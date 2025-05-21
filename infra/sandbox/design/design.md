# Sandbox API Server Design Document

## 1. Overview

The `@ai-sandbox/server` is a Node.js HTTP server that provides APIs for creating and managing sandbox environments. These sandboxes are isolated container environments where code can be executed safely without affecting the host system.

## 2. Architecture

### 2.1 High-level Architecture

```
┌─────────────────┐      ┌───────────────────┐      ┌──────────────────┐
│                 │      │                   │      │                  │
│  Client/API     │─────▶│  Sandbox Server   │─────▶│  Container       │
│  Consumer       │◀─────│  (@ai-sandbox)    │◀─────│  Runtime         │
│                 │      │                   │      │  (Docker/K8s)    │
└─────────────────┘      └───────────────────┘      └──────────────────┘
```

### 2.2 Component Breakdown

1. **HTTP Server Layer**: Express.js server to handle API requests
2. **Container Manager**: Interface to container technology (Docker/Kubernetes)
3. **File System Manager**: Handles file creation and mounting inside containers
4. **Execution Manager**: Manages command execution inside containers
5. **Resource Monitor**: Monitors resource usage and enforces limits
6. **Security Manager**: Enforces security policies and isolation

## 3. Technology Stack

- **Runtime**: Node.js
- **Server Framework**: Express.js
- **Container Technology**: Docker Engine API / Kubernetes API
- **Authentication**: JWT-based authentication (optional)
- **Logging**: Winston/Pino
- **Testing**: Jest, Supertest
- **Documentation**: OpenAPI/Swagger

## 4. API Endpoints Design

### 4.1 Create Sandbox

**Endpoint**: `POST /api/sandbox`

**Request**:

```json
{
  "image": "@ai-sandbox/python",
  "options": {
    "timeout": 30000,
    "memoryLimit": "512m",
    "cpuLimit": "0.5"
  }
}
```

**Response**:

```json
{
  "containerId": "container_abc123",
  "status": "created",
  "createdAt": "2025-05-12T10:00:00Z",
  "expiresAt": "2025-05-12T10:30:00Z"
}
```

### 4.2 Execute Code in Sandbox

**Endpoint**: `POST /api/sandbox/exec`

**Request**:

```json
{
  "containerId": "container_abc123",
  "files": {
    "main.py": "print('hello world')",
    "data/input.txt": "sample data"
  },
  "command": ["python", "main.py"]
}
```

**Response**:

```json
{
  "id": "python_run_7683de5a",
  "status": "success",
  "duration": 252,
  "stdout": "hello world",
  "stderr": ""
}
```

### 4.3 Delete Sandbox

**Endpoint**: `DELETE /api/sandbox/:containerId`

**Response**:

```json
{
  "status": "deleted",
  "containerId": "container_abc123"
}
```

### 4.4 Get Sandbox Status

**Endpoint**: `GET /api/sandbox/:containerId`

**Response**:

```json
{
  "containerId": "container_abc123",
  "status": "running",
  "createdAt": "2025-05-12T10:00:00Z",
  "expiresAt": "2025-05-12T10:30:00Z",
  "resourceUsage": {
    "cpuUsage": "0.2",
    "memoryUsage": "128m"
  }
}
```

## 5. Container Management

### 5.1 Container Lifecycle

1. **Creation**: Container is created from specified image
2. **Preparation**: Files are mounted/copied into container
3. **Execution**: Commands are executed inside container
4. **Monitoring**: Resource usage is monitored
5. **Termination**: Container is stopped and removed after use or timeout

### 5.2 Container Isolation

- Network isolation: Limited/no external network access
- Resource limitations: CPU, memory, disk quotas
- Filesystem isolation: Read-only host mounts where needed
- User namespace isolation: Non-root container user

## 6. Security Considerations

### 6.1 Container Security

- Use official base images and regularly update
- Remove unnecessary tools and packages
- Run containers with minimal privileges
- Implement resource quotas to prevent DoS attacks
- Network isolation to prevent lateral movement

### 6.2 API Security

- Rate limiting to prevent abuse
- Input validation for all API parameters
- Sanitize code execution input
- Authentication and authorization mechanisms
- Audit logging of all operations

### 6.3 Data Security

- Ephemeral storage for sensitive user code
- Automatic cleanup of containers and volumes
- No persistent storage of execution results beyond TTL

## 7. Error Handling

### 7.1 Error Categories

- **Client Errors**: Invalid inputs, rate limiting, etc.
- **Container Errors**: Image not found, container startup failure
- **Execution Errors**: Timeout, out of memory, runtime errors
- **System Errors**: Host resource exhaustion, Docker daemon issues

### 7.2 Error Responses

```json
{
  "error": {
    "code": "CONTAINER_CREATION_FAILED",
    "message": "Failed to create container from image",
    "details": {
      "cause": "Image not found: @ai-sandbox/python"
    }
  }
}
```

## 8. Implementation Plan

