# GraphScope Portal

A web-based management tool for GraphScope

[![Version](https://badgen.net/npm/v/@graphscope/studio-query)](https://www.npmjs.com/@graphscope/studio-query)
![Latest commit](https://badgen.net/github/last-commit/graphscope/portal)

<img src="https://gw.alipayobjects.com/zos/antfincdn/R8sN%24GNdh6/language.svg" width="18"> English | [简体中文](./README.zh-CN.md)

GraphScope Portal is a user-friendly web interface that simplifies managing graph data with GraphScope. It offers one-stop access to data modeling, importing, querying, and monitoring, catering to both Interactive and Insight engines within the GraphScope Flex architecture.

## Core Features

### Data Modeling

Enables users to manually construct node and edge types, as well as quickly build models via YAML configuration files.

### Data Import

Supports uploading local CSV files, with dropdown field mapping selection. Also allows one-click data import through YAML configuration files.

### Interactive Querying

- Powerful Editor: Provides syntax completion and highlighting for Cypher and Gremlin, facilitating easy editing and modification by users.
- Multiple Query Methods: Allows users to write and save graph queries, browse query history, receive schema-based recommendations, and leverage natural language querying powered by OpenAI.
- Rich Visualization: Presents results in Graph or Table view modes, with user customization of node/edge colors, sizes, caption styles, and further data insights through "Switch Chart" functionality.

### Extensibility

- Plugin Integration: Supports incorporating "stored procedures" and "graph algorithms" as plugins for seamless use.
- Customization: Offers language switching, theme switching, and the ability to tailor theme colors and other details to individual preferences.

## Common components

- https://portal-bim.pages.dev/

## Development

### Perpare

- install node.js : https://nodejs.org/en
- install pnpm : https://pnpm.io/installation#using-npm `npm install -g pnpm`

### install dependencies

```bash
pnpm install
```

- build sub packages and watching

```bash
npm run start

```

### run portal website

```bash
cd packages/studio-website
npm run start
```

## Deployment

Execute this command in the root directory:

Compile front-end assets

`npm run ci`

Initial deployment of the service:

```bash
cd packages/studio-website/proxy
npm run start -- --cypher_endpoint=127.0.0.1:7687 --proxy=127.0.0.1:8080
```

explanation:

- `proxy` is the deployment address of the graphscope engine, defaulting to `http://127.0.0.1:8080`.
- `port` is the port of the service front-end, defaulting to `8888`.
- `cypher_endpoint` is the Cypher endpoint of the graphscope interactive engine, defaulting to `http://127.0.0.1:7687`.

## Technical Architecture

GraphScope Portal utilizes a multi-package architecture powered by pnpm, with key technology modules comprising:

| Subpackage      | Description                                              |
| --------------- | -------------------------------------------------------- |
| studio-server   | Auto-generates Open API interfaces for Portal requests   |
| studio-importor | Data modeling and import module with visual capabilities |
| studio-query    | Data querying module supporting Cypher and Gremlin       |
| studio-site     | Main portal website                                      |
| studio-sdk-py   | WIP: Enables usage within JupyterLab                     |

- Start Frontend Component Package

```bash
npm run docs
```

## License

GraphScope Portal is licensed under the Apache License 2.0, an open-source software license encouraging modification, distribution, and commercial use while protecting contributors' rights.
