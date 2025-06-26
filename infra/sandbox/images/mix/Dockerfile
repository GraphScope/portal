# -------------------------------------------------------------------
# Build stage: Install Python dependencies
# -------------------------------------------------------------------
FROM node:22-bookworm-slim AS python-builder

ENV VIRTUAL_ENV=/opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install build dependencies and create virtual environment
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 python3-pip python3-venv python3-dev build-essential \
    && python3 -m venv ${VIRTUAL_ENV} \
    && pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir \
        requests \
        httpx \
        beautifulsoup4 \
        numpy \
        pandas \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# -------------------------------------------------------------------
# Build stage: Install Playwright-MCP and Chromium
# -------------------------------------------------------------------
FROM node:22-bookworm-slim AS playwright-builder

ENV PLAYWRIGHT_HOME=/opt/playwright-mcp \
    PLAYWRIGHT_BROWSERS_PATH=/opt/playwright-mcp/playwright

WORKDIR ${PLAYWRIGHT_HOME}

# Install Playwright dependencies and Chromium
RUN npm init -y \
    && npm install @ai-spider/playwright-mcp@0.0.2 --save \
    && npx playwright-core install-deps chromium \
    && npx playwright-core install --no-shell chromium \
    && npm cache clean --force \
    && rm -rf /tmp/* /var/tmp/*

# Create entrypoint script
RUN mkdir -p /opt/playwright-mcp/bin \
    && tee /opt/playwright-mcp/bin/entrypoint.sh <<'EOF'
#!/bin/sh
if [ "$1" = "serve" ]; then
cd "${PLAYWRIGHT_HOME}"
exec npx @ai-spider/playwright-mcp@0.0.2 \
--headless \
--browser chromium \
--port 3000 \
--host 0.0.0.0 \
--no-sandbox \
--isolated
else
exec "$@"
fi
EOF

RUN chmod +x /opt/playwright-mcp/bin/entrypoint.sh

# -------------------------------------------------------------------
# Final stage: Main application image
# -------------------------------------------------------------------
FROM playwright-builder

LABEL maintainer="AI Spider Team"
LABEL description="Python sandbox + Playwright‑MCP (Chromium) on Debian Bookworm"
LABEL version="2.0.1"

# -------------------------------------------------------------------
# Environment
# -------------------------------------------------------------------
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    SANDBOX_HOME=/home/sandbox \
    PLAYWRIGHT_HOME=/opt/playwright-mcp \
    PLAYWRIGHT_BROWSERS_PATH=/opt/playwright-mcp/playwright \
    VIRTUAL_ENV=/opt/venv \
    PATH="/opt/venv/bin:${PATH}:/opt/playwright-mcp/bin"

# -------------------------------------------------------------------
# Layer 1: Install additional system packages
# -------------------------------------------------------------------
RUN apt-get update && apt-get install -y --no-install-recommends \
    # utilities
    git curl wget tar zip unzip bash sudo make gnupg tzdata jq openssh-client tree file procps \
    # Python runtime (no build tools needed)
    python3 python3-pip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# -------------------------------------------------------------------
# Layer 2: Copy Python virtual environment from builder
# -------------------------------------------------------------------
COPY --from=python-builder ${VIRTUAL_ENV} ${VIRTUAL_ENV}

# -------------------------------------------------------------------
# Layer 3: Create sandbox user and directories
# -------------------------------------------------------------------
RUN groupadd --system sandbox \
    && useradd --system --gid sandbox --home-dir ${SANDBOX_HOME} --shell /bin/bash sandbox \
    && mkdir -p ${SANDBOX_HOME} ${SANDBOX_HOME}/tmp \
    && chown -R sandbox:sandbox ${SANDBOX_HOME} ${PLAYWRIGHT_HOME} ${VIRTUAL_ENV} \
    && chmod 755 ${SANDBOX_HOME} ${PLAYWRIGHT_HOME} \
    && chmod 777 ${SANDBOX_HOME}/tmp \
    && echo "sandbox ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/sandbox \
    && chmod 0440 /etc/sudoers.d/sandbox

# -------------------------------------------------------------------
# Layer 4: Complete git setup and repository initialization
# -------------------------------------------------------------------
USER root

# Root git configurations
RUN git config --system --add safe.directory ${SANDBOX_HOME} \
    && mkdir -p /etc/skel \
    && printf "[safe]\n    directory = %s\n" "${SANDBOX_HOME}" > /etc/skel/.gitconfig \
    && git config --global --add safe.directory ${SANDBOX_HOME} \
    && mkdir -p /home/nobody \
    && printf "[safe]\n    directory = %s\n" "${SANDBOX_HOME}" > /home/nobody/.gitconfig \
    && chown -R nobody:nogroup /home/nobody

USER sandbox
WORKDIR ${SANDBOX_HOME}

# Sandbox user git setup and repository initialization
RUN git config --global user.name "Sandbox User" \
    && git config --global user.email "sandbox@example.com" \
    && git config --global --add safe.directory ${SANDBOX_HOME} \
    && tee .gitignore <<EOF
# Python
__pycache__/
*.py[cod]
*\$py.class
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

RUN git init \
    && echo "# Sandbox Repository\n\nInitialized at: $(date)" > README.md \
    && git add README.md .gitignore \
    && git commit -m "Initial commit with README and .gitignore"

# -------------------------------------------------------------------
# Final settings
# -------------------------------------------------------------------
USER sandbox
WORKDIR ${SANDBOX_HOME}

EXPOSE 3000
ENTRYPOINT ["/opt/playwright-mcp/bin/entrypoint.sh"]
CMD ["serve"]
