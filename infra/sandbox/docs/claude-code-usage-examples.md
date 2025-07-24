# Claude Code Service API 使用示例

本文档介绍如何使用新增的 Claude CLI 功能来创建和管理 Claude 会话。

## API 端点

### 1. 创建新的 Claude 会话

**端点**: `POST /api/claude/session/create`

**请求体**:
```json
{
  "containerId": "container-id-here",
  "prompt": "请帮我设计一个用户认证系统",
  "outputFormat": "json",
  "taskId": "task-12345"
}
```

**参数说明**:
- `containerId` (必需): 容器ID
- `prompt` (必需): 发送给Claude的提示词
- `outputFormat` (可选): 输出格式，支持 "text"、"json"、"stream-json"，默认为 "stream-json"
- `taskId` (可选): 任务ID，用于文件上传和OSS存储路径组织

**响应示例**:

**JSON格式响应** (`outputFormat: "json"`):
```json
{
  "type": "result",
  "subtype": "success",
  "total_cost_usd": 0.003,
  "is_error": false,
  "duration_ms": 1234,
  "duration_api_ms": 800,
  "num_turns": 1,
  "result": "我来帮您设计一个用户认证系统...",
  "session_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**流式响应** (`outputFormat: "stream-json"`):
当使用流式响应时，服务器会返回 Server-Sent Events (SSE) 格式：

```
Content-Type: text/event-stream

data: {"type": "session_start", "session_id": "550e8400-e29b-41d4-a716-446655440000"}

data: {"type": "content", "content": "我来帮您设计", "session_id": "550e8400-e29b-41d4-a716-446655440000"}

data: {"type": "content", "content": "一个用户认证系统", "session_id": "550e8400-e29b-41d4-a716-446655440000"}

data: {"type": "stream_end"}
```

### 2. 恢复特定会话

**端点**: `POST /api/claude/session/resume`

**请求体**:
```json
{
  "containerId": "container-id-here",
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "prompt": "现在添加JWT token验证",
  "outputFormat": "json"
}
```

### 3. 继续最近的会话

**端点**: `POST /api/claude/session/continue`

**请求体**:
```json
{
  "containerId": "container-id-here",
  "prompt": "请添加错误处理",
  "outputFormat": "json"
}
```

### 4. 启动交互式会话

**端点**: `POST /api/claude/session/interactive/{containerId}`

**响应示例**:
```json
{
  "sessionId": "interactive-1703123456789",
  "message": "Interactive Claude session started successfully"
}
```

## 新增功能特性

### 1. 自动文件上传功能

当创建 Claude 会话时提供 `taskId` 参数，系统会在会话完成后自动执行以下操作：

1. **上传 Claude 会话文件**：将 Claude 生成的会话记录文件（.jsonl 格式）上传到 OSS
2. **压缩并上传 Sandbox 文件**：将工作目录中的文件压缩为 ZIP 并上传到 OSS

**OSS 存储路径结构**：
```
{taskId}/{sessionId}/
├── session-file.jsonl    # Claude 会话记录文件
└── sandbox.zip           # Sandbox 工作目录压缩包
```

**文件上传说明**：
- 文件上传是异步进行的，不会阻塞 API 响应
- 只有提供了 `taskId` 参数时才会触发文件上传
- 压缩时会自动排除 `node_modules`、`.venv`、`__pycache__` 等常见的依赖目录
- 上传失败不会影响 Claude 会话的正常执行

### 2. Server-Sent Events (SSE) 支持

对于 `outputFormat: "stream-json"` 的请求，API 会返回 SSE 格式的流式响应，适合实时显示 Claude 的生成过程。

**SSE 事件类型**：
- `session_start`: 会话开始，包含 session_id
- `content`: Claude 生成的内容片段
- `stream_end`: 流结束

## 输出格式

### 1. JSON 格式 (`"outputFormat": "json"`)
- 返回结构化的 JSON 响应
- 包含会话 ID、成本、执行时间等元数据
- 推荐用于程序化交互

### 2. 文本格式 (`"outputFormat": "text"`)
- 返回纯文本响应
- 适合直接显示给用户

### 3. 流式 JSON 格式 (`"outputFormat": "stream-json"`)
- 实时返回响应片段，采用 SSE 格式
- 适合长时间运行的任务
- 支持实时UI更新

## 使用场景示例

### 场景 1: 带文件上传的代码开发会话

```javascript
// 创建带文件上传功能的会话
const createResponse = await fetch('/api/claude/session/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    containerId: 'your-container-id',
    prompt: '请帮我创建一个React Todo应用',
    outputFormat: 'json',
    taskId: 'react-todo-project-001'  // 提供taskId启用文件上传
  })
});

const result = await createResponse.json();
console.log('Session ID:', result.session_id);

