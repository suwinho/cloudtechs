#!/bin/bash
set -e 

USER="suwinho123"
FRONT_IMG="$USER/frontend"
BACK_IMG="$USER/backend"
NET="demo-net"

echo "Czyszczenie starego środowiska"
docker rm -f frontend api-a api-b postgres-db 2>/dev/null || true
docker network create $NET 2>/dev/null || true

echo "🗄️ 1.5 Uruchamianie bazy PostgreSQL"
docker run -d --name postgres-db --network $NET -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password -e POSTGRES_DB=productsdb postgres:15-alpine

echo "🏗️ 2. Budowanie obrazów"
docker build -t $BACK_IMG:latest ./backend
docker build -t $FRONT_IMG:v2 ./frontend

echo "🚀 3. Uruchamianie instancji Backend"
docker run -d --name api-a --network $NET -e INSTANCE_ID="Serwer-A" -e PGHOST="postgres-db" -e PGPORT="5432" -e PGUSER="user" -e PGPASSWORD="password" -e PGDATABASE="productsdb" $BACK_IMG:latest
docker run -d --name api-b --network $NET -e INSTANCE_ID="Serwer-B" -e PGHOST="postgres-db" -e PGPORT="5432" -e PGUSER="user" -e PGPASSWORD="password" -e PGDATABASE="productsdb" $BACK_IMG:latest

echo "🌐 4. Uruchamianie Frontendu"
docker run -d --name frontend --network $NET -p 80:80 $FRONT_IMG:v2

echo "⏳ 5. Oczekiwanie na start usług (5s)..."
sleep 60

echo "📊 6. TESTY LOAD BALANCINGU (2 próby)..."
echo "--------------------------------------------"

echo "Próba 1:"
curl -s http://localhost/api/stats | grep -o '"instanceId":"[^"]*"' || echo "Błąd połączenia!"

echo "Próba 2:"
curl -s http://localhost/api/stats | grep -o '"instanceId":"[^"]*"' || echo "Błąd połączenia!"
