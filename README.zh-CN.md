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

支持用户手动构建节点和边的类型，也支持用户通过 CSV，SQDDL 文件，自动推测生成图模型

![modeling](https://img.alicdn.com/imgextra/i2/O1CN01rCtTYy1ryeXesYuT5_!!6000000005700-0-tps-3490-1918.jpg)

- 数据导入

支持本地 CSV 文件上传，下拉选择字段映射。也支持用过通过 yaml 配置文件一键导入数据
![importing](https://img.alicdn.com/imgextra/i2/O1CN01uqf3lF1Kudkh0dbvR_!!6000000001224-0-tps-3472-1894.jpg)

- 交互式查询

  - 强大的编辑器：支持 Cypher / Gremlin 的语法补全，高亮，方便用户编辑，修改。
  - 多种查询方式：支持用户编写保存图查询语句，回溯历史记录，根据 Schema 推荐查询，和基于 openai 的自然语言查询功能。
  - 丰富的可视化：支持 Graph / Table 的两种展示模式，支持用户自定义点边的颜色，大小，字体等样式，也支持通过「切换图表」进一步洞察数据。
    ![querying](https://img.alicdn.com/imgextra/i4/O1CN01la3ZwB1HXn95Thc7C_!!6000000000768-0-tps-3518-1904.jpg)

- 扩展机制

  - 插件集成： 支持「存储过程」，「图算法」以插件的形式导入并使用
  - 个性化：支持语言切换，主题切换，支持定制主题色和其他细节

## 快速开始

```bash
docker pull  registry.cn-hongkong.aliyuncs.com/graphscope/portal:latest
```

## [👏 共建指南 👏]('./CONTRIBUTING.zh-CN.md')

## [ 🔧 组件库](https://portal-bim.pages.dev/)

## 许可证

GraphScope Portal 采用 Apache License 2.0 开源许可协议发布，鼓励对软件进行修改、分发及商业应用，同时保护贡献者的权益
