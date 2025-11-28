#!/bin/bash
# Ver la última inscripción registrada

mysql -u root -pjmro1975 kindergarten_db << 'SQL'
SELECT '=' as '====================================';
SELECT 'ÚLTIMA INSCRIPCIÓN REGISTRADA' as '';
SELECT '=' as '====================================';

SELECT 
    s.id as 'ID Inscripción',
    CONCAT(s.first_name, ' ', s.paternal_surname) as 'Nombre Completo',
    s.dni as 'DNI',
    s.birth_date as 'Fecha Nacimiento',
    s.health_insurance as 'Obra Social',
    s.shift as 'Turno',
    c.name as 'Sala',
    DATE_FORMAT(s.enrollment_date, '%d/%m/%Y %H:%i:%s') as 'Fecha Inscripción'
FROM student s
LEFT JOIN classroom c ON s.classroom_id = c.id
WHERE s.status = 'inscripto'
ORDER BY s.id DESC
LIMIT 1\G

SELECT '=' as '====================================';
SELECT 'RESPONSABLE' as '';
SELECT '=' as '====================================';

SELECT 
    CONCAT(g.first_name, ' ', g.paternal_surname) as 'Nombre Responsable',
    g.dni as 'DNI',
    g.phone as 'Teléfono',
    g.email_optional as 'Email',
    sg.relationship as 'Relación'
FROM student s
INNER JOIN student_guardian sg ON s.id = sg.student_id
INNER JOIN guardian g ON sg.guardian_id = g.id
WHERE s.status = 'inscripto'
ORDER BY s.id DESC
LIMIT 1\G

SELECT '=' as '====================================';
SELECT 'DOCUMENTOS SUBIDOS' as '';
SELECT '=' as '====================================';

SELECT 
    document_type as 'Tipo',
    file_name as 'Archivo',
    DATE_FORMAT(upload_date, '%d/%m/%Y %H:%i') as 'Fecha Subida'
FROM student_documents
WHERE student_id = (SELECT id FROM student WHERE status = 'inscripto' ORDER BY id DESC LIMIT 1);

SQL
