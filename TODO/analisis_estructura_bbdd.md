# Análisis de la Estructura de la Base de Datos

## Comparación entre el archivo init_db.sql y la documentación completa de la base de datos

### Tablas Presentes en init_db.sql
1. address - ✓ (Completamente presente)
2. access_level - ✓ (Completamente presente)
3. classroom - ✓ (Completamente presente)
4. role - ✓ (Completamente presente)
5. staff - ✓ (Completamente presente)
6. parent_portal_users - ✓ (Completamente presente)
7. guardian - ✓ (Completamente presente)
8. student - ✓ (Completamente presente)
9. emergency_contact - ✓ (Completamente presente)
10. student_guardian - ✓ (Completamente presente)
11. student_documents - ✓ (Completamente presente)
12. student_status_history - ✓ (Completamente presente)
13. parent_registration_drafts - ✓ (Completamente presente)
14. pending_documentation - ✓ (Completamente presente)
15. parent_portal_submissions - ✓ (Completamente presente)
16. attendance - ✓ (Completamente presente)
17. calendar - ✓ (Completamente presente)
18. activity - ✓ (Completamente presente)
19. system_module - ✓ (Completamente presente)
20. permission_action - ✓ (Completamente presente)
21. role_permission - ✓ (Completamente presente)
22. permission_audit_log - ✓ (Completamente presente)
23. conversation - ✓ (Completamente presente)
24. conversation_guardian - ✓ (Completamente presente)
25. conversation_staff - ✓ (Completamente presente)
26. guardian_message - ✓ (Completamente presente)
27. staff_message - ✓ (Completamente presente)

### Tablas que faltan en init_db.sql (según la documentación completa)

1. **meeting_minutes** - Falta completamente
   - Descripción: Tabla para registrar actas de reuniones entre directivos y familias, personal de apoyo y familias, y reuniones del personal
   - Campos necesarios:
     - meeting_type (directivos_familia, apoyo_familia, personal)
     - meeting_date
     - meeting_time
     - participants
     - purpose
     - conclusions
     - responsible_staff_id
     - created_by
     - created_at
     - updated_by
     - updated_at

2. **vaccination_records** - Falta completamente
   - Descripción: Tabla para registrar vacunas de los alumnos con control de vacunas activas y faltantes
   - Campos necesarios:
     - student_id
     - vaccine_name
     - vaccine_date
     - batch_number
     - dose_number
     - next_due_date
     - status (activo, faltante, completo, exento)
     - administered_by
     - notes
     - created_at
     - updated_at

3. **document_review** - Falta completamente
   - Descripción: Tabla para revisión de documentos de alumnos, padres, personal, actas, salidas, permisos, etc.
   - Campos necesarios:
     - document_type (alumno, padre, personal, acta, salida, permiso, otro)
     - document_id (referencia al ID del documento según el tipo)
     - reviewer_id
     - review_date
     - status (pendiente, verificado, rechazado)
     - notes
     - verified_delivery
     - delivery_verified_by
     - delivery_verified_at

### Campos faltantes en tablas existentes

1. **calendar** - Campo event_type limitado
   - Actual: event_type TEXT
   - Necesario: event_type ENUM con valores específicos para actividades especiales como:
     - 'arte', 'musica', 'gimnasia', 'ingles', 'expresion_corporal', 'salida', 
     - 'reunion_directivos_familia', 'reunion_apoyo_familia', 'reunion_personal', 
     - 'celebracion', 'evento_especial'

2. **attendance** - Falta campo para asistencia del personal
   - Actual: Solo tiene asistencia de alumnos
   - Necesario: Agregar campo staff_id para registrar asistencia del personal

3. **activity** - Falta relación con salas
   - Actual: No tiene relación con classroom
   - Necesario: Agregar classroom_id para relacionar las actividades especiales con salas

4. **calendar** - Falta campo staff_id
   - Actual: No relaciona eventos con personal específico
   - Necesario: Agregar staff_id para eventos específicos de personal

### Vistas faltantes en init_db.sql

1. **v_preinscriptos_with_pending_docs** - Presente pero duplicada
   - La vista ya está en init_db.sql pero está duplicada (aparece dos veces)

2. **v_students_pending_document_delivery** - Presente pero duplicada
   - La vista ya está en init_db.sql pero está duplicada (aparece dos veces)

### Adaptaciones necesarias para implementar las funcionalidades faltantes

1. **Módulo de entrevistas con personal de salud**:
   - Aunque no hay una tabla específica para entrevistas, se podría implementar usando la tabla de actas o creando una tabla específica
   - Alternativamente, podría usarse el sistema de conversaciones/mensajes para este propósito

2. **Asistencia de personal**:
   - Agregar campo staff_id a la tabla attendance
   - O crear una tabla staff_attendance separada si es necesario mantenerlos separados

3. **Calendario con eventos de especialistas**:
   - Ajustar el campo event_type en la tabla calendar para incluir los eventos específicos
   - Agregar relaciones con staff_id para eventos específicos

4. **Gestión de vacunas**:
   - Crear la tabla vaccination_records completamente
   - Agregar lógica para comparar vacunas registradas con el calendario oficial

5. **Revisión de documentos**:
   - Crear la tabla document_review completamente
   - Agregar lógica para revisar todos los tipos de documentos mencionados

## Prioridad de implementación

### Alta prioridad:
1. meeting_minutes - Para gestionar reuniones con familias
2. vaccination_records - Para control de vacunación y verificación
3. document_review - Para revisión integral de documentos
4. Actualizar campos en calendar - Para eventos completos

### Media prioridad:
1. Agregar staff_id a attendance - Para asistencia de personal
2. Agregar classroom_id a activity - Para relacionar actividades con salas
3. Eliminar vistas duplicadas en init_db.sql

### Baja prioridad:
1. Agregar vistas adicionales que faciliten la consulta de datos

## Recomendación

El archivo init_db.sql ya contiene la mayor parte de la estructura necesaria para el sistema. Sin embargo, faltan varias funcionalidades importantes que deben implementarse a través de las tablas faltantes y la actualización de algunos campos existentes. La implementación de estas funcionalidades completaría el sistema para abarcar todas las características mencionadas en la documentación completa.