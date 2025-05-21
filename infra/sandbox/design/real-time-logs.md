# 沙箱环境实时日志传输系统设计

## 1. 概述

为了提升用户体验，让用户实时看到沙箱中代码执行的过程和结果，我们设计实现一个基于WebSocket的实时日志传输系统，配合前端的web-shell组件展示执行过程。这样用户可以像使用本地终端一样，实时看到代码的执行过程、输出结果和错误信息。

## 2. 设计目标

1. 实时传输沙箱容器中的日志和命令执行结果
2. 支持交互式命令输入和响应
3. 提供类似终端的用户界面体验
4. 确保系统安全性和稳定性
5. 最小化对现有系统的影响

## 3. 系统架构

### 3.1 整体架构

```
┌─────────────┐       WebSocket       ┌──────────────┐      Docker API     ┌──────────────┐
│             │ <------------------>  │              │ <-----------------> │              │
│  前端       │  实时日志/指令传输    │   沙箱API    │    容器日志/命令    │  Docker容器   │
│ Web-Shell   │                       │   服务器     │                     │              │
└─────────────┘                       └──────────────┘                     └──────────────┘
```

### 3.2 技术选择

- **通信协议**: WebSocket (Socket.IO)
- **后端服务**: Node.js + Express + Socket.IO
- **前端组件**: React + Socket.IO Client
- **容器交互**: Docker API (通过Dockerode)

## 4. 详细设计

### 4.1 后端实现

#### 4.1.1 WebSocket服务集成

在现有的Express服务器中集成Socket.IO服务:

```typescript
// 在server.ts中添加WebSocket服务器
import { Server as WebSocketServer } from "socket.io";
import http from "http";

export function createApp(): {
  app: express.Application;
  httpServer: http.Server;
} {
  const app = express();
  // ...已有代码...

  const httpServer = http.createServer(app);
  const io = new WebSocketServer(httpServer);

  // WebSocket连接处理
  io.on("connection", (socket) => {
    logger.info(`WebSocket client connected: ${socket.id}`);

    // 处理容器会话连接
    socket.on("join-container", (containerId) => {
      socket.join(`container-${containerId}`);
      logger.info(`Client ${socket.id} joined container ${containerId}`);
    });

    // 处理命令输入
    socket.on("command-input", async ({ containerId, command }) => {
      try {
        // 向容器发送命令...
        await executionService.sendCommandToContainer(
          containerId,
          command,
          socket.id
        );
      } catch (error) {
        socket.emit("error", { message: `执行命令失败: ${error.message}` });
      }
    });

    socket.on("disconnect", () => {
      logger.info(`WebSocket client disconnected: ${socket.id}`);
    });
  });

  return { app, httpServer };
}

// 修改startServer函数
export function startServer() {
  const { app, httpServer } = createApp();

  const server = httpServer.listen(config.port, () => {
    // ...已有代码...
  });

  // ...已有代码...
}
```

#### 4.1.2 流式执行服务

扩展执行服务以支持实时流式输出:

