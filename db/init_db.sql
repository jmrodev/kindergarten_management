-- SQL script to initialize the kindergarten database
-- Drops the database if it exists, creates it, and then creates all tables.

-- Database name
SET @DB_NAME = 'kindergarten_db';

-- Drop database if it exists
DROP DATABASE IF EXISTS kindergarten_db;

-- Create database
CREATE DATABASE kindergarten_db;

-- Use the newly created database
USE kindergarten_db;

-- ==========================================
-- 1. INDEPENDENT TABLES & CATEGORIES
-- ==========================================

-- Table: address
CREATE TABLE address (
    id INT PRIMARY KEY AUTO_INCREMENT,
    street TEXT,
    number TEXT,
    city TEXT,
    provincia TEXT,
    postal_code_optional TEXT
);

-- Table: access_level
CREATE TABLE access_level (
    id INT PRIMARY KEY AUTO_INCREMENT,
    access_name TEXT,
    description TEXT
);

-- Table: classroom
CREATE TABLE classroom (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name TEXT,
    capacity INT,
    shift ENUM('Mañana', 'Tarde', 'Completo'),
    academic_year INT,
    age_group INT,
    is_active BOOLEAN,
    teacher_id INT
);

-- Table: blood_types
CREATE TABLE blood_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type_name VARCHAR(10) UNIQUE NOT NULL COMMENT 'Tipo de sangre (ej: A+, O-, etc.)',
    description TEXT
);

-- Table: shifts
CREATE TABLE shifts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    shift_name VARCHAR(20) UNIQUE NOT NULL COMMENT 'Nombre del turno',
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

-- Table: emergency_contact_types
CREATE TABLE emergency_contact_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type_name VARCHAR(50) UNIQUE NOT NULL COMMENT 'Nombre del tipo de contacto',
    description TEXT,
    priority_order INT DEFAULT 1
);

-- Table: medical_categories
CREATE TABLE medical_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

-- Table: health_insurance_providers
CREATE TABLE health_insurance_providers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

