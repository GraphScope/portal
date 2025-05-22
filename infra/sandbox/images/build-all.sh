#!/bin/bash
set -e

# 确保在正确的目录中
cd "$(dirname "$0")"

echo "=== Building AI Spider Sandbox Official Images ==="
echo ""

# 设置构建脚本可执行权限
chmod +x ./node/build.sh
chmod +x ./python/build.sh

# 构建Node.js镜像
echo "Building Node.js images..."
./node/build.sh
echo ""

# 构建Python镜像
echo "Building Python images..."
./python/build.sh
echo ""

# 构建Mix镜像
echo "Building Mix images..."
./mix/build.sh
echo ""

echo "=== All images have been built successfully ==="
echo ""
echo "Available images:"
docker images | grep "ai-spider"