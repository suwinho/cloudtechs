#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="backup_pgdata_${TIMESTAMP}.tar.gz"

echo "=== Tworzenie kopii zapasowej woluminu pgdata ==="
docker run --rm -v pgdata:/data:ro -v "$(pwd):/backup" alpine tar czf /backup/$BACKUP_FILE -C /data .

echo "Utworzono plik backupu: $BACKUP_FILE"