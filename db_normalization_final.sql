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

-- 3. Crear tabla para tipos de contactos de emergencia
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

-- 4. Crear tabla para categorías médicas
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

-- 5. Agregar campo de tipo a la tabla de contactos de emergencia
-- Primero verificar si la columna ya existe
SET @column_exists = (
    SELECT COUNT(*) 
    FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'kindergarten_db' 
    AND TABLE_NAME = 'emergency_contact' 
    AND COLUMN_NAME = 'contact_type_id'
);

-- Si la columna no existe, añadirla
SET @sql = IF(@column_exists = 0, 
    "ALTER TABLE emergency_contact ADD COLUMN contact_type_id BIGINT NULL;", 
    "SELECT 'Column already exists' as message;");
PREPARE stmt FROM @sql;
EXECUTE stmt;

-- Crear índice para la nueva columna
CREATE INDEX IF NOT EXISTS idx_emergency_contact_type ON emergency_contact (contact_type_id);

-- Agregar restricción de clave foránea
ALTER TABLE emergency_contact 
ADD CONSTRAINT IF NOT EXISTS fk_emergency_contact_type 
    FOREIGN KEY (contact_type_id) REFERENCES emergency_contact_types(id) 
    ON DELETE SET NULL ON UPDATE CASCADE;

-- Este script mejora la normalización de la base de datos permitiendo:
-- - Valores consistentes a través de la aplicación
-- - Facilitar mantenimiento y actualización de listas estándar
-- - Mejor integridad referencial
-- - Soporte para valores internacionales o personalizados
-- - Facilitar reportes y análisis de datos categóricos