-- Table: pediatricians
CREATE TABLE pediatricians (
    id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: system_module
CREATE TABLE system_module (
    id INT PRIMARY KEY AUTO_INCREMENT,
    module_name TEXT,
    module_key TEXT UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT
);

-- Table: permission_action
CREATE TABLE permission_action (
    id INT PRIMARY KEY AUTO_INCREMENT,
    action_name TEXT,
    action_key TEXT UNIQUE,
    description TEXT
);

-- ==========================================
-- 2. CORE SYSTEM TABLES
-- ==========================================

-- Table: role
CREATE TABLE role (
    id INT PRIMARY KEY AUTO_INCREMENT,
    role_name TEXT,
    access_level_id INT,
    FOREIGN KEY (access_level_id) REFERENCES access_level(id)
);

-- Table: staff
CREATE TABLE staff (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name TEXT,
    middle_name_optional TEXT,
    third_name_optional TEXT,
    paternal_surname TEXT,
    maternal_surname TEXT,
    dni TEXT UNIQUE,
    email TEXT UNIQUE,
    password_hash TEXT,
    is_active BOOLEAN,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    preferred_surname TEXT,
    address_id INT,
    phone TEXT,
    email_optional TEXT,
    classroom_id INT,
    role_id INT,
    FOREIGN KEY (address_id) REFERENCES address(id),
    FOREIGN KEY (classroom_id) REFERENCES classroom(id),
    FOREIGN KEY (role_id) REFERENCES role(id)
);

-- Add circular FK dependency for classroom -> staff (teacher)
ALTER TABLE classroom ADD FOREIGN KEY (teacher_id) REFERENCES staff(id) ON DELETE SET NULL;

-- Table: parent_portal_users
CREATE TABLE parent_portal_users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    google_id VARCHAR(255) UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NULL,
    name VARCHAR(255),
    avatar_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- Table: guardian
CREATE TABLE guardian (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name TEXT,
    middle_name_optional TEXT,
    paternal_surname TEXT,
    maternal_surname TEXT,
    preferred_surname TEXT,
    dni TEXT UNIQUE,
    address_id INT,
    phone TEXT,
    email_optional TEXT,
    workplace TEXT,
    work_phone TEXT,
    authorized_pickup BOOLEAN,
    authorized_change BOOLEAN,
    parent_portal_user_id INT,
    role_id INT,
    FOREIGN KEY (address_id) REFERENCES address(id),
    FOREIGN KEY (parent_portal_user_id) REFERENCES parent_portal_users(id) ON DELETE SET NULL,
    FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE SET NULL
);

-- Table: student
CREATE TABLE student (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name TEXT,
    middle_name_optional TEXT,
    third_name_optional TEXT,
    paternal_surname TEXT,
    maternal_surname TEXT,
    nickname_optional TEXT,
    dni TEXT UNIQUE,
    birth_date DATE,
    address_id INT,
    classroom_id INT,
    shift TEXT,
    gender ENUM('M', 'F'),
    status ENUM('preinscripto', 'pendiente', 'approved', 'sorteo', 'inscripto', 'activo', 'inactivo', 'egresado', 'rechazado'),
    enrollment_date DATE,
    withdrawal_date DATE,
    health_insurance TEXT,
    affiliate_number TEXT,
    allergies TEXT,
    medications TEXT,
    medical_observations TEXT,
    blood_type TEXT,
    pediatrician_name TEXT,
    pediatrician_phone TEXT,
    photo_authorization BOOLEAN,
    trip_authorization BOOLEAN,
    medical_attention_authorization BOOLEAN,
    has_siblings_in_school BOOLEAN,
    special_needs TEXT,
    vaccination_status ENUM('completo', 'incompleto', 'pendiente', 'no_informado'),
    observations TEXT,
    blood_type_id INT NULL,
    shift_id INT NULL,
    FOREIGN KEY (address_id) REFERENCES address(id),
    FOREIGN KEY (classroom_id) REFERENCES classroom(id),
    FOREIGN KEY (blood_type_id) REFERENCES blood_types(id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (shift_id) REFERENCES shifts(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Emergency contacts are now handled through guardian/student_guardian tables

-- Table: student_guardian
CREATE TABLE student_guardian (
    student_id INT,
    guardian_id INT,
    relationship_type ENUM('madre', 'padre', 'tutor', 'abuelo', 'abuela', 'tio', 'tia', 'otro'),
    is_primary BOOLEAN,
    is_emergency BOOLEAN DEFAULT FALSE COMMENT 'Contacto de emergencia prioritario',
    authorized_pickup BOOLEAN,
    authorized_diaper_change BOOLEAN,
    custody_rights BOOLEAN,
    financial_responsible BOOLEAN,
    notes TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    can_pickup BOOLEAN DEFAULT FALSE COMMENT 'Autorizado a retirar al alumno',
    has_restraining_order BOOLEAN DEFAULT FALSE COMMENT 'Posee restricción judicial para contacto',
    can_change_diaper BOOLEAN DEFAULT FALSE COMMENT 'Autorizado a cambiar pañales',
    PRIMARY KEY (student_id, guardian_id),
    FOREIGN KEY (student_id) REFERENCES student(id),
    FOREIGN KEY (guardian_id) REFERENCES guardian(id)
);

-- Table: student_documents
CREATE TABLE student_documents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT,
    document_type ENUM('dni', 'certificado_nacimiento', 'certificado_vacunas', 'certificado_medico', 'autorizacion_firmada', 'foto', 'otro'),
    file_name TEXT,
    file_path TEXT,
    file_size INT,
    mime_type TEXT,
    uploaded_by INT,
    upload_date TIMESTAMP,
    expiration_date DATE,
    notes TEXT,
    is_verified BOOLEAN,
    verified_by INT,
    verified_at TIMESTAMP,
    delivery_verified BOOLEAN DEFAULT FALSE,
    delivery_verified_by INT,
    delivery_verified_at TIMESTAMP NULL,
    FOREIGN KEY (student_id) REFERENCES student(id),
    FOREIGN KEY (verified_by) REFERENCES staff(id),
    FOREIGN KEY (delivery_verified_by) REFERENCES staff(id)
);

-- Table: vaccination_records
CREATE TABLE vaccination_records (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT,
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

-- Table: meeting_minutes
CREATE TABLE meeting_minutes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    meeting_type ENUM('directivos_familia', 'apoyo_familia', 'personal'),
    meeting_date DATE,
    meeting_time TIME,
    participants TEXT,
    purpose TEXT,
    conclusions TEXT,
    responsible_staff_id INT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (responsible_staff_id) REFERENCES staff(id),
    FOREIGN KEY (created_by) REFERENCES staff(id),
    FOREIGN KEY (updated_by) REFERENCES staff(id)
);

-- Table: document_review
CREATE TABLE document_review (
    id INT PRIMARY KEY AUTO_INCREMENT,
    document_type ENUM('alumno', 'padre', 'personal', 'acta', 'salida', 'permiso', 'otro'),
    document_id INT,
    reviewer_id INT,
    review_date TIMESTAMP,
    status ENUM('pendiente', 'verificado', 'rechazado'),
    notes TEXT,
    verified_delivery BOOLEAN DEFAULT FALSE,
    delivery_verified_by INT,
    delivery_verified_at TIMESTAMP NULL,
    FOREIGN KEY (reviewer_id) REFERENCES staff(id),
    FOREIGN KEY (delivery_verified_by) REFERENCES staff(id)
);

-- Table: attendance
CREATE TABLE attendance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT,
    staff_id INT,
    date DATE,
    status TEXT,
    leave_type_optional TEXT,
    classroom_id INT,
    FOREIGN KEY (student_id) REFERENCES student(id),
    FOREIGN KEY (staff_id) REFERENCES staff(id),
    FOREIGN KEY (classroom_id) REFERENCES classroom(id)
);

-- Table: calendar
CREATE TABLE calendar (
    id INT PRIMARY KEY AUTO_INCREMENT,
    date DATE,
    description TEXT,
    event_type ENUM('inscripcion', 'inicio_clases', 'fin_clases', 'vacaciones', 'invierno', 'feriado', 'personal_activo', 'dia_maestro', 'arte', 'musica', 'gimnasia', 'ingles', 'expresion_corporal', 'salida', 'reunion_directivos_familia', 'reunion_apoyo_familia', 'reunion_personal', 'celebracion', 'evento_especial'),
    classroom_id INT,
    staff_id INT,
    FOREIGN KEY (classroom_id) REFERENCES classroom(id),
    FOREIGN KEY (staff_id) REFERENCES staff(id)
);

-- Table: activity
CREATE TABLE activity (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name TEXT,
    description_optional TEXT,
    schedule_optional TEXT,
    teacher_id INT,
    classroom_id INT,
    FOREIGN KEY (teacher_id) REFERENCES staff(id),
    FOREIGN KEY (classroom_id) REFERENCES classroom(id)
);

-- Table: student_status_history
CREATE TABLE student_status_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT,
    old_status ENUM('preinscripto', 'pendiente', 'approved', 'sorteo', 'inscripto', 'activo', 'inactivo', 'egresado', 'rechazado'),
    new_status ENUM('preinscripto', 'pendiente', 'approved', 'sorteo', 'inscripto', 'activo', 'inactivo', 'egresado', 'rechazado'),
    change_date TIMESTAMP,
    reason TEXT,
    changed_by INT,
    FOREIGN KEY (student_id) REFERENCES student(id)
);

-- Table: parent_registration_drafts
CREATE TABLE parent_registration_drafts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    form_data JSON,
    current_step INT,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES parent_portal_users(id)
);

