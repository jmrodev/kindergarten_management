#!/bin/bash

# Script para cargar datos de ejemplo en la base de datos del jardín de infantes

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║     CARGA DE DATOS DE EJEMPLO - JARDÍN DE INFANTES            ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "Este script cargará datos de ejemplo en la base de datos:"
echo "  - 5 Salas (Roja, Azul, Verde, Amarilla, Naranja)"
echo "  - 15 Direcciones"
echo "  - 15 Contactos de emergencia"
echo "  - 99 Alumnos (algunos hermanos comparten datos)"
echo ""
echo "⚠️  ADVERTENCIA: Esto eliminará todos los datos existentes"
echo ""
read -p "¿Desea continuar? (s/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Ss]$ ]]
then
    echo ""
    echo "📊 Cargando datos..."
    echo ""
    
    # Ejecutar el script SQL
    sudo mariadb < /home/jmro/Escritorio/kindergarten_project_guide/db/sample_data.sql
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ ¡Datos cargados exitosamente!"
        echo ""
        echo "Puedes verificar los datos ejecutando:"
        echo "  sudo mariadb -e 'USE kindergarten_db; SELECT COUNT(*) FROM student;'"
        echo ""
    else
        echo ""
        echo "❌ Error al cargar los datos"
        echo ""
    fi
else
    echo ""
    echo "❌ Operación cancelada"
    echo ""
fi
