#!/bin/bash

# Script para inicializar la base de datos completa del jardín de infantes.
# Elimina la base de datos si existe, la crea y luego crea todas las tablas.

# Cambiar al directorio del script
cd "$(dirname "$0")"

# Verificar que existe el archivo .env en el directorio backend
if [ ! -f ../.env ]; then
    echo "❌ Error: No se encuentra el archivo .env en backend/"
    echo "   Copia .env.example a .env y configura las variables"
    exit 1
fi

source ../.env

echo "🔧 Inicializando la base de datos '${DB_NAME}'..."
echo "   Host: ${DB_HOST}"
echo "   Usuario: ${DB_USER}"
echo ""

# Ejecutar el schema completo
mariadb -h ${DB_HOST} -u ${DB_USER} -p${DB_PASSWORD} < ../../db/init_db.sql 2>&1 | grep -v "Deprecated"

if [ $? -eq 0 ] || [ $? -eq 1 ]; then
    echo ""
    echo "✅ Base de datos '${DB_NAME}' y todas las tablas creadas exitosamente."
    echo ""
    echo "Tablas creadas:"
    mariadb -h ${DB_HOST} -u ${DB_USER} -p${DB_PASSWORD} ${DB_NAME} -e "SHOW TABLES;" 2>/dev/null | tail -n +2
    echo ""
    echo "📝 Próximos pasos:"
    echo "   1. Puedes poblar la base de datos con datos de prueba si es necesario."
    echo "   2. Inicia el servidor: node server.js"
else
    echo ""
    echo "❌ Error al inicializar la base de datos."
    exit 1
fi
