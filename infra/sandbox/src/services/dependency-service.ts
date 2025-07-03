import Docker from "dockerode";
import logger from "../utils/logger";
import { DependencyInstallResult } from "../types";

// 默认npm镜像源配置
const NPM_REGISTRY =
  process.env.NPM_REGISTRY || "https://registry.npmmirror.com";

/**
 * 简化的依赖安装服务
 */
class DependencyService {
  /**
   * 在容器中执行命令
   */
  private async execInContainer(
    container: Docker.Container,
    command: string[],
    workDir?: string
  ): Promise<{ stdout: string; stderr: string }> {
    const containerId = container.id;
    const execOptions: Docker.ExecCreateOptions = {
      Cmd: command,
      AttachStdout: true,
      AttachStderr: true,
      User: "root"
    };

    if (workDir) {
      execOptions.WorkingDir = workDir;
    }

    const exec = await container.exec(execOptions);

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
                position: "DependencyService",
                containerId: container.id
              });
            }
          },
          {
            write: (chunk: Buffer) => {
              const message = chunk.toString();
              stderr += message;
              logger.error(message, {
                position: "DependencyService",
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
   * 安装Node.js依赖
   */
  async installNodeDependencies(
    container: Docker.Container,
    workDir: string = "/home/sandbox"
  ): Promise<DependencyInstallResult> {
    const containerId = container.id;
    logger.info(`Installing Node.js dependencies in ${workDir}`, {
      containerId
    });

    try {
      const { stdout, stderr } = await this.execInContainer(
        container,
        ["npm", "install", "--registry", NPM_REGISTRY],
        workDir
      );

      logger.info(
        `Node.js dependencies installed successfully in ${workDir}`,
        { containerId }
      );
      return { 
        success: true, 
        logs: stdout || "Dependencies installed successfully" 
      };
    } catch (error) {
      logger.error("Error installing Node.js dependencies", {
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

  /**
   * 安装Python依赖
   */
  async installPythonDependencies(
    container: Docker.Container,
    workDir: string = "/home/sandbox"
  ): Promise<DependencyInstallResult> {
    const containerId = container.id;
    logger.info(`Installing Python dependencies in ${workDir}`, {
      containerId
    });

    try {
      const { stdout, stderr } = await this.execInContainer(
        container,
        ["pip", "install", "-r", "requirements.txt"],
        workDir
      );

      logger.info(
        `Python dependencies installed successfully in ${workDir}`,
        { containerId }
      );
      return { 
        success: true, 
        logs: stdout || "Dependencies installed successfully" 
      };
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

  /**
   * 根据文件类型自动安装依赖
   */
  async installDependenciesIfNeeded(
    container: Docker.Container,
    workDir: string = "/home/sandbox"
  ): Promise<DependencyInstallResult> {
    const containerId = container.id;

    try {
      return this.installPythonDependencies(container, workDir);
      // // 检查package.json是否存在
      // try {
      //   const checkPackageJson = await container.exec({
      //     Cmd: ["test", "-f", "package.json"],
      //     AttachStdout: false,
      //     AttachStderr: false,
      //     WorkingDir: workDir
      //   });
      //   const packageJsonExists = await checkPackageJson
      //     .start({})
      //     .then(() =>
      //       checkPackageJson.inspect().then((inspect) => inspect.ExitCode === 0)
      //     );

      //   if (packageJsonExists) {
      //     return this.installNodeDependencies(container, workDir);
      //   }
      // } catch (error) {
      //   logger.debug("Error checking package.json", { error, containerId });
      // }

      // // 检查requirements.txt是否存在
      // try {
      //   const checkRequirements = await container.exec({
      //     Cmd: ["test", "-f", "requirements.txt"],
      //     AttachStdout: false,
      //     AttachStderr: false,
      //     WorkingDir: workDir
      //   });
      //   const requirementsExists = await checkRequirements
      //     .start({})
      //     .then(() =>
      //       checkRequirements
      //         .inspect()
      //         .then((inspect) => inspect.ExitCode === 0)
      //     );

      //   if (requirementsExists) {
      //     return this.installPythonDependencies(container, workDir);
      //   }
      // } catch (error) {
      //   logger.debug("Error checking requirements.txt", { error, containerId });
      // }

      // // 没有检测到依赖文件
      // return { success: true, logs: "No dependency configuration detected." };
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
