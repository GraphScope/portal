#!/bin/bash
set -e

# 定义镜像名称和标签
IMAGE_NAME="ai-spider/python"
PYTHON_VERSIONS=("3.9" "3.11")

# 确保在正确的目录中
cd "$(dirname "$0")"

# 构建多个Python版本的镜像
for version in "${PYTHON_VERSIONS[@]}"; do
  echo "Building $IMAGE_NAME:$version..."
  
  # 修改FROM行来匹配特定的Python版本
  sed "s/FROM python:3.9-alpine/FROM python:$version-alpine/g" Dockerfile > "Dockerfile.$version"
  
  # 构建Docker镜像
  docker build -t "$IMAGE_NAME:$version" -f "Dockerfile.$version" .
  
  # 创建latest标签（使用Python 3.9作为默认版本）
  if [ "$version" == "3.9" ]; then
    docker tag "$IMAGE_NAME:$version" "$IMAGE_NAME:latest"
  fi
  
  # 清理临时Dockerfile
  rm "Dockerfile.$version"
  
  echo "$IMAGE_NAME:$version built successfully!"
done

echo "All Python images have been built."

# 列出生成的镜像
echo ""
echo "Available Python images:"
docker images "$IMAGE_NAME"