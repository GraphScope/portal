/**
 * Log Socket Server
 *
 * A dedicated WebSocket server for receiving and broadcasting logs.
 * This is integrated directly into the logger package to simplify setup.
 *
 * Architecture:
 * - Logger -> Log Socket Server -> Connected clients
 */

import http from "http";
import { Server as SocketIOServer } from "socket.io";

/**
 * Options for the log server
 */
export interface LogServerOptions {
  /** The port for the WebSocket server to listen on */
  port?: number;
  /** Enable or disable debug console output from the server */
  debug?: boolean;
}

/**
 * Creates and starts a dedicated WebSocket server for log broadcasting
 *
 * @param options Configuration options for the server
 * @returns Object containing the server instance and URL
 */
export function createLogServer(options: LogServerOptions = {}) {
  const port = options.port || 3001;
  const debug = options.debug !== false;

  // Create a standalone HTTP server for Socket.IO
  const server = http.createServer();
  const io = new SocketIOServer(server, {
    cors: {
      origin: "*", // Allow connections from any origin
      methods: ["GET", "POST"] // Allow these HTTP methods for CORS preflight
    }
  });

  // Handle client connections
  io.on("connection", (socket) => {
    if (debug) {
      // console.log(`[Log Server] Client connected: ${socket.id}`);
    }

    // Listen for incoming log events from loggers
    socket.on("log", (logEntry) => {
      // Debug output to show received logs
      if (debug) {
        // console.log(`[Log Server] Received log: ${JSON.stringify(logEntry)}`);
      }

      // Broadcast the log to all other connected clients
      // This allows multiple frontends to receive logs in real-time
      socket.broadcast.emit("log", logEntry);
    });

    // Handle client disconnection
    socket.on("disconnect", () => {
      if (debug) {
        // console.log(`[Log Server] Client disconnected: ${socket.id}`);
      }
    });
  });

  // Start the WebSocket server
  server.listen(port);

  if (debug) {
    console.log(
      `[Log Server] WebSocket server running on http://127.0.0.1:${port}`
    );
  }

  // Return server information
  return {
    server: io,
    url: `http://127.0.0.1:${port}`,
    port,
    close: () => server.close()
  };
}

export default createLogServer;
