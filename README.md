# GraphScope Portal

A web-based management tool for GraphScope

<!-- [![Version](https://badgen.net/npm/v/@graphscope/studio-query)](https://www.npmjs.com/@graphscope/studio-query)
![Latest commit](https://badgen.net/github/last-commit/graphscope/portal) -->

<img src="https://gw.alipayobjects.com/zos/antfincdn/R8sN%24GNdh6/language.svg" width="18"> English | [简体中文](./README.zh-CN.md)

GraphScope Portal is a user-friendly web interface that simplifies managing graph data with GraphScope. It offers one-stop access to data modeling, importing, querying, and monitoring, catering to both Interactive and Insight engines within the GraphScope Flex architecture.

## Core Features

### Data Modeling

Supports users to manually create vertex and edge types, as well as automatically generating graph models through CSV and SQDDL files.

![modeling](https://img.alicdn.com/imgextra/i2/O1CN01rCtTYy1ryeXesYuT5_!!6000000005700-0-tps-3490-1918.jpg)

### Data Importing

Supports local CSV file uploads with dropdown field mapping selection. Also allows one-click data import through YAML configuration files.

![importing](https://img.alicdn.com/imgextra/i2/O1CN01uqf3lF1Kudkh0dbvR_!!6000000001224-0-tps-3472-1894.jpg)

### Interactive Querying

- Powerful Editor: Provides syntax completion and highlighting for Cypher and Gremlin, facilitating easy editing and modification by users.
- Multiple Query Methods: Allows users to write and save graph queries, browse query history, receive schema-based recommendations, and leverage natural language querying powered by OpenAI.
- Rich Visualization: Presents results in Graph or Table view modes, with user customization of node/edge colors, sizes, caption styles, and further data insights through "Switch Chart" functionality.

![querying](https://img.alicdn.com/imgextra/i4/O1CN01la3ZwB1HXn95Thc7C_!!6000000000768-0-tps-3518-1904.jpg)

### Extensibility

- Plugin Integration: Supports incorporating "stored procedures" and "graph algorithms" as plugins for seamless use.
- Customization: Offers language switching, theme switching, and the ability to tailor theme colors and other details to individual preferences.

## Quick start

```bash
docker pull  registry.cn-hongkong.aliyuncs.com/graphscope/portal:latest
```

## [👏 Contrubuting]('./CONTRIBUTING.md')

## [ 🔧 Components](https://portal-bim.pages.dev/)

## License

GraphScope Portal is licensed under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0). Please note that third-party dependencies may not have the same license as GraphScope Portal.
