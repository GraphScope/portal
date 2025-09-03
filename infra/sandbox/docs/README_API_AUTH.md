# GraphScope Sandbox API Key Authentication

## Overview

A simple and secure API Key authentication system for GraphScope Sandbox service, protecting both REST API endpoints and MCP (Model Context Protocol) server.

## Features

- ✅ **API Key Authentication**: Bearer token-based authentication
- ✅ **Express & MCP Support**: Protects both HTTP API and MCP protocol
- ✅ **Multiple Key Support**: Single or multiple API keys configuration
- ✅ **Path Filtering**: Health checks and specific paths can skip authentication
- ✅ **Security Logging**: Detailed authentication logs with key masking
- ✅ **Key Generation Tool**: Built-in CLI tool for generating secure API keys

## Quick Setup

### 1. Generate API Key

```bash
# Generate a single API key
npm run generate-api-key

# Generate multiple API keys
npm run generate-api-key -- --count 3

# Generate with custom prefix
npm run generate-api-key -- --prefix my_app
```

### 2. Configure Environment

```bash
# Single API key
export SANDBOX_API_KEY="ai-spider_your_generated_key_here"

# Multiple API keys (comma separated)
export SANDBOX_API_KEYS="key1,key2,key3"

# Or create .env file
echo 'SANDBOX_API_KEY=ai-spider_your_generated_key_here' > .env
```

### 3. Start Services

```bash
# Start Express API server (port 3000)
npm run dev

# Start MCP server (port 3001)
npm run dev:mcp
```

## Usage Examples

### REST API Calls

```bash
# Health check (no auth required)
curl http://localhost:3000/health

# Create sandbox (auth required)
curl -X POST http://localhost:3000/api/sandbox \
  -H "Authorization: Bearer ai-spider_your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{"image": "node:18"}'
```

### MCP Client Configuration

```json
{
  "mcpServers": {
    "graphscope-sandbox": {
      "url": "http://localhost:3001/mcp",
      "headers": {
        "Authorization": "Bearer ai-spider_your_api_key_here"
      }
    }
  }
}
```

### JavaScript/Node.js

```javascript
const API_KEY = "ai-spider_your_api_key_here";
const API_BASE = "http://localhost:3000/api";

const response = await fetch(`${API_BASE}/sandbox`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ image: "node:18" })
});
```

## Architecture

### Components

```
📁 src/middleware/
├── simple-auth.ts          # Authentication middleware
📁 src/
├── server.ts               # Express server with auth
├── mcp/transport.ts        # MCP server with auth
📁 scripts/
├── generate-api-key.cjs    # API key generation tool
```

### Authentication Flow

```mermaid
graph TD
    A[Client Request] --> B{Has Authorization Header?}
    B -->|No| C[401 Unauthorized]
    B -->|Yes| D{Format: Bearer <key>?}
    D -->|No| C
    D -->|Yes| E{Valid API Key?}
    E -->|No| C
    E -->|Yes| F[Request Allowed]
```

### Protected Endpoints

| Endpoint Pattern | Protection | Description            |
| ---------------- | ---------- | ---------------------- |
| `/health`        | ❌ None    | Health check           |
| `/api/*`         | ✅ API Key | All API endpoints      |
| MCP Server       | ✅ API Key | Model Context Protocol |

## Configuration Options

### Environment Variables

| Variable           | Type   | Description                     | Example               |
| ------------------ | ------ | ------------------------------- | --------------------- |
| `SANDBOX_API_KEY`  | String | Single API key                  | `ai-spider_abc123...` |
| `SANDBOX_API_KEYS` | String | Multiple keys (comma-separated) | `key1,key2,key3`      |

### API Key Format

```
<prefix>_<32_random_chars>
```

- **Prefix**: `ai-spider` (configurable)
- **Length**: 32 alphanumeric characters
- **Example**: `ai-spider_K8jHn2mP9xQvR7sT3wY6zA1bC4dF5gE0`

## Security Features

### 🔒 Authentication Protection

