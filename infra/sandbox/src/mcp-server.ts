import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { startHttpTransport } from './mcp/transport';
import logger from './utils/logger';

// Load environment variables
dotenv.config();

/**
 * Start the MCP server with HTTP transport
 */
function startMcpServer() {
  const config = {
    capabilities: ['core'] // Start with core capabilities only
  };

  const transportConfig = {
    host: process.env.MCP_HOST || 'localhost',
    port: parseInt(process.env.MCP_PORT || '3001', 10),
    path: process.env.MCP_PATH || '/mcp'
  };

  logger.info('Starting GraphScope Sandbox MCP Server', {
    transportConfig,
    config
  });

  try {
    startHttpTransport(config, transportConfig);
  } catch (error) {
    logger.error('Failed to start MCP server', { error });
    process.exit(1);
  }
}

startMcpServer();

export default startMcpServer; 