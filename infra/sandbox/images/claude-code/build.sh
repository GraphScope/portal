#!/bin/bash
set -e

# Define image name and tag
IMAGE_NAME="ai-spider/claude-code"
NODE_VERSION="22"

# Ensure we're in the correct directory
cd "$(dirname "$0")"

echo "Building $IMAGE_NAME:$NODE_VERSION..."

# Build Docker image with BuildKit optimizations
DOCKER_BUILDKIT=1 docker build \
  --progress=plain \
  -t "$IMAGE_NAME:$NODE_VERSION" \
  -f Dockerfile .

# Create latest tag
docker tag "$IMAGE_NAME:$NODE_VERSION" "$IMAGE_NAME:latest"

echo "$IMAGE_NAME:$NODE_VERSION built successfully!"

# List generated images
echo ""
echo "Available Claude Code images:"
docker images "$IMAGE_NAME"
