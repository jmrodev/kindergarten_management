#!/bin/bash
# Script para verificar inscripciones en la BD

echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║       VERIFICACIÓN DE INSCRIPCIONES - Base de Datos             ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

# Función para ejecutar query
run_query() {
    mysql -u root -pjmro1975 kindergarten_db -e "$1" 2>/dev/null
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 RESUMEN GENERAL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

run_query "
SELECT 
    COUNT(*) as total_alumnos,
    SUM(CASE WHEN dni IS NOT NULL THEN 1 ELSE 0 END) as con_dni,
    SUM(CASE WHEN health_insurance IS NOT NULL THEN 1 ELSE 0 END) as con_obra_social,
    SUM(CASE WHEN birth_date IS NOT NULL THEN 1 ELSE 0 END) as con_fecha_nac,
    SUM(CASE WHEN emergency_contact_id IS NOT NULL THEN 1 ELSE 0 END) as con_contacto_emerg
FROM student 
WHERE status = 'inscripto';
"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 ÚLTIMAS 10 INSCRIPCIONES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

run_query "
SELECT 
    s.id,
    CONCAT(s.first_name, ' ', s.paternal_surname) as nombre_completo,
    s.dni,
    s.shift as turno,
    c.name as sala,
    DATE_FORMAT(s.enrollment_date, '%d/%m/%Y %H:%i') as fecha_inscripcion,
    s.health_insurance as obra_social
FROM student s
LEFT JOIN classroom c ON s.classroom_id = c.id
WHERE s.status = 'inscripto'
ORDER BY s.id DESC
LIMIT 10;
"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "👨‍👩‍👧 RESPONSABLES VINCULADOS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

run_query "
SELECT 
    COUNT(DISTINCT sg.student_id) as alumnos_con_responsable,
    COUNT(*) as total_relaciones
FROM student_guardian sg
INNER JOIN student s ON sg.student_id = s.id
WHERE s.status = 'inscripto';
"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📄 DOCUMENTOS SUBIDOS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

run_query "
SELECT 
    document_type as tipo,
    COUNT(*) as cantidad
FROM student_documents
GROUP BY document_type;
"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⚠️  INSCRIPCIONES INCOMPLETAS (sin DNI o sin obra social)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

run_query "
SELECT 
    s.id,
    CONCAT(s.first_name, ' ', s.paternal_surname) as nombre,
    CASE WHEN s.dni IS NULL THEN 'Sin DNI' ELSE 'OK' END as dni_status,
    CASE WHEN s.health_insurance IS NULL THEN 'Sin O.Social' ELSE 'OK' END as os_status,
    CASE WHEN s.emergency_contact_id IS NULL THEN 'Sin Contacto' ELSE 'OK' END as ec_status
FROM student s
WHERE s.status = 'inscripto'
  AND (s.dni IS NULL OR s.health_insurance IS NULL OR s.emergency_contact_id IS NULL)
ORDER BY s.id DESC
LIMIT 10;
"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Verificación completada"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Para ver una inscripción específica:"
echo "  mysql -u root -pjmro1975 kindergarten_db -e \"SELECT * FROM student WHERE id = ID_ALUMNO\\G\""
echo ""
echo "Para ver los documentos de un alumno:"
echo "  mysql -u root -pjmro1975 kindergarten_db -e \"SELECT * FROM student_documents WHERE student_id = ID_ALUMNO;\""
echo ""
