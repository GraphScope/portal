import { Logger as WinstonLogger, LoggerOptions, transports } from "winston";
import { Socket } from "socket.io-client";

/**
 * Request context type definition for logging
 * 
 * Contains common request metadata that can be included in log entries:
 * - authorization: Authorization header/token
 * - xContainerId: Container identifier from headers/params/body
 * - userId: User identifier
 * - [key: string]: any: Additional custom context fields
 */
export type RequestContext = {
  authorization?: string;
  xContainerId?: string;
  userId?: string;
  [key: string]: any;
};

/**
 * Configuration options for the Socket.IO Transport
 *
 * These options extend Winston's LoggerOptions to provide Socket.IO-specific settings.
 */
export interface SocketIOTransportOptions extends LoggerOptions {
  /** WebSocket server URL (using http:// or https:// protocol, NOT ws:// or wss://) */
  url?: string;
  /** Event name for log messages, defaults to 'log' */
  eventName?: string;
  /** Log level for this transport */
  level?: string;
  /** Whether to enable automatic reconnection */
  reconnection?: boolean;
  /** Maximum number of reconnection attempts */
  reconnectionAttempts?: number;
  /** Delay between reconnection attempts (in milliseconds) */
  reconnectionDelay?: number;
}

/**
 * Console transport options, extends winston's ConsoleTransportOptions
 */
export type ConsoleTransportOptions = transports.ConsoleTransportOptions;

/**
 * File transport options, extends winston's FileTransportOptions
 */
export type FileTransportOptions = transports.FileTransportOptions;

/**
 * Http transport options, extends winston's HttpTransportOptions
 */
export type HttpTransportOptions = transports.HttpTransportOptions;

/**
 * Extended Winston Logger configuration options with multi-channel support
 *
 * - console: Console transport options (required)
 * - file: File transport options (required)
 * - ws: Socket.IO transport options (optional)
 * - http: Http transport options (optional)
 */
export interface MultiChannelLoggerOptions extends LoggerOptions {
  /** Console transport options (required) */
  console?: ConsoleTransportOptions;
  /** File transport options (required, must provide filename) */
  file?: FileTransportOptions;
  /** WebSocket transport options (optional) */
  ws?: SocketIOTransportOptions & { enabled?: boolean, port?: number };
  /** Http transport options (optional) */
  http?: HttpTransportOptions & { enabled?: boolean, getContext?: () => RequestContext };
}

/**
 * Multi-channel Logger interface that extends Winston Logger
 *
 * This interface maintains full compatibility with Winston's API while adding
 * a socket property for accessing the Socket.IO client instance directly.
 */
export interface MultiChannelLogger extends WinstonLogger {
  /** The Socket.IO client instance or null if WebSocket transport is not configured */
  socket: Socket | null;
}

/**
 * Unified configuration for log service (logger + ws server + http server)
 */
export interface LogServiceConfig extends MultiChannelLoggerOptions {
  logFilePath: string;
  level?: string;
  debug?: boolean;
  service?: string;
}

/**
 * LogLevel defines the supported log severity levels.
 */
export type LogLevel = 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug' | 'silly';

/**
 * LogEntry represents a single log message with optional context and metadata.
 */
export interface LogEntry {
  timestamp: string; // ISO8601
  level: LogLevel;
  message: string;
  sessionId: string; // Session isolation support
  source?: string; // e.g., service/component name
  context?: Record<string, any>; // Arbitrary structured context
  meta?: Record<string, any>; // Additional metadata
  index?: number; // Monotonic index for log ordering (per session)
}

/**
 * LoggerStorage is an interface for log storage backends (memory, file, database, etc).
 * Implementations must provide write() and query() methods, and may support streaming, close, and clear.
 */
export interface LoggerStorage {
  write(entry: LogEntry): Promise<void>;
  query(params: LoggerQueryParams): Promise<LogEntry[]>;
  stream?(params: LoggerQueryParams): AsyncIterable<LogEntry>;
  close?(): Promise<void>;
  clear?(sessionId?: string): Promise<void>; // Clear logs for a session or all if not provided
}

/**
 * LoggerQueryParams defines the parameters for querying or streaming logs.
 */
export interface LoggerQueryParams {
  level?: LogLevel;
  source?: string;
  since?: string; // ISO8601
  until?: string; // ISO8601
  limit?: number;
  sessionId?: string; // Session isolation support
  cursor?: number; // Log index cursor for SSE reconnection
}

/**
 * LoggerClientOptions configures a LoggerClient instance.
 * This is the base shape; implementations may extend it.
 */
export interface LoggerClientOptions {
  transports: any[]; // Use 'any' to avoid direct winston dependency in types
  defaultLevel?: LogLevel;
  source?: string;
  service?: string;
  defaultSessionId?: string; // Optional default session context
}