```typescript
// 在execution-service.ts中添加流式执行支持
class ExecutionService {
  // ...已有代码...

  /**
   * 流式执行命令并实时传输输出到WebSocket
   */
  async streamExecuteInContainer(
    containerId: string,
    command: string[],
    socketId?: string,
    files?: SandboxFiles,
    env?: Record<string, string>,
    gitTracking: boolean = true
  ): Promise<string> {
    // 返回执行ID
    try {
      const executionId = `exec_${uuidv4().substring(0, 8)}`;
      logger.info(`Starting streamed execution: ${executionId}`, {
        containerId,
        command
      });

      // 获取WebSocket服务器实例
      const io = getSocketIOInstance();

      // 设置工作目录
      const workDir =
        files && Object.keys(files).length > 0
          ? await fileService.createFilesInContainer(containerId, files)
          : "/home/sandbox";

      // 获取容器
      const container = this.docker.getContainer(containerId);

      // 创建exec实例
      const exec = await container.exec({
        Cmd: command,
        AttachStdout: true,
        AttachStderr: true,
        WorkingDir: workDir,
        Env: env
          ? Object.entries(env).map(([key, value]) => `${key}=${value}`)
          : undefined,
        Tty: true
      });

      // 启动exec
      const stream = await exec.start({ hijack: true, stdin: true });

      // 实时转发输出到WebSocket
      container.modem.demuxStream(
        stream,
        {
          write: (chunk: Buffer) => {
            const output = chunk.toString();
            // 发送到特定客户端或房间
            if (socketId) {
              io.to(socketId).emit("exec-output", {
                type: "stdout",
                data: output,
                executionId
              });
            } else {
              io.to(`container-${containerId}`).emit("exec-output", {
                type: "stdout",
                data: output,
                executionId
              });
            }
          }
        },
        {
          write: (chunk: Buffer) => {
            const output = chunk.toString();
            // 发送到特定客户端或房间
            if (socketId) {
              io.to(socketId).emit("exec-output", {
                type: "stderr",
                data: output,
                executionId
              });
            } else {
              io.to(`container-${containerId}`).emit("exec-output", {
                type: "stderr",
                data: output,
                executionId
              });
            }
          }
        }
      );

      // 监听流结束
      stream.on("end", async () => {
        try {
          const inspectData = await exec.inspect();
          const exitCode = inspectData.ExitCode;

          // 发送执行完成事件
          if (socketId) {
            io.to(socketId).emit("exec-finished", {
              executionId,
              exitCode,
              status: exitCode === 0 ? "success" : "error"
            });
          } else {
            io.to(`container-${containerId}`).emit("exec-finished", {
              executionId,
              exitCode,
              status: exitCode === 0 ? "success" : "error"
            });
          }

          // Git提交如果启用了跟踪
          if (gitTracking && files && Object.keys(files).length > 0) {
            await gitService.commitChanges(
              containerId,
              executionId,
              `Update files for sandbox execution ${executionId}`,
              workDir
            );
          }
        } catch (error) {
          logger.error(`Error processing execution end: ${error}`);
        }
      });

      return executionId;
    } catch (error) {
      logger.error(`Error in stream execution`, { error });
      throw new ApiError(
        "EXECUTION_FAILED",
        "Failed to execute command in container",
        500,
        { cause: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  /**
   * 向正在运行的容器发送命令（交互式）
   */
  async sendCommandToContainer(
    containerId: string,
    command: string,
    socketId: string
  ): Promise<void> {
    // 实现向容器的stdin发送命令...
  }
}
```

#### 4.1.3 WebSocket控制器

创建专门的WebSocket控制器处理实时会话:

```typescript
// 在controllers/目录下创建websocket-controller.ts
import { Socket } from "socket.io";
import executionService from "../services/execution-service";
import logger from "../utils/logger";

class WebSocketController {
  /**
   * 处理新的WebSocket连接
   */
  handleConnection(socket: Socket) {
    logger.info(`New WebSocket connection: ${socket.id}`);

    // 客户端请求加入容器会话
    socket.on("join-session", async (data: { containerId: string }) => {
      try {
        const { containerId } = data;
        await this.joinContainerSession(socket, containerId);
      } catch (error) {
        socket.emit("error", { message: error.message });
      }
    });

    // 客户端发送命令到容器
    socket.on(
      "execute-command",
      async (data: { containerId: string; command: string[] }) => {
        try {
          const { containerId, command } = data;
          await this.executeCommand(socket, containerId, command);
        } catch (error) {
          socket.emit("error", { message: error.message });
        }
      }
    );

    // 客户端发送文件到容器
    socket.on(
      "upload-files",
      async (data: { containerId: string; files: any }) => {
        // 处理文件上传...
      }
    );

    // 断开连接处理
    socket.on("disconnect", () => {
      logger.info(`WebSocket disconnected: ${socket.id}`);
    });
  }

  /**
   * 加入容器会话
   */
  private async joinContainerSession(socket: Socket, containerId: string) {
    // 验证容器是否存在...
    socket.join(`container-${containerId}`);
    socket.emit("session-joined", { containerId });
    logger.info(`Client ${socket.id} joined container ${containerId}`);
  }

  /**
   * 执行命令
   */
  private async executeCommand(
    socket: Socket,
    containerId: string,
    command: string[]
  ) {
    try {
      const executionId = await executionService.streamExecuteInContainer(
        containerId,
        command,
        socket.id
      );
      socket.emit("command-accepted", { executionId });
    } catch (error) {
      socket.emit("error", { message: `执行命令失败: ${error.message}` });
    }
  }
}

export default new WebSocketController();
```

### 4.2 前端实现