-- Table: pending_documentation
CREATE TABLE pending_documentation (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    document_type TEXT NOT NULL,
    required_by INT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    completed_by INT NULL,
    FOREIGN KEY (student_id) REFERENCES student(id) ON DELETE CASCADE,
    FOREIGN KEY (required_by) REFERENCES staff(id) ON DELETE SET NULL,
    FOREIGN KEY (completed_by) REFERENCES staff(id) ON DELETE SET NULL
);

-- Table: parent_portal_submissions
CREATE TABLE parent_portal_submissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    student_id INT,
    submitted_at TIMESTAMP,
    status ENUM('pending_review', 'approved', 'rejected') DEFAULT 'pending_review',
    approved_at TIMESTAMP NULL,
    approved_by INT NULL,
    rejected_at TIMESTAMP NULL,
    rejected_by INT NULL,
    rejected_reason TEXT,
    FOREIGN KEY (user_id) REFERENCES parent_portal_users(id),
    FOREIGN KEY (student_id) REFERENCES student(id),
    FOREIGN KEY (approved_by) REFERENCES staff(id),
    FOREIGN KEY (rejected_by) REFERENCES staff(id)
);

-- Table: role_permission
CREATE TABLE role_permission (
    role_id INT,
    module_id INT,
    action_id INT,
    is_granted BOOLEAN,
    updated_by INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id, module_id, action_id),
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (module_id) REFERENCES system_module(id),
    FOREIGN KEY (action_id) REFERENCES permission_action(id),
    FOREIGN KEY (updated_by) REFERENCES staff(id)
);

