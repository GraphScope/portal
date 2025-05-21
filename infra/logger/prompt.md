# 需求一：

请你帮我实现一个基于 winston 的 logger 工具，它的 API 与 winston 的 API 完全相同，区别只是在于，它可以同步输出信息到3个地方，第一个是 stdout，第二个是本地文件，第三个是 websocket

- stdout 标准输出
- file：可以放在本地文件夹，比如 /tmp/logs/app.log
- websocket: 可以是一个 websocket 地址，比如 ws://localhost:3000/ws ，只要订阅的 websocket 就能收到流式信息

技术上请采用 nodejs+ winston + socket.io 为主要技术栈，写法用typescript,要求你写出测试用例，以及curl 用法

## 测试demo：

1. 使用 nodejs + express + logger + socket.io 实现一个简单的http服务，服务端用logger记录一些信息，客户端用curl调用服务端接口，并观察服务端输出的日志

2. 使用 vite + react 给我做一个简单的测试网页，在前端通过fetch 请求 服务端接口，并观察服务端输出的日志，同时，在客户端端用socket.io 订阅服务端的日志，并实时显示在网页的logs区域

3. 整个demo都放在examples 文件夹下

---

# 需求二：

1. 为了降低用户的使用门槛，我们是否可以将 `examples/server/log-socket-server.ts` 内置为 logger 的源码，即 logger 可以默认启动一个专门的日志服务。

2. logger 增加分组过滤功能，比如，对于输出到 stdout 的日志，我们希望只输出 `info` 及以上级别的日志；对于输出到 socket 的日志，我们希望只输出匹配到对应 `containerId` 的日志；对于输出到 file 的日志，我们希望只输出匹配到对应 `containerId` 的日志。比如 logs/container-id-1.log 只输出 containerId 为 1 的日志，logs/container-id-2.log 只输出 containerId 为2 的日志。
