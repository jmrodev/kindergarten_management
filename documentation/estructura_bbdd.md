# Estructura de la Base de Datos del Sistema de Gestión del Jardín de Infantes

## Tablas Independientes y Categorías

### 1. address
Almacena la información de direcciones para alumnos, personal y otros usuarios.
```sql
CREATE TABLE address (
    id INT PRIMARY KEY AUTO_INCREMENT,
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
    id INT PRIMARY KEY AUTO_INCREMENT,
    access_name TEXT,
    description TEXT
);
```

### 3. classroom
Almacena la información de las salas del jardín.
```sql
CREATE TABLE classroom (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name TEXT,
    capacity INT,
    shift ENUM('Mañana', 'Tarde', 'Completo'),
    academic_year INT,
    age_group INT,
    is_active BOOLEAN,
    teacher_id INT, -- Referencia al docente asignado
    FOREIGN KEY (teacher_id) REFERENCES staff(id) ON DELETE SET NULL
);
```

### 4. blood_types
Catálogo de tipos de sangre.
```sql
CREATE TABLE blood_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type_name VARCHAR(10) UNIQUE NOT NULL,
    description TEXT
);
```

### 5. shifts
Catálogo de turnos disponibles.
```sql
CREATE TABLE shifts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    shift_name VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);
```

### 6. emergency_contact_types
Tipos de contacto de emergencia (ej. Padre, Madre, Vecino).
```sql
CREATE TABLE emergency_contact_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    priority_order INT DEFAULT 1
);
```

### 7. medical_categories
Categorías para información médica.
```sql
CREATE TABLE medical_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);
```

### 8. health_insurance_providers
Obras sociales y prepagas.
```sql
CREATE TABLE health_insurance_providers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);
```