// 会话完成后，文件会自动上传到OSS：
// react-todo-project-001/{session_id}/session-file.jsonl
// react-todo-project-001/{session_id}/sandbox.zip
```

### 场景 2: 流式响应处理

```javascript
// 使用 EventSource 处理流式响应
const eventSource = new EventSource('/api/claude/session/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    containerId: 'your-container-id',
    prompt: '构建一个完整的博客系统，包括前端、后端和数据库设计',
    outputFormat: 'stream-json',
    taskId: 'blog-system-dev'
  })
});

eventSource.onmessage = function(event) {
  const data = JSON.parse(event.data);
  
  switch(data.type) {
    case 'session_start':
      console.log('会话开始，Session ID:', data.session_id);
      break;
    case 'content':
      // 实时显示生成的内容
      displayContent(data.content);
      break;
    case 'stream_end':
      console.log('会话结束');
      eventSource.close();
      break;
  }
};

eventSource.onerror = function(error) {
  console.error('SSE连接错误:', error);
  eventSource.close();
};
```

### 场景 3: 使用 fetch API 处理流式响应

```javascript
// 使用 fetch API 处理流式响应
const streamResponse = await fetch('/api/claude/session/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    containerId: 'your-container-id',
    prompt: '构建一个微服务架构的电商系统',
    outputFormat: 'stream-json',
    taskId: 'ecommerce-microservices'
  })
});

// 处理流式响应
const reader = streamResponse.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const text = decoder.decode(value);
  const lines = text.split('\n');
  
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      try {
        const data = JSON.parse(line.slice(6)); // 移除 'data: ' 前缀
        
        if (data.type === 'content') {
          console.log('接收到内容:', data.content);
        } else if (data.type === 'session_start') {
          console.log('会话开始:', data.session_id);
        }
      } catch (e) {
        // 忽略非JSON行
      }
    }
  }
}
```

### 场景 4: 多轮架构设计
```javascript
// 1. 开始架构设计
const architectureSession = await fetch('/api/claude/session/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    containerId: 'your-container-id',
    prompt: '设计一个微服务架构，包含用户服务、订单服务和支付服务',
    outputFormat: 'json',
    taskId: 'microservice-architecture-design'
  })
});

const sessionResult = await architectureSession.json();
const sessionId = sessionResult.session_id;

// 2. 详细设计某个服务
const detailDesign = await fetch('/api/claude/session/resume', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    containerId: 'your-container-id',
    sessionId: sessionId,
    prompt: '请详细设计用户服务的API接口',
    outputFormat: 'json'
  })
});

// 注意：文件上传功能只在创建会话时触发，恢复会话不会重新上传文件
```

## 错误处理

API 会返回标准的错误响应：

```json
{
  "error": {
    "code": "CLAUDE_SESSION_CREATION_FAILED",
    "message": "Failed to create Claude session: container not found",
    "details": {
      "containerId": "invalid-container-id"
    }
  }
}
```

常见错误码：
- `CLAUDE_PROMPT_REQUIRED`: 创建会话时未提供 prompt
- `CLAUDE_SESSION_ID_REQUIRED`: 恢复会话时未提供 session ID
- `CLAUDE_SESSION_CREATION_FAILED`: 会话创建失败
- `CLAUDE_SESSION_RESUME_FAILED`: 会话恢复失败
- `CLAUDE_SESSION_CONTINUE_FAILED`: 会话继续失败
- `CLAUDE_STREAM_START_FAILED`: 流式会话启动失败
- `CLAUDE_STREAM_NO_STREAM`: 流式响应无法获取流

## 注意事项

1. **容器生命周期**: 确保在调用 Claude CLI API 之前容器已经创建并正在运行
2. **会话管理**: 保存 session_id 以便后续恢复会话
3. **资源消耗**: Claude CLI 调用会消耗 API 配额，请合理使用
4. **超时处理**: 长时间运行的任务建议使用流式输出格式
5. **并发限制**: 避免在同一容器中并发执行多个 Claude CLI 命令
6. **文件上传**: 只有在创建会话时提供 taskId 才会启用自动文件上传功能
7. **存储空间**: 上传的文件会占用OSS存储空间，请定期清理不需要的文件

## 最佳实践

1. **会话持久化**: 将重要的 session_id 保存到数据库或缓存中
2. **错误重试**: 实现适当的错误重试机制
3. **日志记录**: 记录 Claude CLI 的调用和响应以便调试
4. **成本控制**: 监控 API 调用的成本和频率
5. **响应处理**: 根据不同的输出格式采用相应的解析策略
6. **文件管理**: 合理使用 taskId 来组织上传的文件，便于后续管理和查找
7. **流式处理**: 对于长时间运行的任务，使用流式响应提供更好的用户体验
8. **资源清理**: 定期清理过期的容器和上传的文件，避免资源浪费 