#### 4.2.1 WebTerminal组件

```tsx
// components/web-terminal/index.tsx
import React, { useState, useEffect, useRef } from "react";
import { Socket, io } from "socket.io-client";
import styles from "./style.module.css";

interface WebTerminalProps {
  containerId: string;
  apiUrl: string;
}

interface OutputLine {
  type: "stdout" | "stderr" | "system";
  content: string;
}

const WebTerminal: React.FC<WebTerminalProps> = ({ containerId, apiUrl }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [output, setOutput] = useState<OutputLine[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 初始化WebSocket连接
  useEffect(() => {
    const newSocket = io(apiUrl);

    newSocket.on("connect", () => {
      setConnected(true);
      setOutput((prev) => [
        ...prev,
        { type: "system", content: "连接到终端服务器成功" }
      ]);

      // 加入容器会话
      newSocket.emit("join-session", { containerId });
    });

    newSocket.on("session-joined", (data) => {
      setOutput((prev) => [
        ...prev,
        { type: "system", content: `成功连接到容器: ${data.containerId}` }
      ]);
    });

    newSocket.on("exec-output", (data) => {
      setOutput((prev) => [...prev, { type: data.type, content: data.data }]);
    });

    newSocket.on("exec-finished", (data) => {
      setOutput((prev) => [
        ...prev,
        {
          type: "system",
          content: `命令执行完成 [${data.executionId}], 状态: ${data.status}, 退出码: ${data.exitCode}`
        }
      ]);
    });

    newSocket.on("error", (error) => {
      setOutput((prev) => [
        ...prev,
        { type: "stderr", content: `错误: ${error.message}` }
      ]);
    });

    newSocket.on("disconnect", () => {
      setConnected(false);
      setOutput((prev) => [
        ...prev,
        { type: "system", content: "与终端服务器断开连接" }
      ]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [containerId, apiUrl]);

  // 自动滚动到最新输出
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  // 聚焦输入框
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // 处理命令提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || !socket) return;

    const command = input;
    setOutput((prev) => [...prev, { type: "system", content: `$ ${command}` }]);

    // 发送命令到服务器
    socket.emit("execute-command", {
      containerId,
      command: ["/bin/sh", "-c", command]
    });

    // 更新命令历史
    setHistory((prev) => [...prev, command]);
    setHistoryIndex(-1);
    setInput("");
  };

  // 处理键盘导航历史命令
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput("");
      }
    }
  };

  return (
    <div className={styles.terminal} onClick={focusInput}>
      <div className={styles.header}>
        <span>Web Terminal</span>
        <span className={styles.status}>
          {connected ? "Connected" : "Disconnected"}
        </span>
      </div>
      <div className={styles.outputContainer} ref={terminalRef}>
        {output.map((line, i) => (
          <div
            key={i}
            className={`${styles.outputLine} ${
              line.type === "stderr"
                ? styles.error
                : line.type === "system"
                  ? styles.system
                  : ""
            }`}
          >
            {line.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className={styles.inputForm}>
        <span className={styles.prompt}>$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className={styles.input}
          autoFocus
        />
      </form>
    </div>
  );
};

export default WebTerminal;
```

#### 4.2.2 终端样式

```css
/* components/web-terminal/style.module.css */
.terminal {
  width: 100%;
  height: 400px;
  background-color: #1e1e1e;
  color: #f0f0f0;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  font-family: "JetBrains Mono", "Courier New", monospace;
  font-size: 14px;
}

.header {
  background-color: #333;
  padding: 8px 12px;
  display: flex;
  justify-content: space-between;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.status {
  font-size: 12px;
}

.outputContainer {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  white-space: pre-wrap;
}

.outputLine {
  line-height: 1.5;
}

.error {
  color: #ff5555;
}

.system {
  color: #8be9fd;
  font-style: italic;
}

.inputForm {
  display: flex;
  padding: 8px;
  background-color: #252525;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}

.prompt {
  color: #50fa7b;
  margin-right: 8px;
}

.input {
  flex: 1;
  background: transparent;
  border: none;
  color: #f0f0f0;
  font-family: inherit;
  font-size: inherit;
  outline: none;
}
```

#### 4.2.3 示例用法