-- Table: permission_audit_log
CREATE TABLE permission_audit_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    role_id INT,
    module_id INT,
    action_id INT,
    previous_value BOOLEAN,
    new_value BOOLEAN,
    changed_by INT,
    ip_address TEXT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (module_id) REFERENCES system_module(id),
    FOREIGN KEY (action_id) REFERENCES permission_action(id),
    FOREIGN KEY (changed_by) REFERENCES staff(id)
);

-- Table: conversation
CREATE TABLE conversation (
    id INT PRIMARY KEY AUTO_INCREMENT,
    classroom_id INT,
    creation_date TIMESTAMP,
    FOREIGN KEY (classroom_id) REFERENCES classroom(id)
);

-- Table: conversation_guardian
CREATE TABLE conversation_guardian (
    conversation_id INT,
    guardian_id INT,
    PRIMARY KEY (conversation_id, guardian_id),
    FOREIGN KEY (conversation_id) REFERENCES conversation(id),
    FOREIGN KEY (guardian_id) REFERENCES guardian(id)
);

-- Table: conversation_staff
CREATE TABLE conversation_staff (
    conversation_id INT,
    staff_id INT,
    PRIMARY KEY (conversation_id, staff_id),
    FOREIGN KEY (conversation_id) REFERENCES conversation(id),
    FOREIGN KEY (staff_id) REFERENCES staff(id)
);

-- Table: guardian_message
CREATE TABLE guardian_message (
    id INT PRIMARY KEY AUTO_INCREMENT,
    conversation_id INT,
    sender_guardian_id INT,
    content TEXT,
    send_date TIMESTAMP,
    is_read BOOLEAN,
    FOREIGN KEY (conversation_id) REFERENCES conversation(id),
    FOREIGN KEY (sender_guardian_id) REFERENCES guardian(id)
);

-- Table: staff_message
CREATE TABLE staff_message (
    id INT PRIMARY KEY AUTO_INCREMENT,
    conversation_id INT,
    sender_staff_id INT,
    content TEXT,
    send_date TIMESTAMP,
    is_read BOOLEAN,
    FOREIGN KEY (conversation_id) REFERENCES conversation(id),
    FOREIGN KEY (sender_staff_id) REFERENCES staff(id)
);

-- ==========================================
-- 3. VIEWS & INDEXES
-- ==========================================

CREATE OR REPLACE VIEW v_role_permissions AS
SELECT
    r.id AS role_id,
    r.role_name,
    sm.id AS module_id,
    sm.module_name,
    sm.module_key,
    pa.id AS action_id,
    pa.action_name,
    pa.action_key,
    COALESCE(rp.is_granted, FALSE) AS has_permission
FROM role r
CROSS JOIN system_module sm
CROSS JOIN permission_action pa
LEFT JOIN role_permission rp ON r.id = rp.role_id AND sm.id = rp.module_id AND pa.id = rp.action_id;

CREATE OR REPLACE VIEW v_lottery_list_simple AS
SELECT
    s.id,
    CONCAT(s.first_name, ' ', s.paternal_surname, IFNULL(CONCAT(' ', s.maternal_surname), '')) AS full_name,
    s.dni
