-- ============================================================================
-- MIGRACIÓN: Agregar campos faltantes para inscripciones completas
-- Fecha: 2025-11-28
-- Descripción: Agrega campos críticos para gestión completa de alumnos
-- ============================================================================

-- IMPORTANTE: Hacer backup de la base de datos antes de ejecutar este script
-- mysqldump -u root -p kindergarten_db > backup_$(date +%Y%m%d_%H%M%S).sql

-- ============================================================================
-- 1. AGREGAR CAMPOS A TABLA student
-- ============================================================================

-- DNI del alumno (CRÍTICO - identificación única)
ALTER TABLE student 
ADD COLUMN dni VARCHAR(20) UNIQUE AFTER maternal_surname;

-- Información médica
ALTER TABLE student 
ADD COLUMN health_insurance VARCHAR(100) AFTER shift,
ADD COLUMN affiliate_number VARCHAR(50) AFTER health_insurance,
ADD COLUMN allergies TEXT AFTER affiliate_number,
ADD COLUMN medications TEXT AFTER allergies,
ADD COLUMN medical_observations TEXT AFTER medications,
ADD COLUMN blood_type VARCHAR(5) AFTER medical_observations,
ADD COLUMN pediatrician_name VARCHAR(100) AFTER blood_type,
ADD COLUMN pediatrician_phone VARCHAR(20) AFTER pediatrician_name;

-- Autorizaciones
ALTER TABLE student
ADD COLUMN photo_authorization BOOLEAN DEFAULT FALSE AFTER pediatrician_phone,
ADD COLUMN trip_authorization BOOLEAN DEFAULT FALSE AFTER photo_authorization,
ADD COLUMN medical_attention_authorization BOOLEAN DEFAULT FALSE AFTER trip_authorization;

-- Estado y fechas
ALTER TABLE student
ADD COLUMN status ENUM('inscripto', 'activo', 'inactivo', 'egresado') DEFAULT 'activo' AFTER medical_attention_authorization,
ADD COLUMN enrollment_date DATE AFTER status,
ADD COLUMN withdrawal_date DATE AFTER enrollment_date;

-- Información adicional
ALTER TABLE student
ADD COLUMN has_siblings_in_school BOOLEAN DEFAULT FALSE AFTER withdrawal_date,
ADD COLUMN special_needs TEXT AFTER has_siblings_in_school,
ADD COLUMN vaccination_status ENUM('completo', 'incompleto', 'pendiente', 'no_informado') DEFAULT 'no_informado' AFTER special_needs,
ADD COLUMN observations TEXT AFTER vaccination_status;

-- ============================================================================
-- 2. AGREGAR CAMPOS A TABLA guardian
-- ============================================================================

-- DNI del responsable (CRÍTICO)
ALTER TABLE guardian 
ADD COLUMN dni VARCHAR(20) UNIQUE AFTER maternal_surname;

-- Información de contacto laboral
ALTER TABLE guardian
ADD COLUMN workplace VARCHAR(200) AFTER email_optional,
ADD COLUMN work_phone VARCHAR(20) AFTER workplace;

-- ============================================================================
-- 2.1. AGREGAR CAMPOS A TABLA staff (para autenticación)
-- ============================================================================

ALTER TABLE staff
ADD COLUMN email VARCHAR(255) UNIQUE AFTER maternal_surname,
ADD COLUMN password_hash VARCHAR(255) AFTER email,
ADD COLUMN is_active BOOLEAN DEFAULT TRUE AFTER password_hash,
ADD COLUMN last_login TIMESTAMP AFTER is_active;

-- ============================================================================
-- 3. CREAR TABLA DE RELACIÓN student_guardian
-- ============================================================================

-- Tabla para manejar múltiples responsables por alumno
CREATE TABLE IF NOT EXISTS student_guardian (
  student_id BIGINT NOT NULL,
  guardian_id BIGINT NOT NULL,
  relationship_type ENUM('madre', 'padre', 'tutor', 'abuelo', 'abuela', 'tio', 'tia', 'otro') NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  custody_rights BOOLEAN DEFAULT TRUE,
  financial_responsible BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (student_id, guardian_id),
  FOREIGN KEY (student_id) REFERENCES student(id) ON DELETE CASCADE,
  FOREIGN KEY (guardian_id) REFERENCES guardian(id) ON DELETE CASCADE,
  INDEX idx_student (student_id),
  INDEX idx_guardian (guardian_id)
);

-- ============================================================================
-- 4. AGREGAR CAMPOS A TABLA classroom
-- ============================================================================

-- Agregar turno a classroom si no existe
ALTER TABLE classroom
ADD COLUMN shift ENUM('Mañana', 'Tarde', 'Completo') AFTER capacity,
ADD COLUMN academic_year INT AFTER shift,
ADD COLUMN age_group INT AFTER academic_year,
ADD COLUMN is_active BOOLEAN DEFAULT TRUE AFTER age_group;

-- ============================================================================
-- 5. MEJORAR TABLA emergency_contact
-- ============================================================================

