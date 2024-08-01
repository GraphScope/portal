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
