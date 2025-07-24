import { Request, Response, NextFunction } from "express";
import containerService from "../services/container-service";
import executionService from "../services/execution-service";
import browserService from "../services/browser-service";
import claudeCodeService from "../services/claude-code-service";
import {
  CreateSandboxRequest,
  ExecuteCodeRequest,
  UpdateFilesRequest,
  CreateClaudeSessionRequest,
  ResumeClaudeSessionRequest,
  ContinueClaudeSessionRequest
} from "../types";
import logger from "../utils/logger";

/**
 * Sandbox controller for handling API requests
 */
class SandboxController {
  /**
   * Create a new sandbox
   */
  async createSandbox(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { image, options } = req.body as CreateSandboxRequest;

      logger.info("Creating sandbox", { image, options });

      const container = await containerService.createContainer(image, options);

      res.status(201).json({
        containerId: container.id,
        status: container.status,
        createdAt: container.createdAt.toISOString(),
        expiresAt: container.expiresAt.toISOString(),
        browserPort: container.browserPort // Include the browser port in response
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Execute code in a sandbox
   */
  async executeCode(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { containerId, command, files, env, gitTracking } =
        req.body as ExecuteCodeRequest;

      logger.info("Executing code in sandbox", {
        containerId,
        command,
        hasFiles: files ? Object.keys(files).length > 0 : false
      });

      // Execute code in container
      const result = await executionService.executeInContainer(
        containerId,
        command,
        files,
        env,
        gitTracking
      );

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update files in a sandbox
   */
  async updateFiles(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { containerId, files, gitTracking } =
        req.body as UpdateFilesRequest;

      logger.info("Updating files in sandbox", {
        containerId,
        gitTracking
      });

      // Update files in container
      const result = await executionService.updateFiles(
        containerId,
        files,
        gitTracking
      );

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // Real-time logs functionality has been removed

  /**
   * Get sandbox status
   */
  async getSandboxStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { containerId } = req.params;

      // logger.info(`Getting sandbox status: ${containerId}`, { containerId });

      const containerInfo = await containerService.getContainer(containerId);
      const status = await containerService.getContainerStatus(containerId);

      res.status(200).json({
        containerId: containerInfo.id,
        status: status.status,
        createdAt: containerInfo.createdAt.toISOString(),
        expiresAt: containerInfo.expiresAt.toISOString(),
        browserPort: containerInfo.browserPort, // Include browser port in response
        ...(status.resourceUsage && { resourceUsage: status.resourceUsage })
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a sandbox
   */
  async deleteSandbox(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { containerId } = req.params;

      logger.info("Deleting sandbox", { containerId });

      await containerService.removeContainer(containerId);

      res.status(200).json({
        status: "deleted",
        containerId
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Download a file from a sandbox container
   */
  async downloadFile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { containerId } = req.params;
      const { filePath } = req.query;

      if (!filePath || typeof filePath !== "string") {
        res.status(400).json({
          error: {
            code: "INVALID_PARAMETER",
            message: "filePath query parameter is required"
          }
        });
        return;
      }

      logger.info("Downloading file from sandbox", { containerId, filePath });

      const fileService = await import("../services/file-service").then(
        (m) => m.default
      );
      const { content, fileName } = await fileService.downloadFileFromContainer(
        containerId,
        filePath
      );

      // Set headers for file download
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}"`
      );
      res.setHeader("Content-Type", "application/octet-stream");

      // Send the file content
      res.status(200).send(content);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Download all files from a sandbox container as a zip archive
   * Includes .git directory for version history but excludes other hidden folders and dependency files
   */
  async downloadAllFilesAsZip(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { containerId } = req.params;

      logger.info(
        "Downloading files as ZIP from sandbox (including .git for version history)",
        {
          containerId
        }
      );

      const fileService = await import("../services/file-service").then(
        (m) => m.default
      );
      const { buffer, fileName } =
        await fileService.downloadAllFilesAsZip(containerId);

      // Set headers for file download with appropriate content type
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}"`
      );

      // Set content type based on file extension
      const contentType = fileName.endsWith(".zip")
        ? "application/zip"
        : "application/gzip";

      res.setHeader("Content-Type", contentType);

      // Send the ZIP file content
      res.status(200).send(buffer);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Proxy browser requests to container using port mapping
   */
  async useBrowser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { containerId } = req.params;

      const fullPath = req.path;

      const prefixToRemove = `/api/sandbox/browser/${containerId}`;
      const path = fullPath.startsWith(prefixToRemove)
        ? fullPath.slice(prefixToRemove.length)
        : fullPath;

      // Ensure path starts with / if not empty
      const normalizedPath = path
        ? path.startsWith("/")
          ? path.slice(1)
          : path
        : "";

      logger.info("Handling browser request", {
        method: req.method,
        containerId,
        originalPath: fullPath,
        normalizedPath
      });

      // Check if the container exists and is running
      const containerInfo = await containerService.getContainer(containerId);
      if (containerInfo.status !== "running") {
        res.status(400).json({
          error: {
            code: "CONTAINER_NOT_RUNNING",
            message: `Container ${containerId} is not running`,
            details: { status: containerInfo.status }
          }
        });
        return;
      }

      // Check if the container has a port mapping for browser service
      if (!containerInfo.browserPort) {
        res.status(400).json({
          error: {
            code: "BROWSER_SERVICE_NOT_AVAILABLE",
            message: `Container ${containerId} does not have browser service port mapping`,
            details: { containerId }
          }
        });
        return;
      }

      // Log detailed connection information for debugging
      logger.info(`Using port mapping for container browser service`, {
        containerId,
        browserPort: containerInfo.browserPort,
        targetEndpoint: `http://127.0.0.1:${containerInfo.browserPort}`,
        containerStatus: containerInfo.status,
        requestPath: normalizedPath || "mcp"
      });

      // MCP server requires specific endpoints
      let targetPath = normalizedPath || "mcp";

      // Use browserService to proxy the request using port mapping
      if (targetPath === "mcp" || targetPath === "sse") {
        logger.info(`Proxying ${targetPath} request to container`, {
          containerId,
          browserPort: containerInfo.browserPort,
          path: targetPath
        });

        // Use browserService to forward the request directly
        await browserService.forwardRequest(containerId, req, res, targetPath);
      } else {
        // For any other path, pass through as is
        logger.info(
          `Proxying custom path request to container: ${targetPath}`,
          {
            containerId,
            browserPort: containerInfo.browserPort
          }
        );

        await browserService.forwardRequest(containerId, req, res, targetPath);
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * 创建新的 Claude 会话
   */
  async createClaudeSession(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { containerId, prompt, outputFormat, taskId } =
        req.body as CreateClaudeSessionRequest;

      logger.info("Creating Claude session", {
        containerId,
        promptLength: prompt.length,
        outputFormat,
        taskId
      });

      const result = await claudeCodeService.createClaudeSession({
        containerId,
        prompt,
        outputFormat,
        taskId
      });

      // 根据返回类型设置不同的响应
      if (result.type === "stream") {
        // 类型保护确保result是ClaudeStreamResponse
        const streamResult = result as import("../types").ClaudeStreamResponse;

        // 设置流式响应头
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "Cache-Control");

        // 发送初始事件
        if (streamResult.session_id) {
          res.write(
            `data: ${JSON.stringify({ type: "session_start", session_id: streamResult.session_id })}\n\n`
          );
        }

        // 管道流数据到响应
        streamResult.stream.on("data", (chunk: Buffer) => {
          const data = chunk.toString();
          // 按行发送数据作为SSE事件
          const lines = data.split("\n");
          for (const line of lines) {
            if (line.trim()) {
              res.write(`data: ${line}\n\n`);
            }
          }
        });

        streamResult.stream.on("end", () => {
          res.write(`data: ${JSON.stringify({ type: "stream_end" })}\n\n`);
          res.end();
        });

        streamResult.stream.on("error", (error: Error) => {
          logger.error("Claude stream error", { error, containerId });
          res.write(
            `data: ${JSON.stringify({ type: "error", message: error.message })}\n\n`
          );
          res.end();
        });
      } else {
        // JSON响应
        res.status(200).json(result);
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * 恢复 Claude 会话
   */
  async resumeClaudeSession(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { containerId, sessionId, prompt, outputFormat } =
        req.body as ResumeClaudeSessionRequest;

      logger.info("Resuming Claude session", {
        containerId,
        sessionId,
        hasNewPrompt: !!prompt,
        outputFormat
      });

      const result = await claudeCodeService.resumeClaudeSession({
        containerId,
        sessionId,
        prompt,
        outputFormat
      });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 继续最近的 Claude 会话
   */
  async continueClaudeSession(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { containerId, prompt, outputFormat } =
        req.body as ContinueClaudeSessionRequest;

      logger.info("Continuing Claude session", {
        containerId,
        hasNewPrompt: !!prompt,
        outputFormat
      });

      const result = await claudeCodeService.continueClaudeSession({
        containerId,
        prompt,
        outputFormat
      });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 启动交互式 Claude 会话
   */
  async startInteractiveClaudeSession(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { containerId } = req.params;

      logger.info("Starting interactive Claude session", { containerId });

      const session =
        await claudeCodeService.startInteractiveClaudeSession(containerId);

      res.status(200).json({
        sessionId: session.sessionId,
        message: "Interactive Claude session started successfully"
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new SandboxController();
