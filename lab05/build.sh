#!/bin/bash

DOCKER_USERNAME="suwinho123"
BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ')
VERSION="v3"
NODE_ENV="production"

docker buildx create --name multiarch --use 2>/dev/null || true
docker buildx inspect 

echo "=== BACKEND ==="
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  --build-arg BUILD_DATE=$BUILD_DATE \
  --build-arg VERSION=$VERSION \
  --build-arg NODE_ENV=$NODE_ENV \
  -t $DOCKER_USERNAME/backend:$VERSION \
  -t $DOCKER_USERNAME/backend:latest \
  --push ./backend

echo "=== FRONTEND ==="
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  --build-arg BUILD_DATE=$BUILD_DATE \
  --build-arg VERSION=$VERSION \
  --build-arg NODE_ENV=$NODE_ENV \
  -t $DOCKER_USERNAME/frontend:$VERSION \
  -t $DOCKER_USERNAME/frontend:latest \
  --push ./frontend

docker buildx imagetools inspect $DOCKER_USERNAME/backend:$VERSION
docker buildx imagetools inspect $DOCKER_USERNAME/frontend:$VERSION


echo "=== Lokalny backend ==="
docker buildx build \
  --platform linux/amd64 \
  --build-arg BUILD_DATE=$BUILD_DATE \
  --build-arg VERSION=$VERSION \
  --build-arg NODE_ENV=$NODE_ENV \
  -t test-local/backend:$VERSION \
  --load ./backend

echo "=== Lokalny front ==="
docker buildx build \
  --platform linux/amd64 \
  --build-arg BUILD_DATE=$BUILD_DATE \
  --build-arg VERSION=$VERSION \
  --build-arg NODE_ENV=$NODE_ENV \
  -t test-local/frontend:$VERSION \
  --load ./frontend

echo ">>> Weryfikacja etykiet backend <<<"
docker inspect test-local/backend:$VERSION --format '{{json .Config.Labels}}'

echo ">>> Weryfikacja etykiet frontend <<<"
docker inspect test-local/frontend:$VERSION --format '{{json .Config.Labels}}'