-- SQL script to initialize the kindergarten database
-- Drops the database if it exists, creates it, and then creates all tables.

-- Database name from .env.example
SET @DB_NAME = 'kindergarten_db';

-- Drop database if it exists
DROP DATABASE IF EXISTS kindergarten_db;

-- Create database
CREATE DATABASE kindergarten_db;

-- Use the newly created database
USE kindergarten_db;

-- Table: address (Independent)
CREATE TABLE address (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    street TEXT,
    number TEXT,
    city TEXT,
    provincia TEXT,
    postal_code_optional TEXT
);

-- Table: access_level (Independent)
CREATE TABLE access_level (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    access_name TEXT,
    description TEXT
);

-- Table: classroom (Independent)
CREATE TABLE classroom (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name TEXT,
    capacity INT,
    shift ENUM('Mañana', 'Tarde', 'Completo'),
    academic_year INT,
    age_group INT,
    is_active BOOLEAN
);

-- Table: role (Depends on access_level)
CREATE TABLE role (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    role_name TEXT,
    access_level_id BIGINT,
    FOREIGN KEY (access_level_id) REFERENCES access_level(id)
);

-- Table: staff (Depends on address, classroom, role)
CREATE TABLE staff (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
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
    address_id BIGINT,
    phone TEXT,
    email_optional TEXT,
    classroom_id BIGINT,
    role_id BIGINT,
    FOREIGN KEY (address_id) REFERENCES address(id),
    FOREIGN KEY (classroom_id) REFERENCES classroom(id),
    FOREIGN KEY (role_id) REFERENCES role(id)
);

-- Table: parent_portal_users (Independent)
CREATE TABLE parent_portal_users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    google_id TEXT UNIQUE,
    email TEXT,
    name TEXT,
    created_at TIMESTAMP
);

-- Table: guardian (Depends on address)
CREATE TABLE guardian (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    first_name TEXT,
    middle_name_optional TEXT,
    paternal_surname TEXT,
    maternal_surname TEXT,
    preferred_surname TEXT,
    dni TEXT UNIQUE,
    address_id BIGINT,
    phone TEXT,
    email_optional TEXT,
    workplace TEXT,
    work_phone TEXT,
    authorized_pickup BOOLEAN,
    authorized_change BOOLEAN,
    parent_portal_user_id BIGINT,
    role_id BIGINT,
    FOREIGN KEY (address_id) REFERENCES address(id),
    FOREIGN KEY (parent_portal_user_id) REFERENCES parent_portal_users(id) ON DELETE SET NULL,
    FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE SET NULL
);

-- Table: student (Create without emergency_contact_id FK initially due to circular dependency)
CREATE TABLE student (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    first_name TEXT,
    middle_name_optional TEXT,
    third_name_optional TEXT,
    paternal_surname TEXT,
    maternal_surname TEXT,
    nickname_optional TEXT,
    dni TEXT UNIQUE,
    birth_date DATE,
    address_id BIGINT,
    emergency_contact_id BIGINT, -- This will be linked later
    classroom_id BIGINT,
    shift TEXT,
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
    FOREIGN KEY (address_id) REFERENCES address(id),
    FOREIGN KEY (classroom_id) REFERENCES classroom(id)
);

-- Table: emergency_contact (Now student table exists, so this FK is fine)
CREATE TABLE emergency_contact (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_id BIGINT,
    full_name TEXT,
    relationship TEXT,
    priority INT,
    phone TEXT,
    alternative_phone TEXT,
    is_authorized_pickup BOOLEAN,
    FOREIGN KEY (student_id) REFERENCES student(id)
);

-- Add the foreign key constraint to student for emergency_contact_id
ALTER TABLE student
ADD CONSTRAINT fk_emergency_contact
FOREIGN KEY (emergency_contact_id) REFERENCES emergency_contact(id);