FROM student s
WHERE s.status = 'sorteo'
ORDER BY s.enrollment_date ASC;

CREATE OR REPLACE VIEW v_lottery_list AS
SELECT
    s.id,
    CONCAT(s.first_name, ' ', s.paternal_surname, IFNULL(CONCAT(' ', s.maternal_surname), '')) AS full_name,
    s.dni,
    s.birth_date,
    s.shift,
    s.health_insurance,
    s.has_siblings_in_school,
    s.enrollment_date,
    pps.submitted_at,
    pps.approved_at,
    s.status,
    c.name AS classroom_name,
    g.first_name AS guardian_first_name,
    g.paternal_surname AS guardian_paternal_surname,
    g.phone AS guardian_phone
FROM student s
LEFT JOIN parent_portal_submissions pps ON s.id = pps.student_id
LEFT JOIN classroom c ON s.classroom_id = c.id
LEFT JOIN student_guardian sg ON s.id = sg.student_id AND sg.is_primary = true
LEFT JOIN guardian g ON sg.guardian_id = g.id
WHERE s.status = 'sorteo'
ORDER BY pps.approved_at ASC;

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

CREATE OR REPLACE VIEW v_lottery_list_simple AS
SELECT
    s.id,
    CONCAT(s.first_name, ' ', s.paternal_surname, IFNULL(CONCAT(' ', s.maternal_surname), '')) AS full_name,
    s.dni
FROM student s
WHERE s.status = 'sorteo'
ORDER BY s.enrollment_date ASC;

CREATE OR REPLACE VIEW v_preinscriptos_with_pending_docs AS
SELECT
    s.id,
    CONCAT(s.first_name, ' ', s.paternal_surname, IFNULL(CONCAT(' ', s.maternal_surname), '')) AS full_name,
    s.dni,
    s.status,
    sd.document_type,
    sd.notes,
    sd.upload_date,
    sd.delivery_verified,
    CONCAT(verified_by.first_name, ' ', verified_by.paternal_surname) AS delivery_verified_by_name
FROM student s
LEFT JOIN student_documents sd ON s.id = sd.student_id
LEFT JOIN staff verified_by ON sd.delivery_verified_by = verified_by.id
WHERE s.status = 'preinscripto'
ORDER BY s.id, sd.upload_date ASC;

CREATE OR REPLACE VIEW v_students_pending_document_delivery AS
SELECT
    s.id,
    CONCAT(s.first_name, ' ', s.paternal_surname, IFNULL(CONCAT(' ', s.maternal_surname), '')) AS full_name,
    s.dni,
    s.status,
    COUNT(sd.id) AS total_documents,
    SUM(CASE WHEN sd.delivery_verified = TRUE THEN 1 ELSE 0 END) AS verified_deliveries
FROM student s
LEFT JOIN student_documents sd ON s.id = sd.student_id
WHERE s.status = 'preinscripto'
GROUP BY s.id
ORDER BY s.enrollment_date ASC;

CREATE INDEX idx_pending_documentation_student_completed ON pending_documentation(student_id, completed_at);
CREATE INDEX idx_vaccination_records_student_status ON vaccination_records(student_id, status);
CREATE INDEX idx_document_review_type_status ON document_review(document_type, status);

-- ==========================================
-- 4. INITIAL SEED DATA
-- ==========================================

INSERT INTO blood_types (type_name, description) VALUES
('A+', 'Tipo A positivo'), ('A-', 'Tipo A negativo'), ('B+', 'Tipo B positivo'),
('B-', 'Tipo B negativo'), ('AB+', 'Tipo AB positivo'), ('AB-', 'Tipo AB negativo'),
('O+', 'Tipo O positivo'), ('O-', 'Tipo O negativo');

INSERT INTO shifts (shift_name, description) VALUES
('Mañana', 'Turno de mañana'), ('Tarde', 'Turno de tarde'),
('Completo', 'Turno completo'), ('Mañana y Tarde', 'Turno completo con jornada extendida');

