🎉 Welcome to contribute to the graphscope portal project

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
npm run start -- --cypher_endpoint=http://127.0.0.1:7687 --proxy=http://127.0.0.1:8080
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

## Start Frontend Component Package

```bash
npm run docs
```
