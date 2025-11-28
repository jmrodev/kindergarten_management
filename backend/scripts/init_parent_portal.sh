#!/bin/bash

# Script para inicializar las tablas del portal de padres

# Cambiar al directorio del script
cd "$(dirname "$0")"

# Verificar que existe el archivo .env en el directorio backend
if [ ! -f ../.env ]; then
    echo "❌ Error: No se encuentra el archivo .env en backend/"
    echo "   Copia .env.example a .env y configura las variables"
    exit 1
fi

source ../.env

echo "🔧 Inicializando tablas del portal de padres..."
echo "   Base de datos: ${DB_NAME}"
echo ""

# Ejecutar el schema
mariadb -h ${DB_HOST} -u ${DB_USER} -p${DB_PASSWORD} ${DB_NAME} < ../../db/parent_portal_schema.sql 2>&1 | grep -v "Deprecated"

if [ $? -eq 0 ] || [ $? -eq 1 ]; then
    echo ""
    echo "✅ Tablas del portal de padres creadas exitosamente"
    echo ""
    echo "Tablas creadas:"
    mariadb -h ${DB_HOST} -u ${DB_USER} -p${DB_PASSWORD} ${DB_NAME} -e "SHOW TABLES LIKE 'parent%';" 2>/dev/null | tail -n +2
    echo ""
    echo "📝 Próximos pasos:"
    echo "   1. Configura Google OAuth en backend/.env"
    echo "   2. Reinicia el servidor: node server.js"
    echo "   3. Accede al portal: http://localhost:5173/parent-portal"
    echo ""
    echo "📚 Ver guía completa: documentation/SETUP_PORTAL_RAPIDO.md"
else
    echo ""
    echo "❌ Error al crear las tablas"
    exit 1
fi
