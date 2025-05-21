# 沙箱环境 API 文档

本文档详细说明了沙箱环境(`@graphscope/sandbox`)提供的所有API接口、请求参数和响应格式。

## 基本信息

- 沙箱服务: `http://localhost:3000`（默认）
- 日志服务 `http://localhost:3002`（默认开启websocket 实时日志流服务）
- 所有请求和响应均使用JSON格式
- 错误响应统一格式: `{ "error": { "code": "错误代码", "message": "错误消息", "details": {} } }`

## API Endpoint

### 1. 健康检查

检查API服务是否正常运行。

```
GET /health
```

**示例请求：**

```bash
curl -X GET http://localhost:3000/health
```

**成功响应：**

```json
{
  "status": "ok"
}
```

### 2. 创建沙箱容器

创建一个新的沙箱容器实例。

```
POST /api/sandbox
```

**请求参数：**

| 参数    | 类型   | 必需 | 描述                 |
| ------- | ------ | ---- | -------------------- |
| image   | string | 是   | Docker镜像名称及标签 |
| options | object | 否   | 容器配置选项         |

**options参数详情：**

| 参数        | 类型   | 默认值 | 描述                         |
| ----------- | ------ | ------ | ---------------------------- |
| timeout     | number | 30000  | 容器超时时间(毫秒)           |
| memoryLimit | string | "512m" | 内存限制 (例如 "512m", "1g") |
| cpuLimit    | string | "0.5"  | CPU限制 (例如 "0.5", "1")    |

**示例请求：**

```bash
curl -X POST http://localhost:3000/api/sandbox \
  -H "Content-Type: application/json" \
  -d '{
    "image": "node:18-alpine",
    "options": {
      "timeout": 180000,
      "memoryLimit": "512m"
    }
  }'
```

**成功响应：**

```json
{
  "containerId": "abc123def456...",
  "status": "running",
  "createdAt": "2025-05-14T10:30:00.000Z",
  "expiresAt": "2025-05-14T11:00:00.000Z"
}
```

### 3. 在沙箱中执行代码

在指定沙箱容器中执行代码，支持依赖管理。

```
POST /api/sandbox/exec
```

**请求参数：**

| 参数        | 类型    | 必需 | 描述                                     |
| ----------- | ------- | ---- | ---------------------------------------- |
| containerId | string  | 是   | 容器ID                                   |
| command     | array   | 是   | 要执行的命令及参数                       |
| files       | object  | 否   | 要创建的文件，键为文件路径，值为文件内容 |
| env         | object  | 否   | 环境变量，键为变量名，值为变量值         |
| gitTracking | boolean | 否   | 是否启用Git跟踪（默认为true）            |

**示例请求：**

```bash
curl -X POST http://localhost:3000/api/sandbox/exec \
  -H "Content-Type: application/json" \
  -d '{
    "containerId": "abc123def456...",
    "command": ["node", "index.js"],
    "files": {
      "package.json": "{\"name\":\"test\",\"dependencies\":{\"chalk\":\"^4.1.2\"}}",
      "index.js": "const chalk = require(\"chalk\"); console.log(chalk.green(\"Hello world!\"));"
    },
    "env": {
      "NODE_ENV": "development"
    }
  }'
```

**成功响应：**

```json
{
  "id": "exec_789abc...",
  "status": "success",
  "duration": 1250,
  "stdout": "Hello world!\n",
  "stderr": ""
}
```

### 4. 获取沙箱状态

获取指定容器的状态信息。

```
GET /api/sandbox/:containerId
```

**路径参数：**

| 参数        | 类型   | 描述   |
| ----------- | ------ | ------ |
| containerId | string | 容器ID |

**示例请求：**

```bash
curl -X GET http://localhost:3000/api/sandbox/abc123def456...
```

**成功响应：**

```json
{
  "containerId": "abc123def456...",
  "status": "running",
  "createdAt": "2025-05-14T10:30:00.000Z",
  "expiresAt": "2025-05-14T11:00:00.000Z",
  "resourceUsage": {
    "cpuUsage": "2.50",
    "memoryUsage": "42.3MB"
  }
}
```

### 4. 删除沙箱

删除指定的沙箱容器。

```
DELETE /api/sandbox/:containerId
```

