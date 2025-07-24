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
        lxml \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# -------------------------------------------------------------------
# Final stage: Main application image
# -------------------------------------------------------------------
FROM node:22-bookworm-slim

LABEL maintainer="AI Spider Team"
LABEL description="Claude Code sandbox with Python + Node.js on Debian Bookworm"
LABEL version="1.0.0"

# -------------------------------------------------------------------
# Environment
# -------------------------------------------------------------------
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    SANDBOX_HOME=/home/sandbox \
    VIRTUAL_ENV=/opt/venv \
    PATH="/opt/venv/bin:${PATH}"

# -------------------------------------------------------------------
# Layer 1: Install system dependencies
# -------------------------------------------------------------------
RUN apt-get update && apt-get install -y --no-install-recommends \
    # utilities
    git curl wget tar zip unzip bash sudo make gnupg tzdata jq openssh-client tree file procps \
    # Python runtime (no build tools needed)
    python3 python3-pip \
    # Additional tools
    vim ca-certificates \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*



# Install global npm packages
RUN npm install -g jsonpath

# Install Claude Code
RUN npm install -g @anthropic-ai/claude-code@latest

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
    && chown -R sandbox:sandbox ${SANDBOX_HOME} ${VIRTUAL_ENV} \
    && chmod 755 ${SANDBOX_HOME} \
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



# Set git to use credential helper
RUN git config --global credential.helper 'cache --timeout=3600'

# Create a wrapper script for git that prevents branch switching
RUN echo '#!/bin/bash\n\
# Allow the initial branch creation\n\
if [ ! -f /tmp/.branch-created ]; then\n\
    /usr/bin/git.real "$@"\n\
    if [[ "$1" == "checkout" ]] && [[ "$2" == "-b" ]]; then\n\
        touch /tmp/.branch-created\n\
    fi\n\
else\n\
    # After initial branch creation, prevent switching\n\
    if [[ "$1" == "checkout" ]] && [[ "$2" != "-b" ]] && [[ "$*" != *"--"* ]]; then\n\
        echo "Error: Branch switching is disabled in claude-code-sandbox"\n\
        echo "You can only create new branches with git checkout -b"\n\
        exit 1\n\
    fi\n\
    if [[ "$1" == "switch" ]]; then\n\
        echo "Error: Branch switching is disabled in claude-code-sandbox"\n\
        exit 1\n\
    fi\n\
    /usr/bin/git.real "$@"\n\
fi' > /usr/local/bin/git-wrapper && \
    chmod +x /usr/local/bin/git-wrapper && \
    mv /usr/bin/git /usr/bin/git.real && \
    ln -s /usr/local/bin/git-wrapper /usr/bin/git

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
# Node.js
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
# Claude
.claude/
EOF

RUN git init \
    && echo "# Sandbox Repository\n\nInitialized at: $(date)" > README.md \
    && git add README.md .gitignore \
    && git commit -m "Initial commit with README and .gitignore"

# Create .claude directory and settings.local.json
RUN mkdir -p .claude \
    && tee .claude/settings.local.json <<EOF
{
  "permissions": {
    "allow": [
      "WebFetch(domain:*)",
      "Bash(pip install:*)",
      "Bash(python3 -m venv:*)",
      "Bash(source:*)",
      "Bash(python:*)",
      "Bash(curl:*)",
      "Bash(pkill:*)"
    ],
    "deny": []
  }
}
EOF

# -------------------------------------------------------------------
# Create entrypoint script
# -------------------------------------------------------------------
USER root
RUN echo '#!/bin/bash\n\
set -e\n\
\n\
# Copy git config if mounted\n\
if [ -f "/tmp/.gitconfig" ]; then\n\
    cp /tmp/.gitconfig /root/.gitconfig\n\
fi\n\
\n\
# Execute the command\n\
exec "$@"' > /entrypoint.sh && \
    chmod +x /entrypoint.sh

# -------------------------------------------------------------------
# Final settings
# -------------------------------------------------------------------
USER sandbox
WORKDIR ${SANDBOX_HOME}

ENTRYPOINT ["/entrypoint.sh"]
CMD ["bash"]
