#!/bin/bash
ARCHIVE=$1

if [ -z "$ARCHIVE" ]; then
  echo "Użycie: ./restore.sh <nazwa_pliku_backupu>"
  exit 1
fi

echo "=== Przywracanie woluminu pgdata z $ARCHIVE ==="
# Zatrzymanie kontenera na czas zastepywania plików bazy
docker stop postgres-db > /dev/null

echo "Czyszczenie starych danych i rozpakowywanie..."
docker run --rm -v pgdata:/data -v "$(pwd):/backup" alpine \
  sh -c "rm -rf /data/* && tar xzf /backup/$ARCHIVE -C /data"

echo "Uruchamianie bazy PostgreSQL..."
docker start postgres-db > /dev/null

echo "Oczekiwanie na rozruch..."
sleep 3

echo "=== Weryfikacja dostepnosci bazy ==="
docker exec postgres-db pg_isready -U user -d productsdb
if [ $? -eq 0 ]; then
  echo "✅ Baza danych przywrócona i poprawnie działa!"
else
  echo "❌ Problem z bazą danych po przywróceniu!"
fi