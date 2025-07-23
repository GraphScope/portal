import Docker from "dockerode";
import dotenv from "dotenv";
import path from "path";
import { Transform } from "stream";
import * as tar from "tar-stream";
import config from "../config";
import { ApiError } from "../middleware/error-handler";
import {
  ClaudeResponse,
  ClaudeSessionOptions,
  ContainerInfo,
  SandboxOptions,
  StreamResponse
} from "../types";
import logger from "../utils/logger";
import dockerConfig from "./docker-config";
import gitService from "./git-service";
import ossService from "./oss-service";

// DNS服务器配置，可以从环境变量中读取，默认使用公共DNS
const DNS_SERVERS = process.env.DNS_SERVERS
  ? process.env.DNS_SERVERS.split(",")
  : ["8.8.8.8", "114.114.114.114"]; // Google DNS和114 DNS (中国)

dotenv.config();

// Claude Code 专用环境变量
const CLAUDE_CODE_ENV = [
  "WORKDIR=/home/sandbox",
  "ANTHROPIC_BASE_URL=https://dashscope.aliyuncs.com/api/v2/apps/claude-code-proxy",
  "ANTHROPIC_API_KEY=" + process.env.ANTHROPIC_API_KEY,
  "ANTHROPIC_AUTH_TOKEN=" + process.env.ANTHROPIC_AUTH_TOKEN,
  "IS_SANDBOX=1"
];

const CLAUDE_CODE_OPTIONS = ["--permission-mode=bypassPermissions"];

// Claude Code 默认镜像
const DEFAULT_CLAUDE_CODE_IMAGE = "ai-spider/claude-code:latest";

class ClaudeCodeService {
  private docker: Docker;
  private containers: Map<string, ContainerInfo>;

  constructor() {
    // Use the shared Docker instance from dockerConfig
    this.docker = dockerConfig.getDockerInstance();
    this.containers = new Map();

    // Start container cleanup interval
    setInterval(
      this.cleanupContainers.bind(this),
      config.containerCleanupInterval
    );
  }

  /**
   * Get the Docker instance
   */
  getDockerInstance(): Docker {
    return this.docker;
  }

