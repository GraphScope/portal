是的，我分析了您的需求，设计文档中提出的WebSocket方案确实能够满足您的要求。您需要一个系统，让用户：

1. 在网页上编辑代码
2. 通过`/api/sandbox/exec`接口将代码发送到沙箱运行
3. 实时看到运行日志（比如依赖安装进度等）

我认为将WebSocket服务集成到现有沙箱API是理想的方案。以下是具体的实现方案和测试用例：

## 调整后的架构方案

在现有的沙箱API基础上，我们只需添加WebSocket功能，不需要创建单独的服务。整合方案如下：

1. **REST API**：处理代码提交请求（`/api/sandbox/exec`）
2. **WebSocket**：提供实时日志流，连接到相同的服务器

## 后端实现示例

### 1. 服务器配置

```typescript
// server.ts
import express from "express";
import http from "http";
import { Server as WebSocketServer } from "socket.io";
import sandboxController from "./controllers/sandbox-controller";
import { setupWebSocketHandlers } from "./controllers/websocket-controller";

export function createApp() {
  const app = express();
  // 现有Express配置...

  // 添加REST API端点
  app.post("/api/sandbox/exec", sandboxController.executeCode);

  // 创建HTTP服务器和WebSocket服务器
  const httpServer = http.createServer(app);
  const io = new WebSocketServer(httpServer);

  // 设置WebSocket处理程序
  setupWebSocketHandlers(io);

  return { app, httpServer, io };
}

export function startServer() {
  const { httpServer } = createApp();
  const port = process.env.PORT || 3000;

  httpServer.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
```

### 2. 执行服务更新

```typescript
// services/execution-service.ts
import { ApiError } from "../utils/errors";
import { v4 as uuidv4 } from "uuid";
import logger from "../utils/logger";
import { getSocketIO } from "../utils/socket-manager";

class ExecutionService {
  // ...现有代码...

  /**
   * 执行代码并通过WebSocket流式返回结果
   */
  async executeCodeWithRealTimeLogs(
    containerId: string,
    code: string,
    language: string,
    socketSessionId?: string
  ) {
    try {
      // 创建唯一执行ID
      const executionId = `exec_${uuidv4().substring(0, 8)}`;
      logger.info(`Starting execution: ${executionId}`, {
        containerId,
        language
      });

      // 获取WebSocket实例
      const io = getSocketIO();

      // 将代码写入文件
      const fileName = this.getFileName(language, code);
      await this.fileService.createFilesInContainer(containerId, {
        [fileName]: code
      });

      // 安装依赖并执行代码
      const command = this.buildCommand(language, fileName);

      // 获取容器
      const container = this.docker.getContainer(containerId);

      // 创建exec实例
      const exec = await container.exec({
        Cmd: ["/bin/bash", "-c", command],
        AttachStdout: true,
        AttachStderr: true,
        WorkingDir: "/home/sandbox",
        Tty: false
      });

      // 启动exec
      const stream = await exec.start({ hijack: true, stdin: false });

      // 实时转发输出到WebSocket
      container.modem.demuxStream(
        stream,
        {
          write: (chunk: Buffer) => {
            const output = chunk.toString();
            // 发送标准输出
            this.sendLogOutput(
              io,
              containerId,
              executionId,
              "stdout",
              output,
              socketSessionId
            );
          }
        },
        {
          write: (chunk: Buffer) => {
            const output = chunk.toString();
            // 发送标准错误
            this.sendLogOutput(
              io,
              containerId,
              executionId,
              "stderr",
              output,
              socketSessionId
            );
          }
        }
      );

      // 监听流结束
      return new Promise((resolve, reject) => {
        stream.on("end", async () => {
          try {
            const inspectData = await exec.inspect();
            const exitCode = inspectData.ExitCode;

            // 发送执行完成事件
            this.sendExecutionComplete(
              io,
              containerId,
              executionId,
              exitCode,
              socketSessionId
            );

            // 返回结果
            resolve({
              executionId,
              exitCode,
              status: exitCode === 0 ? "success" : "error"
            });
          } catch (error) {
            logger.error(`Error in execution completion`, { error });
            reject(error);
          }
        });
      });
    } catch (error) {
      logger.error(`Error executing code`, { error });
      throw new ApiError("EXECUTION_FAILED", "Failed to execute code", 500, {
        cause: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * 根据语言构建适当的执行命令
   */
  private buildCommand(language: string, fileName: string): string {
    switch (language) {
      case "python":
        return `pip install -r requirements.txt 2>&1 || true && python ${fileName}`;
      case "javascript":
      case "typescript":
        return `npm install 2>&1 || true && node ${fileName}`;
      default:
        throw new Error(`Unsupported language: ${language}`);
    }
  }

  /**
   * 发送日志输出到WebSocket客户端
   */
  private sendLogOutput(
    io: any,
    containerId: string,
    executionId: string,
    type: "stdout" | "stderr",
    data: string,
    socketSessionId?: string
  ) {
    if (socketSessionId) {
      // 发送给特定会话
      io.to(socketSessionId).emit("execution-output", {
        executionId,
        containerId,
        type,
        data
      });
    } else {
      // 发送给所有订阅此容器的客户端
      io.to(`container-${containerId}`).emit("execution-output", {
        executionId,
        containerId,
        type,
        data
      });
    }
  }

  /**
   * 发送执行完成事件
   */
  private sendExecutionComplete(
    io: any,
    containerId: string,
    executionId: string,
    exitCode: number,
    socketSessionId?: string
  ) {
    const payload = {
      executionId,
      containerId,
      exitCode,
      status: exitCode === 0 ? "success" : "error",
      timestamp: new Date().toISOString()
    };

    if (socketSessionId) {
      io.to(socketSessionId).emit("execution-complete", payload);
    } else {
      io.to(`container-${containerId}`).emit("execution-complete", payload);
    }
  }
}
```