-- Table: student_guardian (Depends on student, guardian)
CREATE TABLE student_guardian (
    student_id BIGINT,
    guardian_id BIGINT,
    relationship_type ENUM('madre', 'padre', 'tutor', 'abuelo', 'abuela', 'tio', 'tia', 'otro'),
    is_primary BOOLEAN,
    authorized_pickup BOOLEAN,
    authorized_diaper_change BOOLEAN,
    custody_rights BOOLEAN,
    financial_responsible BOOLEAN,
    notes TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    PRIMARY KEY (student_id, guardian_id),
    FOREIGN KEY (student_id) REFERENCES student(id),
    FOREIGN KEY (guardian_id) REFERENCES guardian(id)
);

-- Table: student_documents (Depends on student)
CREATE TABLE student_documents (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_id BIGINT,
    document_type ENUM('dni', 'certificado_nacimiento', 'certificado_vacunas', 'certificado_medico', 'autorizacion_firmada', 'foto', 'otro'),
    file_name TEXT,
    file_path TEXT,
    file_size INT,
    mime_type TEXT,
    uploaded_by BIGINT,
    upload_date TIMESTAMP,
    expiration_date DATE,
    notes TEXT,
    is_verified BOOLEAN,
    verified_by BIGINT,
    verified_at TIMESTAMP,
    delivery_verified BOOLEAN DEFAULT FALSE,
    delivery_verified_by BIGINT,
    delivery_verified_at TIMESTAMP NULL,
    FOREIGN KEY (student_id) REFERENCES student(id),
    FOREIGN KEY (verified_by) REFERENCES staff(id),
    FOREIGN KEY (delivery_verified_by) REFERENCES staff(id)
);

-- Table: student_status_history (Depends on student)
CREATE TABLE student_status_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_id BIGINT,
    old_status ENUM('preinscripto', 'pendiente', 'approved', 'sorteo', 'inscripto', 'activo', 'inactivo', 'egresado', 'rechazado'),
    new_status ENUM('preinscripto', 'pendiente', 'approved', 'sorteo', 'inscripto', 'activo', 'inactivo', 'egresado', 'rechazado'),
    change_date TIMESTAMP,
    reason TEXT,
    changed_by BIGINT,
    FOREIGN KEY (student_id) REFERENCES student(id)
);

-- Table: parent_registration_drafts (Depends on parent_portal_users)
CREATE TABLE parent_registration_drafts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    form_data JSON,
    current_step INT,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES parent_portal_users(id)
);

-- Table: pending_documentation (Depends on student, staff)
CREATE TABLE pending_documentation (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_id BIGINT NOT NULL,
    document_type TEXT NOT NULL,
    required_by BIGINT, -- Staff member who required the document
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    completed_by BIGINT NULL, -- Staff member who completed the document
    FOREIGN KEY (student_id) REFERENCES student(id) ON DELETE CASCADE,
    FOREIGN KEY (required_by) REFERENCES staff(id) ON DELETE SET NULL,
    FOREIGN KEY (completed_by) REFERENCES staff(id) ON DELETE SET NULL
);

-- Table: parent_portal_submissions (Depends on parent_portal_users, student)
CREATE TABLE parent_portal_submissions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    student_id BIGINT,
    submitted_at TIMESTAMP,
    status ENUM('pending_review', 'approved', 'rejected') DEFAULT 'pending_review',
    approved_at TIMESTAMP NULL,
    approved_by BIGINT NULL,
    rejected_at TIMESTAMP NULL,
    rejected_by BIGINT NULL,
    rejected_reason TEXT,
    FOREIGN KEY (user_id) REFERENCES parent_portal_users(id),
    FOREIGN KEY (student_id) REFERENCES student(id),
    FOREIGN KEY (approved_by) REFERENCES staff(id),
    FOREIGN KEY (rejected_by) REFERENCES staff(id)
);

-- Table: attendance (Depends on student, classroom)
CREATE TABLE attendance (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_id BIGINT,
    date DATE,
    status TEXT,
    leave_type_optional TEXT,
    classroom_id BIGINT,
    FOREIGN KEY (student_id) REFERENCES student(id),
    FOREIGN KEY (classroom_id) REFERENCES classroom(id)
);

