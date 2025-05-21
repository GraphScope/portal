FROM node:18-alpine

# 镜像元数据
LABEL maintainer="AI Spider Team"
LABEL description="Node.js sandbox environment with pre-installed tools"
LABEL version="1.0.0"

# 设置系统环境变量
ENV NODE_ENV=production
ENV NPM_CONFIG_REGISTRY=https://registry.npmmirror.com
ENV NPM_CONFIG_CACHE=/tmp/.npm
ENV SANDBOX_HOME=/home/sandbox
ENV PATH="${PATH}:/home/sandbox/.local/bin"

# 安装基本工具和依赖
RUN apk add --no-cache \
    git \
    curl \
    wget \
    tar \
    zip \
    unzip \
    bash \
    sudo \
    python3 \
    make \
    g++ \
    openssh-client \
    tzdata \
    jq \
    && ln -sf python3 /usr/bin/python

# 安装pnpm和常用的Node.js开发工具 - 使用兼容Node.js 18的版本
RUN npm install -g --force pnpm@8.15.4 npm@10.2.4 yarn@1.22.22 typescript@latest ts-node@latest && \
    pnpm config set registry https://registry.npmmirror.com && \
    pnpm config set store-dir /tmp/.pnpm-store

# 创建非root用户
RUN addgroup -S sandbox && \
    adduser -S -G sandbox -s /bin/sh -h ${SANDBOX_HOME} sandbox && \
    echo "sandbox ALL=(ALL) NOPASSWD: ALL" > /etc/sudoers.d/sandbox && \
    chmod 0440 /etc/sudoers.d/sandbox

# 创建工作目录并设置权限
RUN mkdir -p ${SANDBOX_HOME} && \
    chown -R sandbox:sandbox ${SANDBOX_HOME} && \
    chmod -R 755 ${SANDBOX_HOME}

# 创建nobody用户可写入的目录
RUN mkdir -p ${SANDBOX_HOME}/tmp && \
    chmod 777 ${SANDBOX_HOME}/tmp && \
    chown -R nobody:nobody ${SANDBOX_HOME}/tmp

# 配置Git安全目录设置（解决dubious ownership问题）
RUN git config --system --add safe.directory ${SANDBOX_HOME} && \
    mkdir -p /etc/skel && \
    echo "[safe]" > /etc/skel/.gitconfig && \
    echo "    directory = ${SANDBOX_HOME}" >> /etc/skel/.gitconfig

# 创建.gitignore文件
RUN echo "# Node.js dependencies" > ${SANDBOX_HOME}/.gitignore && \
    echo "node_modules/" >> ${SANDBOX_HOME}/.gitignore && \
    echo "npm-debug.log" >> ${SANDBOX_HOME}/.gitignore && \
    echo "yarn-error.log" >> ${SANDBOX_HOME}/.gitignore && \
    echo "yarn-debug.log" >> ${SANDBOX_HOME}/.gitignore && \
    echo ".pnpm-store/" >> ${SANDBOX_HOME}/.gitignore && \
    echo ".npm/" >> ${SANDBOX_HOME}/.gitignore && \
    echo "# Build output" >> ${SANDBOX_HOME}/.gitignore && \
    echo "dist/" >> ${SANDBOX_HOME}/.gitignore && \
    echo "build/" >> ${SANDBOX_HOME}/.gitignore && \
    echo ".next/" >> ${SANDBOX_HOME}/.gitignore && \
    echo "out/" >> ${SANDBOX_HOME}/.gitignore && \
    echo "# Environment variables" >> ${SANDBOX_HOME}/.gitignore && \
    echo ".env.local" >> ${SANDBOX_HOME}/.gitignore && \
    echo ".env.development.local" >> ${SANDBOX_HOME}/.gitignore && \
    echo ".env.test.local" >> ${SANDBOX_HOME}/.gitignore && \
    echo ".env.production.local" >> ${SANDBOX_HOME}/.gitignore && \
    echo "# Editor directories and files" >> ${SANDBOX_HOME}/.gitignore && \
    echo ".vscode/" >> ${SANDBOX_HOME}/.gitignore && \
    echo ".idea/" >> ${SANDBOX_HOME}/.gitignore && \
    echo "*.suo" >> ${SANDBOX_HOME}/.gitignore && \
    echo "*.ntvs*" >> ${SANDBOX_HOME}/.gitignore && \
    echo "*.njsproj" >> ${SANDBOX_HOME}/.gitignore && \
    echo "*.sln" >> ${SANDBOX_HOME}/.gitignore && \
    echo "*.sw?" >> ${SANDBOX_HOME}/.gitignore && \
    echo "# System files" >> ${SANDBOX_HOME}/.gitignore && \
    echo ".DS_Store" >> ${SANDBOX_HOME}/.gitignore && \
    echo "Thumbs.db" >> ${SANDBOX_HOME}/.gitignore && \
    chown sandbox:sandbox ${SANDBOX_HOME}/.gitignore

# 初始化Git仓库
WORKDIR ${SANDBOX_HOME}
USER sandbox
RUN git config --global user.name "Sandbox User" && \
    git config --global user.email "sandbox@example.com" && \
    git config --global --add safe.directory ${SANDBOX_HOME} && \
    git init && \
    echo "# Sandbox Repository\n\nInitialized at: $(date)" > README.md && \
    git add README.md && \
    git add .gitignore && \
    git commit -m "Initial commit with README and .gitignore"

# 切换回root用户以允许服务启动时更改用户
USER root
WORKDIR ${SANDBOX_HOME}

# 为root用户和nobody用户也设置safe.directory
RUN git config --global --add safe.directory ${SANDBOX_HOME} && \
    mkdir -p /home/nobody && \
    echo "[safe]" > /home/nobody/.gitconfig && \
    echo "    directory = ${SANDBOX_HOME}" >> /home/nobody/.gitconfig && \
    chown -R nobody:nobody /home/nobody

# 设置入口点
CMD ["node"]