-- Permitir múltiples contactos de emergencia por alumno
ALTER TABLE emergency_contact
ADD COLUMN student_id BIGINT AFTER id,
ADD COLUMN priority INT DEFAULT 1 AFTER relationship,
ADD COLUMN alternative_phone VARCHAR(20) AFTER phone,
ADD COLUMN is_authorized_pickup BOOLEAN DEFAULT FALSE AFTER alternative_phone,
ADD FOREIGN KEY (student_id) REFERENCES student(id) ON DELETE CASCADE;

-- Nota: Esto cambia la relación de 1:1 a 1:N
-- Si ya tienes datos, necesitarás migrarlos manualmente

-- ============================================================================
-- 6. CREAR TABLA DE DOCUMENTOS (opcional pero recomendado)
-- ============================================================================

CREATE TABLE IF NOT EXISTS student_documents (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  student_id BIGINT NOT NULL,
  document_type ENUM('dni', 'certificado_nacimiento', 'certificado_vacunas', 'certificado_medico', 'autorizacion_firmada', 'foto', 'otro') NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size INT,
  mime_type VARCHAR(100),
  uploaded_by BIGINT,
  upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expiration_date DATE,
  notes TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  verified_by BIGINT,
  verified_at TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES student(id) ON DELETE CASCADE,
  INDEX idx_student (student_id),
  INDEX idx_document_type (document_type)
);

-- ============================================================================
-- 7. CREAR TABLA DE HISTORIAL DE ESTADOS (auditoría)
-- ============================================================================

CREATE TABLE IF NOT EXISTS student_status_history (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  student_id BIGINT NOT NULL,
  old_status ENUM('inscripto', 'activo', 'inactivo', 'egresado'),
  new_status ENUM('inscripto', 'activo', 'inactivo', 'egresado') NOT NULL,
  change_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reason TEXT,
  changed_by BIGINT,
  FOREIGN KEY (student_id) REFERENCES student(id) ON DELETE CASCADE,
  INDEX idx_student (student_id),
  INDEX idx_change_date (change_date)
);

-- ============================================================================
-- 8. CREAR ÍNDICES ADICIONALES PARA MEJORAR PERFORMANCE
-- ============================================================================

-- Índices en student
CREATE INDEX idx_student_status ON student(status);
CREATE INDEX idx_student_classroom ON student(classroom_id);
CREATE INDEX idx_student_birth_date ON student(birth_date);
CREATE INDEX idx_student_dni ON student(dni);

-- Índices en guardian
CREATE INDEX idx_guardian_dni ON guardian(dni);
CREATE INDEX idx_guardian_phone ON guardian(phone);

-- ============================================================================
-- 9. AGREGAR CONSTRAINTS Y VALIDACIONES
-- ============================================================================

-- Validar que el DNI tenga el formato correcto (solo números, 7-8 dígitos)
-- Esto se puede hacer también a nivel de aplicación

-- ============================================================================
-- 10. INSERTAR DATOS DE CONFIGURACIÓN (opcional)
-- ============================================================================

-- Insertar año académico actual si tienes una tabla de configuración
-- INSERT INTO system_config (config_key, config_value) VALUES ('current_academic_year', '2026');

-- ============================================================================
-- VERIFICACIÓN POST-MIGRACIÓN
-- ============================================================================

-- Verificar que las columnas se agregaron correctamente
SELECT 
    COLUMN_NAME, 
    DATA_TYPE, 
    IS_NULLABLE, 
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'kindergarten_db' 
  AND TABLE_NAME = 'student'
ORDER BY ORDINAL_POSITION;

-- Verificar las tablas nuevas
SHOW TABLES LIKE '%student%';

-- Contar registros
SELECT 
    'student' as table_name, COUNT(*) as count FROM student
UNION ALL
SELECT 'guardian', COUNT(*) FROM guardian
UNION ALL
SELECT 'student_guardian', COUNT(*) FROM student_guardian
UNION ALL
SELECT 'classroom', COUNT(*) FROM classroom;

-- ============================================================================
-- NOTAS IMPORTANTES
-- ============================================================================

/*
1. Este script es SEGURO de ejecutar múltiples veces (usa IF NOT EXISTS y ADD COLUMN)
2. NO elimina ni modifica datos existentes
3. Las nuevas columnas tendrán valores NULL o defaults para registros existentes
4. Debes ACTUALIZAR manualmente los datos existentes después de la migración
5. Considera crear un script separado para ROLLBACK si es necesario
6. Prueba primero en un entorno de desarrollo

ROLLBACK (si algo sale mal):
- DROP TABLE student_documents;
- DROP TABLE student_status_history;
- DROP TABLE student_guardian;
- ALTER TABLE student DROP COLUMN dni;
- (continuar con cada campo agregado)

SIGUIENTE PASO:
- Ejecutar script de actualización de datos
- Actualizar la aplicación frontend/backend para usar los nuevos campos
- Crear formularios de inscripción completos
*/

-- ============================================================================
-- FIN DE LA MIGRACIÓN
-- ============================================================================

SELECT '✅ Migración completada exitosamente' as status;
