# 第一阶段：从 Git 克隆完整项目并构建
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 安装 Git 和 pnpm
RUN apk add --no-cache git && \
    npm install -g pnpm

# 从 Git 仓库中克隆项目
RUN git clone --depth=1 https://github.com/GraphScope/portal.git . && \
    pnpm install && \
    npm run ci

# 清理不必要的文件
RUN rm -rf .git

# 第二阶段：仅复制前端产物到最终镜像中
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制前端产物到最终镜像
COPY --from=builder /app/packages/studio-website/dist dist/
COPY --from=builder /app/packages/studio-website/server server/

# 进入proxy目录
WORKDIR /app/server

# 安装proxy的依赖
RUN npm install

# # # 设置环境变量
# ENV PORT=8888
# # ENV COORDINATOR=http://127.0.0.1:8080
# # ENV CYPHER_ENDPOINT=neo4j://127.0.0.1:7687
# # ENV GREMLIN_ENDPOINT=ws://127.0.0.1:12312/gremlin

# # 暴露端口
# EXPOSE $PORT

# 在容器启动时运行的命令
# CMD ["sh", "-c", "npm run dev -- --port=${PORT} --coordinator=${COORDINATOR} --cypher_endpoint=${CYPHER_ENDPOINT} --gremlin_endpoint=${GREMLIN_ENDPOINT}"]
 