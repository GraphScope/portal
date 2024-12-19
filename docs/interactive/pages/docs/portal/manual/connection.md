## Connection

GraphScope Portal supports connecting to three engines under the GraphScope Flex architecture, which are Interactive, GART, and Insight.

## Connecting to GraphScope Interactive

We need to download the GraphScope Interactive engine and start it first

```bash
# Pull Graphscope Interactive engine, Apple M2 clip
docker pull registry.cn-beijing.aliyuncs.com/graphscope/interactive:0.28.0-arm64
```

```bash
# Run the container
docker run -d \
--name gs-interactive \
--label flex=interactive \
-p 8080:8080 -p 7777:7777 -p 10000:10000 -p 7687:7687 \
registry.cn-beijing.aliyuncs.com/graphscope/interactive:v0.24.2-arm64 --enable-coordinator
```

and then connect to the engine

```bash
# Run the container
docker run -it \
--name my-portal \
-p 8888:8888 \
-e COORDINATOR=http://host.docker.internal:8080 \
ghcr.io/graphscope/portal:latest
```

> Description of Startup Parameters

- `COORDINATOR` refers to the GraphScope engine address. If you have also started the GraphScope engine locally using Docker, you can directly use `host.docker.internal:8080` as the `COORDINATOR` parameter.
- `PORT` is the port number for the frontend service, defaulting to 8888.