### 8.1 Phase 1: Core API Server

- Setup Express.js server with basic routing
- Implement Docker API integration
- Build container creation and execution endpoints
- Implement basic error handling

### 8.2 Phase 2: Security and Resource Management

- Implement resource limitations
- Add security features
- Develop monitoring capabilities
- Build container lifecycle management

### 8.3 Phase 3: Scaling and Reliability

- Add containerization of the server itself
- Implement load balancing for container distribution
- Add metrics and logging
- Develop automated testing

## 9. Testing Strategy

- **Unit Tests**: Individual components (file system, container management)
- **Integration Tests**: API endpoints with mock Docker runtime
- **End-to-End Tests**: Full API flow with real container execution
- **Load Tests**: Performance under high concurrency
- **Security Tests**: Penetration testing of API and container isolation

## 10. Monitoring and Logging

- Container resource usage metrics
- API request/response logging
- Execution times and resource utilization
- Error rate monitoring
- System health checks

## 11. Deployment Considerations

- Scalable architecture for multiple instances
- Health checks for orchestration
- Resource allocation planning
- Backup and recovery procedures
- CI/CD integration

## 12. Future Extensions

- Support for additional languages and environments
- WebSocket API for real-time execution monitoring
- User management and workspace persistence
- Interactive terminal sessions
- Custom image building API

## 13. Git Version Control Testing

The sandbox now includes Git-based version control for code history. Here are curl examples to test this functionality:

### 13.1 Create a Sandbox with Git Repository

```bash
# Create a sandbox container (Git repo is automatically initialized)
CONTAINER_ID=$(curl -s -X POST http://localhost:3000/api/sandbox \
  -H "Content-Type: application/json" \
  -d '{
    "image": "node:18-alpine",
    "options": {
      "timeout": 120000,
      "memoryLimit": "256m"
    }
  }' | jq -r '.containerId')

echo "Container ID: $CONTAINER_ID"
```

### 13.2 Execute Code Multiple Times (Creates Git Commits)

```bash
# First execution - creates initial files and commits them
curl -s -X POST http://localhost:3000/api/sandbox/exec \
  -H "Content-Type: application/json" \
  -d '{
    "containerId": "'"$CONTAINER_ID"'",
    "files": {
      "index.js": "console.log(\"Version 1\");"
    },
    "command": ["node", "index.js"]
  }'

# Second execution - modifies files and creates a new commit
curl -s -X POST http://localhost:3000/api/sandbox/exec \
  -H "Content-Type: application/json" \
  -d '{
    "containerId": "'"$CONTAINER_ID"'",
    "files": {
      "index.js": "console.log(\"Version 2\");\nconsole.log(\"New feature added!\");"
    },
    "command": ["node", "index.js"]
  }'
```

### 13.3 Get Execution History

```bash
# Get history of code executions from Git repository
curl -s -X GET http://localhost:3000/api/sandbox/$CONTAINER_ID/history \
  -H "Content-Type: application/json"
```

Expected response:

```json
{
  "history": [
    {
      "id": "exec_8794fe6b",
      "commitId": "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
      "timestamp": "2025-05-13T10:15:30+00:00",
      "message": "Update files for sandbox execution",
      "files": ["index.js"]
    },
    {
      "id": "exec_7683de5a",
      "commitId": "b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3",
      "timestamp": "2025-05-13T10:10:00+00:00",
      "message": "Update files for sandbox execution",
      "files": ["index.js"]
    },
    {
      "id": "unknown",
      "commitId": "c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4",
      "timestamp": "2025-05-13T10:05:00+00:00",
      "message": "Initial commit",
      "files": ["README.md"]
    }
  ]
}
```

### 13.4 Compare Code Differences

```bash
# Get diff between two executions
curl -s -X POST http://localhost:3000/api/sandbox/$CONTAINER_ID/diff \
  -H "Content-Type: application/json" \
  -d '{
    "fromExecId": "exec_7683de5a",
    "toExecId": "exec_8794fe6b"
  }'
```

Expected response:

```json
{
  "diff": {
    "index.js": "diff --git a/index.js b/index.js\nindex abc1234..def5678 100644\n--- a/index.js\n+++ b/index.js\n@@ -1 +1,2 @@\n-console.log(\"Version 1\");\n+console.log(\"Version 2\");\n+console.log(\"New feature added!\");\n"
  }
}
```

### 13.5 Rollback to Previous Version

```bash
# Roll back to a previous execution
curl -s -X POST http://localhost:3000/api/sandbox/$CONTAINER_ID/rollback \
  -H "Content-Type: application/json" \
  -d '{
    "executionId": "exec_7683de5a"
  }'

# Execute code after rollback to verify
curl -s -X POST http://localhost:3000/api/sandbox/exec \
  -H "Content-Type: application/json" \
  -d '{
    "containerId": "'"$CONTAINER_ID"'",
    "command": ["node", "index.js"]
  }'
```