**路径参数：**

| 参数        | 类型   | 描述   |
| ----------- | ------ | ------ |
| containerId | string | 容器ID |

**示例请求：**

```bash
curl -X DELETE http://localhost:3000/api/sandbox/abc123def456...
```

**成功响应：**

```json
{
  "status": "deleted",
  "containerId": "abc123def456..."
}
```

### 5. 下载沙箱文件

从指定的沙箱容器中下载文件内容。

```
GET /api/sandbox/:containerId/file
```

**路径参数：**

| 参数        | 类型   | 描述   |
| ----------- | ------ | ------ |
| containerId | string | 容器ID |

**查询参数：**

| 参数     | 类型   | 必需 | 描述                                                       |
| -------- | ------ | ---- | ---------------------------------------------------------- |
| filePath | string | 是   | 文件路径，可以是相对路径（相对于 /home/sandbox）或绝对路径 |

**示例请求：**

```bash
# 使用相对路径
curl -o data.csv "http://localhost:3000/api/sandbox/abc123def456.../file?filePath=TEST_DATA_100.csv"

# 使用绝对路径
curl -o output.txt "http://localhost:3000/api/sandbox/abc123def456.../file?filePath=/home/sandbox/demo/run-100.js"
```

**成功响应：**

成功时，直接返回文件内容，并设置以下响应头：

- `Content-Disposition: attachment; filename="文件名"`
- `Content-Type: application/octet-stream`

**错误响应示例：**

```json
{
  "error": {
    "code": "FILE_NOT_FOUND",
    "message": "File /home/sandbox/non-existent-file.txt not found in container abc123def456..."
  }
}
```

```json
{
  "error": {
    "code": "FILE_DOWNLOAD_FAILED",
    "message": "Failed to download file from container"
  }
}
```

## Log Endpoint

沙箱环境提供日志的 WebSocket 接口，用于实时获取执行日志和发送交互式命令。

### 连接信息

**WebSocket 端点：** `ws://localhost:3002`

### 客户端到服务器的事件

| 事件名 | 参数 | 描述 |
| ------ | ---- | ---- |

### 服务器到客户端的事件

| 事件名 | 参数 | 描述 |
| ------ | ---- | ---- |

### 使用实例

首先，建立与WebSocket服务器的连接：

```javascript
const socket = io('http://localhost:3000', {
  path: '/sandbox/ws',
  transports: ['websocket', 'polling'],
});

// 监听连接事件
socket.on('connect', () => {
  console.log('Connected to WebSocket server');

  // 加入容器的输出流
  socket.emit('join-container', 'abc123def456...');
});

// 监听容器加入确认
socket.on('container-joined', data => {
  console.log(`Joined container: ${data.containerId}`);
});

// 监听执行输出
socket.on('execution-output', data => {
  console.log(`[${data.type}] ${data.data}`);
});

// 监听执行完成
socket.on('execution-complete', data => {
  console.log(`Execution ${data.executionId} completed with status: ${data.status}, exit code: ${data.exitCode}`);
});

// 监听错误
socket.on('error', data => {
  console.error(`Error: ${data.message}`);
});
```

然后，启动命令执行：

```javascript
// 使用 REST API 启动带实时日志的执行
async function executeWithRealtimeLogs() {
  const response = await fetch('http://localhost:3000/api/sandbox/exec/realtime', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      containerId: 'abc123def456...',
      command: ['python', '-c', 'import time; print("Starting"); time.sleep(1); print("Done")'],
      socketSessionId: socket.id, // 传递WebSocket会话ID
    }),
  });

  return await response.json();
}
```

## 依赖管理

沙箱环境支持自动检测和安装依赖。当请求包含相应的配置文件时，系统会自动安装依赖。

### Node.js 依赖管理

在文件列表中包含 `package.json` 文件：

```json
{
  "files": {
    "package.json": "{\"dependencies\":{\"express\":\"^4.18.2\"}}",
    "app.js": "const express = require('express')..."
  }
}
```

### Python 依赖管理

在文件列表中包含 `requirements.txt` 文件：

```json
{
  "files": {
    "requirements.txt": "requests==2.28.1\nnumpy==1.23.5",
    "script.py": "import requests\nimport numpy as np..."
  }
}
```

## Git 版本控制

