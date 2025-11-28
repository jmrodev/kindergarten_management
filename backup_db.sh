#!/bin/bash
# Script de backup de base de datos

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="db/backups"
mkdir -p $BACKUP_DIR

echo "🔄 Creando backup de la base de datos..."

# Backup de la base de datos (ajusta usuario y contraseña según tu configuración)
mysqldump -u root -p kindergarten_db > "$BACKUP_DIR/kindergarten_db_backup_$DATE.sql" 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Backup creado exitosamente: $BACKUP_DIR/kindergarten_db_backup_$DATE.sql"
else
    echo "❌ Error creando backup. Verifica tus credenciales MySQL."
fi
