import { Logger as WinstonLogger, LoggerOptions } from "winston";
import { Socket } from "socket.io-client";

/**
 * Configuration options for the Socket.IO Transport
 *
 * These options extend Winston's LoggerOptions to provide Socket.IO-specific settings.
 */
export interface SocketIOTransportOptions extends LoggerOptions {
  /** WebSocket server URL (using http:// or https:// protocol, NOT ws:// or wss://) */
  url: string;
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
 * Extended Winston Logger configuration options with Socket.IO support
 *
 * This interface extends Winston's LoggerOptions to include a socketIO property
 * for configuring the WebSocket transport.
 */
export interface MultiChannelLoggerOptions extends LoggerOptions {
  /** Socket.IO transport configuration */
  socketIO?: SocketIOTransportOptions;
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