  /**
   * Create a new Claude Code sandbox container
   */
  async createContainer(
    options?: SandboxOptions & { image?: string }
  ): Promise<ContainerInfo> {
    try {
      // Apply default options if not provided
      const image = options?.image || DEFAULT_CLAUDE_CODE_IMAGE;
      const timeout = options?.timeout || config.defaultTimeout;
      const memoryLimit = options?.memoryLimit || config.defaultMemoryLimit;
      const cpuLimit = options?.cpuLimit || config.defaultCpuLimit;
      const portMappings = options?.portMappings || {};

      // 我们将使用Docker生成的实际容器ID，先生成一个唯一的名称前缀
      const containerName = `claude-code-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

      // Check if image exists, pull if not
      try {
        await this.docker.getImage(image).inspect();
        logger.info(`Claude Code image ${image} already exists locally`);
      } catch (error) {
        logger.info(`Pulling Claude Code image ${image}...`);
        await this.pullImage(image);
      }

      // Prepare port bindings if specified
      const portBindings: Record<string, Array<{ HostPort: string }>> = {};
      const exposedPorts: Record<string, {}> = {};

      // Process port mappings if provided
      if (Object.keys(portMappings).length > 0) {
        logger.info(
          `Setting up Claude Code port mappings: ${JSON.stringify(portMappings)}`
        );

        for (const [containerPort, hostPort] of Object.entries(portMappings)) {
          // Format port for Docker API (must end with /tcp)
          const formattedContainerPort = containerPort.includes("/")
            ? containerPort
            : `${containerPort}/tcp`;

          portBindings[formattedContainerPort] = [{ HostPort: hostPort }];
          exposedPorts[formattedContainerPort] = {};

          logger.info(
            `Mapping Claude Code container port ${containerPort} to host port ${hostPort}`
          );
        }
      }

      // Create container with Claude Code specific configuration
      const container: Docker.Container = await this.docker.createContainer({
        Image: image,
        name: containerName,
        Tty: true,
        ExposedPorts: exposedPorts,
        HostConfig: {
          Memory: this.parseMemoryLimit(memoryLimit),
          NanoCpus: this.parseCpuLimit(cpuLimit),
          SecurityOpt: ["no-new-privileges"],
          ReadonlyRootfs: false, // Allow writing to filesystem for file operations
          AutoRemove: false, // We'll manage cleanup ourselves
          // 添加DNS配置
          Dns: DNS_SERVERS,
          DnsOptions: ["timeout:2", "attempts:3"], // 设置DNS查询超时和重试次数
          PortBindings: portBindings
        },
        // Claude Code 专用环境变量
        Env: [
          // 为npm设置配置
          "NPM_CONFIG_REGISTRY=https://registry.npmmirror.com",
          // 解决npm缓存权限问题
          "npm_config_cache=/tmp/.npm", // 将npm缓存目录设置到/tmp下
          // 为pip设置配置
          "PIP_INDEX_URL=https://mirrors.aliyun.com/pypi/simple/",
          "PIP_TRUSTED_HOST=mirrors.aliyun.com",
          // Make services bind to all interfaces
          "HOST=0.0.0.0",
          // 解决Playwright截图字体问题
          "PW_TEST_SCREENSHOT_NO_FONTS_READY=1"
        ],
        // 临时使用root用户启动容器，我们会在容器启动后创建目录并设置权限
        User: "root",
        WorkingDir: "/home"
      });

      // Start the container
      await container.start();

      // Get container info to read the assigned Docker ID
      const dockerId = container.id;

      // Update environment variable with actual Docker ID
      await this.execInContainer(container, [
        "sh",
        "-c",
        `echo SANDBOX_CONTAINER_ID=${container.id} >> /etc/environment`
      ]);

      logger.info(`Created Claude Code container with Docker ID: ${dockerId}`);

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
          `Created and set permissions for /home/sandbox directory in Claude Code container ${dockerId}`
        );

        // Initialize Git repository in the container
        await gitService.initializeRepository(dockerId);
        logger.info(
          `Initialized Git repository in Claude Code container ${dockerId}`
        );
      } catch (error) {
        logger.warn(
          `Error during Claude Code container setup for ${dockerId}`,
          {
            error
          }
        );
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
      logger.info(
        `Stored Claude Code container info for Docker ID: ${dockerId}`,
        {
          dockerId,
          image
        }
      );

      return containerInfo;
    } catch (error) {
      logger.error("Error creating Claude Code container", {
        error,
        image: options?.image || DEFAULT_CLAUDE_CODE_IMAGE
      });
      throw new ApiError(
        "CLAUDE_CODE_CONTAINER_CREATION_FAILED",
        `Failed to create Claude Code container from image: ${options?.image || DEFAULT_CLAUDE_CODE_IMAGE}`,
        500,
        { cause: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  /**
   * Get a Claude Code container by ID
   */
  async getContainer(containerId: string): Promise<ContainerInfo> {
    // 现在containerId就是Docker ID
    const containerInfo = this.containers.get(containerId);

    if (!containerInfo) {
      // 尝试直接通过Docker ID查找容器
      try {
        const container = this.docker.getContainer(containerId);
        const inspectData = await container.inspect(); // 验证容器存在

        // 检查是否是Claude Code容器
        if (!this.isClaudeCodeContainer(inspectData)) {
          throw new ApiError(
            "NOT_CLAUDE_CODE_CONTAINER",
            `Container ${containerId} is not a Claude Code container`,
            400
          );
        }

        // 容器存在但不在我们的记录中，可能是服务重启导致，创建新记录
        logger.info(
          `Claude Code container ${containerId} found in Docker but not in registry, creating record`
        );

        // 获取容器信息，包括创建时间等
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
        logger.error(
          `Error checking Docker for Claude Code container ${containerId}`,
          {
            error
          }
        );
        throw new ApiError(
          "CLAUDE_CODE_CONTAINER_NOT_FOUND",
          `Claude Code container with ID ${containerId} not found`,
          404
        );
      }
    }

    // 检查容器是否过期
    if (new Date() > containerInfo.expiresAt) {
      try {
        await this.removeContainer(containerId);
      } catch (error) {
        logger.error(
          `Error removing expired Claude Code container ${containerId}`,
          {
            error,
            containerId
          }
        );
      }
      throw new ApiError(
        "CLAUDE_CODE_CONTAINER_EXPIRED",
        `Claude Code container with ID ${containerId} has expired`,
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
        "CLAUDE_CODE_CONTAINER_NOT_FOUND",
        `Claude Code container ${containerId} no longer exists in Docker engine`,
        404
      );
    }

    return containerInfo;
  }

  /**
   * Remove a Claude Code container
   */
  async removeContainer(containerId: string): Promise<void> {
    try {
      // 从记录中移除容器信息
      if (this.containers.has(containerId)) {
        logger.info(
          `Removing Claude Code container from registry: ${containerId}`
        );
        this.containers.delete(containerId);
      }

      // 直接使用Docker ID删除容器
      try {
        const container = this.docker.getContainer(containerId);

        logger.info(`Removing Claude Code container with ID: ${containerId}`);
        await container.remove({ force: true, v: true });
        logger.info(
          `Successfully removed Claude Code container with ID: ${containerId}`
        );
        return;
      } catch (error) {
        logger.error(
          `Error removing Claude Code container ${containerId} directly`,
          {
            error
          }
        );

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
            `Removed Claude Code container after additional lookup: ${containerId}`
          );
          return;
        }

        logger.warn(
          `Claude Code container ${containerId} not found in Docker, nothing to remove`
        );
      }
    } catch (error) {
      logger.error(
        `Error in Claude Code container removal process for ${containerId}`,
        {
          error
        }
      );
      throw new ApiError(
        "CLAUDE_CODE_CONTAINER_REMOVAL_FAILED",
        `Failed to remove Claude Code container: ${containerId}`,
        500,
        { cause: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  /**
   * Get Claude Code container status
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
      logger.warn(
        `Could not get detailed stats for Claude Code container ${containerId}`,
        {
          error
        }
      );
      return {
        status: containerInfo.status
      };
    }
  }

  /**
   * List all Claude Code containers
   */
  async listContainers(): Promise<ContainerInfo[]> {
    const containerList: ContainerInfo[] = [];

    for (const [containerId, containerInfo] of this.containers.entries()) {
      try {
        // Verify container still exists and update status
        const container = this.docker.getContainer(containerId);
        const inspectData = await container.inspect();

        // Update status
        containerInfo.status =
          inspectData.State?.Status || containerInfo.status;
        containerList.push(containerInfo);
      } catch (error) {
        // Container no longer exists, remove from registry
        logger.warn(
          `Claude Code container ${containerId} no longer exists, removing from registry`
        );
        this.containers.delete(containerId);
      }
    }

    return containerList;
  }

  /**
   * Check if a container is a Claude Code container
   */
  private isClaudeCodeContainer(inspectData: any): boolean {
    // Check if container name contains "claude-code" or if it has Claude Code environment variables
    const name = inspectData.Name?.toLowerCase() || "";
    const env = inspectData.Config?.Env || [];

    return (
      name.includes("claude-code") ||
      env.some(
        (envVar: string) =>
          envVar.includes("ANTHROPIC_") ||
          envVar.includes("WORKDIR=/home/sandbox")
      )
    );
  }

  /**
   * Clean up expired Claude Code containers
   */
  private async cleanupContainers(): Promise<void> {
    const now = new Date();

    for (const [containerId, containerInfo] of this.containers.entries()) {
      if (now > containerInfo.expiresAt) {
        logger.info(
          `Claude Code container ${containerId} has expired, removing...`
        );
        try {
          await this.removeContainer(containerId);
        } catch (error) {
          logger.error(
            `Error cleaning up Claude Code container ${containerId}`,
            { error }
          );
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
          console.log(err);
          return reject(
            new ApiError(
              "CLAUDE_CODE_IMAGE_PULL_FAILED",
              `Failed to pull Claude Code image: ${image}`,
              500,
              { cause: err.message }
            )
          );
        }

        this.docker.modem.followProgress(stream, (err: any, output: any[]) => {
          if (err) {
            return reject(
              new ApiError(
                "CLAUDE_CODE_IMAGE_PULL_FAILED",
                `Failed to follow progress for Claude Code image: ${image}`,
                500,
                { cause: err.message }
              )
            );
          }

          logger.info(`Successfully pulled Claude Code image: ${image}`);
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
    command: string[],
    env?: string[],
    workingDir?: string
  ): Promise<{ stdout: string; stderr: string }> {
    const exec = await container.exec({
      Cmd: command,
      AttachStdout: true,
      AttachStderr: true,
      Env: env,
      WorkingDir: workingDir
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
              const message = chunk.toString();
              stdout += message;
              logger.info(message, {
                containerId: container.id,
                position: "ClaudeCodeService"
              });
            }
          },
          {
            write: (chunk: Buffer) => {
              const message = chunk.toString();
              stderr += message;
              logger.error(message, {
                containerId: container.id,
                position: "ClaudeCodeService"
              });
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

  /**
   * Execute a command in a Claude Code container (public method)
   */
  async executeCommand(
    containerId: string,
    command: string[]
  ): Promise<{ stdout: string; stderr: string }> {
    const containerInfo = await this.getContainer(containerId);
    const container = this.docker.getContainer(containerId);

    return this.execInContainer(container, command);
  }

  /**
   * 创建新的 Claude 会话
   */
  async createClaudeSession(
    options: ClaudeSessionOptions
  ): Promise<import("../types").ClaudeUnifiedResponse> {
    const {
      prompt,
      outputFormat = "stream-json",
      containerId,
      taskId
    } = options;

    if (!prompt) {
      throw new ApiError(
        "CLAUDE_PROMPT_REQUIRED",
        "Prompt is required to create a Claude session",
        400
      );
    }

    const command = ["claude", "-p", prompt, ...CLAUDE_CODE_OPTIONS];

    if (outputFormat !== "text") {
      command.push("--output-format", outputFormat);
    }

    logger.info(`Creating Claude session in container ${containerId}`, {
      prompt: prompt.substring(0, 100) + (prompt.length > 100 ? "..." : ""),
      outputFormat,
      taskId
    });

    try {
      let result: import("../types").ClaudeUnifiedResponse;
      let sessionId: string | undefined;

      // 如果是stream-json格式，返回流式响应
      if (outputFormat === "stream-json") {
        const streamResult = await this.createClaudeStreamSession(containerId, [
          ...command,
          "--verbose"
        ]);

        // 为流式响应创建包装流来处理 sessionId 提取和文件上传
        if (taskId) {
          const wrappedStream = this.createWrappedStreamForUpload(
            streamResult.stream,
            containerId,
            taskId
          );

          result = {
            type: "stream",
            stream: wrappedStream,
            session_id: streamResult.session_id
          };
        } else {
          result = streamResult;
        }
      } else {
        // 对于json和text格式，使用原有逻辑
        const execResult = await this.execInContainer(
          this.docker.getContainer(containerId),
          command,
          CLAUDE_CODE_ENV,
          "/home/sandbox"
        );

        if (execResult.stderr && execResult.stderr.includes("error")) {
          logger.error(
            `Claude session creation failed in container ${containerId}`,
            {
              stderr: execResult.stderr
            }
          );
          throw new ApiError(
            "CLAUDE_SESSION_CREATION_FAILED",
            `Claude session creation failed: ${execResult.stderr}`,
            500
          );
        }

        result = this.parseClaudeResponse(execResult.stdout, outputFormat);

        // 获取sessionId
        if (result.type !== "stream") {
          sessionId = result.session_id;
        }

        // 对于非流式响应，直接进行文件压缩和上传
        if (sessionId && taskId) {
          this.compressAndUploadClaudeFiles(containerId, sessionId, taskId)
            .then((uploadResults) => {
              logger.info(
                `Claude files upload completed for session ${sessionId}`,
                {
                  containerId,
                  taskId,
                  uploadResults
                }
              );
            })
            .catch((uploadError) => {
              logger.error(
                `Claude files upload failed for session ${sessionId}`,
                {
                  containerId,
                  taskId,
                  error: uploadError
                }
              );
            });
        }
      }

      return result;
    } catch (error) {
      logger.error(
        `Error creating Claude session in container ${containerId}`,
        {
          error,
          prompt: prompt.substring(0, 100),
          taskId
        }
      );

      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(
        "CLAUDE_SESSION_CREATION_FAILED",
        `Failed to create Claude session: ${error instanceof Error ? error.message : String(error)}`,
        500
      );
    }
  }

  /**
   * 为流式响应创建包装流，用于提取 sessionId 和触发文件上传
   */
  private createWrappedStreamForUpload(
    originalStream: NodeJS.ReadableStream,
    containerId: string,
    taskId: string
  ): Transform {
    let sessionId = "";
    let streamEnded = false;

    const wrappedStream = new Transform({
      transform(chunk: any, encoding: any, callback: any) {
        const data = chunk.toString();

        // 尝试从流数据中提取 sessionId
        try {
          const lines = data.split("\n").filter((line: any) => line.trim());
          for (const line of lines) {
            try {
              const parsed = JSON.parse(line);
              if (parsed.session_id && !sessionId) {
                sessionId = parsed.session_id;
                logger.info(`Extracted sessionId from stream: ${sessionId}`, {
                  containerId,
                  taskId
                });
              }
            } catch (e) {
              // 忽略非JSON行
            }
          }
        } catch (e) {
          // 忽略解析错误
        }

        // 转发数据
        this.push(data);
        callback();
      }
    });

    // 监听原始流结束事件
    originalStream.on("end", () => {
      if (!streamEnded) {
        streamEnded = true;

        // 流结束后，如果有 sessionId，开始压缩和上传文件
        if (sessionId) {
          logger.info(
            `Stream ended, starting file upload for session ${sessionId}`,
            {
              containerId,
              taskId
            }
          );

          // 异步执行文件压缩和上传
          this.compressAndUploadClaudeFiles(containerId, sessionId, taskId)
            .then((uploadResults) => {
              logger.info(
                `Claude files upload completed for session ${sessionId}`,
                {
                  containerId,
                  taskId,
                  uploadResults
                }
              );
            })
            .catch((uploadError) => {
              logger.error(
                `Claude files upload failed for session ${sessionId}`,
                {
                  containerId,
                  taskId,
                  error: uploadError
                }
              );
            });
        } else {
          logger.warn(`Stream ended but no sessionId found for upload`, {
            containerId,
            taskId
          });
        }
      }
    });

    originalStream.on("error", (error) => {
      wrappedStream.destroy(error);
    });

    // 管道原始流到包装流
    originalStream.pipe(wrappedStream);

    return wrappedStream;
  }

  /**
   * 恢复特定的 Claude 会话
   */
  async resumeClaudeSession(
    options: ClaudeSessionOptions
  ): Promise<ClaudeResponse> {
    const {
      sessionId,
      prompt,
      outputFormat = "stream-json",
      containerId
    } = options;

    if (!sessionId) {
      throw new ApiError(
        "CLAUDE_SESSION_ID_REQUIRED",
        "Session ID is required to resume a Claude session",
        400
      );
    }

    const command = ["claude", "--resume", sessionId];

    if (prompt) {
      command.push(prompt);
    }

    if (outputFormat !== "text") {
      command.push("--output-format", outputFormat);
    }

    logger.info(
      `Resuming Claude session ${sessionId} in container ${containerId}`,
      {
        sessionId,
        hasNewPrompt: !!prompt,
        outputFormat
      }
    );

    try {
      const result = await this.execInContainer(
        this.docker.getContainer(containerId),
        command,
        CLAUDE_CODE_ENV
      );

      if (result.stderr && result.stderr.includes("error")) {
        logger.error(
          `Claude session resume failed in container ${containerId}`,
          {
            sessionId,
            stderr: result.stderr
          }
        );
        throw new ApiError(
          "CLAUDE_SESSION_RESUME_FAILED",
          `Claude session resume failed: ${result.stderr}`,
          500
        );
      }

      return this.parseClaudeResponse(result.stdout, outputFormat);
    } catch (error) {
      logger.error(
        `Error resuming Claude session ${sessionId} in container ${containerId}`,
        {
          error,
          sessionId
        }
      );

      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(
        "CLAUDE_SESSION_RESUME_FAILED",
        `Failed to resume Claude session: ${error instanceof Error ? error.message : String(error)}`,
        500
      );
    }
  }

  /**
   * 继续最近的 Claude 会话
   */
  async continueClaudeSession(
    options: ClaudeSessionOptions
  ): Promise<ClaudeResponse> {
    const { prompt, outputFormat = "stream-json", containerId } = options;

    const command = ["claude", "--continue"];

    if (prompt) {
      command.push(prompt);
    }

    if (outputFormat !== "text") {
      command.push("--output-format", outputFormat);
    }

    logger.info(`Continuing Claude session in container ${containerId}`, {
      hasNewPrompt: !!prompt,
      outputFormat
    });

    try {
      const result = await this.execInContainer(
        this.docker.getContainer(containerId),
        command,
        CLAUDE_CODE_ENV
      );

      if (result.stderr && result.stderr.includes("error")) {
        logger.error(
          `Claude session continue failed in container ${containerId}`,
          {
            stderr: result.stderr
          }
        );
        throw new ApiError(
          "CLAUDE_SESSION_CONTINUE_FAILED",
          `Claude session continue failed: ${result.stderr}`,
          500
        );
      }

      return this.parseClaudeResponse(result.stdout, outputFormat);
    } catch (error) {
      logger.error(
        `Error continuing Claude session in container ${containerId}`,
        {
          error
        }
      );

      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(
        "CLAUDE_SESSION_CONTINUE_FAILED",
        `Failed to continue Claude session: ${error instanceof Error ? error.message : String(error)}`,
        500
      );
    }
  }

  /**
   * 创建流式 Claude 会话
   */
  private async createClaudeStreamSession(
    containerId: string,
    command: string[]
  ): Promise<import("../types").ClaudeStreamResponse> {
    return new Promise((resolve, reject) => {
      // 创建容器exec实例
      this.docker
        .getContainer(containerId)
        .exec({
          Cmd: command,
          AttachStdout: true,
          AttachStderr: true,
          Env: CLAUDE_CODE_ENV,
          WorkingDir: "/home/sandbox"
        })
        .then((exec) => {
          exec.start({ hijack: true }, (err, stream) => {
            if (err) {
              logger.error(
                `Error starting Claude stream session in container ${containerId}`,
                { error: err }
              );
              return reject(
                new ApiError(
                  "CLAUDE_STREAM_START_FAILED",
                  `Failed to start Claude stream session: ${err.message}`,
                  500
                )
              );
            }

            if (!stream) {
              return reject(
                new ApiError(
                  "CLAUDE_STREAM_NO_STREAM",
                  "No stream returned from Claude exec.start",
                  500
                )
              );
            }

            let sessionId = "";

            // 创建转换流来处理和转发数据
            const outputStream = new Transform({
              transform(chunk: any, encoding: any, callback: any) {
                const data = chunk.toString();

                // 尝试解析数据以提取session_id
                try {
                  const lines = data
                    .split("\n")
                    .filter((line: any) => line.trim());
                  for (const line of lines) {
                    try {
                      const parsed = JSON.parse(line);
                      if (parsed.session_id) {
                        sessionId = parsed.session_id;
                      }
                    } catch (e) {
                      // 忽略非JSON行
                    }
                  }
                } catch (e) {
                  // 忽略解析错误
                }

                // 转发数据
                this.push(data);
                callback();
              }
            });

            // 处理stderr单独记录错误
            const stdoutStream = new Transform({
              transform(chunk: any, encoding: any, callback: any) {
                const data = chunk.toString();
                logger.info(`Claude stream stdout chunk received`, {
                  containerId,
                  dataLength: data.length
                });
                this.push(data);
                callback();
              }
            });

            const stderrStream = new Transform({
              transform(chunk: any, encoding: any, callback: any) {
                const error = chunk.toString();
                logger.error(`Claude stream stderr: ${error}`, { containerId });

                if (error.includes("error")) {
                  outputStream.destroy(
                    new Error(`Claude stream error: ${error}`)
                  );
                }
                callback();
              }
            });

            // 解复用Docker流到stdout和stderr
            this.docker.modem.demuxStream(stream, stdoutStream, stderrStream);

            // 将stdout连接到输出流
            stdoutStream.pipe(outputStream);

            stream.on("end", () => {
              logger.info(
                `Claude stream session ended for container ${containerId}`,
                { sessionId }
              );
            });

            stream.on("error", (streamError) => {
              logger.error(`Claude stream error for container ${containerId}`, {
                error: streamError
              });
              outputStream.destroy(streamError);
            });

            // 返回流式响应，包含初始的 sessionId（可能为空）
            const streamResponse: import("../types").ClaudeStreamResponse = {
              type: "stream",
              stream: outputStream,
              session_id: sessionId
            };

            resolve(streamResponse);
          });
        })
        .catch((error) => {
          logger.error(
            `Error creating Claude stream exec in container ${containerId}`,
            { error }
          );
          reject(
            new ApiError(
              "CLAUDE_STREAM_EXEC_FAILED",
              `Failed to create Claude stream exec: ${error.message}`,
              500
            )
          );
        });
    });
  }

  /**
   * 解析 Claude 命令的响应
   */
  private parseClaudeResponse(
    stdout: string,
    outputFormat: string
  ): ClaudeResponse {
    try {
      if (outputFormat === "json") {
        // 尝试解析 JSON 格式的响应
        const lines = stdout.split("\n").filter((line) => line.trim());
        const lastLine = lines[lines.length - 1];

        if (lastLine) {
          const jsonResponse = JSON.parse(lastLine);
          return {
            type: jsonResponse.type || "result",
            subtype: jsonResponse.subtype,
            total_cost_usd: jsonResponse.total_cost_usd,
            is_error: jsonResponse.is_error || false,
            duration_ms: jsonResponse.duration_ms,
            duration_api_ms: jsonResponse.duration_api_ms,
            num_turns: jsonResponse.num_turns,
            result: jsonResponse.result || "",
            session_id: jsonResponse.session_id
          };
        }
      } else if (outputFormat === "stream-json") {
        // 处理流式 JSON 响应
        const lines = stdout.split("\n").filter((line) => line.trim());
        const responses: StreamResponse[] = [];
        let finalResult = "";
        let sessionId = "";

        for (const line of lines) {
          try {
            const parsed = JSON.parse(line);
            responses.push(parsed);

            if (parsed.type === "result") {
              finalResult = parsed.result || "";
              sessionId = parsed.session_id || "";
            } else if (parsed.content) {
              finalResult += parsed.content;
            }
          } catch (e) {
            // 忽略无效的 JSON 行
          }
        }

        return {
          type: "result",
          is_error: false,
          result: finalResult,
          session_id: sessionId
        };
      }

      // 文本格式的响应
      return {
        type: "result",
        is_error: false,
        result: stdout.trim()
      };
    } catch (error) {
      logger.warn(
        "Failed to parse Claude response as JSON, returning as text",
        {
          error,
          stdout: stdout.substring(0, 200)
        }
      );

      return {
        type: "result",
        is_error: false,
        result: stdout.trim()
      };
    }
  }

  /**
   * 获取 Claude 会话的交互模式（用于实时对话）
   */
  async startInteractiveClaudeSession(containerId: string): Promise<{
    sessionId: string;
    startCommand: () => Promise<void>;
    sendMessage: (message: string) => Promise<ClaudeResponse>;
    endSession: () => Promise<void>;
  }> {
    // 这是一个高级功能，可以用于实现实时交互
    // 暂时返回基础实现，后续可以扩展
    const sessionId = `interactive-${Date.now()}`;

    return {
      sessionId,
      startCommand: async () => {
        logger.info(
          `Starting interactive Claude session ${sessionId} in container ${containerId}`
        );
      },
      sendMessage: async (message: string): Promise<ClaudeResponse> => {
        const result = await this.createClaudeSession({
          containerId,
          prompt: message,
          outputFormat: "json"
        });
        // 确保返回的是 ClaudeResponse 类型
        if (result.type === "stream") {
          throw new ApiError(
            "INVALID_RESPONSE_TYPE",
            "Interactive session requires non-stream response",
            500
          );
        }
        return result as ClaudeResponse;
      },
      endSession: async () => {
        logger.info(
          `Ending interactive Claude session ${sessionId} in container ${containerId}`
        );
      }
    };
  }

  /**
   * 压缩并上传 Claude 会话文件和 sandbox 文件夹到 OSS
   */
  private async compressAndUploadClaudeFiles(
    containerId: string,
    sessionId: string,
    taskId?: string
  ): Promise<{ sessionFileUrl?: string; sandboxFileUrl?: string }> {
    if (!taskId) {
      logger.info("No taskId provided, skipping Claude files upload", {
        containerId,
        sessionId
      });
      return {};
    }

    try {
      const container = this.docker.getContainer(containerId);

      // 验证容器存在
      await container.inspect();

      logger.info(`Starting to upload Claude files for session ${sessionId}`, {
        containerId,
        taskId
      });

      const results: { sessionFileUrl?: string; sandboxFileUrl?: string } = {};

      // 1. 上传 Claude 会话文件（jsonl 原样上传）
      try {
        const sessionFileBuffer = await this.uploadClaudeSessionFile(
          container,
          sessionId,
          taskId
        );

        if (sessionFileBuffer) {
          results.sessionFileUrl = sessionFileBuffer;
          logger.info(`Successfully uploaded Claude session file`, {
            sessionId,
            url: sessionFileBuffer
          });
        }
      } catch (sessionError) {
        logger.warn(`Failed to upload Claude session file for ${sessionId}`, {
          error: sessionError
        });
      }

      // 2. 压缩并上传 sandbox 文件夹
      try {
        const sandboxBuffer = await this.compressSandboxFiles(container);

        if (sandboxBuffer) {
          const sandboxFileName = `sandbox.zip`;
          const sandboxObjectName = `${taskId}/${sessionId}/${sandboxFileName}`;

          const sandboxUploadResult = await ossService.uploadFile(
            sandboxObjectName,
            sandboxBuffer,
            {
              headers: {
                "Content-Type": "application/zip"
              },
              meta: {
                "container-id": containerId,
                "session-id": sessionId,
                "task-id": taskId,
                "file-type": "sandbox-files"
              }
            }
          );

          results.sandboxFileUrl = sandboxUploadResult.url;
          logger.info(`Successfully uploaded sandbox files`, {
            containerId,
            url: sandboxUploadResult.url
          });
        }
      } catch (sandboxError) {
        logger.warn(
          `Failed to compress/upload sandbox files for container ${containerId}`,
          { error: sandboxError }
        );
      }

      return results;
    } catch (error) {
      logger.error(
        `Error in compressAndUploadClaudeFiles for session ${sessionId}`,
        { error, containerId, taskId }
      );
      // 不抛出错误，只是记录日志，不影响主要的 Claude 会话创建流程
      return {};
    }
  }

  /**
   * 上传 Claude 会话文件（jsonl 文件直接上传）
   */
  private async uploadClaudeSessionFile(
    container: Docker.Container,
    sessionId: string,
    taskId: string
  ): Promise<string | null> {
    try {
      // Claude 会话文件通常存储在 ~/.claude/projects/-home-sandbox/ 目录下
      const claudeProjectDir = "/root/.claude/projects/-home-sandbox";

      // 查找对应 sessionId 的 jsonl 文件
      const { stdout: findResult } = await this.execInContainer(
        container,
        [
          "find",
          claudeProjectDir,
          "-name",
          `*${sessionId}*.jsonl`,
          "-type",
          "f"
        ],
        undefined,
        undefined
      ).catch(() => ({ stdout: "", stderr: "" }));

      if (!findResult.trim()) {
        logger.warn(`No Claude session file found for sessionId: ${sessionId}`);
        return null;
      }

      const sessionFiles = findResult
        .trim()
        .split("\n")
        .filter((f) => f.trim());
      logger.info(`Found Claude session files: ${sessionFiles.join(", ")}`);

      // 取第一个找到的 jsonl 文件
      const sessionFilePath = sessionFiles[0];
      const sessionFileName = path.basename(sessionFilePath);

      // 读取 jsonl 文件内容
      const tarStream = await container.getArchive({
        path: sessionFilePath
      });

      // 解压获取文件内容
      const extract = tar.extract();
      let jsonlContent: Buffer | null = null;

      await new Promise<void>((resolve, reject) => {
        extract.on(
          "entry",
          (header: any, stream: NodeJS.ReadableStream, next: () => void) => {
            const chunks: Buffer[] = [];

            stream.on("data", (chunk: Buffer) => {
              chunks.push(chunk);
            });

            stream.on("end", () => {
              if (chunks.length > 0) {
                jsonlContent = Buffer.concat(chunks);
              }
              next();
            });

            stream.resume();
          }
        );

        extract.on("finish", () => {
          resolve();
        });

        extract.on("error", reject);
        tarStream.pipe(extract);
      });

      if (!jsonlContent) {
        logger.warn(
          `Could not read content from Claude session file: ${sessionFilePath}`
        );
        return null;
      }

      // 直接上传 jsonl 文件到 OSS
      const objectName = `${taskId}/${sessionId}/${sessionFileName}`;

      const uploadResult = await ossService.uploadFile(
        objectName,
        jsonlContent,
        {
          headers: {
            "Content-Type": "application/jsonl"
          },
          meta: {
            "container-id": container.id,
            "session-id": sessionId,
            "task-id": taskId,
            "file-type": "claude-session"
          }
        }
      );

      return uploadResult.url;
    } catch (error) {
      logger.error(`Error uploading Claude session file: ${error}`);
      return null;
    }
  }

  /**
   * 压缩 sandbox 文件夹
   */
  private async compressSandboxFiles(
    container: Docker.Container
  ): Promise<Buffer | null> {
    try {
      const WORK_DIR = "/home/sandbox";

      // 创建临时压缩文件
      const tempZipPath = `/tmp/sandbox-${container.id.substring(0, 8)}.zip`;

      // 检查 zip 命令是否可用
      const { exitCode: zipExitCode } = await this.execInContainer(
        container,
        ["which", "zip"],
        undefined,
        undefined
      )
        .then(() => ({ exitCode: 0 }))
        .catch(() => ({ exitCode: 1 }));

      if (zipExitCode !== 0) {
        logger.warn(
          "Zip command not available in container for sandbox compression"
        );
        return null;
      }

      // 创建排除模式文件
      const excludePatterns = [
        "node_modules/*",
        "venv/*",
        ".venv/*",
        "__pycache__/*",
        "dist/*",
        "build/*",
        "package-lock.json",
        "yarn.lock",
        "pnpm-lock.yaml",
        "*.local",
        "*.local/*",
        "*.cache",
        "*.cache/*",
        ".local",
        ".local/*",
        ".cache",
        ".cache/*",
        ".npm",
        ".npm/**"
      ];

      const excludeFilePath = `/tmp/exclude-${container.id.substring(0, 8)}.txt`;

      // 创建排除文件
      await this.execInContainer(
        container,
        [
          "bash",
          "-c",
          `echo "${excludePatterns.join("\n")}" > ${excludeFilePath}`
        ],
        undefined,
        undefined
      );

      // 使用 zip 压缩文件
      const zipCmd = `cd ${WORK_DIR} && zip -r -q ${tempZipPath} . -x@${excludeFilePath}`;

      await this.execInContainer(
        container,
        ["bash", "-c", zipCmd],
        undefined,
        undefined
      );

      // 读取压缩文件内容
      const tarStream = await container.getArchive({
        path: tempZipPath
      });

      // 解压获取文件内容
      const extract = tar.extract();
      let buffer: Buffer | null = null;

      await new Promise<void>((resolve, reject) => {
        extract.on(
          "entry",
          (header: any, stream: NodeJS.ReadableStream, next: () => void) => {
            const chunks: Buffer[] = [];

            stream.on("data", (chunk: Buffer) => {
              chunks.push(chunk);
            });

            stream.on("end", () => {
              if (chunks.length > 0) {
                buffer = Buffer.concat(chunks);
              }
              next();
            });

            stream.resume();
          }
        );

        extract.on("finish", () => {
          resolve();
        });

        extract.on("error", reject);
        tarStream.pipe(extract);
      });

      // 清理临时文件
      await this.execInContainer(
        container,
        ["bash", "-c", `rm -f ${tempZipPath} ${excludeFilePath}`],
        undefined,
        undefined
      ).catch(() => {});

      return buffer;
    } catch (error) {
      logger.error(`Error compressing sandbox files: ${error}`);
      return null;
    }
  }
}

export default new ClaudeCodeService();
