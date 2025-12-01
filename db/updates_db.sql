-- Database Updates based on TODO documentation
-- This script adds missing tables and updates existing tables to complete the kindergarten system

-- 1. Create meeting_minutes table
CREATE TABLE meeting_minutes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    meeting_type ENUM('directivos_familia', 'apoyo_familia', 'personal'),
    meeting_date DATE,
    meeting_time TIME,
    participants TEXT,
    purpose TEXT,
    conclusions TEXT,
    responsible_staff_id BIGINT,
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by BIGINT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (responsible_staff_id) REFERENCES staff(id),
    FOREIGN KEY (created_by) REFERENCES staff(id),
    FOREIGN KEY (updated_by) REFERENCES staff(id)
);

-- 2. Create vaccination_records table
CREATE TABLE vaccination_records (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_id BIGINT,
    vaccine_name TEXT,
    vaccine_date DATE,
    batch_number TEXT,
    dose_number INT,
    next_due_date DATE,
    status ENUM('activo', 'faltante', 'completo', 'exento'),
    administered_by TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student(id)
);

-- 3. Create document_review table
CREATE TABLE document_review (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    document_type ENUM('alumno', 'padre', 'personal', 'acta', 'salida', 'permiso', 'otro'),
    document_id BIGINT,  -- Referencia al ID del documento según el tipo
    reviewer_id BIGINT,
    review_date TIMESTAMP,
    status ENUM('pendiente', 'verificado', 'rechazado'),
    notes TEXT,
    verified_delivery BOOLEAN DEFAULT FALSE,
    delivery_verified_by BIGINT,
    delivery_verified_at TIMESTAMP NULL,
    FOREIGN KEY (reviewer_id) REFERENCES staff(id),
    FOREIGN KEY (delivery_verified_by) REFERENCES staff(id)
);

-- 4. Update calendar table - modify event_type enum
ALTER TABLE calendar MODIFY event_type ENUM('inscripcion', 'inicio_clases', 'fin_clases', 'vacaciones', 'invierno', 'feriado', 'personal_activo', 'dia_maestro', 'arte', 'musica', 'gimnasia', 'ingles', 'expresion_corporal', 'salida', 'reunion_directivos_familia', 'reunion_apoyo_familia', 'reunion_personal', 'celebracion', 'evento_especial');

-- 5. Update attendance table - add staff_id for staff attendance
ALTER TABLE attendance ADD COLUMN staff_id BIGINT;
ALTER TABLE attendance ADD FOREIGN KEY (staff_id) REFERENCES staff(id);

-- 6. Update activity table - add classroom_id to relate activities with classrooms
ALTER TABLE activity ADD COLUMN classroom_id BIGINT;
ALTER TABLE activity ADD FOREIGN KEY (classroom_id) REFERENCES classroom(id);

-- 7. Update calendar table - add staff_id for specific staff events
ALTER TABLE calendar ADD COLUMN staff_id BIGINT;
ALTER TABLE calendar ADD FOREIGN KEY (staff_id) REFERENCES staff(id);

-- 8. Remove duplicate views (keeping the last definition for each)
DROP VIEW IF EXISTS v_lottery_list_simple;
CREATE OR REPLACE VIEW v_lottery_list_simple AS
SELECT
    s.id,
    CONCAT(s.first_name, ' ', s.paternal_surname, IFNULL(CONCAT(' ', s.maternal_surname), '')) AS full_name,
    s.dni
FROM student s
WHERE s.status = 'sorteo'
ORDER BY s.enrollment_date ASC;

-- 9. Update existing views to include vaccination information

-- Update v_preinscriptos_with_pending_docs to include vaccination information
DROP VIEW IF EXISTS v_preinscriptos_with_pending_docs;
CREATE OR REPLACE VIEW v_preinscriptos_with_pending_docs AS
SELECT
    s.id,
    CONCAT(s.first_name, ' ', s.paternal_surname, IFNULL(CONCAT(' ', s.maternal_surname), '')) AS full_name,
    s.dni,
    s.status,
    s.vaccination_status,
    sd.document_type,
    sd.notes,
    sd.upload_date,
    sd.delivery_verified,
    CONCAT(verified_by.first_name, ' ', verified_by.paternal_surname) AS delivery_verified_by_name,
    vr.vaccine_name AS pending_vaccine
FROM student s
LEFT JOIN student_documents sd ON s.id = sd.student_id
LEFT JOIN staff verified_by ON sd.delivery_verified_by = verified_by.id
LEFT JOIN vaccination_records vr ON s.id = vr.student_id AND vr.status = 'faltante'
WHERE s.status = 'preinscripto'
ORDER BY s.id, sd.upload_date ASC;

-- Update v_students_with_pending_docs to include vaccination information
CREATE OR REPLACE VIEW v_students_with_pending_docs AS
SELECT
    s.id,
    CONCAT(s.first_name, ' ', s.paternal_surname, IFNULL(CONCAT(' ', s.maternal_surname), '')) AS full_name,
    s.dni,
    s.status,
    s.classroom_id,
    c.name AS classroom_name,
    pd.document_type,
    pd.notes,
    pd.created_at AS required_date,
    pd.completed_at,
    CONCAT(completed_by.first_name, ' ', completed_by.paternal_surname) AS completed_by_name,
    s.vaccination_status
FROM student s
LEFT JOIN pending_documentation pd ON s.id = pd.student_id AND pd.completed_at IS NULL
LEFT JOIN classroom c ON s.classroom_id = c.id
LEFT JOIN staff completed_by ON pd.completed_by = completed_by.id
WHERE s.status IN ('inscripto', 'activo') AND pd.id IS NOT NULL
ORDER BY s.id, pd.created_at ASC;

-- 10. Create indexes for better performance
CREATE INDEX idx_vaccination_records_student_status ON vaccination_records(student_id, status);
CREATE INDEX idx_document_review_type_status ON document_review(document_type, status);