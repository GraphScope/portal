import { Server as McpServer } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema, ListToolsRequestSchema, Tool as McpTool } from '@modelcontextprotocol/sdk/types.js';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { sandboxTools, Tool } from './tools';
import logger from '../utils/logger';

export interface McpConfig {
  capabilities?: string[];
}

export function createConnection(config: McpConfig = {}): Connection {
  // Filter tools based on capabilities
  const tools = sandboxTools.filter(tool => 
    !config.capabilities || 
    tool.capability === 'core' || 
    config.capabilities.includes(tool.capability)
  );

  const server = new McpServer({
    name: 'GraphScope Sandbox',
    version: '0.1.0'
  }, {
    capabilities: {
      tools: {},
    }
  });

  // Handle list tools request
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    logger.info(`Listing ${tools.length} available tools`);
    
    return {
      tools: tools.map(tool => ({
        name: tool.schema.name,
        description: tool.schema.description,
        inputSchema: zodToJsonSchema(tool.schema.inputSchema),
        annotations: {
          title: tool.schema.title,
          readOnlyHint: tool.schema.type === 'readOnly',
          destructiveHint: tool.schema.type === 'destructive',
          openWorldHint: true,
        },
      })) as McpTool[],
    };
  });

  // Handle call tool request
  server.setRequestHandler(CallToolRequestSchema, async request => {
    const { name, arguments: args } = request.params;
    
    logger.info(`Executing tool: ${name}`, { args });

    const errorResult = (...messages: string[]) => ({
      content: [{ type: 'text', text: messages.join('\n') }],
      isError: true,
    });

    // Find the requested tool
    const tool = tools.find(t => t.schema.name === name);
    if (!tool) {
      logger.error(`Tool not found: ${name}`);
      return errorResult(`Tool "${name}" not found`);
    }

    try {
      // Validate and execute the tool
      const validatedArgs = tool.schema.inputSchema.parse(args);
      const result = await tool.execute(validatedArgs);
      
      logger.info(`Tool execution completed: ${name}`, { 
        success: !result.isError 
      });
      
      return result;
    } catch (error) {
      logger.error(`Tool execution error: ${name}`, { error });
      return errorResult(`Error executing tool "${name}": ${error instanceof Error ? error.message : String(error)}`);
    }
  });

  return new Connection(server);
}

export class Connection {
  readonly server: McpServer;

  constructor(server: McpServer) {
    this.server = server;
    
    this.server.oninitialized = () => {
      const clientVersion = this.server.getClientVersion();
      logger.info('MCP client connected', { clientVersion });
    };
  }

  async close() {
    logger.info('Closing MCP connection');
    await this.server.close();
  }
} 