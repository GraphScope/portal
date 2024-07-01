🎉 欢迎共建 GraphScope Portal 项目

## 技术架构

graphscope portal 采用 pnpm 多包架构，核心技术模块有

| Subpackage      | Description                                                                |
| --------------- | -------------------------------------------------------------------------- |
| studio-server   | 采用 open api 的自动接口生成，用于 Portal 的接口请求                       |
| studio-importor | 数据建模和导入模块，支持可视化建模                                         |
| studio-query    | 数据查询模块，支持 Cypher 和 Gremlin 两种语法                              |
| studio-site     | portal 主站点                                                              |
| gsp             | 基于 python 的封装包，可以在jupyternote，gradio 中调用portla建模，查询模块 |

## 开发指南

### 环境准备

- 安装 node.js : https://nodejs.org/en
- 安装 pnpm : https://pnpm.io/installation#using-npm `npm install -g pnpm`

### 安装依赖

```bash
pnpm install
```

- 编译子包

```bash
npm run start

```

### 本地运行 portal 站点

```bash
cd packages/studio-website
npm run start
```

## 部署指南

在根目录下执行:

编译前端产物

`npm run ci`

初次部署

`npm run deploy -- --proxy=http://x.x.x.x --port=8888`

解释：

- `proxy` 指定 GraphScope 引擎的部署地址，默认为 http://127.0.0.1:8080。
- `port` 设置前端服务端口，默认为 8888。

- 查看日志

`npm run logs`

- 重新部署

`npm run re-deploy -- --proxy=http://x.x.x.x --port=8888`

## 部署指南

在根目录下执行:

编译前端产物

`npm run ci`

启动前端托管服务

```bash
cd packages/studio-website/proxy
npm run start -- --cypher_endpoint=http://127.0.0.1:7687 --proxy=http://127.0.0.1:8080
```

explanation:

- `proxy` GraphScope的引擎地址，默认是 `http://127.0.0.1:8080`.
- `port` 是前端服务端口号 `8888`.
- `cypher_endpoint` 是GraphScope Interactive 引擎的查询地址，默认为 `http://127.0.0.1:7687`.
