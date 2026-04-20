#!/bin/bash

# StickModel Docker Push Script
# Builds, tags, and pushes Docker image to GitHub Container Registry (GHCR)

set -e

# Configuration
GITHUB_ORG="${1:-griz-sys}"
IMAGE_NAME="stickmodel"
REGISTRY="ghcr.io/$GITHUB_ORG/$IMAGE_NAME"
VERSION="${2:-latest}"

echo "=========================================="
echo "Docker Image Push Script (GHCR)"
echo "=========================================="
echo "Registry: $REGISTRY"
echo "Version: $VERSION"
echo "=========================================="

# Check if Docker is running
if ! docker ps > /dev/null 2>&1; then
    echo "❌ Docker is not running. Start Docker and try again."
    exit 1
fi

# Check if logged in to GHCR
if ! docker info | grep -q "ghcr.io"; then
    echo "⚠️  You don't appear to be logged in to GHCR."
    echo ""
    echo "To login to GitHub Container Registry:"
    echo "1. Create a GitHub Personal Access Token with 'write:packages' permission at:"
    echo "   https://github.com/settings/tokens"
    echo ""
    echo "2. Login with:"
    echo "   echo YOUR_PAT | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin"
    echo ""
    exit 1
fi

# Step 1: Build the image
echo ""
echo "📦 Building Docker image..."
docker compose build

# Step 2: Tag the image
echo ""
echo "🏷️  Tagging image..."
docker tag "stickmodel-stickmodel:latest" "$REGISTRY:$VERSION"
docker tag "stickmodel-stickmodel:latest" "$REGISTRY:latest"

# Step 3: Push to GHCR
echo ""
echo "⬆️  Pushing to GitHub Container Registry..."
docker push "$REGISTRY:$VERSION"
docker push "$REGISTRY:latest"

echo ""
echo "✅ Successfully pushed to GHCR!"
echo ""
echo "On your droplet, update docker-compose.yml:"
echo "  image: $REGISTRY:latest"
echo ""
echo "Then run:"
echo "  docker compose pull"
echo "  docker compose up -d"
echo ""