- **Bearer Token**: Standard `Authorization: Bearer <token>` format
- **Key Validation**: Exact match validation against configured keys
- **Request Logging**: All authentication attempts are logged
- **Key Masking**: Only first 8 characters logged for security

### 🛡️ Error Handling

| Error                 | Status | Description                  |
| --------------------- | ------ | ---------------------------- |
| Missing Authorization | 401    | No `Authorization` header    |
| Invalid Format        | 401    | Wrong header format          |
| Invalid Key           | 401    | API key not recognized       |
| Server Error          | 500    | Authentication service error |

### 📊 Logging Examples

```
# Successful authentication
[INFO] API key authentication successful { ip: '127.0.0.1', path: '/api/sandbox', keyPrefix: 'ai-spide...' }

# Failed authentication
[WARN] Invalid API key attempt { ip: '127.0.0.1', path: '/api/sandbox', keyPrefix: 'invalid...' }
```

## Testing

### Verify Setup

```bash
# Test health endpoint (should work)
curl -I http://localhost:3000/health

# Test API without auth (should fail with 401)
curl -I http://localhost:3000/api/sandbox

# Test API with auth (should work with POST data)
curl -I -H "Authorization: Bearer $SANDBOX_API_KEY" \
     http://localhost:3000/api/sandbox
```

### Expected Responses

```bash
# No auth - 401 Unauthorized
{
  "error": {
    "code": "MISSING_AUTH",
    "message": "Authorization header is required. Use: Authorization: Bearer <your-api-key>"
  }
}

# Invalid key - 401 Unauthorized
{
  "error": {
    "code": "INVALID_API_KEY",
    "message": "Invalid API key"
  }
}
```

## Implementation Details

### Middleware Structure

```typescript
// Authentication middleware
export const simpleApiKeyAuth = (req, res, next) => {
  // 1. Check Authorization header
  // 2. Validate Bearer format
  // 3. Verify API key
  // 4. Log attempt
  // 5. Allow/deny request
};

// Conditional authentication
export const conditionalAuth = (req, res, next) => {
  // Skip auth for health checks
  // Apply auth for API routes
};
```

### Key Features

- **Path Filtering**: `/health` endpoint bypasses authentication
- **Multiple Keys**: Support both single and multiple API key configurations
- **Secure Logging**: API keys are masked in logs (only show first 8 chars)
- **Error Messages**: Clear, actionable error messages for debugging
- **Environment Config**: Flexible configuration via environment variables

## Migration from Unauthenticated

### Before (Insecure)

```bash
curl http://localhost:3000/api/sandbox  # ❌ Works without auth
```

### After (Secure)

```bash
curl http://localhost:3000/api/sandbox  # ❌ 401 Unauthorized
curl -H "Authorization: Bearer <key>" http://localhost:3000/api/sandbox  # ✅ Works
```

## Security Best Practices

1. **🔐 Keep Keys Secret**: Never commit API keys to version control
2. **🔄 Rotate Regularly**: Change API keys periodically
3. **🌍 Environment Separation**: Use different keys for dev/staging/prod
4. **📝 Monitor Usage**: Check logs for suspicious authentication attempts
5. **🚫 No Hardcoding**: Always use environment variables for keys

## Troubleshooting

### Common Issues

| Problem                     | Solution                                                         |
| --------------------------- | ---------------------------------------------------------------- |
| "No API keys configured"    | Set `SANDBOX_API_KEY` or `SANDBOX_API_KEYS` environment variable |
| Authentication always fails | Check API key format and environment variable name               |
| MCP client can't connect    | Ensure client config includes `Authorization` header             |

### Debug Commands

```bash
# Check if API key is set
echo ${SANDBOX_API_KEY:0:8}...

# View authentication logs
tail -f logs/sandbox.log | grep -E "(authentication|API key)"

# Test key generation
npm run generate-api-key
```

---

**🚀 Ready to deploy!** Your GraphScope Sandbox is now secured with API Key authentication.
