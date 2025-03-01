#!/bin/bash

# Set path variables
APP_PATH="/var/www/hacktrack"
BACKUP_DIR="/tmp/mysql_backups"
BUCKET_NAME="hacktrack-db-backups"
DATE=$(date +%Y-%m-%d)

# Source Laravel environment variables
if [ -f "$APP_PATH/.env" ]; then
    export $(grep -v '^#' "$APP_PATH/.env" | xargs)
else
    echo "Error: .env file not found"
    exit 1
fi

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Dump the database using Laravel env variables
mysqldump -u "$DB_USERNAME" -p"$DB_PASSWORD" "$DB_DATABASE" | gzip > "$BACKUP_DIR/$DB_DATABASE-$DATE.sql.gz"

# Upload to Google Cloud Storage
gsutil cp "$BACKUP_DIR/$DB_DATABASE-$DATE.sql.gz" "gs://$BUCKET_NAME/"

# Clean up local backup
rm -f "$BACKUP_DIR/$DB_DATABASE-$DATE.sql.gz"

# Log completion
echo "Backup completed at $(date)"