INSERT INTO emergency_contact_types (type_name, description, priority_order) VALUES
('Padre', 'Contacto de emergencia - Padre', 1), ('Madre', 'Contacto de emergencia - Madre', 2),
('Tutor', 'Contacto de emergencia - Tutor legal', 3), ('Abuelo/Abuela', 'Contacto de emergencia - Familiar cercano', 4),
('Otro Familiar', 'Contacto de emergencia - Otro familiar', 5), ('Vecino', 'Contacto de emergencia - Vecino de confianza', 6);

INSERT INTO medical_categories (category_name, description, is_active) VALUES
('Alergias', 'Categoría para alergias del alumno', TRUE),
('Medicamentos', 'Categoría para medicamentos del alumno', TRUE),
('Observaciones Médicas', 'Categoría para observaciones médicas generales', TRUE);

INSERT INTO system_module (module_name, module_key, description, is_active, display_order) VALUES
('Dashboard', 'dashboard', 'Visión general del sistema', TRUE, 1),
('Alumnos', 'alumnos', 'Gestión de información de alumnos', TRUE, 2),
('Salas', 'salas', 'Gestión de salas y asignación de alumnos', TRUE, 3),
('Personal', 'personal', 'Gestión de información del personal', TRUE, 4),
('Responsables', 'responsables', 'Gestión de tutores y responsables', TRUE, 5),
('Asistencia', 'asistencia', 'Registro y gestión de asistencia', TRUE, 6),
('Reportes', 'reportes', 'Generación de informes y estadísticas', TRUE, 7),
('Mensajería', 'mensajeria', 'Comunicación interna con padres y personal', TRUE, 8),
('Configuración', 'configuracion', 'Configuración de permisos y roles', TRUE, 9),
('Roles', 'roles', 'Gestión de roles del sistema', TRUE, 10);

INSERT INTO permission_action (action_name, action_key, description) VALUES
('Ver', 'ver', 'Permite visualizar información'), ('Crear', 'crear', 'Permite crear nuevos registros'),
('Editar', 'editar', 'Permite modificar registros existentes'), ('Eliminar', 'eliminar', 'Permite eliminar registros'),
('Registrar', 'registrar', 'Permite registrar asistencia u otros eventos'), ('Reportes', 'reportes', 'Permite generar reportes'),
('Exportar', 'exportar', 'Permite exportar datos'), ('Enviar', 'enviar', 'Permite enviar mensajes'),
('Gestionar', 'gestionar', 'Permite gestionar configuraciones o elementos'), ('Modificar', 'modificar', 'Permite modificar configuraciones');

-- Administrator Account Setup
INSERT INTO access_level (access_name, description) VALUES ('Full Access', 'Grants full administrative privileges across the system.');
SET @admin_access_level_id = LAST_INSERT_ID();

INSERT INTO access_level (access_name, description) VALUES ('Director Access', 'Grants administrative privileges for managing staff, classrooms, and overall school operations.');
SET @director_access_level_id = LAST_INSERT_ID();

INSERT INTO access_level (access_name, description) VALUES ('Teacher Access', 'Grants privileges for managing assigned students, attendance, and classroom activities.');
SET @teacher_access_level_id = LAST_INSERT_ID();

INSERT INTO access_level (access_name, description) VALUES ('Secretary Access', 'Grants privileges for managing student enrollments, guardian information, and general administrative tasks.');
SET @secretary_access_level_id = LAST_INSERT_ID();

INSERT INTO role (role_name, access_level_id) VALUES ('Administrator', @admin_access_level_id);
SET @admin_role_id = LAST_INSERT_ID();

INSERT INTO role (role_name, access_level_id) VALUES ('Director', @director_access_level_id);
SET @director_role_id = LAST_INSERT_ID();

INSERT INTO role (role_name, access_level_id) VALUES ('Teacher', @teacher_access_level_id);
SET @teacher_role_id = LAST_INSERT_ID();

INSERT INTO role (role_name, access_level_id) VALUES ('Secretary', @secretary_access_level_id);
SET @secretary_role_id = LAST_INSERT_ID();

INSERT INTO access_level (access_name, description) VALUES ('Guardian Access', 'Grants privileges for parents/guardians to view and manage their children''s information.');
SET @guardian_access_level_id = LAST_INSERT_ID();