-- Table: calendar (Depends on classroom)
CREATE TABLE calendar (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    date DATE,
    description TEXT,
    event_type TEXT,
    classroom_id BIGINT,
    FOREIGN KEY (classroom_id) REFERENCES classroom(id)
);

-- Table: activity (Depends on staff)
CREATE TABLE activity (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name TEXT,
    description_optional TEXT,
    schedule_optional TEXT,
    teacher_id BIGINT,
    FOREIGN KEY (teacher_id) REFERENCES staff(id)
);

-- Table: system_module
CREATE TABLE system_module (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    module_name TEXT,
    module_key TEXT UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT
);

-- Initial Data for system_module
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

-- Table: permission_action
CREATE TABLE permission_action (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    action_name TEXT,
    action_key TEXT UNIQUE,
    description TEXT
);

-- Initial Data for permission_action
INSERT INTO permission_action (action_name, action_key, description) VALUES
('Ver', 'ver', 'Permite visualizar información'),
('Crear', 'crear', 'Permite crear nuevos registros'),
('Editar', 'editar', 'Permite modificar registros existentes'),
('Eliminar', 'eliminar', 'Permite eliminar registros'),
('Registrar', 'registrar', 'Permite registrar asistencia u otros eventos'),
('Reportes', 'reportes', 'Permite generar reportes'),
('Exportar', 'exportar', 'Permite exportar datos'),
('Enviar', 'enviar', 'Permite enviar mensajes'),
('Gestionar', 'gestionar', 'Permite gestionar configuraciones o elementos'),
('Modificar', 'modificar', 'Permite modificar configuraciones');

-- Table: role_permission
CREATE TABLE role_permission (
    role_id BIGINT,
    module_id BIGINT,
    action_id BIGINT,
    is_granted BOOLEAN,
    updated_by BIGINT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id, module_id, action_id),
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (module_id) REFERENCES system_module(id),
    FOREIGN KEY (action_id) REFERENCES permission_action(id),
    FOREIGN KEY (updated_by) REFERENCES staff(id)
);

-- Table: permission_audit_log
CREATE TABLE permission_audit_log (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    role_id BIGINT,
    module_id BIGINT,
    action_id BIGINT,
    previous_value BOOLEAN,
    new_value BOOLEAN,
    changed_by BIGINT,
    ip_address TEXT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (module_id) REFERENCES system_module(id),
    FOREIGN KEY (action_id) REFERENCES permission_action(id),
    FOREIGN KEY (changed_by) REFERENCES staff(id)
);

-- View: v_role_permissions
CREATE VIEW v_role_permissions AS
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

-- Table: conversation (Depends on classroom)
CREATE TABLE conversation (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    classroom_id BIGINT,
    creation_date TIMESTAMP,
    FOREIGN KEY (classroom_id) REFERENCES classroom(id)
);

-- Table: conversation_guardian (Depends on conversation, guardian)
CREATE TABLE conversation_guardian (
    conversation_id BIGINT,
    guardian_id BIGINT,
    PRIMARY KEY (conversation_id, guardian_id),
    FOREIGN KEY (conversation_id) REFERENCES conversation(id),
    FOREIGN KEY (guardian_id) REFERENCES guardian(id)
);

-- Table: conversation_staff (Depends on conversation, staff)
CREATE TABLE conversation_staff (
    conversation_id BIGINT,
    staff_id BIGINT,
    PRIMARY KEY (conversation_id, staff_id),
    FOREIGN KEY (conversation_id) REFERENCES conversation(id),
    FOREIGN KEY (staff_id) REFERENCES staff(id)
);

-- Table: guardian_message (Depends on conversation, guardian)
CREATE TABLE guardian_message (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    conversation_id BIGINT,
    sender_guardian_id BIGINT,
    content TEXT,
    send_date TIMESTAMP,
    is_read BOOLEAN,
    FOREIGN KEY (conversation_id) REFERENCES conversation(id),
    FOREIGN KEY (sender_guardian_id) REFERENCES guardian(id)
);