### 9. pediatricians
Registro de pediatras.
```sql
CREATE TABLE pediatricians (
    id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 10. system_module
Módulos del sistema para control de permisos.
```sql
CREATE TABLE system_module (
    id INT PRIMARY KEY AUTO_INCREMENT,
    module_name TEXT,
    module_key TEXT UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT
);
```

### 11. permission_action
Acciones posibles sobre los módulos (ver, crear, editar, etc.).
```sql
CREATE TABLE permission_action (
    id INT PRIMARY KEY AUTO_INCREMENT,
    action_name TEXT,
    action_key TEXT UNIQUE,
    description TEXT
);
```

## Tablas Principales del Sistema

### 12. role
Define los roles de usuarios.
```sql
CREATE TABLE role (
    id INT PRIMARY KEY AUTO_INCREMENT,
    role_name TEXT,
    access_level_id INT,
    FOREIGN KEY (access_level_id) REFERENCES access_level(id)
);
```

### 13. staff
Personal del jardín.
```sql
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
```

### 14. parent_portal_users
Usuarios del portal de padres (autenticación externa).
```sql
CREATE TABLE parent_portal_users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    google_id TEXT UNIQUE,
    email TEXT,
    name TEXT,
    created_at TIMESTAMP
);
```

### 15. guardian
Padres, tutores y responsables.
```sql
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
```

### 16. student
Alumnos del jardín.
```sql
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
    gender ENUM('M', 'F'), -- Nuevo campo
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
    FOREIGN KEY (blood_type_id) REFERENCES blood_types(id),
    FOREIGN KEY (shift_id) REFERENCES shifts(id)
);
```

### 17. student_guardian
Relación muchos a muchos entre alumnos y responsables/contactos de emergencia.
```sql
CREATE TABLE student_guardian (
    student_id INT,
    guardian_id INT,
    relationship_type ENUM('madre', 'padre', 'tutor', 'abuelo', 'abuela', 'tio', 'tia', 'otro'),
    is_primary BOOLEAN,
    is_emergency BOOLEAN DEFAULT FALSE, -- Es contacto de emergencia
    authorized_pickup BOOLEAN, -- (Legacy/Redundante con can_pickup)
    authorized_diaper_change BOOLEAN,
    custody_rights BOOLEAN,
    financial_responsible BOOLEAN,
    notes TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    can_pickup BOOLEAN DEFAULT FALSE, -- Autorizado a retirar
    has_restraining_order BOOLEAN DEFAULT FALSE, -- Restricción judicial
    can_change_diaper BOOLEAN DEFAULT FALSE, -- Autorizado a cambiar pañales
    PRIMARY KEY (student_id, guardian_id),
    FOREIGN KEY (student_id) REFERENCES student(id),
    FOREIGN KEY (guardian_id) REFERENCES guardian(id)
);
```

### 18. student_documents
Documentación digitalizada de los alumnos.
```sql
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
```

### 19. vaccination_records
Registro detallado de vacunas.
```sql
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
```

### 20. meeting_minutes
Actas de reuniones.
```sql
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
```

### 21. document_review
Proceso de revisión de documentos.
```sql
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
```

### 22. attendance
Registro de asistencia.
```sql
CREATE TABLE attendance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT,
    staff_id INT,
    date DATE,
    status TEXT, -- 'presente', 'ausente', etc.
    leave_type_optional TEXT,
    classroom_id INT,
    FOREIGN KEY (student_id) REFERENCES student(id),
    FOREIGN KEY (staff_id) REFERENCES staff(id),
    FOREIGN KEY (classroom_id) REFERENCES classroom(id)
);
```

### 23. calendar
Eventos del calendario escolar.
```sql
CREATE TABLE calendar (
    id INT PRIMARY KEY AUTO_INCREMENT,
    date DATE,
    description TEXT,
    event_type ENUM('inscripcion', 'inicio_clases', ...), -- Ver init_db.sql para lista completa
    classroom_id INT,
    staff_id INT,
    FOREIGN KEY (classroom_id) REFERENCES classroom(id),
    FOREIGN KEY (staff_id) REFERENCES staff(id)
);
```

### 24. activity
Actividades especiales y talleres.
```sql
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
```

### 25. student_status_history
Historial de cambios de estado del alumno.
```sql
CREATE TABLE student_status_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT,
    old_status ENUM('preinscripto', ...),
    new_status ENUM('preinscripto', ...),
    change_date TIMESTAMP,
    reason TEXT,
    changed_by INT,
    FOREIGN KEY (student_id) REFERENCES student(id)
);
```

### 26. parent_registration_drafts
Borradores del formulario de inscripción.
```sql
CREATE TABLE parent_registration_drafts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    form_data JSON,
    current_step INT,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES parent_portal_users(id)
);
```

### 27. pending_documentation
Gestión de documentación adeudada.
```sql
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
```

### 28. parent_portal_submissions
Solicitudes formales desde el portal de padres.
```sql
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
```

### 29. role_permission
Matriz de permisos.
```sql
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
```

### 30. permission_audit_log
Auditoría de cambios en permisos.
```sql
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
```

### 31. conversation
Conversaciones/Chats.
```sql
CREATE TABLE conversation (
    id INT PRIMARY KEY AUTO_INCREMENT,
    classroom_id INT,
    creation_date TIMESTAMP,
    FOREIGN KEY (classroom_id) REFERENCES classroom(id)
);
```

### 32. conversation_guardian
Participantes (Guardianes).
```sql
CREATE TABLE conversation_guardian (
    conversation_id INT,
    guardian_id INT,
    PRIMARY KEY (conversation_id, guardian_id),
    FOREIGN KEY (conversation_id) REFERENCES conversation(id),
    FOREIGN KEY (guardian_id) REFERENCES guardian(id)
);
```

### 33. conversation_staff
Participantes (Personal).
```sql
CREATE TABLE conversation_staff (
    conversation_id INT,
    staff_id INT,
    PRIMARY KEY (conversation_id, staff_id),
    FOREIGN KEY (conversation_id) REFERENCES conversation(id),
    FOREIGN KEY (staff_id) REFERENCES staff(id)
);
```

### 34. guardian_message
Mensajes de guardianes.
```sql
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
```

### 35. staff_message
Mensajes del personal.
```sql
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
```

## Vistas Importantes

### Vista de permisos por rol (`v_role_permissions`)
Muestra la matriz completa de permisos efectivos para cada rol.

### Vista de lista de sorteo (`v_lottery_list`, `v_lottery_list_simple`)
Listados de alumnos en estado de 'sorteo' ordenados por fecha de inscripción o aprobación.

### Vista de documentación pendiente (`v_students_with_pending_docs`)
Muestra alumnos que tienen items requeridos en la tabla `pending_documentation`.

### Vista de preinscriptos con documentación (`v_preinscriptos_with_pending_docs`)
Detalle de documentos subidos y verificados para alumnos en estado de preinscripción.

### Vista de estado de entregas (`v_students_pending_document_delivery`)
Resumen de documentos físicos entregados y verificados.

## Índices de Rendimiento
- `idx_pending_documentation_student_completed`: Optimiza búsquedas de doc pendiente.
- `idx_vaccination_records_student_status`: Optimiza reportes de vacunación.
- `idx_document_review_type_status`: Optimiza colas de revisión.