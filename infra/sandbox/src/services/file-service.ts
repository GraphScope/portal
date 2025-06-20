import Docker from "dockerode";
import fs from "fs";
import path from "path";
import os from "os";
import { v4 as uuidv4 } from "uuid";
import logger from "../utils/logger";
import { ApiError } from "../middleware/error-handler";
import { SandboxFiles } from "../types";
import gitService from "./git-service";
import dockerConfig from "./docker-config";
import * as tar from "tar-stream";

// 固定工作目录，所有代码都存放在这里，由Git管理版本
const WORK_DIR = "/home/sandbox";

class FileService {
  private docker: Docker;

  constructor() {
    this.docker = dockerConfig.getDockerInstance();
  }

  /**
   * Create or update files inside the container's Git repository
   * @returns 返回工作目录路径
   */
  async createFilesInContainer(
    containerId: string,
    files: SandboxFiles
  ): Promise<string> {
    try {
      if (!files || Object.keys(files).length === 0) {
        return WORK_DIR; // No files to create, return base directory
      }

      // 直接使用Docker容器ID获取容器
      let container: Docker.Container;
      try {
        container = this.docker.getContainer(containerId);
        await container.inspect(); // 验证容器存在
      } catch (error) {
        throw new ApiError(
          "CONTAINER_NOT_FOUND",
          `Container with ID ${containerId} not found`,
          404
        );
      }

      // Create a temporary directory for files
      const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "sandbox-"));