INSERT INTO role (role_name, access_level_id) VALUES ('Tutor', @guardian_access_level_id);
SET @tutor_role_id = LAST_INSERT_ID();

INSERT INTO address (street, number, city, provincia, postal_code_optional) VALUES ('Admin Street', '123', 'Admin City', 'Admin Province', '12345');
SET @admin_address_id = LAST_INSERT_ID();

INSERT INTO staff (
    first_name, paternal_surname, email, password_hash, is_active,
    address_id, classroom_id, role_id, last_login
) VALUES (
    'Admin', 'User', 'admin@kindergarten.com', '$2b$10$9Wbi.el7OD9JiiS7JX.USOdyB6mSJlHZwkTH47rIFjDpeUlgDsPki', TRUE,
    @admin_address_id, NULL, @admin_role_id, NOW()
);

-- Dummy Teachers
INSERT INTO staff (
    first_name, paternal_surname, email, password_hash, is_active,
    dni, role_id, created_at, phone
) VALUES 
('Ana', 'Rodríguez', 'ana@jardin.com', '$2b$10$9Wbi.el7OD9JiiS7JX.USOdyB6mSJlHZwkTH47rIFjDpeUlgDsPki', TRUE, '23456789', @teacher_role_id, NOW(), '555-1234'),
('Carlos', 'Martínez', 'carlos@jardin.com', '$2b$10$9Wbi.el7OD9JiiS7JX.USOdyB6mSJlHZwkTH47rIFjDpeUlgDsPki', TRUE, '34567890', @teacher_role_id, NOW(), '555-5678'),
('Laura', 'Sánchez', 'laura@jardin.com', '$2b$10$9Wbi.el7OD9JiiS7JX.USOdyB6mSJlHZwkTH47rIFjDpeUlgDsPki', TRUE, '45678901', @teacher_role_id, NOW(), '555-9012');

-- Grant all permissions to the Administrator role
INSERT INTO role_permission (role_id, module_id, action_id, is_granted, updated_by)
SELECT @admin_role_id, sm.id, pa.id, TRUE, (SELECT id FROM staff WHERE email = 'admin@kindergarten.com')
FROM system_module sm CROSS JOIN permission_action pa;

-- Grant specific permissions to the Director role
INSERT INTO role_permission (role_id, module_id, action_id, is_granted, updated_by)
SELECT @director_role_id, sm.id, pa.id, TRUE, (SELECT id FROM staff WHERE email = 'admin@kindergarten.com')
FROM system_module sm CROSS JOIN permission_action pa WHERE sm.module_key NOT IN ('roles');

-- Grant specific permissions to the Teacher role
INSERT INTO role_permission (role_id, module_id, action_id, is_granted, updated_by)
SELECT @teacher_role_id, sm.id, pa.id, TRUE, (SELECT id FROM staff WHERE email = 'admin@kindergarten.com')
FROM system_module sm CROSS JOIN permission_action pa WHERE sm.module_key IN ('dashboard', 'alumnos', 'salas', 'asistencia', 'mensajeria') AND pa.action_key IN ('ver', 'registrar', 'editar', 'enviar');

-- Grant specific permissions to the Secretary role
INSERT INTO role_permission (role_id, module_id, action_id, is_granted, updated_by)
SELECT @secretary_role_id, sm.id, pa.id, TRUE, (SELECT id FROM staff WHERE email = 'admin@kindergarten.com')
FROM system_module sm CROSS JOIN permission_action pa WHERE sm.module_key IN ('dashboard', 'alumnos', 'responsables', 'reportes', 'mensajeria') AND pa.action_key IN ('ver', 'crear', 'editar', 'exportar', 'enviar');

-- Grant 'crear' on 'alumnos' to the Tutor role by default
INSERT INTO role_permission (role_id, module_id, action_id, is_granted, updated_by)
SELECT @tutor_role_id, (SELECT id FROM system_module WHERE module_key = 'alumnos'), (SELECT id FROM permission_action WHERE action_key = 'crear'), TRUE, (SELECT id FROM staff WHERE email = 'admin@kindergarten.com');
