import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import http, { createServer } from "http";
import { errorHandler, notFoundHandler } from "./middleware/error-handler";
import { conditionalAuth } from "./middleware/simple-auth";
import {
  createSandboxValidation,
  execCodeValidation,
  containerIdValidation,
  updateFilesValidation,
  createClaudeSessionValidation,
  resumeClaudeSessionValidation,
  continueClaudeSessionValidation,
  validate
} from "./middleware/validation";
import sandboxController from "./controllers/sandbox-controller";
import logger from "./utils/logger";
import config from "./config";
import { registerTerminalSocket } from "./terminal/terminal-socket";
import { Server as SocketIOServer } from "socket.io";

/**
 * Create and configure Express app
 */
export function createApp(): {
  app: express.Application;
  server: http.Server;
  io?: any;
} {
  const app = express();

  // Apply middleware
  app.use(helmet()); // Security headers
  app.use(cors()); // Enable CORS
  app.use(express.json({ limit: "100mb" })); // Parse JSON bodies with 100MB limit
  app.use(express.urlencoded({ limit: "100mb", extended: true })); // Parse URL-encoded bodies with 100MB limit
  app.use(morgan("dev")); // HTTP request logging

  // Health check endpoint (no auth required)
  app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
  });

  // Apply API Key authentication to all /api routes
  app.use("/api", conditionalAuth);

  // API routes
  app.post(
    "/api/sandbox",
    createSandboxValidation,
    validate,
    sandboxController.createSandbox.bind(sandboxController)
  );

  // Standard code execution endpoint (maintains backward compatibility)
  app.post(
    "/api/sandbox/exec",
    execCodeValidation,
    validate,
    sandboxController.executeCode.bind(sandboxController)
  );

  // New endpoint for updating files
  app.post(
    "/api/sandbox/files",
    updateFilesValidation,
    validate,
    sandboxController.updateFiles.bind(sandboxController)
  );

  app.use(
    "/api/sandbox/browser/:containerId",
    containerIdValidation,
    validate,
    sandboxController.useBrowser.bind(sandboxController)
  );

  // Removed real-time logs endpoint

  app.get(
    "/api/sandbox/:containerId",
    containerIdValidation,
    validate,
    sandboxController.getSandboxStatus.bind(sandboxController)
  );
  app.delete(
    "/api/sandbox/:containerId",
    containerIdValidation,
    validate,
    sandboxController.deleteSandbox.bind(sandboxController)
  );
  app.get(
    "/api/sandbox/:containerId/file",
    containerIdValidation,
    validate,
    sandboxController.downloadFile.bind(sandboxController)
  );
  app.get(
    "/api/sandbox/:containerId/download-all",
    containerIdValidation,
    validate,
    sandboxController.downloadAllFilesAsZip.bind(sandboxController)
  );

  // Claude CLI 相关路由
  app.post(
    "/api/claude/session/create",
    createClaudeSessionValidation,
    validate,
    sandboxController.createClaudeSession.bind(sandboxController)
  );

  app.post(
    "/api/claude/session/resume",
    resumeClaudeSessionValidation,
    validate,
    sandboxController.resumeClaudeSession.bind(sandboxController)
  );

  app.post(
    "/api/claude/session/continue",
    continueClaudeSessionValidation,
    validate,
    sandboxController.continueClaudeSession.bind(sandboxController)
  );

  app.post(
    "/api/claude/session/interactive/:containerId",
    containerIdValidation,
    validate,
    sandboxController.startInteractiveClaudeSession.bind(sandboxController)
  );

  // Error handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  // Create HTTP server
  const server = createServer(app);

  // 集成Socket.IO
  const io = new SocketIOServer(server, {
    cors: { origin: "*" }
  });

  // 注册终端Socket事件
  registerTerminalSocket(io);

  return { app, server, io };
}

/**
 * Start the server
 */
export function startServer() {
  const { app, server } = createApp();

  server.listen(config.port, () => {
    logger.info(`Server started on port ${config.port}`, {
      env: config.nodeEnv,
      port: config.port
    });
  });

  // Handle graceful shutdown
  const shutdown = () => {
    logger.info("Shutting down server...");

    server.close(() => {
      logger.info("Server stopped");
      process.exit(0);
    });

    setTimeout(() => {
      logger.error(
        "Could not close connections in time, forcefully shutting down"
      );
      process.exit(1);
    }, 10000);
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);

  return server;
}

export default { createApp, startServer };