```tsx
// 在workspace页面中使用WebTerminal
import WebTerminal from "@/components/web-terminal";

// ...在页面组件内
<div className="workspace-container">
  <h2>沙箱环境</h2>
  {containerId && (
    <WebTerminal
      containerId={containerId}
      apiUrl="http://localhost:3000" // 沙箱API的WebSocket地址
    />
  )}
</div>;
```

## 5. API文档

### WebSocket API

沙箱环境提供WebSocket接口，用于实时获取容器执行日志和发送交互式命令。

### 连接WebSocket服务器

```javascript
// 客户端代码
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("WebSocket连接成功");
});
```

### 事件列表

#### 客户端发送的事件

| 事件名          | 参数                                       | 描述             |
| --------------- | ------------------------------------------ | ---------------- |
| join-session    | { containerId: string }                    | 加入容器会话     |
| execute-command | { containerId: string, command: string[] } | 在容器中执行命令 |
| upload-files    | { containerId: string, files: object }     | 上传文件到容器   |

#### 服务器发送的事件

| 事件名         | 参数                                                           | 描述               |
| -------------- | -------------------------------------------------------------- | ------------------ |
| session-joined | { containerId: string }                                        | 成功加入容器会话   |
| exec-output    | { type: 'stdout'/'stderr', data: string, executionId: string } | 命令执行产生的输出 |
| exec-finished  | { executionId: string, exitCode: number, status: string }      | 命令执行完成       |
| error          | { message: string }                                            | 发生错误           |

### 示例流程

1. 连接WebSocket服务器
2. 发送`join-session`事件加入容器会话
3. 接收`session-joined`事件确认已连接到容器
4. 发送`execute-command`事件执行命令
5. 接收多个`exec-output`事件获取实时输出
6. 接收`exec-finished`事件获知命令执行完成

## 6. 实施计划

### 6.1 依赖安装

```bash
cd packages/sandbox
npm install socket.io ws
```

### 6.2 前端依赖

```bash
npm install socket.io-client
```

### 6.3 开发步骤

1. 修改sandbox服务器代码，添加WebSocket支持
2. 实现流式执行服务
3. 创建WebSocket控制器
4. 开发前端WebTerminal组件
5. 集成测试和调试
6. 更新API文档

## 7. 安全考虑

1. **授权验证**: 确保只有授权用户能连接到WebSocket服务
2. **访问控制**: 用户只能访问自己创建的容器
3. **资源限制**: 防止通过实时会话消耗过多服务器资源
4. **输入验证**: 严格验证所有用户输入的命令
5. **超时处理**: 设置长时间无操作的会话超时

## 8. 未来扩展

1. **会话持久化**: 保存终端会话历史，允许用户恢复之前的工作
2. **文件上传/下载UI**: 在WebTerminal中集成文件操作功能
3. **多终端支持**: 允许用户同时打开多个终端标签
4. **权限控制**: 基于用户角色限制终端功能
5. **代码编辑器集成**: 将终端与代码编辑器集成，提供统一的开发环境

## 9. 结论

实时日志传输系统将大大提升用户体验，让用户可以像使用本地终端一样与远程沙箱环境交互，看到实时的执行过程和输出结果。通过WebSocket技术的应用，我们可以在保证系统安全性的同时，提供流畅的实时交互体验。

# Real-time Logs with WebSockets

This document describes the WebSocket implementation for real-time logs in the Sandbox service.

## Overview

The WebSocket functionality allows clients to connect to the Sandbox service and receive real-time logs and execution output from containers. This is especially useful for long-running tasks, dependency installation processes, and interactive debugging.

## Architecture

The WebSocket service is integrated directly into the existing Sandbox API service rather than being a separate service. This simplifies deployment and reduces complexity.

```
┌─────────────┐       HTTP        ┌──────────────┐      Docker API     ┌──────────────┐
│             │ -----------------> │              │ -----------------> │              │
│  Client     │                    │   Sandbox    │                    │    Docker    │
│             │ <----------------- │   Service    │ <----------------- │  Containers  │
└─────────────┘       HTTP        └──────────────┘                    └──────────────┘
       │                                  │                                   │
       │          WebSocket               │                                   │
       └--------------------------------->│                                   │
                Real-time logs            │                                   │
       <---------------------------------┘                                   │
                                           └-----------------------------------┘
                                                  Container output streams
```

## Implementation Details

### Backend Components

