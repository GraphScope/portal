# Claude Code CLI 多轮对话用法指南

基于 ClaudeCodeSDK 文档，本指南详细介绍 Claude Code CLI 在多轮对话场景下的核心用法。

## 1. 会话管理 (Session Management)

### 1.1 创建和继续对话

**继续最近的对话**
```bash
# 继续最近的对话
claude --continue

# 继续并提供新的prompt
claude --continue "现在为此代码添加错误处理"
claude --continue "请优化这个函数的性能"
```

**恢复特定会话**
```bash
# 通过session ID恢复特定对话
claude --resume 550e8400-e29b-41d4-a716-446655440000

# 在非交互模式下恢复并执行新任务
claude -p --resume 550e8400-e29b-41d4-a716-446655440000 "更新测试用例"
claude -p --resume abc123 "重构数据库连接逻辑"
```

### 1.2 会话识别和管理

- 每个会话都有唯一的 `session_id`
- 会话 ID 在响应的 JSON 格式中返回
- 可以通过会话 ID 在任何时间点恢复对话
- 支持多个并发会话

## 2. 输出格式配置 (Output Formats)

### 2.1 文本输出 (默认格式)

```bash
# 标准文本输出
claude -p "解释 src/components/Header.tsx 文件的功能"
claude -p "这个API接口的设计有什么问题？"
```

### 2.2 JSON格式输出

```bash
# 结构化JSON输出
claude -p "数据层是如何工作的？" --output-format json
claude -p "分析代码质量" --output-format json
```

**JSON响应结构：**
```json
{
  "type": "result",
  "subtype": "success", 
  "total_cost_usd": 0.003,
  "is_error": false,
  "duration_ms": 1234,
  "duration_api_ms": 800,
  "num_turns": 6,
  "result": "模型的完整响应内容...",
  "session_id": "abc123"
}
```

### 2.3 流式JSON输出 (Streaming JSON Output)

```bash
# 实时流式响应
claude -p "构建一个完整的Web应用程序" --output-format stream-json
claude -p "重构整个项目架构" --output-format stream-json
```

**流式输出特性：**
- 以 `init` 系统消息开始
- 实时输出用户和助手消息片段
- 每条消息作为独立的JSON对象发送
- 以包含统计信息的 `result` 消息结束
- 适合长时间运行的复杂任务

## 3. 多轮对话关键环节

### 3.1 创建初始会话

```bash
# 使用prompt创建新会话
claude -p "请帮我设计一个用户认证系统"

# 交互模式创建会话
claude
> 请分析当前项目的架构设计
```

### 3.2 会话上下文维护

```bash
# 方法1: 继续最近的对话
claude --continue "现在添加JWT token验证"

# 方法2: 恢复特定会话并继续
claude --resume $SESSION_ID "实现用户权限管理"

# 方法3: 在同一会话中追加多个任务
claude --continue "添加单元测试"
claude --continue "优化数据库查询"
claude --continue "添加API文档"
```

### 3.3 流式输出处理

```bash
# 启动流式对话
claude -p "开发一个完整的博客系统" --output-format stream-json | while read -r line; do
  echo "收到: $line"
  # 实时处理每个JSON消息
done
```
