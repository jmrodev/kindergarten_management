# Estructura de la Base de Datos del Sistema de Gestión del Jardín de Infantes

## Tablas Principales

### 1. address
Almacena la información de direcciones para alumnos, personal y otros usuarios.
```sql
CREATE TABLE address (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    street TEXT,
    number TEXT,
    city TEXT,
    provincia TEXT,
    postal_code_optional TEXT
);
```

### 2. access_level
Define los niveles de acceso al sistema.
```sql
CREATE TABLE access_level (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    access_name TEXT,
    description TEXT
);
```

### 3. classroom
Almacena la información de las salas del jardín.
```sql
CREATE TABLE classroom (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name TEXT,
    capacity INT,
    shift ENUM('Mañana', 'Tarde', 'Completo'),
    academic_year INT,
    age_group INT,
    is_active BOOLEAN
);
```

### 4. role
Define los roles de usuarios en el sistema, asociados a niveles de acceso.
```sql
CREATE TABLE role (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    role_name TEXT,
    access_level_id BIGINT,
    FOREIGN KEY (access_level_id) REFERENCES access_level(id)
);
```

### 5. staff
Almacena información del personal del jardín, incluyendo maestros especializados.
```sql
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
```

### 6. parent_portal_users
Usuarios del portal para padres, con opción de autenticación por Google.
```sql
CREATE TABLE parent_portal_users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    google_id TEXT UNIQUE,
    email TEXT,
    name TEXT,
    created_at TIMESTAMP
);
```

### 7. guardian
Responsables de los alumnos, incluyendo tíos, abuelos, etc.
```sql
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
```

### 8. student
Información principal de los alumnos, incluyendo datos médicos y autorizaciones.
```sql
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
    emergency_contact_id BIGINT,
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
```

### 9. emergency_contact
Contactos de emergencia para los alumnos.
```sql
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

-- Agregar clave foránea al alumno para contacto de emergencia
ALTER TABLE student
ADD CONSTRAINT fk_emergency_contact
FOREIGN KEY (emergency_contact_id) REFERENCES emergency_contact(id);
```

### 10. student_guardian
Relación muchos a muchos entre alumnos y responsables.
```sql
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
```

### 11. student_documents
Documentos de los alumnos, incluyendo verificación de entrega.
```sql
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
```

### 12. student_status_history
Historial de cambios de estado de los alumnos.
```sql
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
```

### 13. parent_registration_drafts
Borradores de inscripción por parte de padres.
```sql
CREATE TABLE parent_registration_drafts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    form_data JSON,
    current_step INT,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES parent_portal_users(id)
);
```

### 14. pending_documentation
Documentación pendiente para alumnos.
```sql
CREATE TABLE pending_documentation (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_id BIGINT NOT NULL,
    document_type TEXT NOT NULL,
    required_by BIGINT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    completed_by BIGINT NULL,
    FOREIGN KEY (student_id) REFERENCES student(id) ON DELETE CASCADE,
    FOREIGN KEY (required_by) REFERENCES staff(id) ON DELETE SET NULL,
    FOREIGN KEY (completed_by) REFERENCES staff(id) ON DELETE SET NULL
);
```

### 15. parent_portal_submissions
Solicitudes por parte de padres.
```sql
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
```

### 16. attendance
Registro de asistencia de alumnos (mañana, tarde, ambos turnos).
```sql
CREATE TABLE attendance (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_id BIGINT,
    date DATE,
    status TEXT,
    leave_type_optional TEXT,
    classroom_id BIGINT,
    staff_id BIGINT,  -- Registro de asistencia del personal
    FOREIGN KEY (student_id) REFERENCES student(id),
    FOREIGN KEY (classroom_id) REFERENCES classroom(id),
    FOREIGN KEY (staff_id) REFERENCES staff(id)
);
```

### 17. calendar
Calendario de eventos del jardín.
```sql
CREATE TABLE calendar (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    date DATE,
    description TEXT,
    event_type ENUM('inscripcion', 'inicio_clases', 'fin_clases', 'vacaciones', 'invierno', 'feriado', 'personal_activo', 'dia_maestro', 'arte', 'musica', 'gimnasia', 'ingles', 'expresion_corporal', 'salida', 'reunion_directivos_familia', 'reunion_apoyo_familia', 'reunion_personal', 'celebracion', 'evento_especial'),
    classroom_id BIGINT,
    staff_id BIGINT,
    FOREIGN KEY (classroom_id) REFERENCES classroom(id),
    FOREIGN KEY (staff_id) REFERENCES staff(id)
);
```

### 18. activity
Actividades de especialidades (arte, música, gimnasia, inglés, expresión corporal).
```sql
CREATE TABLE activity (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name TEXT,
    description_optional TEXT,
    schedule_optional TEXT,
    teacher_id BIGINT,
    classroom_id BIGINT,
    FOREIGN KEY (teacher_id) REFERENCES staff(id),
    FOREIGN KEY (classroom_id) REFERENCES classroom(id)
);
```

