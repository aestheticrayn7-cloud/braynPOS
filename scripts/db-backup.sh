#!/bin/bash

# Configuration
DB_NAME="braynpos"
DB_USER="postgres"
BACKUP_DIR="/c/Users/HP/Desktop/braynPOS/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
FILENAME="braynpos_backup_${TIMESTAMP}.sql"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo "--- BraynPOS Database Backup ---"
echo "Starting backup for ${DB_NAME} at ${TIMESTAMP}..."

# Execute pg_dump
# Note: This assumes pg_dump is in the PATH and password is provided via .pgpass or environment variable
# If running on Windows with Git Bash/WSL:
pg_dump -U "$DB_USER" -d "$DB_NAME" -F p > "${BACKUP_DIR}/${FILENAME}"

if [ $? -eq 0 ]; then
    echo "SUCCESS: Backup saved to ${BACKUP_DIR}/${FILENAME}"
    # Delete backups older than 7 days
    find "$BACKUP_DIR" -maxdepth 1 -name "braynpos_backup_*.sql" -mtime +7 -delete
    echo "Old backups cleaned up."
else
    echo "ERROR: Backup failed!"
    exit 1
fi
