#!/bin/bash

# LimpiApp - Database Backup Script
# Creates a timestamped backup of the database

set -e

# Configuration
DB_NAME="${DB_NAME:-limpiapp_dev}"
DB_USER="${DB_USER:-limpiapp}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
BACKUP_DIR="../backups"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Generate filename with timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_backup_${TIMESTAMP}.sql"

echo "🔄 Creating backup of database: $DB_NAME"
echo "Backup file: $BACKUP_FILE"

# Create backup
pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -F p -f $BACKUP_FILE

if [ $? -eq 0 ]; then
    # Compress backup
    gzip $BACKUP_FILE
    echo "✅ Backup created successfully: ${BACKUP_FILE}.gz"

    # Show file size
    SIZE=$(du -h "${BACKUP_FILE}.gz" | cut -f1)
    echo "Backup size: $SIZE"

    # Clean old backups (keep last 10)
    echo ""
    echo "Cleaning old backups (keeping last 10)..."
    ls -t $BACKUP_DIR/*.sql.gz | tail -n +11 | xargs -r rm
    echo "✅ Cleanup complete"
else
    echo "❌ Backup failed"
    exit 1
fi
