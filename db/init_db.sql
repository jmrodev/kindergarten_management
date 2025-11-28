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
    paternal_surname TEXT,
    maternal_surname TEXT,
    email TEXT UNIQUE,
    password_hash TEXT,
    is_active BOOLEAN,
    last_login TIMESTAMP,
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
    FOREIGN KEY (address_id) REFERENCES address(id)
);

-- Table: parent_portal_users (Independent)
CREATE TABLE parent_portal_users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    google_id TEXT UNIQUE,
    email TEXT,
    name TEXT,
    created_at TIMESTAMP
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
    status ENUM('inscripto', 'activo', 'inactivo', 'egresado'),
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
    custody_rights BOOLEAN,
    financial_responsible BOOLEAN,
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
    FOREIGN KEY (student_id) REFERENCES student(id)
);

-- Table: student_status_history (Depends on student)
CREATE TABLE student_status_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_id BIGINT,
    old_status ENUM('inscripto', 'activo', 'inactivo', 'egresado'),
    new_status ENUM('inscripto', 'activo', 'inactivo', 'egresado'),
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

-- Table: parent_portal_submissions (Depends on parent_portal_users, student)
CREATE TABLE parent_portal_submissions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    student_id BIGINT,
    submitted_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES parent_portal_users(id),
    FOREIGN KEY (student_id) REFERENCES student(id)
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

-- Table: permission_action
CREATE TABLE permission_action (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    action_name TEXT,
    action_key TEXT UNIQUE,
    description TEXT
);

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

-- Insert the Administrator role
INSERT INTO role (role_name, access_level_id) VALUES ('Administrator', @admin_access_level_id);
SET @admin_role_id = LAST_INSERT_ID();

-- Insert a dummy address for the admin user
INSERT INTO address (street, number, city, provincia, postal_code_optional) VALUES ('Admin Street', '123', 'Admin City', 'Admin Province', '12345');
SET @admin_address_id = LAST_INSERT_ID();

-- Insert a dummy classroom for the admin user (if required by schema, can be a generic one)
INSERT INTO classroom (name, capacity, shift, academic_year, age_group, is_active) VALUES ('Admin Classroom', 1, 'Mañana', 2025, 0, FALSE);
SET @admin_classroom_id = LAST_INSERT_ID();

-- Insert the default administrator user
INSERT INTO staff (
    first_name, paternal_surname, email, password_hash, is_active,
    address_id, classroom_id, role_id, last_login
) VALUES (
    'Admin', 'User', 'admin@kindergarten.com', '$2b$10$1LlL9Li2/zWwTPse6RQdO.2Zoa400EqHo1AA9pSgzAR8AaYWSvLTW', TRUE,
    @admin_address_id, @admin_classroom_id, @admin_role_id, NOW()
);
