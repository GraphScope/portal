FROM python:3.9-alpine

# 镜像元数据
LABEL maintainer="AI Spider Team"
LABEL description="Python sandbox environment with pre-installed tools"
LABEL version="1.0.0"

# 设置系统环境变量
# ENV PIP_INDEX_URL=https://mirrors.aliyun.com/pypi/simple/
# ENV PIP_TRUSTED_HOST=mirrors.aliyun.com
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV SANDBOX_HOME=/home/sandbox
ENV APP_HOME=/home/sandbox/.local/app
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
    make \
    g++ \
    gcc \
    python3-dev \
    openssh-client \
    tzdata \
    jq \
    nodejs \
    npm \
    # 添加构建psutil所需的依赖
    linux-headers \
    musl-dev \
    && ln -sf python3 /usr/bin/python

# 安装Python工具 - 使用分步骤方式安装以减少构建失败的可能性
RUN pip install --no-cache-dir --upgrade pip

# 创建非root用户
RUN addgroup -S sandbox && \
    adduser -S -G sandbox -s /bin/sh -h ${SANDBOX_HOME} sandbox && \
    echo "sandbox ALL=(ALL) NOPASSWD: ALL" > /etc/sudoers.d/sandbox && \
    chmod 0440 /etc/sudoers.d/sandbox

# 创建工作目录并设置权限
RUN mkdir -p ${SANDBOX_HOME} ${APP_HOME} && \
    chown -R sandbox:sandbox ${SANDBOX_HOME} ${APP_HOME} && \
    chmod -R 755 ${SANDBOX_HOME} ${APP_HOME}

# 创建nobody用户可写入的目录
RUN mkdir -p ${SANDBOX_HOME}/tmp && \
    chmod 777 ${SANDBOX_HOME}/tmp && \
    chown -R nobody:nobody ${SANDBOX_HOME}/tmp

# 使用sandbox用户安装Python包以避免pip权限警告
USER sandbox
WORKDIR ${SANDBOX_HOME}

# 先安装基本工具包
RUN pip install --user \
    mypy \
    requests \
    httpx \
    beautifulsoup4

# 单独安装数据科学和计算包
RUN pip install --user \
    numpy \
    pandas

# 初始化Node.js项目和安装Playwright
WORKDIR ${APP_HOME}
USER sandbox
RUN npm init -y && \
    npm install @playwright/mcp --save --registry=https://registry.anpm.alibaba-inc.com \
    npx -y playwright-core install-deps chromium

# 切换回root用户
USER root

# 配置Git安全目录设置（解决dubious ownership问题）
RUN git config --system --add safe.directory ${SANDBOX_HOME} && \
    mkdir -p /etc/skel && \
    echo "[safe]" > /etc/skel/.gitconfig && \
    echo "    directory = ${SANDBOX_HOME}" >> /etc/skel/.gitconfig

# 创建.gitignore文件
RUN echo "# Python" > ${SANDBOX_HOME}/.gitignore && \
    echo "__pycache__/" >> ${SANDBOX_HOME}/.gitignore && \
    echo "*.py[cod]" >> ${SANDBOX_HOME}/.gitignore && \
    echo "*$py.class" >> ${SANDBOX_HOME}/.gitignore && \
    echo ".pytest_cache/" >> ${SANDBOX_HOME}/.gitignore && \
    echo ".coverage" >> ${SANDBOX_HOME}/.gitignore && \
    echo "htmlcov/" >> ${SANDBOX_HOME}/.gitignore && \
    echo "# Virtual Environments" >> ${SANDBOX_HOME}/.gitignore && \
    echo ".env/" >> ${SANDBOX_HOME}/.gitignore && \
    echo ".venv/" >> ${SANDBOX_HOME}/.gitignore && \
    echo "env/" >> ${SANDBOX_HOME}/.gitignore && \
    echo "venv/" >> ${SANDBOX_HOME}/.gitignore && \
    echo "ENV/" >> ${SANDBOX_HOME}/.gitignore && \
    echo "# Package Files" >> ${SANDBOX_HOME}/.gitignore && \
    echo "*.egg" >> ${SANDBOX_HOME}/.gitignore && \
    echo "*.egg-info/" >> ${SANDBOX_HOME}/.gitignore && \
    echo "dist/" >> ${SANDBOX_HOME}/.gitignore && \
    echo "build/" >> ${SANDBOX_HOME}/.gitignore && \
    echo "sdist/" >> ${SANDBOX_HOME}/.gitignore && \
    echo "# Jupyter Notebooks" >> ${SANDBOX_HOME}/.gitignore && \
    echo ".ipynb_checkpoints" >> ${SANDBOX_HOME}/.gitignore && \
    echo "# Directory for cached packages" >> ${SANDBOX_HOME}/.gitignore && \
    echo ".cache/" >> ${SANDBOX_HOME}/.gitignore && \
    echo "# Editor files" >> ${SANDBOX_HOME}/.gitignore && \
    echo ".vscode/" >> ${SANDBOX_HOME}/.gitignore && \
    echo ".idea/" >> ${SANDBOX_HOME}/.gitignore && \
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

# 创建入口点脚本
COPY <<-"EOF" /usr/local/bin/entrypoint.sh
#!/bin/sh
if [ "$1" = "serve" ]; then
    cd ${APP_HOME}
    exec npx @playwright/mcp --port 3000 --host 0.0.0.0
else
    exec "$@"
fi
EOF

RUN chmod +x /usr/local/bin/entrypoint.sh

# 设置工作目录和入口点
WORKDIR ${SANDBOX_HOME}
EXPOSE 3000
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["serve"]