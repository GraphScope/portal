// Logger types for infra/sandbox-v2/logger
import Transport from 'winston-transport';
// 已迁移类型定义，若有本地私有类型可在此补充

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
 */
export interface LoggerClientOptions {
  transports: Transport[];
  defaultLevel?: LogLevel;
  source?: string;
  service?: string;
  defaultSessionId?: string; // Optional default session context
}

/**
 * LoggerServerOptions configures a logger server instance.
 */
export interface LoggerServerOptions {
  storage: LoggerStorage;
  transports?: Transport[]; // For broadcasting
  port?: number;
  debug?: boolean;
} 