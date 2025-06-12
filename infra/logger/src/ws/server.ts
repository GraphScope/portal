import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

/**
 * Options for the WebSocket log server
 */
export interface WsLogServerOptions {
  port?: number;
  debug?: boolean;
}

/**
 * Creates and starts a dedicated WebSocket server for log broadcasting
 * @param options Configuration options for the server
 * @returns Object containing the server instance and URL
 */
export function createWsLogServer(options: WsLogServerOptions = {}) {
  const port = options.port || 3002;
  const debug = options.debug !== false;

  // Create a standalone HTTP server for Socket.IO
  const server = http.createServer();
  const io = new SocketIOServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', socket => {
    if (debug) {
      // console.log(`[WS Log Server] Client connected: ${socket.id}`);
    }
    socket.on('log', logEntry => {
      if (debug) {
        console.log(`[WS Log Server] Received log: ${JSON.stringify(logEntry)}`);
      }
      io.emit('log', logEntry);
    });
    socket.on('disconnect', () => {
      if (debug) {
        // console.log(`[WS Log Server] Client disconnected: ${socket.id}`);
      }
    });
  });

  server.listen(port);
  if (debug) {
    console.log(`[WS Log Server] WebSocket server running on http://127.0.0.1:${port}`);
  }

  return {
    server: io,
    url: `http://127.0.0.1:${port}`,
    port,
    close: () => server.close(),
  };
} 