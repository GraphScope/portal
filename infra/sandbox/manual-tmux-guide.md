# 手动使用 tmux 管理沙箱服务

本文档介绍如何直接使用 tmux 命令行工具来手动管理沙箱服务，无需依赖管理脚本。适合希望深入了解 tmux 或需要更灵活控制的用户。

## 前提条件

- 已安装 tmux (`sudo apt-get install tmux` 或 `sudo yum install tmux`)
- 已完成沙箱服务的部署和构建

## 基本 tmux 命令参考

| 命令                              | 描述                     |
| --------------------------------- | ------------------------ |
| `tmux new-session -s <名称>`      | 创建新的会话             |
| `tmux attach -t <名称>`           | 连接到已存在的会话       |
| `tmux list-sessions` 或 `tmux ls` | 列出所有会话             |
| `tmux kill-session -t <名称>`     | 终止指定会话             |
| `tmux info`                       | 显示 tmux 服务器详细信息 |

## 手动启动沙箱服务的步骤

### 1. 创建新的 tmux 会话

```bash
# 创建一个名为 sandbox-session 的新会话
tmux new-session -s sandbox-session
```

此命令会创建一个新的 tmux 会话，并将您的终端连接到该会话。

### 2. 导航到正确的目录

在新创建的 tmux 会话中，导航到沙箱服务的目录：

```bash
cd ./portal/infra/sandbox
```

### 3. 启动沙箱服务

在 tmux 会话中执行以下命令启动服务：

```bash
# 启动沙箱服务
node dist/lib/index.js
```

### 4. 从会话中分离

服务启动后，按下 `Ctrl+B` 然后按 `D` 从会话中分离。这样服务会继续在后台运行，即使您关闭终端或断开 SSH 连接。

## 查看服务状态和日志

### 列出所有会话

```bash
# 以下两个命令是等效的
tmux list-sessions
tmux ls
```

### 重新连接到会话

```bash
tmux attach -t sandbox-session
```

这会将您的终端重新连接到运行沙箱服务的会话，让您可以查看输出和日志。

这个命令会每秒刷新一次，显示所有 tmux 会话的最新状态，对于监控服务运行非常有用。

### 停止服务

1. 重新连接到会话：

   ```bash
   tmux attach -t sandbox-session
   ```

2. 在会话中按 `Ctrl+C` 终止 Node.js 进程

3. 关闭会话（可选）：
   ```bash
   exit
   ```
   或者使用 `Ctrl+D`

### 终止会话

如果需要强制终止会话：

```bash
tmux kill-session -t sandbox-session
```

这会终止会话和其中运行的所有进程。

## tmux 内的操作

一旦进入 tmux 会话，您可以使用以下快捷键：

- `Ctrl+B` 然后 `D` - 分离会话（保持后台运行）
- `Ctrl+B` 然后 `[` - 进入滚动模式（使用方向键/PageUp/PageDown查看历史日志）
- `Ctrl+B` 然后 `?` - 显示所有快捷键帮助
- `Ctrl+B` 然后 `C` - 创建新窗口
- `Ctrl+B` 然后 `0-9` - 切换到对应编号的窗口
- `Ctrl+B` 然后 `%` - 水平分割窗口
- `Ctrl+B` 然后 `"` - 垂直分割窗口

## 切换和管理多个窗口

一个 tmux 会话中可以有多个窗口，这对于同时监控日志和执行命令很有用：

1. 在 tmux 会话中，按 `Ctrl+B` 然后 `C` 创建新窗口
2. 使用 `Ctrl+B` 然后 `0-9` 在窗口间切换
3. 使用 `Ctrl+B` 然后 `n`（下一个）或 `p`（上一个）切换窗口

## 实用技巧

### 查看日志但不附加到会话

```bash
tmux capture-pane -pt sandbox-session | tail -n 100
```

这个命令会捕获会话的当前内容并显示最后 100 行。

### 服务崩溃但会话仍存在

如果服务进程崩溃，tmux 会话可能仍在运行。重新连接并启动服务：

```bash
tmux attach -t sandbox-session
# 然后启动服务
node dist/lib/index.js
```
