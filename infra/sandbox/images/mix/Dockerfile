# -------------------------------------------------------------------
# Python sandbox with Playwright (Chromium) on Debian
# -------------------------------------------------------------------
    FROM python:3.11-slim

    LABEL maintainer="AI Spider Team"
    LABEL description="Python sandbox + Playwright (Chromium) on Debian"
    LABEL version="2.0.1"
    
    # -------------------------------------------------------------------
    # Environment
    # -------------------------------------------------------------------
    ENV PYTHONDONTWRITEBYTECODE=1 \
        PYTHONUNBUFFERED=1 \
        SANDBOX_HOME=/home/sandbox \
        PLAYWRIGHT_HOME=/opt/playwright \
        PLAYWRIGHT_BROWSERS_PATH=/opt/playwright/browsers
    
    # -------------------------------------------------------------------
    # Layer 1: Install system packages and dependencies
    # -------------------------------------------------------------------
    RUN apt-get update && apt-get install -y --no-install-recommends \
        # System utilities
        git curl wget tar zip unzip bash sudo make gnupg tzdata jq openssh-client \
        # Build tools for Python packages
        build-essential \
        # Playwright system dependencies
        libnss3 \
        libnspr4 \
        libatk-bridge2.0-0 \
        libdrm2 \
        libxkbcommon0 \
        libgtk-3-0 \
        libgbm1 \
        libasound2 \
        && apt-get clean \
        && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
    
    # -------------------------------------------------------------------
    # Layer 2: Install Python dependencies
    # -------------------------------------------------------------------
    RUN pip install --no-cache-dir --upgrade pip \
        && pip install --no-cache-dir \
            requests \
            httpx \
            beautifulsoup4 \
            numpy \
            pandas \
            fastapi \
            uvicorn \
            pydantic \
            playwright
    
    # -------------------------------------------------------------------
    # Layer 3: Install Playwright dependencies and browsers
    # -------------------------------------------------------------------
    RUN playwright install-deps
    RUN playwright install chromium
    # Verify installation
    RUN python -c "from playwright.sync_api import sync_playwright; print('Playwright installation verified')"
    
    # -------------------------------------------------------------------
    # Layer 4: Create sandbox user and directories
    # -------------------------------------------------------------------
    RUN groupadd --system sandbox \
        && useradd --system --gid sandbox --home-dir ${SANDBOX_HOME} --shell /bin/bash sandbox \
        && mkdir -p ${SANDBOX_HOME} ${SANDBOX_HOME}/tmp ${PLAYWRIGHT_HOME} \
        && chown -R sandbox:sandbox ${SANDBOX_HOME} ${PLAYWRIGHT_HOME} \
        && chmod 755 ${SANDBOX_HOME} ${PLAYWRIGHT_HOME} \
        && chmod 777 ${SANDBOX_HOME}/tmp \
        && echo "sandbox ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/sandbox \
        && chmod 0440 /etc/sudoers.d/sandbox
    
    # -------------------------------------------------------------------
    # Layer 5: Complete git setup and repository initialization
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
    # Layer 6: Copy browser API and set up entrypoint
    # -------------------------------------------------------------------
    USER root
    
    # Copy the browser API file
    COPY browser_api.py ${PLAYWRIGHT_HOME}/browser_api.py
    RUN chown sandbox:sandbox ${PLAYWRIGHT_HOME}/browser_api.py \
        && chmod +x ${PLAYWRIGHT_HOME}/browser_api.py
    
    # -------------------------------------------------------------------
    # Final settings
    # -------------------------------------------------------------------
    USER sandbox
    WORKDIR ${SANDBOX_HOME}
    
    EXPOSE 3000
    ENTRYPOINT ["python", "/opt/playwright/browser_api.py"]
    