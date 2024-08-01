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
