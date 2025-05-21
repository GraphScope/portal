# AI Spider Sandbox Official Images

This directory contains the Dockerfiles and build scripts for official sandbox images. These images are pre-installed with common development tools to ensure consistent execution environments and avoid runtime installation issues.

## Available Images

- `node`: Node.js environments with pre-installed tools

  - `node:18`: Node.js 18 with git, pnpm, and other essential tools
  - `node:20`: Node.js 20 with git, pnpm, and other essential tools

- `python`: Python environments with pre-installed tools
  - `python:3.9`: Python 3.9 with git, pip, and other essential tools
  - `python:3.11`: Python 3.11 with git, pip, and other essential tools

## Image Features

All images include:

- Git for version control
- Appropriate package managers (pnpm/npm/pip)
- Common development tools
- Properly configured permissions
- Security hardening

## Building Images

To build all images:

```bash
cd packages/sandbox/images
chmod +x build-all.sh
./build-all.sh
```

To build a specific image:

```bash
cd packages/sandbox/images/node
chmod +x build.sh
./build.sh
```

## Using Images

These images are designed to be used with the AI Spider Sandbox system. In your sandbox configuration, specify the image name as:

```json
{
  "image": "@graphscope/node:18",
  "options": {
    "timeout": 60000
  }
}
```
