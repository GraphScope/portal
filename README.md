# GraphScope Portal

A web-based management tool for GraphScope

<!-- [![Version](https://badgen.net/npm/v/@graphscope/studio-query)](https://www.npmjs.com/@graphscope/studio-query)
![Latest commit](https://badgen.net/github/last-commit/graphscope/portal) -->

<img src="https://gw.alipayobjects.com/zos/antfincdn/R8sN%24GNdh6/language.svg" width="18"> English | [简体中文](./README.zh-CN.md)

GraphScope Portal is a user-friendly web interface that simplifies managing graph data with GraphScope. It offers one-stop access to data modeling, importing, querying, and monitoring, catering to both Interactive and Insight engines within the GraphScope Flex architecture.

![query](https://img.alicdn.com/imgextra/i3/O1CN015kMEu71soPJ8fuhy2_!!6000000005813-0-tps-3424-1636.jpg)

## Quick start

There are two ways to start graphscope portal

### Using Docker Image

```bash
# Pull the image
docker pull registry.cn-hongkong.aliyuncs.com/graphscope/portal:latest
```

```bash
# Run the container
docker run -it
--name my-portal
-p 8888:8888
-e COORDINATOR=http://host.docker.internal:8080
registry.cn-hongkong.aliyuncs.com/graphscope/portal:latest
```

> Description of Startup Parameters

- `COORDINATOR` refers to the GraphScope engine address. If you have also started the GraphScope engine locally using Docker, you can directly use `host.docker.internal:8080` as the `COORDINATOR` parameter.
- `PORT` is the port number for the frontend service, defaulting to 8888.

### Building from the source code

prepare [node.js](https://nodejs.org/en) and [pnpm](https://pnpm.io/installation#using-npm)

```bash
# Compile front-end assets
npm run ci
# Start the server
cd packages/studio-website/server
npm run dev -- --port=8888 --coordinator=<graphscope_coordinator_endpoint> --cypher_endpoint=<graphscope_cypher_endpoint>
```

## Core Features

### Data Modeling

GraphScope Portal supports users in manually constructing graph models. You can create vertex types by clicking "Add Node" or create edge types by "dragging vertex edges." The entire process is like freely sketching on a whiteboard—efficient and simple. Additionally, Portal supports automatically inferring and generating graph models by parsing user CSV, JSON, and other data files.

![modeling](https://img.alicdn.com/imgextra/i1/O1CN01Msfdm820qFpaF6Ku6_!!6000000006900-0-tps-3572-1912.jpg)

### Data Importing

GraphScope Portal allows users to bind data files in a single or batch mode according to the vertex-edge model. For CSV files, it provides local upload and field mapping parsing functionality. It also supports one-click data import through YAML configuration files.

![importing](https://img.alicdn.com/imgextra/i2/O1CN01VZlwwK1K5nnW6MPF7_!!6000000001113-0-tps-3554-1914.jpg)

### Interactive Querying

Once the data is ready, GraphScope Portal offers the 「Query」 module, which features a powerful code editor, multiple query methods, and rich visualization.

Powerful Editor: Supports syntax completion and highlighting for Cypher / Gremlin, making it easy for users to edit and modify queries.

Multiple Query Methods: Allows users to write and save graph query statements, review history, recommend queries based on schema, and use natural language queries based on OpenAI.

Rich Visualization: Supports both Graph and Table display modes. The Graph mode provides 2D/3D visualization, an efficient rendering engine, and allows users to customize node and edge colors, sizes, fonts, etc. It also supports further data insights through "switching charts."

### Extensibility

GraphScope Portal offers a 「Extension」 module, supporting the import and use of "Stored Procedures" and "Graph Algorithms" as plugins. It also provides "Personalized Configuration": supports language switching, theme switching, and customization of theme colors and other details.

Its frontend module not only supports use on the Web UI but also integrates with Jupyter Notebook.

## Other Resources

- [👏 Contrubuting]('./CONTRIBUTING.md')
- [ 🔧 Components](https://portal-bim.pages.dev/)

## License

GraphScope Portal is licensed under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0). Please note that third-party dependencies may not have the same license as GraphScope Portal.
