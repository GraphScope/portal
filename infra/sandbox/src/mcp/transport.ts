import http from 'node:http';
import crypto from 'node:crypto';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createConnection, Connection, McpConfig } from './connection';
import logger from '../utils/logger';

export interface HttpTransportConfig {
  host?: string;
  port?: number;
  path?: string;
}

export function startHttpTransport(
  config: McpConfig = {},
  transportConfig: HttpTransportConfig = {}
) {
  const {
    host = 'localhost',
    port = 3001,
    path = '/mcp'
  } = transportConfig;

  const streamableSessions = new Map<string, StreamableHTTPServerTransport>();
  const connections = new Map<string, Connection>();

  const httpServer = http.createServer(async (req, res) => {
    const url = new URL(`http://localhost${req.url}`);
    
    // Only handle requests to the MCP path
    if (!url.pathname.startsWith(path)) {
      res.statusCode = 404;
      res.end('Not Found');
      return;
    }

    await handleStreamable(req, res, streamableSessions, connections, config);
  });

  httpServer.listen(port, host, () => {
    const address = httpServer.address();
    let url: string;
    
    if (typeof address === 'string') {
      url = address;
    } else if (address) {
      const resolvedPort = address.port;
      let resolvedHost = address.family === 'IPv4' ? address.address : `[${address.address}]`;
      if (resolvedHost === '0.0.0.0' || resolvedHost === '[::]') {
        resolvedHost = 'localhost';
      }
      url = `http://${resolvedHost}:${resolvedPort}`;
    } else {
      url = `http://${host}:${port}`;
    }

    const message = [
      `GraphScope Sandbox MCP Server listening on ${url}${path}`,
      'Put this in your MCP client config:',
      JSON.stringify({
        'mcpServers': {
          'graphscope-sandbox': {
            'url': `${url}${path}`
          }
        }
      }, undefined, 2),
    ].join('\n');
    
    logger.info(message);
    console.log(message);
  });

  // Handle graceful shutdown
  const shutdown = () => {
    logger.info('Shutting down MCP HTTP transport...');

    // Close all connections
    Promise.all([...connections.values()].map(conn => conn.close()))
      .then(() => {
        httpServer.close(() => {
          logger.info('MCP HTTP transport stopped');
          process.exit(0);
        });
      })
      .catch(error => {
        logger.error('Error closing MCP connections', { error });
        process.exit(1);
      });

    setTimeout(() => {
      logger.error('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);

  return httpServer;
}

async function handleStreamable(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  sessions: Map<string, StreamableHTTPServerTransport>,
  connections: Map<string, Connection>,
  config: McpConfig
) {
  const sessionId = req.headers['mcp-session-id'] as string | undefined;
  
  if (sessionId) {
    // Handle existing session
    const transport = sessions.get(sessionId);
    if (!transport) {
      res.statusCode = 404;
      res.end('Session not found');
      return;
    }
    return await transport.handleRequest(req, res);
  }

  if (req.method === 'POST') {
    // Create new session
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => crypto.randomUUID(),
      onsessioninitialized: sessionId => {
        sessions.set(sessionId, transport);
        logger.info(`Created MCP session: ${sessionId}`);
      }
    });

    transport.onclose = () => {
      if (transport.sessionId) {
        sessions.delete(transport.sessionId);
        const connection = connections.get(transport.sessionId);
        if (connection) {
          connections.delete(transport.sessionId);
          connection.close().catch(error => 
            logger.error('Error closing connection', { error, sessionId: transport.sessionId })
          );
        }
        logger.info(`Closed MCP session: ${transport.sessionId}`);
      }
    };

    // Create MCP connection
    const connection = createConnection(config);
    if (transport.sessionId) {
      connections.set(transport.sessionId, connection);
    }
    
    await connection.server.connect(transport);
    await transport.handleRequest(req, res);
    return;
  }

  res.statusCode = 400;
  res.end('Invalid request');
} 