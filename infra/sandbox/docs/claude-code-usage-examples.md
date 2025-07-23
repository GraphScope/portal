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
  "outputFormat": "json"
}
```

**响应示例**:
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

## 输出格式

### 1. JSON 格式 (`"outputFormat": "json"`)
- 返回结构化的 JSON 响应
- 包含会话 ID、成本、执行时间等元数据
- 推荐用于程序化交互

### 2. 文本格式 (`"outputFormat": "text"`)
- 返回纯文本响应
- 适合直接显示给用户

### 3. 流式 JSON 格式 (`"outputFormat": "stream-json"`)
- 实时返回响应片段
- 适合长时间运行的任务
- 每行一个 JSON 对象

## 使用场景示例

### 场景 1: 代码审查和优化
```javascript
// 1. 创建会话进行代码审查
const reviewSession = await fetch('/api/claude/session/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    containerId: 'your-container-id',
    prompt: '请审查以下代码的质量和安全性...',
    outputFormat: 'json'
  })
});

// 2. 继续会话询问具体优化建议
const optimizeResponse = await fetch('/api/claude/session/continue', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    containerId: 'your-container-id',
    prompt: '请提供具体的优化建议',
    outputFormat: 'json'
  })
});
```

### 场景 2: 多轮架构设计
```javascript
// 1. 开始架构设计
const architectureSession = await fetch('/api/claude/session/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    containerId: 'your-container-id',
    prompt: '设计一个微服务架构，包含用户服务、订单服务和支付服务',
    outputFormat: 'json'
  })
});

const sessionId = architectureSession.session_id;

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
```

### 场景 3: 流式响应处理
```javascript
// 使用流式 JSON 处理长时间任务
const streamResponse = await fetch('/api/claude/session/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    containerId: 'your-container-id',
    prompt: '构建一个完整的博客系统，包括前端、后端和数据库设计',
    outputFormat: 'stream-json'
  })
});

// 处理流式响应
const reader = streamResponse.body.getReader();
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const text = new TextDecoder().decode(value);
  const lines = text.split('\n');
  
  for (const line of lines) {
    if (line.trim()) {
      try {
        const data = JSON.parse(line);
        console.log('Received:', data);
      } catch (e) {
        // 忽略非JSON行
      }
    }
  }
}
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

## 注意事项

1. **容器生命周期**: 确保在调用 Claude CLI API 之前容器已经创建并正在运行
2. **会话管理**: 保存 session_id 以便后续恢复会话
3. **资源消耗**: Claude CLI 调用会消耗 API 配额，请合理使用
4. **超时处理**: 长时间运行的任务建议使用流式输出格式
5. **并发限制**: 避免在同一容器中并发执行多个 Claude CLI 命令

## 最佳实践

1. **会话持久化**: 将重要的 session_id 保存到数据库或缓存中
2. **错误重试**: 实现适当的错误重试机制
3. **日志记录**: 记录 Claude CLI 的调用和响应以便调试
4. **成本控制**: 监控 API 调用的成本和频率
5. **响应处理**: 根据不同的输出格式采用相应的解析策略 