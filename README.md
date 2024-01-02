# GraphScope Components

| Subpackage      | Description                                                                                                       |
| --------------- | ----------------------------------------------------------------------------------------------------------------- |
| studio-server   |                                                                                                                   |
| studio-importor | Data modeling and import module, supports visual modeling                                                         |
| studio-query    | Data querying module, supports Cypher and Gremlin                                                                 |
| studio-canvas   | Graph canvas module, supports relational data visualization                                                       |
| studio-site     | studio site                                                                                                       |
| studio-sdk      | Comprehensive workspace SDK built from `studio-importor`, `studio-query`, and `studio-canvas`, can run on the web |
| studio-sdk-py   | Wraps `studio-sdk` into Python code, supports execution in JupyterLab                                             |

## Development

- install dependencies

```
pnpm install

```

- build sub packages and watching

```
npm run start

```

- start components demo site

```
npm run docs
```
