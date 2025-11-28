-- ============================================================================
-- MIGRACIÓN SEGURA: Campos para inscripciones completas 2026
-- Fecha: 2025-11-28
-- Descripción: Agrega campos críticos omitiendo duplicados
-- ============================================================================

-- ============================================================================
-- 1. AGREGAR CAMPOS A TABLA student
-- ============================================================================

-- DNI del alumno (CRÍTICO - identificación única)
ALTER TABLE student 
ADD COLUMN IF NOT EXISTS dni VARCHAR(20) UNIQUE AFTER maternal_surname;

-- Información médica
ALTER TABLE student 
ADD COLUMN IF NOT EXISTS health_insurance VARCHAR(100) AFTER shift;

ALTER TABLE student
ADD COLUMN IF NOT EXISTS affiliate_number VARCHAR(50) AFTER health_insurance;

ALTER TABLE student
ADD COLUMN IF NOT EXISTS allergies TEXT AFTER affiliate_number;

ALTER TABLE student
ADD COLUMN IF NOT EXISTS medications TEXT AFTER allergies;

ALTER TABLE student
ADD COLUMN IF NOT EXISTS medical_observations TEXT AFTER medications;

ALTER TABLE student
ADD COLUMN IF NOT EXISTS blood_type VARCHAR(5) AFTER medical_observations;

ALTER TABLE student
ADD COLUMN IF NOT EXISTS pediatrician_name VARCHAR(100) AFTER blood_type;

ALTER TABLE student
ADD COLUMN IF NOT EXISTS pediatrician_phone VARCHAR(20) AFTER pediatrician_name;

-- Autorizaciones
ALTER TABLE student
ADD COLUMN IF NOT EXISTS photo_authorization BOOLEAN DEFAULT FALSE AFTER pediatrician_phone;

ALTER TABLE student
ADD COLUMN IF NOT EXISTS trip_authorization BOOLEAN DEFAULT FALSE AFTER photo_authorization;

ALTER TABLE student
ADD COLUMN IF NOT EXISTS medical_attention_authorization BOOLEAN DEFAULT FALSE AFTER trip_authorization;

-- Estado y fechas
ALTER TABLE student
ADD COLUMN IF NOT EXISTS status ENUM('inscripto', 'activo', 'inactivo', 'egresado') DEFAULT 'inscripto' AFTER medical_attention_authorization;

ALTER TABLE student
ADD COLUMN IF NOT EXISTS enrollment_date DATE AFTER status;

ALTER TABLE student
ADD COLUMN IF NOT EXISTS withdrawal_date DATE AFTER enrollment_date;

-- Información adicional
ALTER TABLE student
ADD COLUMN IF NOT EXISTS has_siblings_in_school BOOLEAN DEFAULT FALSE AFTER withdrawal_date;

ALTER TABLE student
ADD COLUMN IF NOT EXISTS special_needs TEXT AFTER has_siblings_in_school;

ALTER TABLE student
ADD COLUMN IF NOT EXISTS vaccination_status ENUM('completo', 'incompleto', 'pendiente', 'no_informado') DEFAULT 'no_informado' AFTER special_needs;

ALTER TABLE student
ADD COLUMN IF NOT EXISTS observations TEXT AFTER vaccination_status;

-- ============================================================================
-- 2. AGREGAR CAMPOS A TABLA guardian
-- ============================================================================

-- DNI del responsable (CRÍTICO)
ALTER TABLE guardian 
ADD COLUMN IF NOT EXISTS dni VARCHAR(20) UNIQUE AFTER maternal_surname;

-- Información de contacto laboral
ALTER TABLE guardian
ADD COLUMN IF NOT EXISTS workplace VARCHAR(200) AFTER email_optional;

ALTER TABLE guardian
ADD COLUMN IF NOT EXISTS work_phone VARCHAR(20) AFTER workplace;

-- ============================================================================
-- 3. CREAR TABLA DE RELACIÓN student_guardian
-- ============================================================================

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
-- 4. AGREGAR CAMPOS A TABLA classroom (omitiendo shift que ya existe)
-- ============================================================================

ALTER TABLE classroom
ADD COLUMN IF NOT EXISTS academic_year INT AFTER capacity;

ALTER TABLE classroom
ADD COLUMN IF NOT EXISTS age_group INT AFTER academic_year;

ALTER TABLE classroom
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE AFTER age_group;

-- ============================================================================
-- 5. MEJORAR TABLA emergency_contact
-- ============================================================================

ALTER TABLE emergency_contact
ADD COLUMN IF NOT EXISTS student_id BIGINT AFTER id;

ALTER TABLE emergency_contact
ADD COLUMN IF NOT EXISTS priority INT DEFAULT 1 AFTER relationship;

ALTER TABLE emergency_contact
ADD COLUMN IF NOT EXISTS alternative_phone VARCHAR(20) AFTER phone;

ALTER TABLE emergency_contact
ADD COLUMN IF NOT EXISTS is_authorized_pickup BOOLEAN DEFAULT FALSE AFTER alternative_phone;

-- Agregar foreign key solo si no existe
SET @fk_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
                  WHERE TABLE_SCHEMA = 'kindergarten_db' 
                  AND TABLE_NAME = 'emergency_contact' 
                  AND CONSTRAINT_NAME = 'emergency_contact_ibfk_1');

SET @sql = IF(@fk_exists = 0, 
              'ALTER TABLE emergency_contact ADD FOREIGN KEY (student_id) REFERENCES student(id) ON DELETE CASCADE', 
              'SELECT "FK already exists" as status');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ============================================================================
-- 6. CREAR TABLA DE DOCUMENTOS
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
-- 7. CREAR TABLA DE HISTORIAL DE ESTADOS
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
-- 8. CREAR ÍNDICES ADICIONALES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_student_status ON student(status);
CREATE INDEX IF NOT EXISTS idx_student_classroom ON student(classroom_id);
CREATE INDEX IF NOT EXISTS idx_student_birth_date ON student(birth_date);
CREATE INDEX IF NOT EXISTS idx_student_dni ON student(dni);
CREATE INDEX IF NOT EXISTS idx_guardian_dni ON guardian(dni);
CREATE INDEX IF NOT EXISTS idx_guardian_phone ON guardian(phone);

-- ============================================================================
-- VERIFICACIÓN POST-MIGRACIÓN
-- ============================================================================

SELECT '✅ Migración completada exitosamente' as status;

SELECT COUNT(*) as total_students FROM student;
SELECT COUNT(*) as total_guardians FROM guardian;
SELECT COUNT(*) as total_classrooms FROM classroom;