沙箱环境自动为每个容器创建一个Git仓库，并在每次执行有文件变更的代码时创建提交。

### 获取Git历史

**示例请求：**

```bash
curl -X GET http://localhost:3000/api/sandbox/history/abc123def456... \
  -H "Content-Type: application/json" \
  -d '{
    "limit": 5
  }'
```

**成功响应：**

```json
[
  {
    "id": "exec_789abc...",
    "commitId": "a1b2c3d4e5f6...",
    "timestamp": "2025-05-14T10:35:25.000Z",
    "message": "Update index.js for execution exec_789abc...",
    "files": ["index.js"]
  },
  {
    "id": "exec_456def...",
    "commitId": "f6e5d4c3b2a1...",
    "timestamp": "2025-05-14T10:32:10.000Z",
    "message": "Initial commit",
    "files": ["README.md"]
  }
]
```

### 回滚到特定执行

**示例请求：**

```bash
curl -X POST http://localhost:3000/api/sandbox/rollback \
  -H "Content-Type: application/json" \
  -d '{
    "containerId": "abc123def456...",
    "executionId": "exec_456def..."
  }'
```

**成功响应：**

```json
{
  "status": "success",
  "message": "Rolled back to execution exec_456def..."
}
```

## 错误代码

| 错误代码                  | 描述                |
| ------------------------- | ------------------- |
| CONTAINER_NOT_FOUND       | 容器未找到          |
| CONTAINER_EXPIRED         | 容器已过期          |
| CONTAINER_CREATION_FAILED | 容器创建失败        |
| CONTAINER_REMOVAL_FAILED  | 容器删除失败        |
| EXECUTION_FAILED          | 代码执行失败        |
| IMAGE_PULL_FAILED         | 无法拉取Docker镜像  |
| INVALID_MEMORY_LIMIT      | 内存限制格式无效    |
| INVALID_CPU_LIMIT         | CPU限制格式无效     |
| GIT_INIT_FAILED           | Git仓库初始化失败   |
| GIT_COMMIT_FAILED         | Git提交失败         |
| GIT_HISTORY_FAILED        | 获取Git历史失败     |
| GIT_ROLLBACK_FAILED       | Git回滚失败         |
| GIT_INSTALLATION_FAILED   | Git安装失败         |
| EXECUTION_NOT_FOUND       | 指定的执行ID未找到  |
| WEBSOCKET_NOT_CONNECTED   | WebSocket未连接     |
| JOIN_CONTAINER_FAILED     | 加入容器失败        |
| MISSING_SOCKET_SESSION    | 缺少WebSocket会话ID |

## 完整示例

以下是一个完整的工作流示例，包括创建容器、执行代码、检查状态和删除容器：

```bash
#!/bin/bash

# 创建容器
CONTAINER_RESPONSE=$(curl -s -X POST http://localhost:3000/api/sandbox \
  -H "Content-Type: application/json" \
  -d '{
    "image": "node:18-alpine",
    "options": {
      "timeout": 300000
    }
  }')
CONTAINER_ID=$(echo $CONTAINER_RESPONSE | jq -r .containerId)
echo "Container created: $CONTAINER_ID"

# 执行代码
EXEC_RESPONSE=$(curl -s -X POST http://localhost:3000/api/sandbox/exec \
  -H "Content-Type: application/json" \
  -d '{
    "containerId": "'"$CONTAINER_ID"'",
    "files": {
      "package.json": "{\"name\":\"test\",\"dependencies\":{\"chalk\":\"^4.1.2\"}}",
      "index.js": "const chalk = require(\"chalk\"); console.log(chalk.blue(\"Hello\"), chalk.green(\"World!\"));"
    },
    "command": ["node", "index.js"]
  }')
echo "Execution result:"
echo $EXEC_RESPONSE | jq .

# 检查容器状态
STATUS_RESPONSE=$(curl -s -X GET http://localhost:3000/api/sandbox/$CONTAINER_ID)
echo "Container status:"
echo $STATUS_RESPONSE | jq .

# 删除容器
DELETE_RESPONSE=$(curl -s -X DELETE http://localhost:3000/api/sandbox/$CONTAINER_ID)
echo "Container deleted:"
echo $DELETE_RESPONSE | jq .
```
