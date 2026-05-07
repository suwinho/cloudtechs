#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="backup_pgdata_${TIMESTAMP}.tar.gz"

docker run --rm -v pgdata:/data -v "$(pwd):/backup" alpine tar -czf /backup/$BACKUP_FILE -C /data .

echo "Utworzono plik backupu: $BACKUP_FILE"