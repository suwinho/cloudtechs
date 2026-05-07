#!/bin/bash
set -e

USER="suwinho123"
VERSION="v6"
BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ')

docker buildx inspect multiarch >/dev/null 2>&1 || docker buildx create --name multiarch --use
docker buildx use multiarch

echo "=== Backend (push) ==="
docker buildx build --platform linux/amd64,linux/arm64 --provenance=false \
  --build-arg BUILD_DATE=$BUILD_DATE --build-arg VERSION=$VERSION --build-arg NODE_ENV=production \
  -t $USER/backend:$VERSION -t $USER/backend:latest --push ./backend

echo "=== Frontend (push) ==="
docker buildx build --platform linux/amd64,linux/arm64 --provenance=false \
  --build-arg BUILD_DATE=$BUILD_DATE --build-arg VERSION=$VERSION --build-arg NODE_ENV=production \
  -t $USER/frontend:$VERSION -t $USER/frontend:latest --push ./frontend

echo "=== Weryfikacja ==="
docker buildx imagetools inspect $USER/backend:$VERSION
docker buildx imagetools inspect $USER/frontend:$VERSION

echo "=== Lokalny build ==="
docker build --build-arg BUILD_DATE=$BUILD_DATE --build-arg VERSION=$VERSION \
  -t $USER/backend:$VERSION ./backend

docker build --build-arg BUILD_DATE=$BUILD_DATE --build-arg VERSION=$VERSION \
  -t $USER/frontend:$VERSION ./frontend

echo "=== Etykiety ==="
docker inspect $USER/backend:$VERSION --format '{{json .Config.Labels}}'
docker inspect $USER/frontend:$VERSION --format '{{json .Config.Labels}}'