### 3. WebSocket控制器

```typescript
// controllers/websocket-controller.ts
import { Server as WebSocketServer, Socket } from "socket.io";
import logger from "../utils/logger";
import { setSocketIO } from "../utils/socket-manager";

export function setupWebSocketHandlers(io: WebSocketServer) {
  // 保存WebSocket服务器实例以便其他地方使用
  setSocketIO(io);

  // 处理新连接
  io.on("connection", (socket: Socket) => {
    logger.info(`WebSocket client connected: ${socket.id}`);

    // 客户端加入容器会话
    socket.on("join-container", (containerId: string) => {
      socket.join(`container-${containerId}`);
      logger.info(`Client ${socket.id} joined container ${containerId}`);
      socket.emit("container-joined", { containerId });
    });

    // 断开连接
    socket.on("disconnect", () => {
      logger.info(`WebSocket client disconnected: ${socket.id}`);
    });
  });
}
```

### 4. Sandbox控制器

```typescript
// controllers/sandbox-controller.ts
import { Request, Response, NextFunction } from "express";
import executionService from "../services/execution-service";
import containerService from "../services/container-service";
import logger from "../utils/logger";

class SandboxController {
  /**
   * 处理代码执行请求 (REST API)
   */
  async executeCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { code, language, containerId, socketSessionId } = req.body;

      if (!code || !language) {
        return res.status(400).json({
          status: "error",
          message: "Missing required parameters: code and language"
        });
      }

      // 确保容器存在或创建新容器
      const cId =
        containerId ||
        (await containerService.createContainer({
          image: language === "python" ? "sandbox-python" : "sandbox-node"
        }));

      // 开始异步执行，WebSocket将处理结果流
      const executionId = await executionService.executeCodeWithRealTimeLogs(
        cId,
        code,
        language,
        socketSessionId
      );

      // 返回立即响应给客户端
      return res.status(202).json({
        status: "accepted",
        data: {
          containerId: cId,
          executionId,
          message: "Execution started. Connect to WebSocket for real-time logs."
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new SandboxController();
```

### 5. WebSocket管理器

```typescript
// utils/socket-manager.ts
import { Server as WebSocketServer } from "socket.io";

let io: WebSocketServer | null = null;

export function setSocketIO(socketIO: WebSocketServer) {
  io = socketIO;
}

export function getSocketIO(): WebSocketServer {
  if (!io) {
    throw new Error("WebSocket server not initialized");
  }
  return io;
}
```

## 前端实现示例

### 1. 代码编辑与执行组件