### 19. system_module
Módulos del sistema.
```sql
CREATE TABLE system_module (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    module_name TEXT,
    module_key TEXT UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT
);
```

### 20. permission_action
Acciones de permisos.
```sql
CREATE TABLE permission_action (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    action_name TEXT,
    action_key TEXT UNIQUE,
    description TEXT
);
```

### 21. role_permission
Asociación de permisos a roles.
```sql
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
```

### 22. permission_audit_log
Registro de auditoría de permisos.
```sql
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
```

### 23. conversation
Conversaciones por salas.
```sql
CREATE TABLE conversation (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    classroom_id BIGINT,
    creation_date TIMESTAMP,
    FOREIGN KEY (classroom_id) REFERENCES classroom(id)
);
```

### 24. conversation_guardian
Participantes guardianes en conversaciones.
```sql
CREATE TABLE conversation_guardian (
    conversation_id BIGINT,
    guardian_id BIGINT,
    PRIMARY KEY (conversation_id, guardian_id),
    FOREIGN KEY (conversation_id) REFERENCES conversation(id),
    FOREIGN KEY (guardian_id) REFERENCES guardian(id)
);
```

### 25. conversation_staff
Participantes del personal en conversaciones.
```sql
CREATE TABLE conversation_staff (
    conversation_id BIGINT,
    staff_id BIGINT,
    PRIMARY KEY (conversation_id, staff_id),
    FOREIGN KEY (conversation_id) REFERENCES conversation(id),
    FOREIGN KEY (staff_id) REFERENCES staff(id)
);
```

### 26. guardian_message
Mensajes enviados por guardianes.
```sql
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
```

### 27. staff_message
Mensajes enviados por el personal.
```sql
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
```

### 28. meeting_minutes
Actas de reuniones.
```sql
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
```

### 29. vaccination_records
Registro de vacunas de los alumnos.
```sql
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
```

### 30. document_review
Revisión de documentos.
```sql
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
```

## Vistas Importantes

### Vista de permisos por rol
```sql
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
```

### Vista de lista de sorteo simple
```sql
CREATE VIEW v_lottery_list_simple AS
SELECT
    s.id,
    CONCAT(s.first_name, ' ', s.paternal_surname, IFNULL(CONCAT(' ', s.maternal_surname), '')) AS full_name,
    s.dni
FROM student s
WHERE s.status = 'sorteo'
ORDER BY s.enrollment_date ASC;
```

### Vista de lista de sorteo completa
```sql
CREATE VIEW v_lottery_list AS
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
```

### Vista de alumnos con documentación pendiente
```sql
CREATE VIEW v_students_with_pending_docs AS
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
```

## Índices de Rendimiento

### Índice para documentación pendiente
```sql
CREATE INDEX idx_pending_documentation_student_completed ON pending_documentation(student_id, completed_at);
```

## Roles Iniciales

```sql
-- Insertar niveles de acceso iniciales
INSERT INTO access_level (access_name, description) VALUES 
('Full Access', 'Grants full administrative privileges across the system.'),
('Director Access', 'Grants administrative privileges for managing staff, classrooms, and overall school operations.'),
('Teacher Access', 'Grants privileges for managing assigned students, attendance, and classroom activities.'),
('Secretary Access', 'Grants privileges for managing student enrollments, guardian information, and general administrative tasks.'),
('Guardian Access', 'Grants privileges for parents/guardians to view and manage their children''s information.');

-- Insertar roles iniciales
SET @admin_access_level_id = (SELECT id FROM access_level WHERE access_name = 'Full Access');
SET @director_access_level_id = (SELECT id FROM access_level WHERE access_name = 'Director Access');
SET @teacher_access_level_id = (SELECT id FROM access_level WHERE access_name = 'Teacher Access');
SET @secretary_access_level_id = (SELECT id FROM access_level WHERE access_name = 'Secretary Access');
SET @guardian_access_level_id = (SELECT id FROM access_level WHERE access_name = 'Guardian Access');

INSERT INTO role (role_name, access_level_id) VALUES 
('Administrator', @admin_access_level_id),
('Director', @director_access_level_id),
('Teacher', @teacher_access_level_id),
('Secretary', @secretary_access_level_id),
('Tutor', @guardian_access_level_id);
```

Esta estructura de base de datos soporta todas las funcionalidades del sistema de gestión del jardín de infantes, incluyendo:
- Gestión completa de alumnos y sus datos médicos
- Relación con responsables y autorizaciones
- Gestión de personal y roles
- Sistema de autenticación
- Documentación y verificación
- Calendario integral
- Asistencia
- Mensajería bidireccional
- Revisión de documentos
- Vacunación
- Reuniones y actas
- Control de permisos