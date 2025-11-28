-- Crear tabla de relación entre student y guardian
-- Incluye permisos de retiro y cambio de pañales
-- Fecha: 2025-11-28

USE kindergarten_db;

-- Tabla de relación Student-Guardian (muchos a muchos)
CREATE TABLE IF NOT EXISTS student_guardian (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_id BIGINT NOT NULL,
    guardian_id BIGINT NOT NULL,
    relationship VARCHAR(50) NOT NULL COMMENT 'Padre, Madre, Tutor, Abuelo/a, Tío/a, etc',
    is_primary BOOLEAN DEFAULT FALSE COMMENT 'Si es el responsable principal',
    authorized_pickup BOOLEAN DEFAULT FALSE COMMENT 'Autorizado para retirar al niño',
    authorized_diaper_change BOOLEAN DEFAULT FALSE COMMENT 'Autorizado para cambiar pañales',
    notes TEXT COMMENT 'Notas adicionales sobre este responsable',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student(id) ON DELETE CASCADE,
    FOREIGN KEY (guardian_id) REFERENCES guardian(id) ON DELETE CASCADE,
    UNIQUE KEY unique_student_guardian (student_id, guardian_id)
);

-- Crear índices para optimizar consultas
CREATE INDEX idx_student_guardian_student ON student_guardian(student_id);
CREATE INDEX idx_student_guardian_guardian ON student_guardian(guardian_id);
CREATE INDEX idx_student_guardian_primary ON student_guardian(is_primary);

-- Vista para consultar estudiantes con sus responsables
CREATE OR REPLACE VIEW v_student_guardians AS
SELECT 
    s.id as student_id,
    s.first_name as student_first_name,
    s.paternal_surname as student_paternal_surname,
    sg.id as relation_id,
    sg.relationship,
    sg.is_primary,
    sg.authorized_pickup,
    sg.authorized_diaper_change,
    sg.notes,
    g.id as guardian_id,
    g.first_name as guardian_first_name,
    g.paternal_surname as guardian_paternal_surname,
    g.maternal_surname as guardian_maternal_surname,
    g.phone as guardian_phone,
    g.email_optional as guardian_email,
    g.authorized_pickup as guardian_authorized_pickup,
    g.authorized_change as guardian_authorized_change
FROM student s
INNER JOIN student_guardian sg ON s.id = sg.student_id
INNER JOIN guardian g ON sg.guardian_id = g.id
ORDER BY s.paternal_surname, s.first_name, sg.is_primary DESC;

SELECT 'Tabla student_guardian y vista creadas exitosamente' as Resultado;