1. **WebSocket Server**: Uses Socket.IO for WebSocket communication with clients.
2. **Real-time Execution Service**: Handles streaming container output over WebSocket connections.
3. **Socket Controller**: Manages WebSocket events and client connections.
4. **Socket Manager**: Singleton for accessing the WebSocket server instance across the application.

### API Endpoints

#### REST Endpoints

1. **Standard Execution (Existing)**:

   - `POST /api/sandbox/exec`
   - Supports both traditional response and real-time logs via socketSessionId parameter

2. **Real-time Execution (New)**:
   - `POST /api/sandbox/exec/realtime`
   - Dedicated endpoint for real-time execution with required socketSessionId

#### WebSocket Endpoint

- **WebSocket Connection**:
  - `ws://[server-address]/sandbox/ws`
  - Uses Socket.IO with path configuration

### WebSocket Events

#### Client to Server Events:

1. **`join-container`**: Join a specific container's room to receive its events

   ```json
   {
     "containerId": "container123"
   }
   ```

2. **`execute-command`**: Execute a command in a container (future implementation)

   ```json
   {
     "containerId": "container123",
     "command": ["python", "-c", "print('hello')"]
   }
   ```

3. **`stdin-data`**: Send standard input to a running command (future implementation)
   ```json
   {
     "executionId": "exec123",
     "data": "input data"
   }
   ```

#### Server to Client Events:

1. **`container-joined`**: Confirmation of joining a container room

   ```json
   {
     "containerId": "container123",
     "success": true
   }
   ```

2. **`execution-output`**: Real-time command output

   ```json
   {
     "executionId": "exec123",
     "containerId": "container123",
     "type": "stdout", // or "stderr"
     "data": "Output content",
     "timestamp": "2025-05-14T12:34:56.789Z"
   }
   ```

3. **`execution-complete`**: Notification that execution has finished

   ```json
   {
     "executionId": "exec123",
     "containerId": "container123",
     "status": "success", // or "failed", "timeout", "error"
     "exitCode": 0,
     "timestamp": "2025-05-14T12:35:01.234Z"
   }
   ```

4. **`error`**: Error events
   ```json
   {
     "message": "Error message",
     "code": "ERROR_CODE"
   }
   ```

## Client Usage

### Establishing a Connection

```javascript
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  path: "/sandbox/ws",
  transports: ["websocket", "polling"]
});

socket.on("connect", () => {
  console.log("Connected to WebSocket server");

  // Join container to receive its events
  socket.emit("join-container", "container123");
});
```

### Executing Code with Real-time Logs

```javascript
// First establish WebSocket connection as shown above

// Then make API call to execute code with real-time logs
async function executeCode(containerId, code) {
  const response = await fetch(
    "http://localhost:3000/api/sandbox/exec/realtime",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        containerId,
        command: ["python", "-c", code],
        socketSessionId: socket.id // Pass the socket ID to associate with this request
      })
    }
  );

  return await response.json();
}

// Listen for real-time output
socket.on("execution-output", (data) => {
  console.log(`${data.type === "stderr" ? "Error: " : ""}${data.data}`);
});

// Listen for execution completion
socket.on("execution-complete", (data) => {
  console.log(
    `Execution completed with status: ${data.status}, exit code: ${data.exitCode}`
  );
});
```

## Usage Examples

### Node.js Client

See the example client in `demo/websocket-client.js` which demonstrates:

- Connecting to WebSocket server
- Creating or using an existing container
- Sending code for execution
- Handling real-time logs

### React Component

See `demo/WebSocketLogViewer.tsx` for a complete React component example that:

- Connects to the WebSocket server
- Maintains connection status
- Allows code editing
- Executes code with real-time log streaming
- Displays stdout/stderr with appropriate styling

## Best Practices

1. **Error Handling**: Always handle WebSocket disconnections and errors gracefully
2. **Reconnection**: Implement reconnection logic for WebSocket connections
3. **Clean Up**: Properly disconnect WebSocket connections when components unmount
4. **Room Management**: Join only necessary container rooms to reduce server load
5. **Security**: Validate socketSessionId to ensure clients can only access their own execution streams

## Future Extensions

1. **Interactive Processes**: Support for stdin streaming to interact with running processes
2. **Direct WebSocket Command Execution**: Execute commands directly via WebSocket without REST API
3. **Container Events**: Stream container lifecycle events (start, stop, resource usage)
4. **Authentication**: Enhanced authentication for WebSocket connections
