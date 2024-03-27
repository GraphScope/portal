# 第一阶段：从 Git 克隆完整项目并构建
FROM node:18 AS builder

# 设置工作目录
WORKDIR /portal

# 安装 Git
RUN apt-get update && apt-get install -y git \
    && npm install -g pnpm

# 从 Git 仓库中克隆项目 token 换成github的token，之后开源则不需要了
RUN git clone  https://<token>@github.com/GraphScope/portal.git .
RUN ls

# 安装依赖
RUN pnpm install

# 构建前端产物
RUN npm run ci


# 第二阶段：仅复制前端产物到最终镜像中
FROM node:18  
RUN pwd
# 设置工作目录
WORKDIR /portal
RUN pwd


# 从第一个阶段复制前端产物到最终镜像
COPY --from=builder /portal/packages/studio-website/dist dist
COPY --from=builder /portal/packages/studio-website/proxy proxy

# 编译 proxy 产物
WORKDIR /portal/proxy
RUN pwd
RUN npm install

# 设置环境变量
ENV port 8888
ENV proxy http://127.0.0.1:8080
ENV cypher_endpoint neo4j://127.0.0.1:7687
ENV gremlin_endpoint ws://127.0.0.1:12312/gremlin

# 暴露端口
EXPOSE $port

# 在容器启动时运行的命令
CMD ["sh", "-c", "npm run dev -- --port=$port --proxy=$proxy --cypher_endpoint=$cypher_endpoint --gremlin_endpoint=$gremlin_endpoint"]
# TODO intergration with pm2
# CMD [ "pm2-runtime", "index.js","--port","$port","--proxy","$proxy","--cypher_endpoint" ,"$cypher_endpoint","--gremlin_endpoint","$gremlin_endpoint"]