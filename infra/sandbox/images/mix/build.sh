#!/bin/bash
set -e

# Define image name and tag
IMAGE_NAME="ai-spider/mix"
NODE_VERSION="22"

# Ensure we're in the correct directory
cd "$(dirname "$0")"

echo "Building $IMAGE_NAME:$NODE_VERSION..."

# Build Docker image
docker build -t "$IMAGE_NAME:$NODE_VERSION" -f Dockerfile .

# Create latest tag
docker tag "$IMAGE_NAME:$NODE_VERSION" "$IMAGE_NAME:latest"

echo "$IMAGE_NAME:$NODE_VERSION built successfully!"

# List generated images
echo ""
echo "Available Node.js images:"
docker images "$IMAGE_NAME"