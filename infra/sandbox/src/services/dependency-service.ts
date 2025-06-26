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
      const exec = await container.exec({
        Cmd: ["npm", "install", "--registry", NPM_REGISTRY],
        AttachStdout: true,
        AttachStderr: true,
        WorkingDir: workDir
      });

      const result = await exec.start({});
      const inspect = await exec.inspect();

      if (inspect.ExitCode === 0) {
        logger.info(
          `Node.js dependencies installed successfully in ${workDir}`,
          { containerId }
        );
        return { success: true, logs: "Dependencies installed successfully" };
      } else {
        logger.error(`npm install failed with exit code ${inspect.ExitCode}`, {
          containerId
        });
        return {
          success: false,
          logs: "",
          error: `npm install failed with exit code ${inspect.ExitCode}`
        };
      }
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
      const exec = await container.exec({
        Cmd: ["pip", "install", "-r", "requirements.txt"],
        AttachStdout: true,
        AttachStderr: true,
        WorkingDir: workDir
      });

      const result = await exec.start({});
      const inspect = await exec.inspect();

      if (inspect.ExitCode === 0) {
        logger.info(
          `Python dependencies installed successfully in ${workDir}`,
          { containerId }
        );
        return { success: true, logs: "Dependencies installed successfully" };
      } else {
        logger.error(`pip install failed with exit code ${inspect.ExitCode}`, {
          containerId
        });
        return {
          success: false,
          logs: "",
          error: `pip install failed with exit code ${inspect.ExitCode}`
        };
      }
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
      // 检查package.json是否存在
      try {
        const checkPackageJson = await container.exec({
          Cmd: ["test", "-f", "package.json"],
          AttachStdout: false,
          AttachStderr: false,
          WorkingDir: workDir
        });
        const packageJsonExists = await checkPackageJson
          .start({})
          .then(() =>
            checkPackageJson.inspect().then((inspect) => inspect.ExitCode === 0)
          );

        if (packageJsonExists) {
          return this.installNodeDependencies(container, workDir);
        }
      } catch (error) {
        logger.debug("Error checking package.json", { error, containerId });
      }

      // 检查requirements.txt是否存在
      try {
        const checkRequirements = await container.exec({
          Cmd: ["test", "-f", "requirements.txt"],
          AttachStdout: false,
          AttachStderr: false,
          WorkingDir: workDir
        });
        const requirementsExists = await checkRequirements
          .start({})
          .then(() =>
            checkRequirements
              .inspect()
              .then((inspect) => inspect.ExitCode === 0)
          );

        if (requirementsExists) {
          return this.installPythonDependencies(container, workDir);
        }
      } catch (error) {
        logger.debug("Error checking requirements.txt", { error, containerId });
      }

      // 没有检测到依赖文件
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
