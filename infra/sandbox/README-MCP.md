# GraphScope Sandbox MCP Server

This document explains how to use the GraphScope Sandbox as an MCP (Model Context Protocol) server, which allows AI assistants to create and execute code in isolated Docker containers.

## Overview

The MCP server wraps the existing GraphScope Sandbox functionality and exposes it as standardized MCP tools that can be used by compatible AI clients like Claude Desktop, Cline, or any other MCP-compatible application.

## Available Tools

### Core Tools

1. **create_sandbox** - Create a new isolated Docker container
2. **execute_code** - Execute code in an existing sandbox
3. **get_sandbox_status** - Check the status of a sandbox
4. **delete_sandbox** - Delete and cleanup a sandbox

## Quick Start

### 1. Start the MCP Server

```bash
# Using npm script (recommended for development)
npm run dev:mcp

# Or run directly with ts-node
npm run dev:mcp

# Or using the built version
node dist/lib/mcp-server.js
```

### 2. Configure Your MCP Client

The server will display configuration instructions when started. For most MCP clients, you'll add something like this to your client configuration:

```json
{
  "mcpServers": {
    "graphscope-sandbox": {
      "url": "http://localhost:3001/mcp"
    }
  }
}
```

### 3. Environment Variables

You can configure the MCP server using these environment variables:

```bash
MCP_HOST=localhost          # Host to bind to (default: localhost)
MCP_PORT=3001              # Port to listen on (default: 3001)  
MCP_PATH=/mcp              # URL path for MCP endpoint (default: /mcp)
```

## Tool Usage Examples

### Creating a Sandbox

```json
{
  "tool": "create_sandbox",
  "arguments": {
    "image": "node:18",
    "options": {
      "memoryLimit": "512m",
      "timeout": 300000
    }
  }
}
```

Response:
```json
{
  "containerId": "abc123def456",
  "status": "running",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "expiresAt": "2024-01-15T11:30:00.000Z",
  "browserPort": 34567
}
```

### Executing Code

```json
{
  "tool": "execute_code",
  "arguments": {
    "containerId": "abc123def456",
    "command": ["node", "index.js"],
    "files": {
      "index.js": "console.log('Hello from sandbox!');"
    },
    "env": {
      "NODE_ENV": "development"
    }
  }
}
```

Response:
```json
{
  "id": "exec-789",
  "status": "success",
  "duration": 1250,
  "stdout": "Hello from sandbox!\n",
  "stderr": ""
}
```

### Checking Status

```json
{
  "tool": "get_sandbox_status",
  "arguments": {
    "containerId": "abc123def456"
  }
}
```

### Deleting a Sandbox

```json
{
  "tool": "delete_sandbox",
  "arguments": {
    "containerId": "abc123def456"
  }
}
```

## Supported Docker Images

The sandbox supports any Docker image, but these are commonly used:

- **Node.js**: `node:18`, `node:20`, `node:latest`
- **Python**: `python:3.11`, `python:3.12`, `python:latest`  
- **Ubuntu**: `ubuntu:22.04`, `ubuntu:latest`
- **Debian**: `debian:12`, `debian:latest`

## Transport Protocol

This MCP server uses **Streamable HTTP** transport, which is efficient for real-time communication and supports:

- Session management
- Streaming responses
- Connection lifecycle management
- Error handling

## Development

### Running Both Servers

You can run both the traditional REST API server and the MCP server simultaneously:

```bash
# Terminal 1: Traditional Express server
npm run dev

# Terminal 2: MCP server  
npm run dev:mcp
```

They use different ports by default:
- Express server: `http://localhost:3000`
- MCP server: `http://localhost:3001/mcp`

### Architecture

The MCP implementation consists of:

- **`src/mcp/tools.ts`** - Tool definitions and execution logic
- **`src/mcp/connection.ts`** - MCP server connection handling
- **`src/mcp/transport.ts`** - HTTP transport layer with streamable support
- **`src/mcp-server.ts`** - Main entry point for MCP server

The MCP tools wrap the existing sandbox services:
- Container service (creating/managing Docker containers)
- Execution service (running code in containers)
- File service (file operations)

## Security Considerations

The MCP server inherits all security features from the underlying sandbox:

- **Container isolation** - Each sandbox runs in an isolated Docker container
- **Resource limits** - Memory and CPU constraints can be configured
- **Timeout protection** - Automatic cleanup of long-running operations
- **Network isolation** - Containers have limited network access

## Troubleshooting

### Common Issues

1. **"Session not found"** - This usually means the MCP connection was lost. Restart your MCP client.

2. **"Container not found"** - The container may have expired or been deleted. Create a new sandbox.

3. **Connection refused** - Make sure the MCP server is running and the port is not blocked.

### Logs

The MCP server uses the same logging system as the main sandbox. Check the console output for detailed information about:

- Session creation/destruction
- Tool execution
- Error details

### Docker Requirements

Make sure Docker is running and accessible:

```bash
docker version
docker ps
```

## Integration Examples

### With Claude Desktop

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "graphscope-sandbox": {
      "url": "http://localhost:3001/mcp"
    }
  }
}
```

### With Cline VS Code Extension

Add to your Cline MCP settings:

```json
{
  "mcpServers": {
    "graphscope-sandbox": {
      "url": "http://localhost:3001/mcp"
    }
  }
}
```

## Next Steps

Future enhancements planned:

1. **Additional Tools** - File download, browser automation, network access
2. **More Transports** - SSE (Server-Sent Events) support
3. **Authentication** - API key or token-based authentication
4. **Resource Management** - Better container lifecycle management
5. **Monitoring** - Metrics and health checks 