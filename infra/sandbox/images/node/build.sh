#!/bin/bash
set -e

# 定义镜像名称和标签
IMAGE_NAME="ai-spider/node"
NODE_VERSIONS=("18" "20")

# 确保在正确的目录中
cd "$(dirname "$0")"

# 建立多个Node.js版本的镜像
for version in "${NODE_VERSIONS[@]}"; do
  echo "Building $IMAGE_NAME:$version..."
  
  # 修改FROM行来匹配特定的Node版本
  sed "s/FROM node:18-alpine/FROM node:$version-alpine/g" Dockerfile > "Dockerfile.$version"
  
  # 构建Docker镜像
  docker build -t "$IMAGE_NAME:$version" -f "Dockerfile.$version" .
  
  # 创建latest标签（使用Node.js 18作为默认版本）
  if [ "$version" == "18" ]; then
    docker tag "$IMAGE_NAME:$version" "$IMAGE_NAME:latest"
  fi
  
  # 清理临时Dockerfile
  rm "Dockerfile.$version"
  
  echo "$IMAGE_NAME:$version built successfully!"
done

echo "All Node.js images have been built."

# 列出生成的镜像
echo ""
echo "Available Node.js images:"
docker images "$IMAGE_NAME"