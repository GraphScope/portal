import Docker from "dockerode";
import config from "../config";
import logger from "../utils/logger";
import { ContainerInfo, SandboxOptions } from "../types";
import { ApiError } from "../middleware/error-handler";
import gitService from "./git-service";

// DNS服务器配置，可以从环境变量中读取，默认使用公共DNS
const DNS_SERVERS = process.env.DNS_SERVERS
  ? process.env.DNS_SERVERS.split(",")
  : ["8.8.8.8", "114.114.114.114"]; // Google DNS和114 DNS (中国)

class ContainerService {
  private docker: Docker;
  private containers: Map<string, ContainerInfo>;

  constructor() {
    // Initialize Docker client
    this.docker = new Docker();
    this.containers = new Map();

    // Start container cleanup interval
    setInterval(
      this.cleanupContainers.bind(this),
      config.containerCleanupInterval
    );
  }

  /**
   * Create a new sandbox container
   */
  async createContainer(
    image: string,
    options?: SandboxOptions
  ): Promise<ContainerInfo> {
    try {
      // Apply default options if not provided
      const timeout = options?.timeout || config.defaultTimeout;
      const memoryLimit = options?.memoryLimit || config.defaultMemoryLimit;
      const cpuLimit = options?.cpuLimit || config.defaultCpuLimit;

      // 我们将使用Docker生成的实际容器ID，先生成一个唯一的名称前缀
      const containerName = `sandbox-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

      // Check if image exists, pull if not
      try {
        await this.docker.getImage(image).inspect();
        logger.info(`Image ${image} already exists locally`);
      } catch (error) {
        logger.info(`Pulling image ${image}...`);
        await this.pullImage(image);
      }

      // Create container
      const container: Docker.Container = await this.docker.createContainer({
        Image: image,
        name: containerName,
        Tty: true,
        HostConfig: {
          Memory: this.parseMemoryLimit(memoryLimit),
          NanoCpus: this.parseCpuLimit(cpuLimit),
          SecurityOpt: ["no-new-privileges"],
          NetworkMode: "bridge", // 使用默认的bridge网络
          ReadonlyRootfs: false, // Allow writing to filesystem for file operations
          AutoRemove: false, // We'll manage cleanup ourselves
          // 添加DNS配置
          Dns: DNS_SERVERS,
          DnsOptions: ["timeout:2", "attempts:3"] // 设置DNS查询超时和重试次数
        },
        // 添加容器内环境变量
        Env: [
          // 为npm设置配置
          "NPM_CONFIG_REGISTRY=https://registry.npmmirror.com",
          // 解决npm缓存权限问题
          "npm_config_cache=/tmp/.npm", // 将npm缓存目录设置到/tmp下
          // 为pip设置配置
          "PIP_INDEX_URL=https://mirrors.aliyun.com/pypi/simple/",
          "PIP_TRUSTED_HOST=mirrors.aliyun.com"
        ],
        // 临时使用root用户启动容器，我们会在容器启动后创建目录并设置权限
        User: "root",
        WorkingDir: "/home"
      });

      // Start the container
      await container.start();

      // Update environment variable with actual Docker ID
      await this.execInContainer(container, [
        "sh",
        "-c",
        `echo SANDBOX_CONTAINER_ID=${container.id} >> /etc/environment`
      ]);
      // 获取Docker分配的实际ID
      const dockerId = container.id;
      logger.info(`Created container with Docker ID: ${dockerId}`);

      // 创建home/sandbox目录并设置权限
      try {
        await this.execInContainer(container, ["mkdir", "-p", "/home/sandbox"]);
        // 设置目录权限保nobody用户可以写入
        await this.execInContainer(container, [
          "chmod",
          "777",
          "/home/sandbox"
        ]);
        await this.execInContainer(container, [
          "chmod",
          "a+rwx",
          "/home/sandbox"
        ]);
        logger.info(
          `Created and set permissions for /home/sandbox directory in container ${dockerId}`
        );

        // Initialize Git repository in the container
        await gitService.initializeRepository(dockerId);
        logger.info(`Initialized Git repository in container ${dockerId}`);
      } catch (error) {
        logger.warn(`Error during container setup for ${dockerId}`, {
          error
        });
      }

      // Calculate expiration time
      const now = new Date();
      const expiresAt = new Date(now.getTime() + timeout);

      // Store container info using Docker ID as key
      const containerInfo: ContainerInfo = {
        id: dockerId,
        status: "running",
        createdAt: now,
        expiresAt: expiresAt,
        containerName // 记录容器名称，便于后续查找
      };

      // Save container info
      this.containers.set(dockerId, containerInfo);
      logger.info(`Stored container info for Docker ID: ${dockerId}`, {
        dockerId,
        image
      });

      return containerInfo;
    } catch (error) {
      logger.error("Error creating container", { error, image });
      throw new ApiError(
        "CONTAINER_CREATION_FAILED",
        `Failed to create container from image: ${image}`,
        500,
        { cause: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  /**
   * Get a container by ID
   */
  async getContainer(containerId: string): Promise<ContainerInfo> {
    // 现在containerId就是Docker ID
    const containerInfo = this.containers.get(containerId);

    if (!containerInfo) {
      // 尝试直接通过Docker ID查找容器
      try {
        const container = this.docker.getContainer(containerId);
        await container.inspect(); // 验证容器存在

        // 容器存在但不在我们的记录中，可能是服务重启导致，创建新记录
        logger.info(
          `Container ${containerId} found in Docker but not in registry, creating record`
        );

        // 获取容器信息，包括创建时间等
        const inspectData = await container.inspect();
        const state = inspectData.State?.Status || "unknown";

        // 从创建时间推断过期时间
        const createdAt = new Date(inspectData.Created || new Date());
        const expiresAt = new Date(createdAt.getTime() + config.defaultTimeout);

        const name = inspectData.Name?.replace(/^\//, "") || "";

        const restoredInfo: ContainerInfo = {
          id: containerId,
          status: state,
          createdAt: createdAt,
          expiresAt: expiresAt,
          containerName: name
        };

        // 将恢复的信息存入内存
        this.containers.set(containerId, restoredInfo);

        return restoredInfo;
      } catch (error) {
        logger.error(`Error checking Docker for container ${containerId}`, {
          error
        });
        throw new ApiError(
          "CONTAINER_NOT_FOUND",
          `Container with ID ${containerId} not found`,
          404
        );
      }
    }

    // 检查容器是否过期
    if (new Date() > containerInfo.expiresAt) {
      try {
        await this.removeContainer(containerId);
      } catch (error) {
        logger.error(`Error removing expired container ${containerId}`, {
          error,
          containerId
        });
      }
      throw new ApiError(
        "CONTAINER_EXPIRED",
        `Container with ID ${containerId} has expired`,
        400
      );
    }

    // 验证容器仍然存在
    try {
      const container = this.docker.getContainer(containerId);
      const inspectData = await container.inspect();
      // 更新容器状态信息
      containerInfo.status = inspectData.State?.Status || containerInfo.status;
    } catch (error) {
      // 容器不存在，从记录中删除
      this.containers.delete(containerId);
      throw new ApiError(
        "CONTAINER_NOT_FOUND",
        `Container ${containerId} no longer exists in Docker engine`,
        404
      );
    }

    return containerInfo;
  }

  /**
   * Remove a container
   */
  async removeContainer(containerId: string): Promise<void> {
    try {
      // 从记录中移除容器信息
      if (this.containers.has(containerId)) {
        logger.info(`Removing container from registry: ${containerId}`);
        this.containers.delete(containerId);
      }

      // 直接使用Docker ID删除容器
      try {
        const container = this.docker.getContainer(containerId);
        logger.info(`Removing container with ID: ${containerId}`);
        await container.remove({ force: true, v: true });
        logger.info(`Successfully removed container with ID: ${containerId}`);
        return;
      } catch (error) {
        logger.error(`Error removing container ${containerId} directly`, {
          error
        });

        // 如果直接使用ID失败，可能是ID格式不对，尝试通过名称查找
        // 这部分主要是为了向前兼容或处理异常情况
        const containers = await this.docker.listContainers({
          all: true,
          filters: { id: [containerId] }
        });

        if (containers.length > 0) {
          const container = this.docker.getContainer(containers[0].Id);
          await container.remove({ force: true, v: true });
          logger.info(
            `Removed container after additional lookup: ${containerId}`
          );
          return;
        }

        logger.warn(
          `Container ${containerId} not found in Docker, nothing to remove`
        );
      }
    } catch (error) {
      logger.error(`Error in container removal process for ${containerId}`, {
        error
      });
      throw new ApiError(
        "CONTAINER_REMOVAL_FAILED",
        `Failed to remove container: ${containerId}`,
        500,
        { cause: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  /**
   * Get container status
   */
  async getContainerStatus(containerId: string): Promise<{
    status: string;
    resourceUsage?: { cpuUsage?: string; memoryUsage?: string };
  }> {
    const containerInfo = await this.getContainer(containerId);

    try {
      // 直接使用containerId获取Docker容器
      const container = this.docker.getContainer(containerId);
      const stats = await container.stats({ stream: false });

      // 获取容器详细信息以确保状态是最新的
      const inspectData = await container.inspect();
      const status = inspectData.State?.Status || containerInfo.status;

      // Calculate CPU and memory usage
      const cpuUsage = this.calculateCpuPercentage(stats);
      const memoryUsage = this.formatBytes(stats.memory_stats.usage);

      return {
        status: status,
        resourceUsage: {
          cpuUsage: cpuUsage.toFixed(2),
          memoryUsage
        }
      };
    } catch (error) {
      // If we can't get detailed stats, just return the basic status
      logger.warn(`Could not get detailed stats for container ${containerId}`, {
        error
      });
      return {
        status: containerInfo.status
      };
    }
  }

  /**
   * Clean up expired containers
   */
  private async cleanupContainers(): Promise<void> {
    const now = new Date();

    for (const [containerId, containerInfo] of this.containers.entries()) {
      if (now > containerInfo.expiresAt) {
        logger.info(`Container ${containerId} has expired, removing...`);
        try {
          await this.removeContainer(containerId);
        } catch (error) {
          logger.error(`Error cleaning up container ${containerId}`, { error });
        }
      }
    }
  }

  /**
   * Pull a Docker image
   */
  private async pullImage(image: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.docker.pull(image, (err: any, stream: NodeJS.ReadableStream) => {
        if (err) {
          return reject(
            new ApiError(
              "IMAGE_PULL_FAILED",
              `Failed to pull image: ${image}`,
              500,
              { cause: err.message }
            )
          );
        }

        this.docker.modem.followProgress(stream, (err: any, output: any[]) => {
          if (err) {
            return reject(
              new ApiError(
                "IMAGE_PULL_FAILED",
                `Failed to pull image: ${image}`,
                500,
                { cause: err.message }
              )
            );
          }

          logger.info(`Successfully pulled image: ${image}`);
          resolve();
        });
      });
    });
  }

  /**
   * Parse memory limit from string representation (e.g., "512m") to bytes
   */
  private parseMemoryLimit(memoryLimit: string): number {
    const regex = /^(\d+)(k|m|g)?$/;
    const match = memoryLimit.toLowerCase().match(regex);

    if (!match) {
      throw new ApiError(
        "INVALID_MEMORY_LIMIT",
        `Invalid memory limit format: ${memoryLimit}`,
        400
      );
    }

    const value = parseInt(match[1], 10);
    const unit = match[2] || "";

    switch (unit) {
      case "k":
        return value * 1024;
      case "m":
        return value * 1024 * 1024;
      case "g":
        return value * 1024 * 1024 * 1024;
      default:
        return value;
    }
  }

  /**
   * Parse CPU limit from string representation (e.g., "0.5") to nanoCPUs
   */
  private parseCpuLimit(cpuLimit: string): number {
    const cpu = parseFloat(cpuLimit);

    if (isNaN(cpu) || cpu <= 0) {
      throw new ApiError(
        "INVALID_CPU_LIMIT",
        `Invalid CPU limit: ${cpuLimit}`,
        400
      );
    }

    // Convert CPU cores to nanoCPUs (e.g., 0.5 -> 500000000)
    return Math.floor(cpu * 1000000000);
  }

  /**
   * Calculate CPU usage percentage from stats
   */
  private calculateCpuPercentage(stats: any): number {
    const cpuDelta =
      stats.cpu_stats.cpu_usage.total_usage -
      stats.precpu_stats.cpu_usage.total_usage;
    const systemDelta =
      stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage;

    if (systemDelta > 0 && cpuDelta > 0) {
      return (cpuDelta / systemDelta) * stats.cpu_stats.online_cpus * 100;
    }

    return 0;
  }

  /**
   * Format bytes to human-readable format
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return "0B";

    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + sizes[i];
  }

  /**
   * Execute a command in the container
   */
  private async execInContainer(
    container: Docker.Container,
    command: string[]
  ): Promise<{ stdout: string; stderr: string }> {
    const exec = await container.exec({
      Cmd: command,
      AttachStdout: true,
      AttachStderr: true
    });

    return new Promise((resolve, reject) => {
      exec.start({ hijack: true }, (err, stream) => {
        if (err) return reject(err);
        if (!stream)
          return reject(new Error("No stream returned from exec.start"));

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

        stream.on("end", () => {
          resolve({ stdout, stderr });
        });

        stream.on("error", (err) => {
          reject(err);
        });
      });
    });
  }
}

export default new ContainerService();
