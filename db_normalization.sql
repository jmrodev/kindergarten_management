-- Script de normalización para mejorar la estructura de la base de datos del jardín de infantes
-- Este script mejora la normalización creando tablas para valores categóricos
-- para mejorar la integridad referencial y consistencia de datos

-- 1. Crear tabla para tipos de sangre
CREATE TABLE IF NOT EXISTS blood_types (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    type_name VARCHAR(10) UNIQUE NOT NULL COMMENT 'Tipo de sangre (ej: A+, O-, etc.)',
    description TEXT
);

-- Insertar valores comunes de tipos de sangre
INSERT IGNORE INTO blood_types (type_name, description) VALUES
('A+', 'Tipo A positivo'),
('A-', 'Tipo A negativo'),
('B+', 'Tipo B positivo'),
('B-', 'Tipo B negativo'),
('AB+', 'Tipo AB positivo'),
('AB-', 'Tipo AB negativo'),
('O+', 'Tipo O positivo'),
('O-', 'Tipo O negativo');

-- 2. Crear tabla para turnos (shifts)
CREATE TABLE IF NOT EXISTS shifts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    shift_name VARCHAR(20) UNIQUE NOT NULL COMMENT 'Nombre del turno',
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

-- Insertar valores de turnos
INSERT IGNORE INTO shifts (shift_name, description) VALUES
('Mañana', 'Turno de mañana'),
('Tarde', 'Turno de tarde'),
('Completo', 'Turno completo'),
('Mañana y Tarde', 'Turno completo con jornada extendida');

-- 3. Crear columna temporal para almacenar los valores actuales
-- Primero, agregamos columnas de referencia en la tabla student
ALTER TABLE student 
ADD COLUMN blood_type_id BIGINT NULL,
ADD COLUMN shift_id BIGINT NULL;

-- 4. Crear índices para las nuevas columnas
CREATE INDEX idx_student_blood_type ON student(blood_type_id);
CREATE INDEX idx_student_shift ON student(shift_id);

-- 5. Migrar datos existentes (aunque actualmente están vacíos, el script está preparado para cuando haya datos)
-- Para shift, actualizamos la columna shift_id basándonos en el valor actual de shift
UPDATE student s 
JOIN shifts sh ON s.shift = sh.shift_name 
SET s.shift_id = sh.id 
WHERE s.shift IS NOT NULL AND s.shift != '';

-- Para blood_type, actualizamos la columna blood_type_id basándonos en el valor actual de blood_type
UPDATE student s 
JOIN blood_types bt ON s.blood_type = bt.type_name 
SET s.blood_type_id = bt.id 
WHERE s.blood_type IS NOT NULL AND s.blood_type != '';

-- 6. Agregar llaves foráneas
-- Aseguramos que los valores existan antes de crear las llaves foráneas
ALTER TABLE student 
ADD CONSTRAINT fk_student_blood_type 
    FOREIGN KEY (blood_type_id) REFERENCES blood_types(id) 
    ON DELETE SET NULL ON UPDATE CASCADE,
ADD CONSTRAINT fk_student_shift 
    FOREIGN KEY (shift_id) REFERENCES shifts(id) 
    ON DELETE SET NULL ON UPDATE CASCADE;

-- 7. Finalmente, opcionalmente se puede eliminar los campos de texto si se desea mantener solo las referencias
-- Esto se haría después de asegurar que todos los datos han sido migrados exitosamente
-- ALTER TABLE student DROP COLUMN blood_type, DROP COLUMN shift;

-- 8. Para mantener compatibilidad, si se decide mantener ambos campos (texto y referenciado):
-- Mantener ambas columnas pero usar la referenciada para la lógica principal
-- La columna de texto puede servir para valores personalizados o no estándar

-- 9. Opcional: Crear vista para mantener compatibilidad con consultas existentes
CREATE OR REPLACE VIEW student_with_normalized_fields AS
SELECT 
    s.*,
    bt.type_name as blood_type_normalized,
    sh.shift_name as shift_normalized
FROM student s
LEFT JOIN blood_types bt ON s.blood_type_id = bt.id
LEFT JOIN shifts sh ON s.shift_id = sh.id;

-- 10. Extensiones futuras: Se pueden crear tablas similares para otros campos categóricos
-- Ejemplos: tipos de contacto de emergencia, categorías médicas, tipos de autorización, etc.

-- 11. Crear tabla para tipos de contactos de emergencia si es necesario
CREATE TABLE IF NOT EXISTS emergency_contact_types (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    type_name VARCHAR(50) UNIQUE NOT NULL COMMENT 'Nombre del tipo de contacto',
    description TEXT,
    priority_order INT DEFAULT 1
);

-- Insertar tipos comunes de contactos de emergencia
INSERT IGNORE INTO emergency_contact_types (type_name, description, priority_order) VALUES
('Padre', 'Contacto de emergencia - Padre', 1),
('Madre', 'Contacto de emergencia - Madre', 2),
('Tutor', 'Contacto de emergencia - Tutor legal', 3),
('Abuelo/Abuela', 'Contacto de emergencia - Familiar cercano', 4),
('Otro Familiar', 'Contacto de emergencia - Otro familiar', 5),
('Vecino', 'Contacto de emergencia - Vecino de confianza', 6);

-- 12. Agregar campo de tipo a la tabla de contactos de emergencia
ALTER TABLE emergency_contact 
ADD COLUMN contact_type_id BIGINT NULL,
ADD INDEX idx_emergency_contact_type (contact_type_id),
ADD CONSTRAINT fk_emergency_contact_type 
    FOREIGN KEY (contact_type_id) REFERENCES emergency_contact_types(id) 
    ON DELETE SET NULL ON UPDATE CASCADE;

-- 13. Crear tabla para categorías médicas
CREATE TABLE IF NOT EXISTS medical_categories (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

-- Insertar categorías médicas comunes
INSERT IGNORE INTO medical_categories (category_name, description, is_active) VALUES
('Alergias', 'Categoría para alergias del alumno', TRUE),
('Medicamentos', 'Categoría para medicamentos del alumno', TRUE),
('Observaciones Médicas', 'Categoría para observaciones médicas generales', TRUE);

