import Docker from "dockerode";
import logger from "../utils/logger";
import fs from "fs";
import { execSync } from "child_process";
import dotenv from "dotenv";
dotenv.config();

/**
 * Shared Docker configuration to avoid circular dependencies
 */
class DockerConfig {
  private docker: Docker;

  constructor() {
    // Initialize Docker client with appropriate socket path
    const socketPath =
      process.env.DOCKER_SOCKET_PATH ||
      process.env.DOCKER_HOST?.replace("unix://", "") ||
      this.getDefaultDockerSocket();

    logger.info(`Using Docker socket path: ${socketPath}`);

    // Check socket path exists and is accessible
    try {
      const stats = fs.statSync(socketPath);
      logger.info(
        `Docker socket exists: ${stats.isSocket() ? "Yes (is socket)" : "No (not a socket)"}`
      );
    } catch (error: any) {
      logger.warn(`Docker socket path check failed: ${error.message}`);
    }

    this.docker = new Docker({ socketPath });
  }

  /**
   * Get the Docker instance
   */
  getDockerInstance(): Docker {
    return this.docker;
  }

  /**
   * Get the default Docker socket path based on the platform
   */
  private getDefaultDockerSocket(): string {
    const platform = process.platform;
    logger.info(`Detecting Docker socket path for platform: ${platform}`);

    // Try to detect Colima socket first (most likely on macOS)
    try {
      const colimaStatus = execSync("colima status 2>/dev/null").toString();
      const socketMatch = colimaStatus.match(
        /socket: unix:\/\/(.*docker\.sock)/
      );
      if (socketMatch && socketMatch[1]) {
        const colimaSocket = socketMatch[1];
        logger.info(`Detected Colima socket: ${colimaSocket}`);
        if (fs.existsSync(colimaSocket)) {
          return colimaSocket;
        }
      }
    } catch (error: any) {
      logger.info(`Colima detection failed or not installed: ${error.message}`);
    }

    // These paths are ordered by priority
    const possiblePaths = [
      "/var/run/docker.sock", // Default Unix socket
      `${process.env.HOME}/.docker/run/docker.sock`, // Docker Desktop socket (newer versions)
      `${process.env.HOME}/.colima/default/docker.sock`, // Colima socket
      "/Users/Shared/docker/run/docker.sock", // Another common Docker Desktop location
      "/private/var/run/docker.sock" // macOS sometimes uses this path
    ];

    // Try each path in order
    for (const path of possiblePaths) {
      logger.info(`Checking Docker socket path: ${path}`);
      if (fs.existsSync(path)) {
        logger.info(`Found Docker socket at: ${path}`);
        return path;
      } else {
        logger.info(`Docker socket not found at: ${path}`);
      }
    }

    // If no socket is found, try to find using Docker context config
    try {
      const dockerContext = execSync(
        "docker context inspect 2>/dev/null"
      ).toString();
      const hostMatch = dockerContext.match(/\"Host\"\s*:\s*\"(.+?)\"/);
      if (hostMatch && hostMatch[1] && hostMatch[1].startsWith("unix://")) {
        const detectedPath = hostMatch[1].replace("unix://", "");
        logger.info(
          `Detected Docker socket from docker context: ${detectedPath}`
        );
        if (fs.existsSync(detectedPath)) {
          return detectedPath;
        }
      }
    } catch (error: any) {
      logger.warn(
        `Failed to detect Docker socket from context: ${error.message}`
      );
    }

    // If no socket is found, return the default path and let Docker handle the error
    logger.warn("No Docker socket found, using default path");
    return "/var/run/docker.sock";
  }
}

// Export a singleton instance
export default new DockerConfig();
