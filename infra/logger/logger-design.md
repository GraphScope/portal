# Winston 多通道日志工具设计文档

## 项目概述

本项目实现了一个基于 Winston 的多通道日志工具，保持与 Winston API 完全一致的同时，支持将日志同步输出到多个渠道：

1. **标准输出 (stdout)**：控制台彩色输出
2. **本地文件**：日志文件持久化，支持轮转
3. **WebSocket**：通过 Socket.IO 实时推送日志到前端/订阅端
4. **HTTP**：通过 HTTP 动态推送日志，支持自定义 header（如鉴权、容器隔离）

## 技术栈
- Node.js
- TypeScript
- Winston (日志库)
- Socket.IO (WebSocket 通信)
- Express (HTTP 日志服务)

## 主要组件与职责

### 1. Logger（多通道日志采集器）
- 通过 `createLogger` 创建，支持 console、file、WebSocket、HTTP 多种 transport。
- 保持 Winston API 兼容，支持 info/warn/error/debug 等所有标准方法。
- 支持自定义格式、日志级别、文件轮转、动态 header。
- WebSocket/HTTP transport 可选，按需启用。

### 2. SocketIOTransport（WebSocket 日志推送）
- 继承自 winston-transport，自定义实现。
- 通过 Socket.IO 客户端连接指定 WS server，推送日志。
- 支持断线重连、消息队列缓存、事件名自定义。
- 连接失败时自动降级，日志不会丢失。

### 3. DynamicHttpTransport（HTTP 日志推送）
- 继承自 winston.transports.Http。
- 支持每条日志动态生成 header（如 Authorization、x-container-id 等）。
- 通过 fetch 发送 POST 请求到 HTTP 日志服务。
- 失败时自动忽略，不影响主流程。

### 4. 日志服务端（WS/HTTP Server）
- WS server：通过 `createWsLogServer` 创建，负责接收 logger 推送的日志并广播给所有客户端。
- HTTP server：通过 `createHttpLogServer` 创建，负责日志的 HTTP API（如 ingest/query/stream/health），不做日志推送。
- 支持 session 隔离、SSE 流式查询、健康检查等。

### 5. 统一入口（createLogService）
- 通过一份配置同时创建 logger、WS server、HTTP server。
- 便于业务方一键集成多通道日志能力。

## 主要类型定义（TypeScript）

```typescript
export interface LogServiceConfig {
  logFilePath: string;         // 日志文件路径
  level?: string;              // 日志级别
  debug?: boolean;             // 是否开启 debug 输出
  service?: string;            // 服务名（可选）
  ws?: {
    port: number;
    enabled: boolean;
  };
  http?: {
    port: number;
    enabled: boolean;
    host?: string;
    path?: string;
    getContext?: () => { authorization?: string; xContainerId?: string };
  };
}
```

## 典型用法

### 1. 创建多通道 logger
```typescript
import { createLogger, SocketIOTransport } from '@graphscope/logger';

const logger = createLogger({
  level: 'info',
  file: { filename: '/tmp/app.log' },
  console: {},
  ws: {
    enabled: true,
    url: 'http://localhost:3001',
    eventName: 'log',
    level: 'info',
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 2000,
  },
  http: {
    enabled: true,
    host: '127.0.0.1',
    port: 4002,
    path: '/logs/log',
    getContext: () => ({ authorization: 'Bearer ...', xContainerId: 'abc' })
  }
});

logger.info('This is an info log');
logger.error('This is an error log', { error: new Error('fail') });
```

### 2. 统一入口创建 logger + WS/HTTP server
```typescript
import { createLogService } from '@graphscope/logger';

const { logger, wsServer, httpServer } = createLogService({
  logFilePath: '/var/log/app.log',
  level: 'info',
  ws: { port: 3002, enabled: true },
  http: { port: 4001, enabled: true },
  service: 'my-service',
});

logger.info('hello world');
```

### 3. WebSocket 客户端订阅日志
```javascript
const socket = io('http://localhost:3002');
socket.on('log', (logMessage) => {
  console.log('Received log:', logMessage);
});
```

### 4. HTTP 日志 API 查询/推送
- POST `/logs/log` 发送日志（需带鉴权 header）
- GET `/logs/query` 查询历史日志
- GET `/logs/stream` SSE 实时流式日志
- GET `/logs/health` 健康检查

## 架构图

```
客户端 <---Socket.IO---> WS 日志服务 <---Socket.IO---> Logger (WS Transport)
    |                                             |
    |                                             |
    +-------------------HTTP----------------------+
                              |
                        HTTP 日志服务 (API)
                              |
                        日志文件/内存存储
```

## 设计要点与实现细节

- **多通道输出**：console/file 必须，ws/http 可选，均可单独启用/关闭。
- **WebSocket 断线重连**：自动重连，消息队列缓存，恢复后补发。
- **HTTP 动态 header**：每条日志可带不同 header，支持多租户/鉴权。
- **文件写入安全**：自动创建目录，支持文件轮转与备份。
- **API 兼容性**：logger 完全兼容 winston API，便于迁移。
- **统一入口**：`createLogService` 一键集成所有能力。
- **类型安全**：所有配置项、API、日志结构均有完整 TypeScript 类型定义。

## 后续扩展方向
- 支持更多 transport（如数据库、云日志等）
- 日志分析与可视化集成
- 分布式日志聚合

## 结论
本工具为 Node.js 应用提供了高性能、可扩展、易用的多通道日志采集与分发能力，适合现代微服务、云原生等多场景。