-- Table: staff_message (Depends on conversation, staff)
CREATE TABLE staff_message (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    conversation_id BIGINT,
    sender_staff_id BIGINT,
    content TEXT,
    send_date TIMESTAMP,
    is_read BOOLEAN,
    FOREIGN KEY (conversation_id) REFERENCES conversation(id),
    FOREIGN KEY (sender_staff_id) REFERENCES staff(id)
);

--
-- Initial Data for Administrator
--

-- Insert an access level for Administrator
INSERT INTO access_level (access_name, description) VALUES ('Full Access', 'Grants full administrative privileges across the system.');
SET @admin_access_level_id = LAST_INSERT_ID();

-- Insert an access level for Director
INSERT INTO access_level (access_name, description) VALUES ('Director Access', 'Grants administrative privileges for managing staff, classrooms, and overall school operations.');
SET @director_access_level_id = LAST_INSERT_ID();

-- Insert an access level for Teacher
INSERT INTO access_level (access_name, description) VALUES ('Teacher Access', 'Grants privileges for managing assigned students, attendance, and classroom activities.');
SET @teacher_access_level_id = LAST_INSERT_ID();

-- Insert an access level for Secretary
INSERT INTO access_level (access_name, description) VALUES ('Secretary Access', 'Grants privileges for managing student enrollments, guardian information, and general administrative tasks.');
SET @secretary_access_level_id = LAST_INSERT_ID();

-- Insert the Administrator role
INSERT INTO role (role_name, access_level_id) VALUES ('Administrator', @admin_access_level_id);
SET @admin_role_id = LAST_INSERT_ID();

-- Insert the Director role
INSERT INTO role (role_name, access_level_id) VALUES ('Director', @director_access_level_id);
SET @director_role_id = LAST_INSERT_ID();

-- Insert the Teacher role
INSERT INTO role (role_name, access_level_id) VALUES ('Teacher', @teacher_access_level_id);
SET @teacher_role_id = LAST_INSERT_ID();

-- Insert the Secretary role
INSERT INTO role (role_name, access_level_id) VALUES ('Secretary', @secretary_access_level_id);
SET @secretary_role_id = LAST_INSERT_ID();

-- Insert an access level for Guardian/Tutor
INSERT INTO access_level (access_name, description) VALUES ('Guardian Access', 'Grants privileges for parents/guardians to view and manage their children''s information.');
SET @guardian_access_level_id = LAST_INSERT_ID();

-- Insert the Guardian/Tutor role
INSERT INTO role (role_name, access_level_id) VALUES ('Tutor', @guardian_access_level_id);
SET @tutor_role_id = LAST_INSERT_ID();

-- Insert a dummy address for the admin user
INSERT INTO address (street, number, city, provincia, postal_code_optional) VALUES ('Admin Street', '123', 'Admin City', 'Admin Province', '12345');
SET @admin_address_id = LAST_INSERT_ID();

-- Insert the default administrator user
INSERT INTO staff (
    first_name, paternal_surname, email, password_hash, is_active,
    address_id, classroom_id, role_id, last_login
) VALUES (
    'Admin', 'User', 'admin@kindergarten.com', '$2b$10$KztEjpwYr/rzl7OAKLRWf.Citp8esIqisRoqTOPEWJu.HYRTBcMZ6', TRUE,
    @admin_address_id, NULL, @admin_role_id, NOW()
);

-- Grant all permissions to the Administrator role
INSERT INTO role_permission (role_id, module_id, action_id, is_granted, updated_by)
SELECT
    @admin_role_id,
    sm.id,
    pa.id,
    TRUE,
    (SELECT id FROM staff WHERE email = 'admin@kindergarten.com')
FROM system_module sm
CROSS JOIN permission_action pa;

-- Grant all permissions to the Director role
INSERT INTO role_permission (role_id, module_id, action_id, is_granted, updated_by)
SELECT
    @director_role_id,
    sm.id,
    pa.id,
    TRUE,
    (SELECT id FROM staff WHERE email = 'admin@kindergarten.com') -- Assuming admin user is the one updating
FROM system_module sm
CROSS JOIN permission_action pa
WHERE sm.module_key NOT IN ('roles'); -- Directors don't manage roles themselves

