# Tablas Faltantes y Actualizaciones Necesarias

## 1. Crear tabla meeting_minutes

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

## 2. Crear tabla vaccination_records

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

## 3. Crear tabla document_review

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

## 4. Actualizar tabla calendar

```sql
-- Modificar el campo event_type para incluir los valores específicos
ALTER TABLE calendar MODIFY event_type ENUM('inscripcion', 'inicio_clases', 'fin_clases', 'vacaciones', 'invierno', 'feriado', 'personal_activo', 'dia_maestro', 'arte', 'musica', 'gimnasia', 'ingles', 'expresion_corporal', 'salida', 'reunion_directivos_familia', 'reunion_apoyo_familia', 'reunion_personal', 'celebracion', 'evento_especial');
```

## 5. Actualizar tabla attendance

```sql
-- Agregar campo para registrar asistencia del personal
ALTER TABLE attendance ADD COLUMN staff_id BIGINT;
ALTER TABLE attendance ADD FOREIGN KEY (staff_id) REFERENCES staff(id);
```

## 6. Actualizar tabla activity

```sql
-- Agregar campo para relacionar actividades con salas
ALTER TABLE activity ADD COLUMN classroom_id BIGINT;
ALTER TABLE activity ADD FOREIGN KEY (classroom_id) REFERENCES classroom(id);
```

## 7. Actualizar tabla calendar (agregar staff_id)

```sql
-- Agregar campo staff_id para eventos específicos de personal
ALTER TABLE calendar ADD COLUMN staff_id BIGINT;
ALTER TABLE calendar ADD FOREIGN KEY (staff_id) REFERENCES staff(id);
```

## 8. Eliminar vistas duplicadas

-- Ya están presentes en el archivo init_db.sql, pero hay duplicados que deben eliminarse:
```sql
-- Eliminar duplicados de vistas para evitar errores
DROP VIEW IF EXISTS v_lottery_list_simple;
-- La vista se recrea con la definición correcta como ya está en init_db.sql

DROP VIEW IF EXISTS v_lottery_list;
-- La vista se recrea con la definición correcta como ya está en init_db.sql
```

## 9. Agregar índices para mejorar rendimiento

```sql
-- Índice para la tabla vaccination_records
CREATE INDEX idx_vaccination_records_student_status ON vaccination_records(student_id, status);

-- Índice para la tabla document_review
CREATE INDEX idx_document_review_type_status ON document_review(document_type, status);
```

## 10. Actualizar vistas existentes si es necesario

```sql
-- Actualizar vista para incluir información de vacunas
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
```

## 11. Actualizar vistas de preinscriptos

```sql
-- Actualizar vista para incluir información de vacunas y documentos
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
```