import { startServer } from "./server";
import logger from "./utils/logger";

/**
 * Main entry point for the sandbox API server
 */
try {
  // Start the HTTP server
  startServer();
  logger.info("Sandbox API Server initialization complete");
} catch (error) {
  logger.error("Failed to start Sandbox API Server", { error });
  process.exit(1);
}

// Export all necessary components for use as a library
export * from "./types";
export { default as containerService } from "./services/container-service";
export { default as executionService } from "./services/execution-service";
export { default as fileService } from "./services/file-service";
export { createApp, startServer } from "./server";