-- Grant specific permissions to the Teacher role
INSERT INTO role_permission (role_id, module_id, action_id, is_granted, updated_by)
SELECT
    @teacher_role_id,
    sm.id,
    pa.id,
    TRUE,
    (SELECT id FROM staff WHERE email = 'admin@kindergarten.com')
FROM system_module sm
CROSS JOIN permission_action pa
WHERE sm.module_key IN ('dashboard', 'alumnos', 'salas', 'asistencia', 'mensajeria')
  AND pa.action_key IN ('ver', 'registrar', 'editar', 'enviar');

-- Grant specific permissions to the Secretary role
INSERT INTO role_permission (role_id, module_id, action_id, is_granted, updated_by)
SELECT
    @secretary_role_id,
    sm.id,
    pa.id,
    TRUE,
    (SELECT id FROM staff WHERE email = 'admin@kindergarten.com')
FROM system_module sm
CROSS JOIN permission_action pa
WHERE sm.module_key IN ('dashboard', 'alumnos', 'responsables', 'reportes', 'mensajeria')
  AND pa.action_key IN ('ver', 'crear', 'editar', 'exportar', 'enviar');

-- Grant 'crear' on 'alumnos' to the Tutor role by default
INSERT INTO role_permission (role_id, module_id, action_id, is_granted, updated_by)
SELECT
    @tutor_role_id,
    (SELECT id FROM system_module WHERE module_key = 'alumnos'),
    (SELECT id FROM permission_action WHERE action_key = 'crear'),
    TRUE,
    (SELECT id FROM staff WHERE email = 'admin@kindergarten.com');

-- Create a simple view for the lottery list (students ready for lottery with just name and DNI as requested)
CREATE OR REPLACE VIEW v_lottery_list_simple AS
SELECT
    s.id,
    CONCAT(s.first_name, ' ', s.paternal_surname, IFNULL(CONCAT(' ', s.maternal_surname), '')) AS full_name,
    s.dni
FROM student s
WHERE s.status = 'sorteo'
ORDER BY s.enrollment_date ASC;

-- Create a comprehensive view for the lottery list with additional information for admin staff
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

-- Create a view for students with pending documentation that need to be completed
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
    CONCAT(completed_by.first_name, ' ', completed_by.paternal_surname) AS completed_by_name
FROM student s
LEFT JOIN pending_documentation pd ON s.id = pd.student_id AND pd.completed_at IS NULL
LEFT JOIN classroom c ON s.classroom_id = c.id
LEFT JOIN staff completed_by ON pd.completed_by = completed_by.id
WHERE s.status IN ('inscripto', 'activo') AND pd.id IS NOT NULL
ORDER BY s.id, pd.created_at ASC;

-- Create an index for better performance on pending_documentation queries
CREATE INDEX idx_pending_documentation_student_completed ON pending_documentation(student_id, completed_at);

-- Create a simple view for the lottery list (students ready for lottery with just name and DNI as requested)
CREATE OR REPLACE VIEW v_lottery_list_simple AS
SELECT
    s.id,
    CONCAT(s.first_name, ' ', s.paternal_surname, IFNULL(CONCAT(' ', s.maternal_surname), '')) AS full_name,
    s.dni
FROM student s
WHERE s.status = 'sorteo'
ORDER BY s.enrollment_date ASC;

-- Create a comprehensive view for the lottery list with additional information for admin staff
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

-- Create a view for students with pending documentation that need to be completed
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
    CONCAT(completed_by.first_name, ' ', completed_by.paternal_surname) AS completed_by_name
FROM student s
LEFT JOIN pending_documentation pd ON s.id = pd.student_id AND pd.completed_at IS NULL
LEFT JOIN classroom c ON s.classroom_id = c.id
LEFT JOIN staff completed_by ON pd.completed_by = completed_by.id
WHERE s.status IN ('inscripto', 'activo') AND pd.id IS NOT NULL
ORDER BY s.id, pd.created_at ASC;

-- Create a view for students in preinscripto status showing their document delivery status
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

-- Create a view to track students that have not delivered required documents but are still in preinscripto
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

