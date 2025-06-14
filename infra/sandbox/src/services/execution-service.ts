import Docker from "dockerode";
import { v4 as uuidv4 } from "uuid";
import logger from "../utils/logger";
import { ApiError } from "../middleware/error-handler";
import { ExecutionResult, SandboxFiles } from "../types";
import fileService from "./file-service";
import dependencyService from "./dependency-service";
import gitService from "./git-service";
import dockerConfig from "./docker-config";

class ExecutionService {
  private docker: Docker;

  constructor() {
    this.docker = dockerConfig.getDockerInstance();
  }

  /**
   * Execute a command in a container
   */
  async executeInContainer(
    containerId: string,
    command: string[],
    files?: SandboxFiles,
    env?: Record<string, string>,
    gitTracking: boolean = true // Changed default to true
  ): Promise<ExecutionResult> {
    try {
      const startTime = Date.now();
      const executionId = `exec_${uuidv4()}`;

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

      // 创建文件并获取工作目录路径
      let workDir = "/home/sandbox";
      let filesChanged = false;

      if (files && Object.keys(files).length > 0) {
        workDir = await fileService.createFilesInContainer(containerId, files);
        filesChanged = true;

        // 如果启用了Git跟踪，初始化或提交更改
        if (gitTracking) {
          try {
            // 检查是否已经初始化了Git仓库
            const gitInitialized = await this.isGitInitialized(
              container,
              workDir
            );

            if (!gitInitialized) {
              logger.info(
                `Initializing Git repository for container ${containerId}`
              );
              await gitService.initializeRepository(containerId, workDir);
            }

            // 准备好提交消息
            const commitMessage = this.generateCommitMessage(
              files,
              executionId
            );
            logger.info(
              `Committing file changes to Git for execution ${executionId}`,
              {
                containerId,
                files: Object.keys(files)
              }
            );

            // 提交更改
            await gitService.commitChanges(
              containerId,
              executionId,
              commitMessage,
              workDir
            );
          } catch (gitError) {
            // Git错误不应该中断执行，只记录日志
            logger.warn(`Git tracking failed for execution ${executionId}`, {
              containerId,
              error: gitError
            });
          }
        }
      }

      // 检测和安装依赖（在工作目录中）
      if (files && Object.keys(files).length > 0) {
        logger.info(
          `Checking for dependencies in container ${containerId} at ${workDir}`
        );
        const installResult =
          await dependencyService.installDependenciesIfNeeded(
            container,
            files,
            workDir
          );

        if (!installResult.success) {
          logger.error(
            `Dependency installation failed for container ${containerId}`,
            {
              error: installResult.error
            }
          );

          return {
            id: executionId,
            status: "error",
            duration: Date.now() - startTime,
            stdout: installResult.logs,
            stderr: installResult.error || "Dependency installation failed",
            error: "Dependency installation failed"
          };
        } else if (
          installResult.logs !== "No dependency configuration detected."
        ) {
          // 仅当实际安装了依赖时才记录
          logger.info(
            `Dependencies installed for container ${containerId} at ${workDir}`
          );

          // 如果启用了Git跟踪且安装了依赖，提交依赖更改
          if (gitTracking) {
            try {
              const dependenciesCommitMsg = `Install dependencies for execution ${executionId}`;
              await gitService.commitChanges(
                containerId,
                executionId,
                dependenciesCommitMsg,
                workDir
              );
            } catch (gitError) {
              logger.warn(
                `Failed to commit dependencies to Git for execution ${executionId}`,
                {
                  containerId,
                  error: gitError
                }
              );
            }
          }
        }
      }

      // 执行命令，使用工作目录
      const result = await this.execInContainer(
        container,
        command,
        workDir,
        env
      );

      const endTime = Date.now();
      const duration = endTime - startTime;

      if (result.exitCode !== 0) {
        logger.error(`Execution failed with exit code ${result.stderr}`, {
          containerId,
          duration
        });
      } else {
        logger.info(`Execution succeeded: ${result.stdout}`, {
          containerId,
          duration
        });
      }

      return {
        id: executionId,
        status: result.exitCode === 0 ? "success" : "error",
        duration,
        stdout: result.stdout,
        stderr: result.stderr,
        ...(result.exitCode !== 0 && {
          error: `Process exited with code ${result.exitCode}`
        })
      };
    } catch (error) {
      logger.error(`Error executing command in container ${containerId}`, {
        error,
        command
      });
      throw new ApiError(
        "EXECUTION_FAILED",
        `Failed to execute command in container`,
        500,
        { cause: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  /**
   * Generate commit message based on modified files
   */
  private generateCommitMessage(
    files: SandboxFiles,
    executionId: string
  ): string {
    const fileNames = Object.keys(files);

    if (fileNames.length === 1) {
      return `Update ${fileNames[0]} for execution ${executionId}`;
    } else if (fileNames.length <= 3) {
      return `Update ${fileNames.join(", ")} for execution ${executionId}`;
    } else {
      return `Update ${fileNames.length} files for execution ${executionId}`;
    }
  }

  /**
   * Check if Git is initialized in the container
   */
  private async isGitInitialized(
    container: Docker.Container,
    workDir: string = "/home/sandbox"
  ): Promise<boolean> {
    const containerId = container.id;
    try {
      const exec = await container.exec({
        Cmd: ["test", "-d", ".git"],
        AttachStdout: false,
        AttachStderr: false,
        WorkingDir: workDir
      });

      return new Promise<boolean>((resolve) => {
        exec.start({}, async () => {
          const inspect = await exec.inspect();
          resolve(inspect.ExitCode === 0);
        });
      });
    } catch (error) {
      logger.warn(`Error checking Git initialization`, { error, containerId });
      return false;
    }
  }

  /**
   * Execute a command in the container with timeout
   */
  private async execInContainer(
    container: Docker.Container,
    command: string[],
    workDir: string = "/home/sandbox",
    env?: Record<string, string>
  ): Promise<{
    stdout: string;
    stderr: string;
    exitCode: number;
  }> {
    const containerId = container.id;
    // 确保工作目录是绝对路径
    if (!workDir.startsWith("/")) {
      workDir = `/home/sandbox/${workDir}`;
    }

    // 简单检查目录是否存在，如果不存在则尝试创建它
    try {
      // 先检查目录是否存在
      const checkDirExec = await container.exec({
        Cmd: ["test", "-d", workDir],
        AttachStdout: false,
        AttachStderr: false,
        User: "root"
      });

      const checkResult = await new Promise<{ ExitCode: number }>((resolve) => {
        checkDirExec.start({}, async (err) => {
          if (err) {
            logger.warn(`Error checking directory ${workDir}`, {
              error: err,
              containerId
            });
          }
          const inspect = await checkDirExec.inspect();
          resolve({ ExitCode: inspect.ExitCode ?? -1 }); // Default to -1 if ExitCode is null
        });
      });

      // 如果目录不存在，创建它并设置权限
      if (checkResult.ExitCode !== 0) {
        logger.info(`Creating working directory ${workDir} in container`, {
          containerId
        });

        const createDirExec = await container.exec({
          Cmd: ["mkdir", "-p", workDir],
          AttachStdout: false,
          AttachStderr: false,
          User: "root"
        });

        await new Promise<void>((resolve) => {
          createDirExec.start({}, () => resolve());
        });

        // 设置目录权限
        const chmodExec = await container.exec({
          Cmd: ["chmod", "777", workDir],
          AttachStdout: false,
          AttachStderr: false,
          User: "root"
        });

        await new Promise<void>((resolve) => {
          chmodExec.start({}, () => resolve());
        });

        logger.info(`Created and set permissions for ${workDir}`, {
          containerId
        });
      }
    } catch (error) {
      logger.warn(`Error setting up working directory ${workDir}`, {
        error,
        containerId
      });
    }

    // 执行用户命令，使用nobody用户
    const execOptions: Docker.ExecCreateOptions = {
      Cmd: command,
      AttachStdout: true,
      AttachStderr: true,
      WorkingDir: workDir,
      User: "nobody" // 使用非特权用户
    };

    // 添加环境变量，如果提供了的话
    if (env && Object.keys(env).length > 0) {
      const envArray = Object.entries(env).map(
        ([key, value]) => `${key}=${value}`
      );
      execOptions.Env = envArray;
    }

    const exec = await container.exec(execOptions);

    return new Promise((resolve, reject) => {
      exec.start({ hijack: true }, (err, stream) => {
        if (err) {
          logger.error(`Error starting command execution`, {
            error: err,
            containerId,
            command
          });
          return reject(err);
        }
        if (!stream) {
          logger.error(`No stream returned from exec.start`, {
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
              logger.info(message, { containerId: container.id, position: 'ExecutionService' });
            }
          },
          {
            write: (chunk: Buffer) => {
              const message = chunk.toString();
              stderr += message;
              logger.error(message, { containerId: container.id, position: 'ExecutionService' });
            }
          }
        );

        stream.on("end", async () => {
          try {
            const inspectData = await exec.inspect();
            const exitCode = inspectData.ExitCode ?? -1;
            logger.debug(
              `Command execution completed with exit code ${exitCode}`,
              { containerId, command }
            );
            resolve({
              stdout,
              stderr,
              exitCode: exitCode // Default to -1 if ExitCode is null
            });
          } catch (error) {
            logger.error(`Error inspecting command execution`, {
              error,
              containerId,
              command
            });
            reject(error);
          }
        });

        stream.on("error", (err) => {
          logger.error(`Stream error during command execution`, {
            error: err,
            containerId,
            command
          });
          reject(err);
        });
      });
    });
  }

}

export default new ExecutionService();
