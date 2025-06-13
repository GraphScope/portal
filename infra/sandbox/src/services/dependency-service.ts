import Docker from "dockerode";
import logger from "../utils/logger";
import {
  DependencyHandler,
  DependencyInstallResult,
  SandboxFiles
} from "../types";

// 默认npm镜像源配置，可以从环境变量中读取
// 使用淘宝npm镜像源作为默认值，这是中国区域最稳定的公共npm镜像
const NPM_REGISTRY =
  process.env.NPM_REGISTRY || "https://registry.npmmirror.com";

/**
 * Node.js package handler
 */
class NodePackageHandler implements DependencyHandler {
  canHandle(files: SandboxFiles): boolean {
    return Object.keys(files).some(
      (filename) =>
        filename === "package.json" || filename.endsWith("/package.json")
    );
  }

  async install(
    container: Docker.Container,
    files: SandboxFiles,
    workDir: string = "/home/sandbox"
  ): Promise<DependencyInstallResult> {
    const containerId = container.id;
    logger.info(`Installing Node.js dependencies in ${workDir}`, {
      containerId
    });

    try {
      // 执行npm install命令，添加--registry参数指定镜像源
      const exec = await container.exec({
        Cmd: ["npm", "install", "--registry", NPM_REGISTRY],
        AttachStdout: true,
        AttachStderr: true,
        WorkingDir: workDir // 使用指定的工作目录
      });

      return new Promise((resolve, reject) => {
        exec.start({ hijack: true }, (err, stream) => {
          if (err) {
            logger.error("Failed to start npm install", {
              error: err,
              containerId
            });
            return reject(err);
          }

          if (!stream) {
            return reject(new Error("No stream returned from exec.start"));
          }

          let stdout = "";
          let stderr = "";

          container.modem.demuxStream(
            stream,
            {
              write: (chunk: Buffer) => {
                stdout += chunk.toString();
              }
            },
            {
              write: (chunk: Buffer) => {
                stderr += chunk.toString();
              }
            }
          );

          stream.on("data", (chunk: Buffer) => {
            logger.info(`${chunk.toString()}`, { position: 'NodePackageHandler', containerId: container.id });
          });

          stream.on("end", async () => {
            try {
              const inspectData = await exec.inspect();
              const exitCode = inspectData.ExitCode || 0;

              if (exitCode !== 0) {
                logger.error(`npm install failed with exit code ${exitCode}`, {
                  stderr,
                  containerId
                });
                resolve({
                  success: false,
                  logs: stdout,
                  error:
                    stderr || `npm install failed with exit code ${exitCode}`
                });
              } else {
                logger.info(
                  `Node.js dependencies installed successfully in ${workDir}`,
                  { containerId }
                );
                resolve({
                  success: true,
                  logs: stdout
                });
              }
            } catch (error) {
              logger.error("Error inspecting exec", { error, containerId });
              reject(error);
            }
          });

          stream.on("error", (err) => {
            logger.error("Stream error during npm install", {
              error: err,
              containerId
            });
            reject(err);
          });
        });
      });
    } catch (error) {
      logger.error("Error installing Node.js dependencies", { error });
      return {
        success: false,
        logs: "",
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
}

/**
 * Python package handler
 */
class PythonPackageHandler implements DependencyHandler {
  canHandle(files: SandboxFiles): boolean {
    return Object.keys(files).some(
      (filename) =>
        filename === "requirements.txt" ||
        filename.endsWith("/requirements.txt")
    );
  }

  async install(
    container: Docker.Container,
    files: SandboxFiles,
    workDir: string = "/home/sandbox"
  ): Promise<DependencyInstallResult> {
    const containerId = container.id;
    logger.info(`Installing Python dependencies in ${workDir}`, {
      containerId
    });

    try {
      // 执行pip install -r requirements.txt命令
      const exec = await container.exec({
        Cmd: ["pip", "install", "-r", "requirements.txt"],
        AttachStdout: true,
        AttachStderr: true,
        WorkingDir: workDir // 使用指定的工作目录
      });

      return new Promise((resolve, reject) => {
        exec.start({ hijack: true }, (err, stream) => {
          if (err) {
            logger.error("Failed to start pip install", {
              error: err,
              containerId
            });
            return reject(err);
          }

          if (!stream) {
            return reject(new Error("No stream returned from exec.start"));
          }

          let stdout = "";
          let stderr = "";

          container.modem.demuxStream(
            stream,
            {
              write: (chunk: Buffer) => {
                stdout += chunk.toString();
              }
            },
            {
              write: (chunk: Buffer) => {
                stderr += chunk.toString();
              }
            }
          );

          stream.on("data", (chunk: Buffer) => {
            logger.info(`${chunk.toString()}`, { position: 'PythonPackageHandler', containerId: container.id });
          });

          stream.on("end", async () => {
            try {
              const inspectData = await exec.inspect();
              const exitCode = inspectData.ExitCode || 0;

              if (exitCode !== 0) {
                logger.error(`pip install failed with exit code ${exitCode}`, {
                  stderr,
                  containerId
                });
                resolve({
                  success: false,
                  logs: stdout,
                  error:
                    stderr || `pip install failed with exit code ${exitCode}`
                });
              } else {
                logger.info(
                  `Python dependencies installed successfully in ${workDir}`,
                  { containerId }
                );
                resolve({
                  success: true,
                  logs: stdout
                });
              }
            } catch (error) {
              logger.error("Error inspecting exec", { error, containerId });
              reject(error);
            }
          });

          stream.on("error", (err) => {
            logger.error("Stream error during pip install", {
              error: err,
              containerId
            });
            reject(err);
          });
        });
      });
    } catch (error) {
      logger.error("Error installing Python dependencies", {
        error,
        containerId
      });
      return {
        success: false,
        logs: "",
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
}

/**
 * Dependency detection and installation service
 */
class DependencyService {
  private handlers: DependencyHandler[] = [];

  constructor() {
    // 注册各种语言的处理器
    this.handlers.push(new NodePackageHandler());
    this.handlers.push(new PythonPackageHandler());
    // 可以添加更多处理器
  }

  /**
   * Install dependencies if needed based on files
   */
  async installDependenciesIfNeeded(
    container: Docker.Container,
    files: SandboxFiles,
    workDir: string = "/home/sandbox"
  ): Promise<DependencyInstallResult> {
    const containerId = container.id;
    try {
      // 查找能处理当前文件集合的处理器
      for (const handler of this.handlers) {
        if (handler.canHandle(files)) {
          logger.info(
            `Dependency handler found, installing dependencies in ${workDir}`,
            { containerId }
          );
          // @ts-ignore: 传递workDir参数到install方法
          return handler.install(container, files, workDir);
        }
      }

      // 没有找到处理器，说明不需要安装依赖
      return { success: true, logs: "No dependency configuration detected." };
    } catch (error) {
      logger.error("Error in dependency installation process", {
        error,
        containerId
      });
      return {
        success: false,
        logs: "",
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
}

export default new DependencyService();
