-- Creación de tablas para gestión dinámica de permisos
-- Fecha: 2025-11-27

USE kindergarten_db;

-- Tabla de módulos del sistema
CREATE TABLE IF NOT EXISTS system_module (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    module_key VARCHAR(50) UNIQUE NOT NULL,
    module_name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de acciones disponibles
CREATE TABLE IF NOT EXISTS permission_action (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    action_key VARCHAR(50) UNIQUE NOT NULL,
    action_name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de permisos (relación role-module-action)
CREATE TABLE IF NOT EXISTS role_permission (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    role_id BIGINT NOT NULL,
    module_id BIGINT NOT NULL,
    action_id BIGINT NOT NULL,
    is_granted BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by BIGINT,
    FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
    FOREIGN KEY (module_id) REFERENCES system_module(id) ON DELETE CASCADE,
    FOREIGN KEY (action_id) REFERENCES permission_action(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES staff(id) ON DELETE SET NULL,
    UNIQUE KEY unique_permission (role_id, module_id, action_id)
);

-- Tabla de log de cambios de permisos (auditoría)
CREATE TABLE IF NOT EXISTS permission_audit_log (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    role_id BIGINT NOT NULL,
    module_id BIGINT NOT NULL,
    action_id BIGINT NOT NULL,
    previous_value BOOLEAN,
    new_value BOOLEAN,
    changed_by BIGINT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (module_id) REFERENCES system_module(id),
    FOREIGN KEY (action_id) REFERENCES permission_action(id),
    FOREIGN KEY (changed_by) REFERENCES staff(id) ON DELETE SET NULL
);

-- Insertar módulos del sistema
INSERT INTO system_module (module_key, module_name, description, icon, display_order) VALUES
('alumnos', 'Gestión de Alumnos', 'Administración completa de alumnos del jardín', 'school', 1),
('salas', 'Gestión de Salas', 'Administración de aulas y capacidad', 'meeting_room', 2),
('personal', 'Gestión de Personal', 'Administración de staff del jardín', 'badge', 3),
('tutores', 'Gestión de Tutores', 'Administración de padres y tutores', 'supervisor_account', 4),
('asistencia', 'Control de Asistencia', 'Registro y seguimiento de asistencia', 'fact_check', 5),
('reportes', 'Reportes y Estadísticas', 'Generación de reportes e informes', 'assessment', 6),
('mensajeria', 'Sistema de Mensajería', 'Comunicación interna del jardín', 'forum', 7),
('configuracion', 'Configuración del Sistema', 'Configuración general y permisos', 'settings', 8);

-- Insertar acciones disponibles
INSERT INTO permission_action (action_key, action_name, description) VALUES
('ver', 'Ver', 'Visualizar información'),
('crear', 'Crear', 'Crear nuevos registros'),
('editar', 'Editar', 'Modificar registros existentes'),
('eliminar', 'Eliminar', 'Eliminar registros'),
('registrar', 'Registrar', 'Registrar eventos o acciones'),
('reportes', 'Reportes', 'Generar y visualizar reportes'),
('exportar', 'Exportar', 'Exportar datos a archivos'),
('enviar', 'Enviar', 'Enviar mensajes o notificaciones'),
('gestionar', 'Gestionar', 'Gestión completa del módulo'),
('modificar', 'Modificar', 'Modificar configuraciones');

-- Insertar permisos por defecto para ADMIN
INSERT INTO role_permission (role_id, module_id, action_id, is_granted)
SELECT 
    r.id as role_id,
    m.id as module_id,
    a.id as action_id,
    TRUE as is_granted
FROM role r
CROSS JOIN system_module m
CROSS JOIN permission_action a
WHERE r.role_name = 'admin';

-- Insertar permisos por defecto para DIRECTIVO (igual que admin)
INSERT INTO role_permission (role_id, module_id, action_id, is_granted)
SELECT 
    r.id as role_id,
    m.id as module_id,
    a.id as action_id,
    TRUE as is_granted
FROM role r
CROSS JOIN system_module m
CROSS JOIN permission_action a
WHERE r.role_name = 'directivo';

-- Insertar permisos por defecto para SECRETARIA
INSERT INTO role_permission (role_id, module_id, action_id, is_granted)
SELECT 
    r.id as role_id,
    m.id as module_id,
    a.id as action_id,
    TRUE as is_granted
FROM role r
CROSS JOIN system_module m
CROSS JOIN permission_action a
WHERE r.role_name = 'secretaria'
AND (
    (m.module_key = 'alumnos' AND a.action_key IN ('ver', 'crear', 'editar'))
    OR (m.module_key = 'salas' AND a.action_key = 'ver')
    OR (m.module_key = 'personal' AND a.action_key = 'ver')
    OR (m.module_key = 'tutores' AND a.action_key IN ('ver', 'crear', 'editar'))
    OR (m.module_key = 'asistencia' AND a.action_key IN ('ver', 'registrar', 'editar'))
    OR (m.module_key = 'reportes' AND a.action_key = 'ver')
    OR (m.module_key = 'mensajeria' AND a.action_key IN ('ver', 'enviar'))
);

-- Insertar permisos por defecto para MAESTRO
INSERT INTO role_permission (role_id, module_id, action_id, is_granted)
SELECT 
    r.id as role_id,
    m.id as module_id,
    a.id as action_id,
    TRUE as is_granted
FROM role r
CROSS JOIN system_module m
CROSS JOIN permission_action a
WHERE r.role_name = 'maestro'
AND (
    (m.module_key = 'alumnos' AND a.action_key = 'ver')
    OR (m.module_key = 'salas' AND a.action_key = 'ver')
    OR (m.module_key = 'personal' AND a.action_key = 'ver')
    OR (m.module_key = 'tutores' AND a.action_key = 'ver')
    OR (m.module_key = 'asistencia' AND a.action_key IN ('ver', 'registrar'))
    OR (m.module_key = 'reportes' AND a.action_key = 'ver')
    OR (m.module_key = 'mensajeria' AND a.action_key IN ('ver', 'enviar'))
);

-- Insertar permisos por defecto para TUTOR
INSERT INTO role_permission (role_id, module_id, action_id, is_granted)
SELECT 
    r.id as role_id,
    m.id as module_id,
    a.id as action_id,
    TRUE as is_granted
FROM role r
CROSS JOIN system_module m
CROSS JOIN permission_action a
WHERE r.role_name = 'tutor'
AND (
    (m.module_key = 'alumnos' AND a.action_key = 'ver')
    OR (m.module_key = 'salas' AND a.action_key = 'ver')
    OR (m.module_key = 'asistencia' AND a.action_key = 'ver')
    OR (m.module_key = 'mensajeria' AND a.action_key IN ('ver', 'enviar'))
);

-- Crear índices para optimizar consultas
CREATE INDEX idx_role_permission_role ON role_permission(role_id);
CREATE INDEX idx_role_permission_module ON role_permission(module_id);
CREATE INDEX idx_role_permission_action ON role_permission(action_id);
CREATE INDEX idx_audit_log_changed_at ON permission_audit_log(changed_at);
CREATE INDEX idx_audit_log_changed_by ON permission_audit_log(changed_by);

-- Vista para consultar permisos fácilmente
CREATE OR REPLACE VIEW v_role_permissions AS
SELECT 
    r.id as role_id,
    r.role_name,
    m.id as module_id,
    m.module_key,
    m.module_name,
    a.id as action_id,
    a.action_key,
    a.action_name,
    COALESCE(rp.is_granted, FALSE) as has_permission,
    rp.updated_at,
    s.first_name as updated_by_first_name,
    s.paternal_surname as updated_by_surname
FROM role r
CROSS JOIN system_module m
CROSS JOIN permission_action a
LEFT JOIN role_permission rp ON (
    rp.role_id = r.id 
    AND rp.module_id = m.id 
    AND rp.action_id = a.id
)
LEFT JOIN staff s ON rp.updated_by = s.id
WHERE m.is_active = TRUE
ORDER BY r.id, m.display_order, a.id;

SELECT 'Estructura de permisos creada exitosamente' as Resultado;
