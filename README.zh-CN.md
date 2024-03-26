<h1 align="center">
    <img src="https://graphscope.io/assets/images/graphscope-logo.svg" width="400" alt="graphscope-logo">
</h1>

<p align="center">
   专为 GraphScope 设计的，基于 Web 的用户交互工具
</p>

<div align="center">
  
[![Version](https://badgen.net/npm/v/@graphscope/studio-query)](https://www.npmjs.com/@graphscope/studio-query)
 
![Latest commit](https://badgen.net/github/last-commit/graphscope/portal)
  
</div>

<img src="https://gw.alipayobjects.com/zos/antfincdn/R8sN%24GNdh6/language.svg" width="18"> [English](/docs/README.md) | 简体中文

GraphScope Portal 是一款专为 GraphScope 设计的，基于 Web 的用户交互工具，旨在一站式简化图数据管理流程。它集成了数据建模、导入、查询与监控功能，全面支持 GraphScope Flex 架构下 Interactive 与 Insight 计算引擎。

## 核心功能

- 数据建模

支持用户手动构建节点和边的类型，也支持用户通过 yaml 配置文件快速构建模型

- 数据导入

支持本地 CSV 文件上传，下拉选择字段映射。也支持用过通过 yaml 配置文件一键导入数据

- 交互式查询

  - 强大的编辑器：支持 Cypher / Gremlin 的语法补全，高亮，方便用户编辑，修改。
  - 多种查询方式：支持用户编写保存图查询语句，回溯历史记录，根据 Schema 推荐查询，和基于 openai 的自然语言查询功能。
  - 丰富的可视化：支持 Graph / Table 的两种展示模式，支持用户自定义点边的颜色，大小，字体等样式，也支持通过「切换图表」进一步洞察数据。

- 扩展机制

  - 插件集成： 支持「存储过程」，「图算法」以插件的形式导入并使用
  - 个性化：支持语言切换，主题切换，支持定制主题色和其他细节

## 快速开始

- 启动 Insight 引擎

```bash
docker pull <insight-engine-image>
```

- 启动 Interactive 引擎

```bash
docker pull <interactive-engine-image>
```

## 本地开发

- 准备工作

  - 安装 node.js : https://nodejs.org/en
  - 安装 pnpm : https://pnpm.io/installation#using-npm `npm install -g pnpm`

- 安装依赖

```bash
pnpm install

```

- 编译子包

```bash
npm run start
```

- 启动 Portal 前端洁面

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

## 技术架构

graphscope portal 采用 pnpm 多包架构，核心技术模块有

| Subpackage      | Description                                          |
| --------------- | ---------------------------------------------------- |
| studio-server   | 采用 open api 的自动接口生成，用于 Portal 的接口请求 |
| studio-importor | 数据建模和导入模块，支持可视化建模                   |
| studio-query    | 数据查询模块，支持 Cypher 和 Gremlin 两种语法        |
| studio-site     | portal 主站点                                        |
| studio-sdk-py   | 正在建设中: 未来将支持在 JupyterLab 中使用 portal    |

- 启动 Portal 中的前端组件包

```
npm run docs
```

## 许可证

GraphScope Portal 采用 Apache License 2.0 开源许可协议发布，鼓励对软件进行修改、分发及商业应用，同时保护贡献者的权益
