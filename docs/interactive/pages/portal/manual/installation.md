## Installation with docker

```bash
# Pull the image
docker pull ghcr.io/graphscope/portal:latest
```

## Installation with source code

```bash
# Compile front-end assets
npm run ci
# Start the server
cd packages/studio-website/server
npm run dev -- --port=8888 --coordinator=<graphscope_coordinator_endpoint> --cypher_endpoint=<graphscope_cypher_endpoint>
```
