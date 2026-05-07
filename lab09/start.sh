#!/bin/bash
set -x

USER="suwinho123"
VERSION="v6"
proxy_net="bridge-net"
db_net="db-net"
app_net="redis-net"

echo "=== 1. Czyszczenie ==="
docker rm -f frontend api-a api-b postgres-db redis-db worker
docker network rm $proxy_net $app_net $db_net 2>/dev/null || true
docker network create --subnet 172.18.0.0/24 --gateway 172.18.0.1 $proxy_net
docker network create --subnet 172.19.0.0/24 --gateway 172.19.0.1 $app_net
docker network create --subnet 172.20.0.0/24 --gateway 172.20.0.1 $db_net

echo "=== 2. Infrastruktura ==="
docker volume create pgdata

docker run -d --name postgres-db --network $db_net \
  -v pgdata:/var/lib/postgresql/data \
  -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password -e POSTGRES_DB=productsdb \
  postgres:15-alpine

docker run -d --name redis-db --network $app_net --tmpfs /data redis:7-alpine

echo "Czekam 10 sekund na start PostgreSQL i Redis..."
sleep 10

docker run -d --name worker --network $db_net \
  -e INSTANCE_ID="Worker" \
  -e PGHOST="postgres-db" -e PGUSER="user" -e PGPASSWORD="password" -e PGDATABASE="productsdb" \
  -e REDIS_URL="redis://redis-db:6379" \
  $USER/backend:$VERSION

docker network connect $app_net worker

echo "=== 3. Backend ==="
docker run -d --name api-a --network $proxy_net \
  -e INSTANCE_ID="Serwer-A" \
  -e PGHOST="postgres-db" -e PGUSER="user" -e PGPASSWORD="password" -e PGDATABASE="productsdb" \
  -e REDIS_URL="redis://redis-db:6379" \
  --ip 172.18.0.10 \
  --mac-address 02:42:ac:14:00:0a \
  $USER/backend:$VERSION

docker network connect $db_net api-a
docker network connect $app_net api-a

docker run -d --name api-b --network $proxy_net \
  -e INSTANCE_ID="Serwer-B" \
  -e PGHOST="postgres-db" -e PGUSER="user" -e PGPASSWORD="password" -e PGDATABASE="productsdb" \
  -e REDIS_URL="redis://redis-db:6379" \
  --ip 172.18.0.11 \
  --mac-address 02:42:ac:14:00:0b \
  $USER/backend:$VERSION

docker network connect $db_net api-b
docker network connect $app_net api-b

echo "=== 4. Frontend ==="
docker run -d --name frontend --network $proxy_net -p 80:80 \
  -v "$(pwd)/nginx.conf:/etc/nginx/nginx.conf:ro" \
  $USER/frontend:$VERSION

echo "=== 5. Status ==="
sleep 5
docker ps
echo "Aplikacja: http://localhost"

echo "=== 6. TEST DNS ==="
docker exec api-a ping -c 3 api-b
docker run -d --name test-default-a alpine sleep 10
docker run -d --name test-default-b alpine sleep 10
docker exec test-default-a ping -c 1 test-default-b || echo "POTWIERDZONE: Ping po nazwie nie działa w sieci domyślnej."
docker rm -f test-default-a test-default-b

echo "=== 7. TEST IZOLACJI ==="
docker exec frontend ping -c 1 postgres-db || echo "Izolacja działa - Frontend nie widzi bazy"

echo "=== 8. Test Host i None ==="
docker run --rm --network none alpine ip addr
docker run --rm --network host alpine ip addr