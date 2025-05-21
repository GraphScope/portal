# Winston 多通道日志工具设计文档

## 项目概述

本项目实现了一个基于 Winston 的日志工具，保持与 Winston API 完全一致的同时，支持将日志同步输出到三个不同渠道：

1. **标准输出 (stdout)**：直接在控制台显示日志，支持彩色输出
2. **本地文件**：将日志保存到指定的本地文件，支持文件轮转
3. **WebSocket**：通过 Socket.IO 实时推送日志信息到客户端，支持断线重连

## 技术栈

- Node.js
- TypeScript
- Winston (日志库)
- Socket.io (WebSocket 通信)
- Jest (单元测试)

## 设计方案

### 核心组件

1. **Logger 类**：主要的日志处理类，封装 Winston 功能并扩展多通道能力
   - `createMultiChannelLogger()`: 创建具有自定义配置的 logger 实例
   - `createDefaultLogger()`: 创建具有默认配置的 logger 实例，简化常见场景
2. **Transport 实现**：
   - 使用原生 Winston Console Transport 处理标准输出
   - 使用原生 Winston File Transport 处理文件日志
   - 自定义 Socket.IO Transport 处理 WebSocket 实时日志
3. **配置管理**：提供灵活的配置选项和默认配置，包括：
   - 日志格式化配置
   - 日志级别管理
   - 文件轮转策略
   - WebSocket 连接和重连策略

### API 设计

Logger 类将保持与 Winston 完全一致的 API，包括但不限于：

```typescript
logger.info(message, ...meta);
logger.error(message, ...meta);
logger.warn(message, ...meta);
logger.debug(message, ...meta);
logger.verbose(message, ...meta);
logger.silly(message, ...meta);
```

### Socket.io Transport 实现

自定义一个 Winston Transport，用于将日志消息通过 Socket.io 发送到指定的 WebSocket 端点。

```typescript
class SocketIOTransport extends winston.Transport {
  private socket: SocketIOClient.Socket;

  constructor(options: SocketIOTransportOptions) {
    super(options);
    this.socket = io(options.url);
    // 初始化连接管理与错误处理
  }

  log(info: any, callback: () => void) {
    this.socket.emit("log", info);
    callback();
  }
}
```

### 配置示例

```typescript
const logger = createLogger({
  level: "info",
  format: combine(timestamp(), json()),
  transports: [
    // 标准输出
    new transports.Console(),

    // 文件输出
    new transports.File({
      filename: "/tmp/logs/app.log",
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),

    // WebSocket 输出
    new SocketIOTransport({
      url: "ws://localhost:3000/ws",
      level: "info"
    })
  ]
});
```

## 系统架构

### 组件架构

```
客户端应用 <---- Socket.IO ----> 独立日志服务器  <---- Socket.IO ---- 日志库
    |                               |                                    |
    |                               |                                    |
    +------ HTTP API -------> API服务器 <---------------------------- 控制台输出
                                                                        |
                                                                        |
                                                                     日志文件
```

### 项目结构

```
/
├── src/
│   ├── index.ts              # 主入口文件
│   ├── logger.ts             # Logger 类实现
│   ├── transports/
│   │   └── socket-io.ts      # Socket.IO Transport 实现
│   └── types/
│       └── index.ts          # 类型定义
├── examples/
│   ├── server/               # 服务器示例
│   │   ├── index.ts          # API 服务器示例
│   │   └── log-socket-server.ts # 日志 Socket.IO 服务器
│   ├── client/               # 客户端示例 (React)
│   ├── logs/                 # 日志文件存储目录
│   ├── curl-test.sh          # cURL 测试脚本
│   └── run.sh                # 运行脚本
│   ├── logger.test.ts        # Logger 单元测试
│   └── socket-transport.test.ts # Socket.io Transport 测试
├── examples/
│   ├── basic-usage.ts        # 基本使用示例
│   └── websocket-client.html # WebSocket 客户端示例
├── package.json
├── tsconfig.json
└── README.md
```

## 实现详情

### 日志格式化

- 支持 Winston 所有的内置格式化器，如 json、simple、colorize 等
- 为控制台和文件输出提供不同的格式
- 确保在不同输出渠道保持语义一致性

### 错误处理机制

- **WebSocket 连接失败处理**：

  - 自动重连机制
  - 消息队列缓存 - 当连接断开时，日志消息会被缓存，连接恢复后重新发送
  - 降级策略 - 在 WebSocket 不可用时，仍能保证控制台和文件输出正常工作

- **文件写入错误处理**：
  - 目录自动创建
  - 文件轮转策略，避免单个文件过大
  - 日志备份配置

### 日志服务端架构

为了避免循环连接问题并提高可维护性，日志系统分为两个独立服务：

1. **API 服务器**：提供 HTTP 接口，生成日志
2. **日志 WebSocket 服务器**：专门用于接收和广播日志信息

这种分离架构解决了以下问题：

- 避免了循环连接问题
- 提高了系统可伸缩性
- 降低了单个服务的负担

### 性能优化

- **批量处理**：WebSocket Transport 实现了消息队列
- **缓冲策略**：在高日志量场景下，通过队列管理减少网络压力
- **轻量级事件传输**：避免冗余信息传输

## 使用示例

### 基本使用

```typescript
import { createLogger } from "./path-to-logger";

const logger = createLogger({
  // 配置选项
});

logger.info("Hello, world!");
logger.error("An error occurred", { error: "Details" });
```

### WebSocket 客户端订阅

```javascript
// 浏览器中
const socket = io("ws://localhost:3000/ws");
socket.on("log", (logMessage) => {
  console.log("Received log:", logMessage);
});
```

### Curl 测试 (WebSocket)

使用 websocat 等工具测试 WebSocket 连接：

```bash
# 安装 websocat
brew install websocat  # macOS
apt-get install websocat  # Ubuntu

# 连接到 WebSocket 端点
websocat ws://localhost:3000/ws

# 此时终端将显示接收到的日志消息
```

## 部署与配置

提供详细的配置项文档，包括：

- 日志级别设置
- 文件轮转策略
- WebSocket 连接配置
- 格式化选项

## 后续扩展可能性

1. 添加更多传输渠道，如数据库存储、云日志服务等
2. 支持日志分析和可视化工具集成
3. 实现分布式日志收集与聚合

## 结论

这个日志工具将提供与 Winston 完全兼容的 API，同时扩展了多通道输出能力，特别是实时 WebSocket 传输功能。通过合理的设计和实现，确保日志处理的可靠性、灵活性和高性能。
