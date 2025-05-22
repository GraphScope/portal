# -------------------------------------------------------------------
# Base image: Node 22 on Debian Bookworm slim
# -------------------------------------------------------------------
    FROM node:22-bookworm-slim

    LABEL maintainer="AI Spider Team"
    LABEL description="Python sandbox + Playwright‑MCP (Chromium) on Debian Bookworm"
    LABEL version="2.0.1"
    
    # -------------------------------------------------------------------
    # Environment
    # -------------------------------------------------------------------
    ENV PYTHONDONTWRITEBYTECODE=1 \
        PYTHONUNBUFFERED=1 \
        SANDBOX_HOME=/home/sandbox \
        APP_HOME=/home/sandbox/.local/app \
        PLAYWRIGHT_BROWSERS_PATH=/home/sandbox/.local/playwright \
        VIRTUAL_ENV=/home/sandbox/.venv \
        PATH="/home/sandbox/.venv/bin:${PATH}:/home/sandbox/.local/bin"
    
    # -------------------------------------------------------------------
    # 1) Install OS packages
    # -------------------------------------------------------------------
    RUN apt-get update \
     && apt-get install -y --no-install-recommends \
          # utilities
          git curl wget tar zip unzip bash sudo make gnupg tzdata jq openssh-client \
          # Python & build tools
          python3 python3-venv python3-dev build-essential \
     && rm -rf /var/lib/apt/lists/*
    
    # -------------------------------------------------------------------
    # 2) Create sandbox user & directories
    # -------------------------------------------------------------------
    RUN groupadd --system sandbox \
     && useradd --system --gid sandbox --home-dir ${SANDBOX_HOME} --shell /bin/bash sandbox \
     && mkdir -p ${SANDBOX_HOME} ${APP_HOME} ${SANDBOX_HOME}/tmp \
     && chown -R sandbox:sandbox ${SANDBOX_HOME} ${APP_HOME} \
     && chmod 755 ${SANDBOX_HOME} ${APP_HOME} \
     && chmod 777 ${SANDBOX_HOME}/tmp \
     && echo "sandbox ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/sandbox \
     && chmod 0440 /etc/sudoers.d/sandbox
    
    # -------------------------------------------------------------------
    # 3) Prepare Python virtual environment & install packages
    # -------------------------------------------------------------------
    USER sandbox
    WORKDIR ${SANDBOX_HOME}
    
    # Create venv and upgrade pip
    RUN python3 -m venv ${VIRTUAL_ENV} \
     && pip install --upgrade pip
    
    # Install Python libraries into the venv
    RUN pip install \
         mypy \
         requests \
         httpx \
         beautifulsoup4 \
         numpy \
         pandas
    
    # -------------------------------------------------------------------
    # 4) Install Playwright‑MCP and Chromium
    # -------------------------------------------------------------------
    USER sandbox
    WORKDIR ${APP_HOME}
    
    RUN npm init -y \
     && npm install @playwright/mcp --save \
     && npx playwright install-deps \
     && npx playwright install chromium
    
    # -------------------------------------------------------------------
    # 5) Git safe.directory and .gitignore
    # -------------------------------------------------------------------
    USER root
    
    RUN git config --system --add safe.directory ${SANDBOX_HOME} \
     && mkdir -p /etc/skel \
     && printf "[safe]\n    directory = %s\n" "${SANDBOX_HOME}" > /etc/skel/.gitconfig
    
    RUN tee ${SANDBOX_HOME}/.gitignore <<EOF
    # Python
    __pycache__/
    *.py[cod]
    *$py.class
    .pytest_cache/
    .coverage
    htmlcov/
    # Venv
    .venv/
    # Packages
    *.egg
    *.egg-info/
    dist/
    build/
    sdist/
    # Jupyter
    .ipynb_checkpoints/
    # Cache
    .cache/
    # Editors
    .vscode/
    .idea/
    # System
    .DS_Store
    Thumbs.db
    EOF
    
    RUN chown sandbox:sandbox ${SANDBOX_HOME}/.gitignore
    
    # -------------------------------------------------------------------
    # 6) Initialize Git repo as sandbox user
    # -------------------------------------------------------------------
    USER sandbox
    WORKDIR ${SANDBOX_HOME}
    
    RUN git config --global user.name "Sandbox User" \
     && git config --global user.email "sandbox@example.com" \
     && git config --global --add safe.directory ${SANDBOX_HOME} \
     && git init \
     && echo "# Sandbox Repository\n\nInitialized at: $(date)" > README.md \
     && git add README.md .gitignore \
     && git commit -m "Initial commit with README and .gitignore"
    
    # -------------------------------------------------------------------
    # 7) Final safe.directory for root & nobody
    # -------------------------------------------------------------------
    USER root
    
    RUN git config --global --add safe.directory ${SANDBOX_HOME} \
     && mkdir -p /home/nobody \
     && printf "[safe]\n    directory = %s\n" "${SANDBOX_HOME}" > /home/nobody/.gitconfig \
     && chown -R nobody:nogroup /home/nobody
    
    # -------------------------------------------------------------------
    # 8) Entrypoint script
    # -------------------------------------------------------------------
    COPY <<-'EOE' /usr/local/bin/entrypoint.sh
    #!/bin/sh
    if [ "$1" = "serve" ]; then
      cd "${APP_HOME}"
        exec npx @playwright/mcp \
        --headless \
        --browser chromium \
        --port 3000 \
        --host 0.0.0.0 \
         --no-sandbox 
    else
      exec "$@"
    fi
    EOE
    
    RUN chmod +x /usr/local/bin/entrypoint.sh
    RUN chown sandbox:sandbox /usr/local/bin/entrypoint.sh
    
    # --------------------------å-----------------------------------------
    # 9) Final settings
    # -------------------------------------------------------------------
    USER sandbox
    WORKDIR ${SANDBOX_HOME}
    
    EXPOSE 3000
    ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
    CMD ["serve"]
    