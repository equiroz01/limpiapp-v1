#!/bin/bash

# LimpiApp - Database Restore Script
# Restores a database from a backup file

set -e

# Configuration
DB_NAME="${DB_NAME:-limpiapp_dev}"
DB_USER="${DB_USER:-limpiapp}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
BACKUP_DIR="../backups"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🔄 LimpiApp Database Restore"
echo "============================"
echo ""

# List available backups
echo "Available backups:"
ls -lh $BACKUP_DIR/*.sql.gz 2>/dev/null | awk '{print NR". "$9" ("$5")"}'

if [ $? -ne 0 ]; then
    echo -e "${RED}No backups found in $BACKUP_DIR${NC}"
    exit 1
fi

echo ""
read -p "Enter backup number to restore (or 'q' to quit): " BACKUP_NUM

if [ "$BACKUP_NUM" = "q" ]; then
    exit 0
fi

# Get the selected backup file
BACKUP_FILE=$(ls -t $BACKUP_DIR/*.sql.gz 2>/dev/null | sed -n "${BACKUP_NUM}p")

if [ -z "$BACKUP_FILE" ]; then
    echo -e "${RED}Invalid selection${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}⚠️  WARNING: This will DROP and recreate the database!${NC}"
echo "Database: $DB_NAME"
echo "Backup:   $BACKUP_FILE"
echo ""
read -p "Are you sure you want to continue? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "Restore cancelled"
    exit 0
fi

# Drop existing database
echo ""
echo "Dropping existing database..."
dropdb -h $DB_HOST -p $DB_PORT -U $DB_USER --if-exists $DB_NAME

# Create new database
echo "Creating database..."
createdb -h $DB_HOST -p $DB_PORT -U $DB_USER $DB_NAME

# Restore from backup
echo "Restoring from backup..."
gunzip -c $BACKUP_FILE | psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Database restored successfully!${NC}"
else
    echo ""
    echo -e "${RED}❌ Restore failed${NC}"
    exit 1
fi