      try {
        // Create all files locally first
        for (const [filePath, content] of Object.entries(files)) {
          // Create directory structure if needed
          const fullPath = path.join(tempDir, filePath);
          const dirPath = path.dirname(fullPath);

          fs.mkdirSync(dirPath, { recursive: true });
          fs.writeFileSync(fullPath, content);

          logger.debug(`Created file ${filePath} in temp directory`, {
            containerId
          });
        }

        // Copy all files to the container
        for (const filePath of Object.keys(files)) {
          const fullPath = path.join(tempDir, filePath);
          // 将文件放在根工作目录下
          const containerPath = `${WORK_DIR}/${filePath}`;

          // Create directory in container if needed
          const dirPath = path.dirname(containerPath);
          if (dirPath !== WORK_DIR) {
            // 使用root用户创建目录并设置权限
            await this.execInContainer(
              container,
              ["mkdir", "-p", dirPath],
              "root"
            );
            await this.execInContainer(
              container,
              ["chmod", "777", dirPath],
              "root"
            );
          }

          // Copy file content to container
          await this.copyFileToContainer(container, fullPath, containerPath);

          // 设置文件权限，确保nobody用户可读写
          await this.execInContainer(
            container,
            ["chmod", "666", containerPath],
            "root"
          );

          logger.debug(
            `Copied file ${filePath} to container ${containerId} in directory ${WORK_DIR}`,
            { containerId }
          );
        }

        // 使用Git跟踪文件变更
        const fileChangeId = uuidv4().substring(0, 8);
        const commitMessage = `Update files for sandbox execution`;

        // 提交更改到Git
        await gitService.commitChanges(
          containerId,
          fileChangeId,
          commitMessage,
          WORK_DIR
        );

        logger.info(
          `Created ${Object.keys(files).length} files in container ${containerId} and committed to Git`
        );

        return WORK_DIR;
      } finally {
        // Clean up temp directory
        this.cleanupTempDir(tempDir);
      }
    } catch (error) {
      logger.error(`Error creating files in container ${containerId}`, {
        error
      });
      throw new ApiError(
        "FILE_CREATION_FAILED",
        "Failed to create files in container",
        500,
        { cause: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  /**
   * Download a file from the container
   * @param containerId The ID of the container
   * @param filePath The path of the file within the container to download
   * @returns The file content as a string
   */
  async downloadFileFromContainer(
    containerId: string,
    filePath: string
  ): Promise<{ content: string; fileName: string }> {
    try {
      // Get the container
      let container: Docker.Container;
      try {
        container = this.docker.getContainer(containerId);
        await container.inspect(); // Verify container exists
      } catch (error) {
        throw new ApiError(
          "CONTAINER_NOT_FOUND",
          `Container with ID ${containerId} not found`,
          404
        );
      }

      // Normalize path - make sure it's absolute if not already
      const normalizedPath = path.isAbsolute(filePath)
        ? filePath
        : `${WORK_DIR}/${filePath}`;

      // First check if file exists
      const { exitCode } = await this.execInContainer(
        container,
        ["test", "-f", normalizedPath],
        "root"
      )
        .then(() => ({ exitCode: 0 }))
        .catch(() => ({ exitCode: 1 }));

      if (exitCode !== 0) {
        throw new ApiError(
          "FILE_NOT_FOUND",
          `File ${normalizedPath} not found in container ${containerId}`,
          404
        );
      }

      // Read file content
      const { stdout, stderr } = await this.execInContainer(
        container,
        ["cat", normalizedPath],
        "root"
      );

      if (stderr) {
        throw new ApiError(
          "FILE_READ_ERROR",
          `Error reading file ${normalizedPath}: ${stderr}`,
          500
        );
      }

      const fileName = path.basename(normalizedPath);

      logger.info(
        `Downloaded file ${normalizedPath} from container ${containerId}`
      );

      return { content: stdout, fileName };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      logger.error(`Error downloading file from container ${containerId}`, {
        error,
        filePath
      });
      throw new ApiError(
        "FILE_DOWNLOAD_FAILED",
        "Failed to download file from container",
        500,
        { cause: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  /**
   * Download all files from the container as zip archive
   * Includes .git directory for version history but excludes dependency files
   * Creates a single zip archive directly in the container for better performance
   * @param containerId The ID of the container
   * @returns Buffer containing zip archive and suggested filename
   */
  async downloadAllFilesAsZip(
    containerId: string
  ): Promise<{ buffer: Buffer; fileName: string }> {
    try {
      // Get the container
      let container: Docker.Container;
      try {
        container = this.docker.getContainer(containerId);
        await container.inspect(); // Verify container exists
      } catch (error) {
        throw new ApiError(
          "CONTAINER_NOT_FOUND",
          `Container with ID ${containerId} not found`,
          404
        );
      }

      logger.info(
        `Creating zip archive of files in container ${containerId} (including .git)`
      );

      // Temporary file path inside container to store the zip
      const tempZipPath = `/tmp/sandbox-${containerId.substring(0, 8)}.zip`;

      // Check if zip is installed in the container
      const { exitCode: zipExitCode } = await this.execInContainer(
        container,
        ["which", "zip"],
        "root"
      )
        .then(() => ({ exitCode: 0 }))
        .catch(() => ({ exitCode: 1 }));

      if (zipExitCode === 0) {
        // ZIP is available, use it for better compression and exclusion features
        // Create exclude patterns for zip command
        const excludePatterns = [
          "'*/node_modules/*'",
          "'*/venv/*'",
          "'*/.venv/*'",
          "'*/__pycache__/*'",
          "'*/dist/*'",
          "'*/build/*'",
          "'*/package-lock.json'",
          "'*/yarn.lock'",
          "'*/pnpm-lock.yaml'",
          "'*.local'",
          "'*.local/*'",
          "'*.local/**'",
          "'*.cache'",
          "'*.cache/*'",
          "'*.cache/**'",
          "'*/.local'",
          "'*/.local/*'",
          "'*/.local/**'",
          "'*/.cache'",
          "'*/.cache/*'",
          "'*/.cache/**'",
          "'*/.venv'",
          "'*/.venv/**'",
          "'*/.npm'",
          "'*/.npm/**'"
        ];

        // Create a command to archive files with zip
        // Create a more reliable way to exclude patterns using a temporary exclude file
        const excludeFilePath = `/tmp/exclude-${containerId.substring(0, 8)}.txt`;

        // First create a file with all exclude patterns (one per line, without quotes)
        await this.execInContainer(
          container,
          [
            "bash",
            "-c",
            `echo "${excludePatterns.map((p) => p.replace(/'/g, "")).join("\n")}" > ${excludeFilePath}`
          ],
          "root"
        );

        // Then use the exclude file with zip's -x@ option
        const zipCmd = `cd ${WORK_DIR} && zip -r -q ${tempZipPath} . -x@${excludeFilePath}`;

        logger.info(`Creating archive using zip: ${zipCmd}`);
        const { stderr } = await this.execInContainer(
          container,
          ["bash", "-c", zipCmd],
          "root"
        );

        if (stderr && !stderr.includes("zip warning")) {
          logger.warn(`Zip command produced warnings: ${stderr}`);
        }
      } else {
        // Fallback - this shouldn't happen since we assume zip is available
        throw new ApiError(
          "ZIP_NOT_AVAILABLE",
          "Zip command not available in container",
          500
        );
      }

      logger.info(`Reading zip file from container: ${tempZipPath}`);

      // Create a temporary file locally to store the zip contents
      const localTempDir = fs.mkdtempSync(
        path.join(os.tmpdir(), "sandbox-zip-")
      );
      const localTempFile = path.join(
        localTempDir,
        `sandbox-${containerId.substring(0, 8)}.zip`
      );
      const writeStream = fs.createWriteStream(localTempFile);

      // Use a different approach to copy the file from the container
      // First create a small tar archive containing just our zip file
      const { stderr: cpErr } = await this.execInContainer(
        container,
        [
          "bash",
          "-c",
          `cd /tmp && tar -cf /tmp/archive.tar ${path.basename(tempZipPath)}`
        ],
        "root"
      );

      if (cpErr) {
        logger.warn(`Warning when creating tar: ${cpErr}`);
      }

      // Now get the tar archive using Docker's getArchive API
      const tarStream = await container.getArchive({
        path: "/tmp/archive.tar"
      });

      // Extract the zip file from the tar archive
      const extract = tar.extract();

      // Use promise to properly handle async extraction
      await new Promise<void>((resolve, reject) => {
        extract.on(
          "entry",
          (header: any, stream: NodeJS.ReadableStream, next: () => void) => {
            // We're only extracting the zip file
            const chunks: Buffer[] = [];

            stream.on("data", (chunk: Buffer) => {
              chunks.push(chunk);
            });

            stream.on("end", () => {
              if (chunks.length > 0) {
                const fileBuffer = Buffer.concat(chunks);
                fs.writeFileSync(localTempFile, fileBuffer);
              }
              next();
            });

            stream.resume();
          }
        );

        extract.on("finish", () => {
          resolve();
        });

        extract.on("error", (err: Error) => {
          reject(
            new ApiError(
              "ZIP_EXTRACTION_ERROR",
              `Error extracting zip file: ${err.message}`,
              500
            )
          );
        });

        // Pipe tar stream to the extract instance
        tarStream.pipe(extract);
      });

      // Read the file as a buffer
      const buffer = fs.readFileSync(localTempFile);

      // Clean up the temporary files
      this.cleanupTempDir(localTempDir);

      // Clean up the temporary files in the container
      const excludeFilePath = `/tmp/exclude-${containerId.substring(0, 8)}.txt`;
      await this.execInContainer(
        container,
        [
          "bash",
          "-c",
          `rm -f /tmp/archive.tar ${tempZipPath} ${excludeFilePath}`
        ],
        "root"
      ).catch((err) => {
        logger.warn(
          `Failed to clean up temporary files in container: ${err.message}`
        );
      });

      const fileName = `sandbox-${containerId.substring(0, 8)}.zip`;

      logger.info(
        `Successfully created zip archive for container ${containerId}`
      );

      return { buffer, fileName };
    } catch (error) {
      logger.error(`Error creating archive: ${error}`);
      throw error instanceof ApiError
        ? error
        : new ApiError(
            "ZIP_CREATION_FAILED",
            "Failed to create zip archive",
            500,
            { cause: error instanceof Error ? error.message : String(error) }
          );
    }
  }

  /**
   * Execute a command in the container
   */
  private async execInContainer(
    container: Docker.Container,
    command: string[],
    user: string = "root"
  ): Promise<{ stdout: string; stderr: string }> {
    const containerId = container.id;
    const exec = await container.exec({
      Cmd: command,
      AttachStdout: true,
      AttachStderr: true,
      User: user // 允许指定用户执行命令
    });

    return new Promise((resolve, reject) => {
      exec.start({ hijack: true }, (err, stream) => {
        if (err) {
          logger.error("Failed to start exec in container", {
            error: err,
            containerId,
            command
          });
          return reject(err);
        }
        if (!stream) {
          logger.error("No stream returned from exec.start", {
            containerId,
            command
          });
          return reject(new Error("No stream returned from exec.start"));
        }

        let stdout = "";
        let stderr = "";

        container.modem.demuxStream(
          stream,
          {
            write: (chunk: Buffer) => {
              const message = chunk.toString();
              stdout += message;
              logger.info(message, {
                position: "FileService",
                containerId: container.id
              });
            }
          },
          {
            write: (chunk: Buffer) => {
              const message = chunk.toString();
              stderr += message;
              logger.error(message, {
                position: "FileService",
                containerId: container.id
              });
            }
          }
        );

        stream.on("end", () => {
          resolve({ stdout, stderr });
        });

        stream.on("error", (err) => {
          logger.error("Stream error during exec", {
            error: err,
            containerId,
            command
          });
          reject(err);
        });
      });
    });
  }

  /**
   * Copy a file from the local filesystem to the container
   */
  private async copyFileToContainer(
    container: Docker.Container,
    localPath: string,
    containerPath: string
  ): Promise<void> {
    const containerId = container.id;
    return new Promise((resolve, reject) => {
      // Read the file content
      const content = fs.readFileSync(localPath);

      const pack = tar.pack();

      // Add file to the tar stream
      const fileName = path.basename(containerPath);
      pack.entry({ name: fileName }, content);

      // Finalize the tar stream
      pack.finalize();

      // Extract the path without filename for the put directory
      const containerDir = path.dirname(containerPath);

      // Put the file in the container
      container.putArchive(pack, { path: containerDir }, (err) => {
        if (err) {
          logger.error(`Error copying file to container`, {
            err,
            containerId,
            containerPath
          });
          reject(err);
        } else {
          logger.debug(`Successfully copied file to ${containerPath}`, {
            containerId
          });
          resolve();
        }
      });
    });
  }

  /**
   * Clean up temporary directory
   */
  private cleanupTempDir(tempDir: string): void {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
      logger.debug(`Cleaned up temporary directory: ${tempDir}`);
    } catch (error) {
      logger.warn(`Failed to clean up temporary directory: ${tempDir}`, {
        error
      });
    }
  }
}

export default new FileService();
