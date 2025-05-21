import winston, { createLogger, format, transports } from "winston";
import { MultiChannelLogger, MultiChannelLoggerOptions } from "./types";
import SocketIOTransport from "./transports/socket-io";
import { Socket } from "socket.io-client";
import path from "path";
import fs from "fs";
import { createLogServer } from "./log-server";

/**
 * Creates a multi-channel logger instance that can output to console, file, and WebSocket
 *
 * The logger maintains Winston's original API while adding WebSocket capabilities.
 *
 * @param options Configuration options for the logger
 * @returns MultiChannelLogger instance that extends Winston Logger
 */
export function createMultiChannelLogger(
  options: MultiChannelLoggerOptions = {}
): MultiChannelLogger {
  // Default format: timestamp + JSON format
  const defaultFormat = format.combine(format.timestamp(), format.json());

  // Default configuration options
  const defaultOptions: MultiChannelLoggerOptions = {
    level: "info",
    format: options.format || defaultFormat,
    transports: []
  };

  // Merge provided options with defaults
  const loggerOptions = { ...defaultOptions, ...options };

  // Add Console Transport if no transports specified
  if (
    !loggerOptions.transports ||
    (Array.isArray(loggerOptions.transports) &&
      loggerOptions.transports.length === 0)
  ) {
    loggerOptions.transports = [new transports.Console()];
  }

  // Create Winston Logger instance and cast to our extended interface
  const logger = createLogger(loggerOptions) as MultiChannelLogger;

  // Initialize socket property as null
  logger.socket = null;

  // Add Socket.IO Transport if URL is provided
  if (options.socketIO?.url) {
    const socketTransport = new SocketIOTransport(options.socketIO);
    logger.add(socketTransport);
    // Store socket instance for external access (useful for manual connections/disconnections)
    logger.socket = socketTransport["socket"];
  }

  return logger;
}

/**
 * Ensures the directory for a log file exists, creating it if necessary
 * @param filePath Path to the log file
 */
function ensureDirectoryExists(filePath: string): void {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return;
  }
  fs.mkdirSync(dirname, { recursive: true });
}

/**
 * Creates a multi-channel logger with sensible defaults for console, file, and WebSocket output
 *
 * This is a convenience function that configures all three output channels at once.
 *
 * @param logFilePath Path to the log file (optional, defaults to '/tmp/logs/app.log')
 * @param socketUrl Socket.IO server URL (optional, if not provided WebSocket transport is disabled)
 * @returns MultiChannelLogger instance
 */
export function createDefaultLogger(
  logFilePath: string = "/tmp/logs/app.log",
  socketUrl?: string
): MultiChannelLogger {
  // Ensure log directory exists
  ensureDirectoryExists(logFilePath);

  const options: MultiChannelLoggerOptions = {
    level: "info",
    format: format.combine(
      format.timestamp(),
      format.printf(({ timestamp, level, message, ...rest }) => {
        const restString = Object.keys(rest).length ? JSON.stringify(rest) : "";
        return `${timestamp} ${level}: ${message} ${restString}`;
      })
    ),
    transports: [
      // Console output with colorized format
      new winston.transports.Console({
        format: format.combine(
          format.colorize(),
          format.printf(({ timestamp, level, message, ...rest }) => {
            const restString = Object.keys(rest).length
              ? JSON.stringify(rest)
              : "";
            return `${timestamp} ${level}: ${message} ${restString}`;
          })
        )
      }),
      // File output with rotation settings
      new winston.transports.File({
        filename: logFilePath,
        maxsize: 5242880, // 5MB
        maxFiles: 5
      })
    ]
  };

  // Add Socket.IO configuration if URL is provided
  if (socketUrl) {
    options.socketIO = {
      url: socketUrl,
      level: "info",
      reconnection: true
    };
  }

  return createMultiChannelLogger(options);
}

/**
 * Creates both a log server and a logger that connects to it
 *
 * This is a convenience function that:
 * 1. Creates and starts an integrated log server
 * 2. Creates a default logger configured to connect to that server
 *
 * @param logFilePath Path to the log file (optional, defaults to '/tmp/logs/app.log')
 * @param port Port for the log server (optional, defaults to 3001)
 * @param debug Whether to output debug logs from the server (optional, defaults to false)
 * @returns Object containing both the logger and log server information
 */
export function createLoggerWithServer(
  logFilePath: string = "/tmp/logs/app.log",
  port: number = 3001,
  debug: boolean = false
) {
  // Create and start the integrated log server
  const logServer = createLogServer({ port, debug });

  // Create a logger that connects to the server
  const logger = createDefaultLogger(logFilePath, logServer.url);

  return {
    logger,
    logServer
  };
}

// Export types and classes
export * from "./types";
export { SocketIOTransport };
export { createLogServer };
export default {
  createMultiChannelLogger,
  createDefaultLogger,
  SocketIOTransport,
  createLogServer,
  createLoggerWithServer
};
