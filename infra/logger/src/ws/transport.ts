import Transport from "winston-transport";
import { io, Socket } from "socket.io-client";
import { SocketIOTransportOptions } from "../types";

/**
 * Custom Winston Transport that sends logs to a WebSocket server via Socket.IO
 *
 * This transport:
 * - Connects to a Socket.IO server using the provided URL
 * - Emits log events to the server with the configured event name
 * - Handles connection errors and reconnection automatically
 * - Queues messages when disconnected and sends them upon reconnection
 */
class SocketIOTransport extends Transport {
  private socket: Socket;
  private eventName: string;
  private connected: boolean = false;
  private messageQueue: any[] = [];
  private reconnecting: boolean = false;

  /**
   * Creates a new Socket.IO transport instance
   *
   * @param options Configuration options for the transport
   */
  constructor(options: SocketIOTransportOptions) {
    super(options);

    this.eventName = options.eventName || "log";

    try {
      // Create Socket.IO client
      // Note: Socket.IO uses http:// or https:// protocol, not ws:// or wss://
      this.socket = io(options.url, {
        reconnection: options.reconnection !== false,
        reconnectionAttempts: options.reconnectionAttempts || Infinity,
        reconnectionDelay: options.reconnectionDelay || 1000
      });

      // Set up event handlers
      if (this.socket) {
        this.setupEventHandlers();
      }
    } catch (error) {
      console.error("Error initializing SocketIOTransport:", error);
      // Create a mock socket to avoid null reference exceptions in tests
      this.socket = {
        emit: () => {},
        on: () => this.socket,
        disconnect: () => {}
      } as any;
    }
  }

  /**
   * Sets up Socket.IO event handlers for connection management
   */
  private setupEventHandlers(): void {
    // Ensure socket exists
    if (!this.socket) return;

    // Connection established
    this.socket.on("connect", () => {
      this.connected = true;
      this.reconnecting = false;

      // Send any queued messages once connected
      this.flushMessageQueue();

      // Log successful connection
      console.debug(`SocketIOTransport: Connected to server`);
    });

    // Connection error
    this.socket.on("connect_error", (error: Error) => {
      this.connected = false;
      if (!this.reconnecting) {
        this.reconnecting = true;
        console.error(
          `SocketIOTransport: Connection error: ${error.message}. Will attempt to reconnect.`
        );
      }
    });

    // Connection lost
    this.socket.on("disconnect", () => {
      this.connected = false;
      console.debug("SocketIOTransport: Disconnected from server");
    });
  }

  /**
   * Sends all queued messages to the server
   * Called after connection is established or re-established
   */
  private flushMessageQueue(): void {
    if (this.socket && this.messageQueue.length > 0 && this.connected) {
      this.messageQueue.forEach((msg) => {
        this.socket.emit(this.eventName, msg);
      });
      this.messageQueue = [];
    }
  }

  /**
   * Winston Transport log processing method
   * Called by Winston whenever a log message is generated
   *
   * @param info Log information object
   * @param callback Callback function to execute after processing
   */
  log(info: any, callback: () => void): void {
    setImmediate(() => {
      this.emit("logged", info);
    });

    // Format log entry with timestamp if not provided
    const logEntry = {
      ...info,
      timestamp: info.timestamp || new Date().toISOString()
    };

    // If connected, send immediately; otherwise queue for later
    if (this.socket && this.connected) {
      this.socket.emit(this.eventName, logEntry);
    } else {
      this.messageQueue.push(logEntry);
    }

    callback();
  }

  /**
   * Closes the transport and disconnects from the Socket.IO server
   * Called when the logger is closed or the application exits
   */
  close(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

export default SocketIOTransport;
