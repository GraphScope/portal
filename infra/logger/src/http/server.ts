import { loggerRouter } from './routers';
import http from 'http';
import express from 'express';

export interface HttpLogServerOptions {
  port?: number;
  debug?: boolean;
}

/**
 * Creates and configures an Express server for logging functionality
 * @param options - Configuration options for the logger server
 * @returns Configured Express application instance
 */
export function createHttpLogServer(options: HttpLogServerOptions = {}): {
  server: http.Server | null;
  app: express.Express;
} {
  const { port = 4002, debug = true } = options;
  const app = express();

  // Enable JSON body parsing
  app.use(express.json());

  // Mount the logger router
  app.use('/logs', loggerRouter);

  // Start the server if port is specified
  if (port) {
    const server = app.listen(port, '127.0.0.1', () => {
      if (debug) {
        console.log(`[HTTP Log Server] HTTP Logger server running on http://127.0.0.1:${port}`);
      }
    });
    return {
      server,
      app,
    };
  }

  return {
    server: null,
    app,
  };
} 
