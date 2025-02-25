---
title: Visualize graphs with GraphScope Portal
---

## Visualize graphs with GraphScope Portal

GraphScope Interactive redefines graph exploration with its powerful and efficient engine. Seamlessly integrated with [GraphScope Portal](https://github.com/GraphScope/portal), a web-based interface for real-time query execution and visualization, it empowers users to unlock insights from complex graphs with ease. Focus on your data, not the complexity.GraphScope Interactive makes advanced graph analytics accessible to everyone.

<img src="/visualization/query.png" />

## Launching GraphScope Portal

We provide an [Online Portal](https://gsp.vercel.app/#/setting) where you only need to fill in the `coordinator address` of the Interactive Service on the settings configuration page.

<img src="/visualization/coordinator-settings.png" />

In addition, we offer two more ways to launch the GraphScope portal:

### Option 1: Launch via Docker;

```bash
# Pull the GraphScope Portal  Docker image

docker pull ghcr.io/graphscope/portal:latest

# Start server

docker run -d -p 8888:8888 --name my-portal ghcr.io/graphscope/portal:latest
```

### Option 2: Launch via source code.

```bash
# git clone repo

git clone https://github.com/GraphScope/portal.git

# Compile front-end assets

npm run ci

# Start the server

cd packages/studio-website/server
npm run dev
```
