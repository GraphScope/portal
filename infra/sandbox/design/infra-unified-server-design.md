# Sandbox V2 Unified Server Design (Revised)

## High-Level Architecture & Code Design

### Modular, Decoupled Directory Structure

To maximize modularity, extensibility, and maintainability, the unified infra server is organized into three main parts:

- **container/**: Core implementations for browser, Docker, code execution, file system, git operations, and container lifecycle management. Pure logic, no dependency on HTTP/MCP/Logger servers.
- **servers/**: Contains all server entrypoints and logic. Each server is independent and only depends on `container` and `shared` logic.
  - **http/**: Express server for RESTful API (OpenAPI 3.0, `/api/v1/`), SSE endpoints, and authentication. Uses a central controller class with route triples for declarative route registration. No separate `routes/` folder needed.
  - **mcp/**: MCP server for streamable endpoints (`/mcp`, `/mcp/sse`), including transport, tools, and connection management. No dependency on Express or HTTP server.
  - **logger/**: Dedicated log server (SSE/stream/REST), log client for integration, and multiple transports. Used by both HTTP and MCP servers, as well as container logic.
- **shared/**: Common types, utilities, Zod schemas, and config shared across all modules.

#### Example Directory Structure
```
infra/
  sandbox-v2/
    container/
      browser/
      docker/
      code/
      fs/
      git/
      manager.ts
      types.ts
    servers/
      http/
        controllers/
          sandbox-controller.ts  # Central controller with route triples
        middlewares/
        openapi/
        app.ts
        index.ts
        types.ts
      mcp/
        server.ts
        transport/
        tools/
        connections/
        types.ts
      logger/
        server.ts
        client.ts
        transports/
        types.ts
        storage-memory.ts
      other-service/
        server.ts
      middlewares/
        auth.ts
      openapi/
        swagger.ts
      types/
        index.ts
    shared/
      types/
    utils/
      schemas/
      config/
    tests/
    Dockerfile
    README.md
    package.json
    tsconfig.json
```

---

## Architectural Rationale

- **Decoupling**: Each server (HTTP, MCP, Logger) is independent and only depends on `container` and `shared` logic. No cross-dependencies between servers.
- **Centralized Route Management**: HTTP server uses the route triple pattern in the central controller—no separate `routes/` folder.
- **Extensibility**: Easy to add new transports, tools, or container types.
- **Reusability**: Logger client can be used by any component to push logs.
- **Testability**: Clear separation for unit/integration testing.
- **Scalability**: Each server can be scaled or deployed independently if needed.

---

## Endpoint Mapping

- **RESTful HTTP (OpenAPI 3.0, `/api/v1/`)**  
  - CRUD and management for containers, dependencies, fs, code, git, etc.
  - SSE endpoints for streaming (e.g., logs, file changes).
- **MCP HTTP Streaming (`/mcp`)**  
  - Streamable endpoint for MCP protocol.
- **MCP SSE (`/mcp/sse`)**  
  - SSE endpoint for backward compatibility.
- **Logger Service (`/logs`)**  
  - SSE/stream endpoint for real-time logs from all containers/services.
  - Log ingestion endpoint for clients/components to push logs.

---

## Key Design Principles

- **Separation of Concerns**:  
  - `container/` implements all low-level logic (browser, Docker, code, fs, git, management).
  - `servers/` contains only server-specific logic and entrypoints.
  - `shared/` holds all cross-cutting types, schemas, and utilities.
- **Declarative Routing**:  
  - HTTP server uses static route triples in the central controller for easy registration and maintainability.
- **OpenAPI Integration**:  
  - JSDoc + Zod for validation and documentation.
- **Streaming/SSE**:  
  - Use native HTTP streaming and SSE for real-time features.
- **Authentication & Security**:  
  - Pluggable authentication middleware for sensitive endpoints.
- **Logger as a Service**:  
  - Logger server exposes both push (ingest) and pull (stream/SSE) endpoints, and a logger client is provided for all components.

## Logger Module Design

### Rationale and Role

The logger module is foundational to the unified infra server, providing observability, debugging, and auditability for all components (HTTP, MCP, container logic, etc.). As a core dependency, it must be implemented first to enable seamless integration and consistent logging across the system.

### Design Goals
- **Decoupled and Extensible**: The logger is a standalone module, not tied to any specific server or transport. It can be used by any component (HTTP server, MCP server, container logic, etc.).
- **Push/Pull Model**: Supports both log ingestion (push) from clients/components and log streaming (pull) for real-time or historical log access.
- **Multiple Transports**: Easily extensible to support various transports (SSE, HTTP, file, cloud, etc.) for both ingestion and streaming.
- **Client/Server Separation**: Provides a logger client for all components to push logs, and a logger server to aggregate, store, and serve logs.
- **Structured Logging**: All logs are structured (e.g., JSON), supporting rich metadata (timestamp, level, source, context, etc.).
- **Scalable and Reliable**: Designed for high-throughput, concurrent log ingestion and streaming, with proper buffering and backpressure handling.

### High-Level Architecture

```
+-------------------+         push         +-------------------+
|   Any Component   |-------------------->|   Logger Client   |
+-------------------+                     +-------------------+
                                              |
                                              | (push)
                                              v
                                      +-------------------+
                                      |   Logger Server   |
                                      +-------------------+
                                              ^
                                              | (pull/stream)
                                              |
                                      +-------------------+
                                      |   Log Consumer    |
                                      +-------------------+
```

- **Logger Client**: Lightweight library for all components to send logs to the logger server, supporting batching, retries, and structured log formatting.
- **Logger Server**: Central service that receives, stores, and streams logs. Exposes endpoints for log ingestion (push) and log streaming/query (pull), supporting multiple transports (SSE, HTTP, etc.).
- **Log Consumer**: Any client (UI, CLI, monitoring tool) that subscribes to or queries logs from the logger server.

### Key Features
- **API Endpoints**:
  - `POST /logs` — Ingest logs (push)
  - `GET /logs/stream` — Real-time log streaming (SSE/HTTP)
  - `GET /logs/query` — Query historical logs
- **Transports**:
  - **Console**: For local development and debugging, logs are output to the console.
  - **File**: Logs are persisted to local files for archiving and later analysis.
  - **HTTP**: Logs are automatically pushed to the logger server via HTTP POST, suitable for distributed log aggregation. This uses winston's official `transports.Http` implementation directly.
  - **Extensibility**: If additional transports are needed in the future (such as SSE broadcast, cloud log services, etc.), they can be added via winston's transport plugin mechanism.

> The logger client currently supports Console, File, and HTTP transports out of the box, all based on winston's official implementations. No custom transport implementation is required at this stage.

### Implementation Steps
1. **Define structured log format and types** (in `shared/types/`)
2. **Implement logger client** (in `servers/logger/client.ts`)
   - API for log events, batching, retries
   - Configurable transport
3. **Implement logger server** (in `servers/logger/server.ts`)
   - Endpoints for ingestion and streaming
   - Pluggable storage and transport
   - SSE/HTTP support
4. **Add transports** (in `servers/logger/transports/`)
   - SSE, HTTP, file, etc.
5. **Integrate logger client** into all other modules
6. **Test reliability, performance, and extensibility**

### Extensibility
- Add new transports by implementing a transport interface
- Support for log filtering, search, and retention policies
- Optional: Integrate with external log aggregation/monitoring systems

### Summary

The logger module is the backbone of observability for the unified infra server. Its decoupled, extensible design ensures that all components can reliably push and consume logs, supporting robust debugging, monitoring, and auditing across the system. Implementing the logger first enables consistent, structured logging and paves the way for scalable, maintainable infrastructure.

---

## Example Usage

- **HTTP server** imports `container` logic and `logger` client, exposes REST/SSE endpoints.
- **MCP server** imports `container` logic and `logger` client, exposes streaming endpoints.
- **Logger server** exposes log ingestion and streaming endpoints, and provides a client for other modules.

---

## Action List for Aligning /infra/sandbox-v2 with Unified Infra Server Design

### 1. Project Structure & Modularity
- [ ] Restructure project to match the proposed directory layout.
- [ ] Ensure all low-level logic is in `container/`, and all server logic is in `servers/`.

### 2. API Endpoints & Routing
- [ ] Adopt versioned RESTful endpoints as per the design.
- [ ] Implement or refactor streaming endpoints to use HTTP streaming or SSE (no WebSocket).
- [ ] Use route triple pattern in the central controller for HTTP server.

### 3. Streaming & SSE
- [ ] Implement SSE for log streaming (`/logs`), including heartbeat support.
- [ ] Implement HTTP streaming for MCP (`/mcp`), with heartbeat messages.
- [ ] Implement SSE for MCP (`/mcp/sse`), with heartbeat.

### 4. API Documentation & Validation
- [ ] Integrate OpenAPI (swagger-jsdoc + swagger-ui-express) for API docs at `/api-docs`.
- [ ] Add JSDoc comments to all routes/controllers for OpenAPI generation.
- [ ] Adopt Zod for runtime validation of request bodies, params, and queries.
- [ ] (Optional) Use zod-to-openapi to auto-generate OpenAPI schemas from Zod.

### 5. Authentication & Security
- [ ] Implement pluggable authentication middleware (e.g., JWT) for all sensitive endpoints.
- [ ] Add RBAC/authorization checks where needed.

### 6. Service Integration
- [ ] Unify all sandbox-related services (container, dependency, fs, code, git, logger, MCP) under the new modular structure.
- [ ] Refactor existing services to be modular and easily extensible.

### 7. Logger Service
- [ ] Implement a logger server with push/pull endpoints and multiple transports.
- [ ] Provide a logger client for all components to push logs.

### 8. Testing & Reliability
- [ ] Add unit and integration tests for all endpoints, especially streaming/SSE.
- [ ] Test SSE/streaming reliability and performance (e.g., heartbeat, disconnect handling).

### 9. Deployment & Ops
- [ ] Dockerize the unified server for deployment.
- [ ] Add health checks and monitoring endpoints.

### 10. Documentation
- [ ] Update README to reflect new architecture, endpoints, and usage.
- [ ] Document streaming protocols (SSE/HTTP streaming, heartbeat format, etc).

### Optional/Advanced Improvements
- [ ] Consider using Fastify for better performance if Express is not a hard requirement.
- [ ] Add support for tool registry in MCP service for easy extensibility.
- [ ] Implement graceful shutdown and resource cleanup for streaming endpoints.

---

## Conclusion

This revised design enables all sandbox and MCP services to be unified under a modular, decoupled architecture, with real-time log streaming via a dedicated logger service, and all APIs accessible via HTTP. Each server (HTTP, MCP, Logger) is independent, extensible, and easy to test and maintain. The logger service provides a robust foundation for observability and debugging across all components. 