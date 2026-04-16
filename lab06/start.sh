#!/bin/bash
set -x

USER="suwinho123"
VERSION="v2"
NET="demo-net"


echo "=== 1. Czyszczenie ==="
docker rm -f frontend api-a api-b postgres-db redis-db
docker network create $NET

echo "=== 2. Infrastruktura ==="
docker volume create pgdata

docker run -d --name postgres-db --network $NET \
  -v pgdata:/var/lib/postgresql/data \
  -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password -e POSTGRES_DB=productsdb \
  postgres:15-alpine

docker run -d --name redis-db --network $NET --tmpfs /data redis:7-alpine

echo "Czekam 5 sekund na start PostgreSQL..."
sleep 5

echo "=== 3. Backend ==="
docker run -d --name api-a --network $NET \
  -e INSTANCE_ID="Serwer-A" \
  -e PGHOST="postgres-db" -e PGUSER="user" -e PGPASSWORD="password" -e PGDATABASE="productsdb" \
  -e REDIS_URL="redis://redis-db:6379" \
  $USER/backend:$VERSION

docker run -d --name api-b --network $NET \
  -e INSTANCE_ID="Serwer-B" \
  -e PGHOST="postgres-db" -e PGUSER="user" -e PGPASSWORD="password" -e PGDATABASE="productsdb" \
  -e REDIS_URL="redis://redis-db:6379" \
  $USER/backend:$VERSION

echo "=== 4. Frontend ==="
docker run -d --name frontend --network $NET -p 80:80 \
  -v "$(pwd)/nginx.conf:/etc/nginx/nginx.conf:ro" \
  $USER/frontend:$VERSION

echo "=== 5. Status ==="
sleep 3
docker ps
echo "Aplikacja: http://localhost"