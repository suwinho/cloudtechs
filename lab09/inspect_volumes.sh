#!/bin/bash
VOLUMES=("pgdata")

echo "=== Analiza woluminów ==="
for VOLUME in "${VOLUMES[@]}"; do
  echo "-----------------------------------"
  echo "Nazwa woluminu: $VOLUME"
  
  # 1. Lokalizacja na hoście
  MOUNTPOINT=$(docker volume inspect $VOLUME --format '{{.Mountpoint}}' 2>/dev/null)
  if [ -z "$MOUNTPOINT" ]; then
    echo "Wolumin nie istnieje."
    continue
  fi
  echo "Lokalizacja na hoście: $MOUNTPOINT"
  
  # 2. Rozmiar
  SIZE=$(docker run --rm -v $VOLUME:/data alpine du -sh /data | cut -f1)
  echo "Rozmiar danych: $SIZE"
  
  # 3. Używające kontenery
  echo "Używające kontenery:"
  docker ps --filter volume=$VOLUME --format "  - {{.Names}} ({{.Image}})"
done
echo "-----------------------------------"
