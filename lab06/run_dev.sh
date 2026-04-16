#!/bin/bash
echo "=== Uruchamianie trybu deweloperskiego (Hot Reload) ==="
docker run -d \
  --name api-dev \
  --network demo-net \
  -p 3001:3000 \
  -v "$(pwd)/backend:/app" \
  -w /app \
  -e INSTANCE_ID="Serwer-Dev" \
  -e PGHOST="postgres-db" \
  -e PGUSER="user" \
  -e PGPASSWORD="password" \
  -e PGDATABASE="productsdb" \
  -e REDIS_URL="redis://redis-db:6379" \
  node:18-alpine \
  sh -c "npm install && npx -y nodemon server.js"
echo "Obserwacja włączona. Zmień cokolwiek w backend/server.js na swoim komputerze, a serwer Node sam się zrestartuje!"