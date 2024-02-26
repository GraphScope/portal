# GraphScope Portal

## Perpare

- install node.js : https://nodejs.org/en
- install pnpm : https://pnpm.io/installation#using-npm `npm install -g pnpm`

## Development

- install dependencies

```
pnpm install

```

- build sub packages and watching

```
npm run start

```

- run portal website

```

cd packages/studio-website

npm run start

```

---

## Deployment

Execute this command in the root directory:

Compile front-end assets
`npm run ci`

Initial deployment of the service:
`npm run deploy -- --proxy=http://x.x.x.x --port=8888`

explanation:

- `proxy` is the deployment address of the graphscope engine, defaulting to `http://127.0.0.1:8080`.
- `port` is the port of the service front-end, defaulting to `8888`.

View logs:

- `npm run logs`

Re-deployment

- `npm run re-deploy -- --proxy=http://x.x.x.x --port=8888`

## others components

- start components demo site

```
npm run docs
```

| Subpackage      | Description                                                                                                       |
| --------------- | ----------------------------------------------------------------------------------------------------------------- |
| studio-server   |                                                                                                                   |
| studio-importor | Data modeling and import module, supports visual modeling                                                         |
| studio-query    | Data querying module, supports Cypher and Gremlin                                                                 |
| studio-canvas   | Graph canvas module, supports relational data visualization                                                       |
| studio-site     | studio site                                                                                                       |
| studio-sdk      | Comprehensive workspace SDK built from `studio-importor`, `studio-query`, and `studio-canvas`, can run on the web |
| studio-sdk-py   | Wraps `studio-sdk` into Python code, supports execution in JupyterLab                                             |
