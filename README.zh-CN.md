<!-- <h1 align="center">
    <img src="https://graphscope.io/assets/images/graphscope-logo.svg" width="400" alt="graphscope-logo">
</h1>

<p align="center">
   专为 GraphScope 设计的，基于 Web 的用户交互工具
</p>

<div align="center"> -->

<!-- [![Version](https://badgen.net/npm/v/@graphscope/studio-query)](https://www.npmjs.com/@graphscope/studio-query)

![Latest commit](https://badgen.net/github/last-commit/graphscope/portal)
   -->
</div>

# GraphScope Portal

专为 GraphScope 设计的，基于 Web 的用户交互工具

<img src="https://gw.alipayobjects.com/zos/antfincdn/R8sN%24GNdh6/language.svg" width="18"> [English](/docs/README.md) | 简体中文

GraphScope Portal 是一款专为 GraphScope 设计的，基于 Web 的用户交互工具，旨在一站式简化图数据管理流程。它集成了数据建模、导入、查询与监控功能，全面支持 GraphScope Flex 架构下 Interactive 与 Insight 计算引擎。

![query](https://img.alicdn.com/imgextra/i3/O1CN015kMEu71soPJ8fuhy2_!!6000000005813-0-tps-3424-1636.jpg)

## 快速开始

### 方式一：使用 Docker 镜像

```bash
# 拉取镜像
docker pull  ghcr.io/graphscope/portal:latest
```

# 运行容器

```bash
docker run -it \
--name my-portal \
-p 8888:8888 \
-e COORDINATOR=http://host.docker.internal:8080 \
ghcr.io/graphscope/portal:latest
```

> 启动参数说明

- `COORDINATOR` 是 GraphScope 引擎地址,如果你也在本地用 docker 启动了 GraphScope 引擎，可以直接使用 `host.docker.internal:8080` 作为 `COORDINATOR` 参数。
- `PORT` 是前端服务端口号,默认为 `8888`.

### 方式二：使用源码编译（本机或者云主机都可）

环境准备：请确保本地安装 [node.js](https://nodejs.org/en) 和 [pnpm](https://pnpm.io/installation#using-npm)

```bash
# 编译前端产物
npm run ci
cd packages/studio-website/server
# 启动前端服务
npm run dev -- --port=8888 --coordinator=<graphscope_coordinator_endpoint> --cypher_endpoint=<graphscope_cypher_endpoint>
```

## 核心功能

### 数据建模

GraphScope Portal 支持用户手动构建图模型，您可以点击「添加节点」创建点类型，也可以通过「拖拽节点边缘」创建边类型。整个过程就像是在白板上自由手绘，高效简洁。同时 Portal 也支持通过解析用户的 CSV,JSON 等数据文件，自动推测生成图模型。

![modeling](https://img.alicdn.com/imgextra/i1/O1CN01Msfdm820qFpaF6Ku6_!!6000000006900-0-tps-3572-1912.jpg)

### 数据导入

GraphScope Portal 支持用户按照点边模型，单次或批量绑定数据文件。针对 CSV 文件，提供本地上传并解析字段映射的功能。也支持也支持用过通过 yaml 配置文件一键导入数据

![importing](https://img.alicdn.com/imgextra/i2/O1CN01VZlwwK1K5nnW6MPF7_!!6000000001113-0-tps-3554-1914.jpg)

### 交互式查询

当数据准备就绪之后，GraphScope Portal 提供了「交互式查询」模块，该模块拥有强大的代码编辑器，多种查询方式，以及丰富的可视化

强大的编辑器：支持 Cypher / Gremlin 的语法补全，高亮，方便用户编辑，修改。

多种查询方式：支持用户编写保存图查询语句，回溯历史记录，根据 Schema 推荐查询，和基于 openai 的自然语言查询功能。

丰富的可视化：支持 Graph / Table 的两种展示模式，Graph模式支持 2D/3D 展示，高效的渲染引擎，支持用户自定义点边的颜色，大小，字体等样式，也支持通过「切换图表」进一步洞察数据。

### 扩展机制

GraphScope Portal 提供「插件集成」模块， 支持「存储过程」，「图算法」以插件的形式导入并使用，也提供「个性化配置」：支持语言切换，主题切换，支持定制主题色和其他细节。

其前端模块，不仅支持用户在 Web UI 上使用，也支持集成在 Jupyter Notebook 中使用。

## 其他参考

- [👏 共建指南 👏]('./CONTRIBUTING.zh-CN.md')
- [ 🔧 组件库](https://portal-bim.pages.dev/)

## 许可证

GraphScope Portal 采用 Apache License 2.0 开源许可协议发布，鼓励对软件进行修改、分发及商业应用，同时保护贡献者的权益
