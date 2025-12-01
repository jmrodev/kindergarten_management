#!/bin/bash
# Script para inicializar el proyecto frontend

echo "Inicializando proyecto frontend del sistema de gestión de jardín de infantes..."

# Verificar si node está instalado
if ! [ -x "$(command -v node)" ]; then
  echo 'Error: Node.js no está instalado.' >&2
  exit 1
fi

# Verificar si npm está instalado
if ! [ -x "$(command -v npm)" ]; then
  echo 'Error: npm no está instalado.' >&2
  exit 1
fi

echo "Node.js y npm están instalados."

# Instalar dependencias
echo "Instalando dependencias..."
npm install

# Crear archivo .env si no existe
if [ ! -f .env ]; then
    echo "Creando archivo .env..."
    echo "REACT_APP_API_URL=http://localhost:3000/api" > .env
    echo "Archivo .env creado con configuración por defecto."
fi

echo "Proyecto inicializado correctamente."
echo ""
echo "Para iniciar el servidor de desarrollo, use: npm start"
echo "Para crear una versión de producción, use: npm run build"