import { createLogger as winstonCreateLogger, format, transports } from "winston";
import { MultiChannelLogger, MultiChannelLoggerOptions } from "./types";
import SocketIOTransport from "./ws/transport";
import path from "path";
import fs from "fs";
import TransportStream from "winston-transport";
import DynamicHttpTransport from "./http/DynamicHttpTransport";

const DEFAULT_FILE_MAX_SIZE = 5242880; // 5MB
const DEFAULT_FILE_MAX_FILES = 5;
/**
 * Ensures the directory for a log file exists, creating it if necessary
 * @param filePath Path to the log file
 */
function ensureDirectoryExists(filePath: string): void {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
}

/**
 * Creates a multi-channel logger instance that can output to console, file, WebSocket, and HTTP
 *
 * The logger maintains Winston's original API while adding WebSocket capabilities.
 *
 * @param options Configuration options for the logger
 * @returns MultiChannelLogger instance that extends Winston Logger
 */
export function createLogger(
  options: MultiChannelLoggerOptions
): MultiChannelLogger {
  // 创建公共的format配置
  const commonFormat = format.combine(
    format.timestamp(),
    format.simple()
  );

  // 1. Console transport (always enabled)
  const consoleTransport = new transports.Console({
    format: format.combine(format.colorize(), commonFormat),
    ...options.console,
  });

  // 2. File transport (always enabled, filename 必须)
  if (!options.file?.filename) {
    throw new Error("File transport requires a filename (log file path). Please provide file.filename in options.");
  }
  ensureDirectoryExists(options.file.filename);
  const fileTransport = new transports.File({
    format: commonFormat,
    maxsize: Number(process.env.LOG_FILE_MAX_SIZE) || DEFAULT_FILE_MAX_SIZE,
    maxFiles: Number(process.env.LOG_FILE_MAX_FILES) || DEFAULT_FILE_MAX_FILES,
    ...options.file,
  });

  // 3. 组装 transports，类型为 TransportStream[]
  const loggerTransports: TransportStream[] = [consoleTransport, fileTransport];

  // 4. WS transport（可选）
  let socket: any = null;
  if (options.ws?.enabled && options.ws.url) {
    const wsTransport = new SocketIOTransport({
      ...options.ws,
      format: commonFormat
    });
    loggerTransports.push(wsTransport as unknown as TransportStream);
    socket = (wsTransport as any).socket;
  }

  // 5. HTTP transport（可选）
  if (options.http?.enabled) {
    loggerTransports.push(new DynamicHttpTransport({
      ...options.http,
      format: commonFormat,
      getContext: options.http.getContext || (() => ({}))
    }));
  }

  // 6. 创建 logger
  const logger = winstonCreateLogger({
    ...options,
    transports: loggerTransports,
  }) as MultiChannelLogger;

  // 7. 挂载 ws socket 实例
  (logger as any).socket = socket;

  return logger;
}

// Export types and classes
export * from "./types";
export { SocketIOTransport };
export default {
  createLogger,
  SocketIOTransport
};