```tsx
// CodeEditor.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import { MonacoEditor } from "./MonacoEditor"; // 代码编辑器组件
import { LogViewer } from "./LogViewer"; // 日志显示组件

interface CodeEditorProps {
  initialCode?: string;
  language: "python" | "javascript" | "typescript";
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  initialCode = "",
  language
}) => {
  const [code, setCode] = useState(initialCode);
  const [containerId, setContainerId] = useState<string | null>(null);
  const [executionId, setExecutionId] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [logs, setLogs] = useState<Array<{ type: string; content: string }>>(
    []
  );
  const [socket, setSocket] = useState<Socket | null>(null);

  // 初始化WebSocket连接
  useEffect(() => {
    const newSocket = io("http://localhost:3000");

    newSocket.on("connect", () => {
      console.log("Connected to WebSocket server");

      // 如果已有containerId，加入该容器的房间
      if (containerId) {
        newSocket.emit("join-container", containerId);
      }
    });

    // 监听容器加入事件
    newSocket.on("container-joined", (data: { containerId: string }) => {
      console.log(`Joined container: ${data.containerId}`);
    });

    // 监听执行输出
    newSocket.on(
      "execution-output",
      (data: {
        executionId: string;
        type: "stdout" | "stderr";
        data: string;
      }) => {
        setLogs((prevLogs) => [
          ...prevLogs,
          {
            type: data.type,
            content: data.data
          }
        ]);
      }
    );

    // 监听执行完成
    newSocket.on(
      "execution-complete",
      (data: {
        executionId: string;
        status: "success" | "error";
        exitCode: number;
      }) => {
        setLogs((prevLogs) => [
          ...prevLogs,
          {
            type: "system",
            content: `Execution complete. Status: ${data.status}, Exit code: ${data.exitCode}`
          }
        ]);
        setIsExecuting(false);
      }
    );

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // 当获取到containerId时，加入该容器的WebSocket房间
  useEffect(() => {
    if (socket && containerId) {
      socket.emit("join-container", containerId);
    }
  }, [socket, containerId]);

  // 执行代码
  const executeCode = async () => {
    try {
      setIsExecuting(true);
      setLogs([{ type: "system", content: "Starting execution..." }]);

      // 发送代码到API
      const response = await axios.post("/api/sandbox/exec", {
        code,
        language,
        containerId, // 如果为null，API会创建新容器
        socketSessionId: socket?.id // 传递WebSocket会话ID以接收私有事件
      });

      // 保存返回的containerId
      if (response.data.data.containerId) {
        setContainerId(response.data.data.containerId);
      }

      // 保存executionId
      setExecutionId(response.data.data.executionId);
    } catch (error) {
      setLogs((prevLogs) => [
        ...prevLogs,
        { type: "error", content: `Error: ${error.message}` }
      ]);
      setIsExecuting(false);
    }
  };

  return (
    <div className="code-editor-container">
      <div className="editor-section">
        <MonacoEditor
          value={code}
          onChange={setCode}
          language={language}
          height="400px"
        />
        <button
          onClick={executeCode}
          disabled={isExecuting}
          className="execute-button"
        >
          {isExecuting ? "Executing..." : "Run Code"}
        </button>
      </div>

      <div className="output-section">
        <h3>Output</h3>
        <LogViewer logs={logs} />
      </div>
    </div>
  );
};

export default CodeEditor;
```

### 2. 日志查看器组件

```tsx
// LogViewer.tsx
import React, { useRef, useEffect } from "react";

interface Log {
  type: string;
  content: string;
}

interface LogViewerProps {
  logs: Log[];
}

export const LogViewer: React.FC<LogViewerProps> = ({ logs }) => {
  const logContainerRef = useRef<HTMLDivElement>(null);

  // 自动滚动到最新日志
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="log-viewer" ref={logContainerRef}>
      {logs.map((log, index) => (
        <div key={index} className={`log-line ${log.type}`}>
          {log.type === "stderr"
            ? "❌ "
            : log.type === "stdout"
              ? "📝 "
              : "🔔 "}
          {log.content}
        </div>
      ))}
    </div>
  );
};
```

## 测试用例

以下是一个完整的测试用例，展示方案的可行性。

### 测试用例1: Python依赖安装和执行

假设用户提交以下Python代码并希望查看依赖安装过程：

```python
# test.py
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

# 创建一些随机数据
data = np.random.randn(100, 4)
df = pd.DataFrame(data, columns=['A', 'B', 'C', 'D'])

# 打印数据统计
print("Data statistics:")
print(df.describe())

# 简单数据处理
df['E'] = df.A + df.B
print("\nTotal rows after processing:", len(df))

# 生成结果
print("\nProcessing complete!")
```

同时创建一个`requirements.txt`文件：

```
numpy==1.22.0
pandas==1.5.0
matplotlib==3.5.1
```

### 后端测试流程:

1. 用户提交代码和requirements.txt内容
2. 后端将文件写入容器
3. 执行依赖安装和代码运行
4. 通过WebSocket实时返回安装和执行日志

### 前端测试:

1. 用户点击"运行代码"
2. 前端建立WebSocket连接并加入容器房间
3. 前端显示实时安装日志：
   ```
   📝 Collecting numpy==1.22.0
   📝 Downloading numpy-1.22.0-cp39-cp39-manylinux_2_17_x86_64.manylinux2014_x86_64.whl (16.8 MB)
   📝 Installing collected packages: numpy
   📝 Successfully installed numpy-1.22.0
   📝 Collecting pandas==1.5.0
   ...
   ```
4. 依赖安装完成后，显示代码执行日志：
   ```
   📝 Data statistics:
   📝               A         B         C         D
   📝 count  100.000000 100.000...
   ...
   📝 Processing complete!
   ```
5. 执行完成后，显示完成状态

### 扩展测试: 长时间运行任务

对于长时间运行的任务，WebSocket连接将保持活跃状态，实时接收进度更新，用户可以实时看到执行进度。

## 结论

这个方案完全可以满足您的需求。通过将WebSocket集成到现有的沙箱API服务中，我们可以：

1. 保持API的简洁性（`/api/sandbox/exec`接口不变）
2. 提供实时日志流（通过WebSocket）
3. 支持用户在前端实时看到依赖安装和代码执行过程

实现这个方案只需要：

1. 在现有服务中添加WebSocket支持
2. 修改执行服务以支持流式输出
3. 在前端添加WebSocket客户端来接收和显示日志

这个方案适合集成到您现有的系统中，不需要创建单独的服务，维护成本较低。
