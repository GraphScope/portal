# Socket.IO + Docker 容器终端服务方案

## 1. 系统架构概述

- **前端**：xterm.js 终端模拟器 + Socket.IO 客户端
- **后端**：Node.js + Socket.IO 服务器 + Docker 容器管理
- **目标**：用户通过 Web 页面终端访问指定 Docker 容器

```
用户 <-> xterm.js <-> Socket.IO 客户端 <-> Socket.IO 服务器 <-> Docker 容器
```

---

## 2. Socket.IO vs WebSocket 对比

| 特性          | Socket.IO             | WebSocket     |
| ------------- | --------------------- | ------------- |
| 自动重连      | 支持                  | 需手动实现    |
| 房间/命名空间 | 支持                  | 需手动实现    |
| 消息类型      | 丰富（事件/二进制等） | 仅文本/二进制 |
| 兼容性        | 更好                  | 需兼容性处理  |
| 心跳检测      | 内置                  | 需手动实现    |
| API 友好性    | 更高                  | 较底层        |
| 实现成本      | 低                    | 高            |

**结论**：Socket.IO 更适合快速开发和维护，功能更丰富。

---

## 3. 关键模块与实现思路

### 3.1 会话管理模块
- 负责维护用户与容器终端的映射关系
- 管理 Socket.IO 连接生命周期

**原型代码：**
```js
// sessionManager.js
const sessions = new Map();

function createSession(socketId, containerId, ptyProcess) {
  sessions.set(socketId, { containerId, ptyProcess });
}

function getSession(socketId) {
  return sessions.get(socketId);
}

function removeSession(socketId) {
  sessions.delete(socketId);
}

module.exports = { createSession, getSession, removeSession };
```

### 3.2 Docker 容器管理模块
- 负责容器的创建、连接、销毁
- 通过 Docker API 或命令行与容器交互

**原型代码：**
```js
// dockerManager.js
const { exec } = require('child_process');

function execInContainer(containerId, cmd, onData) {
  // 通过 docker exec 启动 shell
  const child = exec(`docker exec -ti ${containerId} bash`, { stdio: 'pipe' });
  child.stdout.on('data', onData);
  child.stderr.on('data', onData);
  return child;
}

module.exports = { execInContainer };
```

### 3.3 终端通信模块
- 负责前端与后端的双工通信
- 处理终端输入输出、窗口大小调整等

**原型代码：**
```js
// server.js (核心 Socket.IO 逻辑)
const io = require('socket.io')(server);
const pty = require('node-pty');
const { execInContainer } = require('./dockerManager');
const { createSession, getSession, removeSession } = require('./sessionManager');

io.on('connection', (socket) => {
  socket.on('start-terminal', ({ containerId }) => {
    // 启动 docker exec 伪终端
    const shell = pty.spawn('docker', ['exec', '-ti', containerId, 'bash'], {
      name: 'xterm-color',
      cols: 80,
      rows: 24,
      cwd: process.env.HOME,
      env: process.env
    });
    createSession(socket.id, containerId, shell);
    shell.on('data', (data) => socket.emit('output', data));
    socket.on('input', (data) => shell.write(data));
    socket.on('resize', ({ cols, rows }) => shell.resize(cols, rows));
    socket.on('disconnect', () => {
      shell.kill();
      removeSession(socket.id);
    });
  });
});
```

### 3.4 前端集成 xterm.js
- 通过 Socket.IO 客户端与后端通信
- 处理终端输入输出、窗口调整

**原型代码：**
```js
// 前端 terminal.js
import { Terminal } from 'xterm';
import io from 'socket.io-client';

const term = new Terminal();
term.open(document.getElementById('terminal'));
const socket = io('http://localhost:3000');

socket.emit('start-terminal', { containerId: 'your-container-id' });
socket.on('output', data => term.write(data));
term.onData(data => socket.emit('input', data));
window.addEventListener('resize', () => {
  socket.emit('resize', { cols: term.cols, rows: term.rows });
});
```

---

## 4. 安全与扩展性设计

### 4.1 安全措施
- 用户认证（如 JWT）
- 容器访问权限校验
- 命令执行白名单
- 通信加密（HTTPS/WSS）

### 4.2 扩展性
- 支持多用户多会话
- 支持容器池和资源隔离
- 支持终端会话录制与回放
- 支持水平扩展和负载均衡

---

## 5. 总结

- Socket.IO 方案开发效率高，易于维护和扩展
- 结合 xterm.js 可快速实现 Web 终端访问 Docker 容器
- 需重点关注安全和资源管理

---

## 6. 后端现有代码改造与扩展计划

### 6.1 服务入口与Socket.IO集成
- 在 `infra/sandbox/src/server.ts` 中集成 Socket.IO 服务，复用现有 HTTP server。
- 启动 Socket.IO 服务并监听终端相关事件（如 start-terminal、input、resize、disconnect）。
- 保持 Express API 与 Socket.IO 服务并存。

### 6.2 终端会话管理
- 新增 `infra/sandbox/src/terminal/session-manager.ts`，用于管理 socketId <-> 容器终端伪终端（pty）映射。
- 支持多用户多会话隔离，断开连接时自动清理资源。

### 6.3 容器终端伪终端支持
- 在 `infra/sandbox/src/services/container-service.ts` 中扩展，支持通过 Docker API 创建并管理 attach/exec 伪终端（推荐 node-pty 或 dockerode 的 exec/attach）。
- 提供创建、写入、关闭终端的接口，便于 Socket.IO 事件调用。

### 6.4 终端Socket事件与数据流
- 新建 `infra/sandbox/src/terminal/terminal-socket.ts`，实现 Socket.IO 事件处理：
  - `start-terminal`：启动指定容器的终端会话，返回初始输出。
  - `input`：将前端输入写入pty。
  - `resize`：调整终端窗口大小。
  - `disconnect`：清理会话和pty资源。
- 终端输出通过 `output` 事件实时推送给前端。

### 6.5 API与权限扩展
- 在 `infra/sandbox/src/controllers/sandbox-controller.ts` 增加终端相关API（如获取终端状态、关闭终端等，REST或Socket均可）。
- 在 `infra/sandbox/src/services/container-service.ts` 增加终端attach/exec相关方法。
- 增加权限校验，确保用户只能访问有权限的容器终端。

### 6.6 依赖与环境
- package.json 增加 `socket.io`、`node-pty` 等依赖。
- 如需支持多平台，注意 node-pty 的编译和兼容性。

### 6.7 其他可选扩展
- 支持终端会话录制与回放。
- 支持终端多路复用（如tmux/screen）。
- 支持终端日志持久化。

---

> 以上为后端主要改造与扩展actions，建议先实现Socket.IO服务与最小终端通信闭环，再逐步完善安全、权限、扩展性等。

---

> 以上为整体方案设计与关键实现原型，后续可按模块细化完善。
