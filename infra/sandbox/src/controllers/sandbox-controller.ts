import { Request, Response, NextFunction } from "express";
import containerService from "../services/container-service";
import executionService from "../services/execution-service";
import { CreateSandboxRequest, ExecuteCodeRequest } from "../types";
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
        expiresAt: container.expiresAt.toISOString()
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
        gitTracking
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
        { containerId }
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
}

export default new SandboxController();
