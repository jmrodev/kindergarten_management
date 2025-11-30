# Entidades y Relaciones del Sistema de Gestión del Jardín de Infantes

## 1. Entidad: Alumno (Student)

### Atributos:
- ID (bigint)
- Nombre(s)
- Apellidos (paterno y materno)
- Alias/nickname
- DNI
- Fecha de nacimiento
- Dirección (FK)
- Contacto de emergencia (FK)
- Sala (FK)
- Turno (mañana, tarde, mañana y tarde)
- Estado (preinscripto, pendiente, aprobado, sorteo, inscripto, activo, inactivo, egresado, rechazado)
- Fecha de inscripción
- Fecha de retiro (si aplica)
- Información médica (seguro, número de afiliado, alergias, medicamentos, observaciones médicas, tipo de sangre)
- Nombre y teléfono del pediatra
- Autorizaciones (fotografía, excursiones, atención médica)
- Tiene hermanos en el jardín
- Necesidades especiales
- Estado de vacunación
- Observaciones

### Relaciones:
- Uno a Uno con Dirección
- Uno a Uno con Contacto de Emergencia
- Muchos a Uno con Sala
- Muchos a Muchos con Responsable (a través de tabla intermedia Student_Guardian)
- Uno a Muchos con Documentos
- Uno a Muchos con Historial de Estados
- Uno a Muchos con Documentación Pendiente
- Uno a Muchos con Asistencia
- Uno a Muchos con Conversaciones (indirectamente a través de responsables)
- Uno a Muchos con Vacunas
- Uno a Muchos con Revisión de Documentos

## 2. Entidad: Responsable (Guardian)

### Atributos:
- ID (bigint)
- Nombre(s)
- Apellidos (paterno y materno)
- Apellido preferido
- DNI
- Dirección (FK)
- Teléfono
- Email
- Lugar de trabajo
- Teléfono del trabajo
- Autorizado para retiro
- Autorizado para cambios
- Usuario del portal de padres (FK)
- Rol (FK)

### Relaciones:
- Muchos a Uno con Dirección
- Uno a Muchos con Usuarios del Portal de Padres
- Uno a Muchos con Roles
- Muchos a Muchos con Alumnos (a través de tabla intermedia Student_Guardian)
- Muchos a Muchos con Conversaciones (guardianes participantes)
- Uno a Muchos con Mensajes de Guardianes

## 3. Entidad: Sala (Classroom)

### Atributos:
- ID (bigint)
- Nombre
- Capacidad
- Turno (mañana, tarde, completo)
- Año académico
- Grupo de edad
- Activo

### Relaciones:
- Uno a Muchos con Alumnos
- Uno a Muchos con Personal (si está asignado a una sala específica)
- Uno a Muchos con Asistencia
- Uno a Muchos con Calendario
- Uno a Muchos con Actividades
- Uno a Muchos con Conversaciones
- Uno a Muchos con Actividades Especiales

## 4. Entidad: Personal (Staff)

### Atributos:
- ID (bigint)
- Nombre(s)
- Apellidos (paterno y materno)
- Apellido preferido
- DNI
- Email
- Contraseña (hash)
- Activo
- Último login
- Fecha de creación
- Dirección (FK)
- Teléfono
- Email opcional
- Sala asignada (FK)
- Rol (FK)

### Relaciones:
- Muchos a Uno con Dirección
- Muchos a Uno con Sala (si está asignado)
- Muchos a Uno con Rol
- Uno a Muchos con Asistencia (de personal)
- Uno a Muchos con Conversaciones (personal participante)
- Uno a Muchos con Mensajes de Personal
- Uno a Muchos con Documentos Verificados
- Uno a Muchos con Documentos con Entrega Verificada
- Uno a Muchos con Cambios de Estado de Alumnos
- Uno a Muchos con Solicitud de Documentación Pendiente
- Uno a Muchos con Solicitud de Padres Aprobadas
- Uno a Muchos con Solicitud de Padres Rechazadas
- Uno a Muchos con Revisión de Documentos
- Uno a Muchos con Asistencia de Alumnos (registro)
- Uno a Muchos con Actas de Reuniones

## 5. Entidad: Documento (Student_Documents)

### Atributos:
- ID (bigint)
- Alumno (FK)
- Tipo de documento
- Nombre del archivo
- Ruta del archivo
- Tamaño del archivo
- Tipo MIME
- Subido por (staff, FK)
- Fecha de subida
- Fecha de expiración
- Notas
- Verificado
- Verificado por (staff, FK)
- Fecha de verificación
- Entrega verificada
- Verificado entrega por (staff, FK)
- Fecha de verificación de entrega

### Relaciones:
- Muchos a Uno con Alumno
- Muchos a Uno con Staff (subido por)
- Muchos a Uno con Staff (verificado por)
- Muchos a Uno con Staff (verificado entrega por)
- Uno a Muchos con Revisión de Documentos

## 6. Entidad: Documentación Pendiente (Pending_Documentation)

### Atributos:
- ID (bigint)
- Alumno (FK)
- Tipo de documento
- Requerido por (staff, FK)
- Notas
- Fecha de creación
- Fecha de completado
- Completado por (staff, FK)

### Relaciones:
- Muchos a Uno con Alumno
- Muchos a Uno con Staff (requerido por)
- Muchos a Uno con Staff (completado por)

## 7. Entidad: Asistencia (Attendance)

### Atributos:
- ID (bigint)
- Alumno (FK)
- Fecha
- Estado
- Tipo de salida (opcional)
- Sala (FK)
- Registrado por (staff, FK)

### Relaciones:
- Muchos a Uno con Alumno
- Muchos a Uno con Sala
- Muchos a Uno con Staff (registrado por)

## 8. Entidad: Calendario (Calendar)

### Atributos:
- ID (bigint)
- Fecha
- Descripción
- Tipo de evento
- Sala (FK)
- Personal (FK)

### Relaciones:
- Muchos a Uno con Sala
- Muchos a Uno con Personal

## 9. Entidad: Conversación (Conversation)

### Atributos:
- ID (bigint)
- Sala (FK)
- Fecha de creación

### Relaciones:
- Muchos a Uno con Sala
- Muchos a Muchos con Guardianes
- Muchos a Muchos con Personal
- Uno a Muchos con Mensajes de Guardianes
- Uno a Muchos con Mensajes de Personal

## 10. Entidad: Mensaje (Guardian_Message y Staff_Message)

### Atributos (Guardian_Message):
- ID (bigint)
- Conversación (FK)
- Emisor (guardian, FK)
- Contenido
- Fecha de envío
- Leído

### Atributos (Staff_Message):
- ID (bigint)
- Conversación (FK)
- Emisor (staff, FK)
- Contenido
- Fecha de envío
- Leído

### Relaciones:
- Muchos a Uno con Conversación
- Muchos a Uno con Guardian (emisor)
- Muchos a Uno con Staff (emisor)

## 11. Entidad: Vacunas (Vaccination_Records)

### Atributos:
- ID (bigint)
- Alumno (FK)
- Nombre de la vacuna
- Fecha de vacunación
- Número de lote
- Número de dosis
- Próxima fecha de vacuna
- Estado (activo, faltante, completo, exento)
- Administrado por
- Notas
- Fecha de creación
- Fecha de actualización

### Relaciones:
- Muchos a Uno con Alumno

## 12. Entidad: Revisión de Documentos (Document_Review)

### Atributos:
- ID (bigint)
- Tipo de documento
- ID del documento (referencia según tipo)
- Revisor (staff, FK)
- Fecha de revisión
- Estado (pendiente, verificado, rechazado)
- Notas
- Entrega verificada
- Entrega verificada por (staff, FK)
- Fecha de verificación de entrega

### Relaciones:
- Muchos a Uno con Staff (revisor)
- Muchos a Uno con Staff (verificado entrega por)

## 13. Entidad: Actas de Reuniones (Meeting_Minutes)

### Atributos:
- ID (bigint)
- Tipo de reunión
- Fecha de reunión
- Hora de reunión
- Participantes
- Propósito
- Conclusiones
- Responsable (staff, FK)
- Creado por (staff, FK)
- Fecha de creación
- Actualizado por (staff, FK)
- Fecha de actualización

### Relaciones:
- Muchos a Uno con Staff (responsable)
- Muchos a Uno con Staff (creado por)
- Muchos a Uno con Staff (actualizado por)

## 14. Entidad: Usuario del Portal de Padres (Parent_Portal_Users)

### Atributos:
- ID (bigint)
- ID de Google
- Email
- Nombre
- Fecha de creación

### Relaciones:
- Uno a Muchos con Responsables
- Uno a Muchos con Borradores de Inscripción
- Uno a Muchos con Solicitud de Padres

## 15. Entidad: Solicitud de Padres (Parent_Portal_Submissions)

### Atributos:
- ID (bigint)
- Usuario (FK)
- Alumno (FK)
- Fecha de envío
- Estado
- Fecha de aprobación
- Aprobado por (staff, FK)
- Fecha de rechazo
- Rechazado por (staff, FK)
- Razón de rechazo

### Relaciones:
- Muchos a Uno con Usuario del Portal
- Muchos a Uno con Alumno
- Muchos a Uno con Staff (aprobado por)
- Muchos a Uno con Staff (rechazado por)

## 16. Entidad: Historial de Estados de Alumno (Student_Status_History)

### Atributos:
- ID (bigint)
- Alumno (FK)
- Estado anterior
- Nuevo estado
- Fecha de cambio
- Razón
- Cambiado por (staff, FK)

### Relaciones:
- Muchos a Uno con Alumno
- Muchos a Uno con Staff (cambiado por)

## 17. Entidad: Relación Alumno-Responsable (Student_Guardian)

### Atributos:
- Alumno (FK)
- Responsable (FK)
- Tipo de relación
- Es primario
- Autorizado para retiro
- Autorizado para cambio de pañal
- Derechos de custodia
- Responsable financiero
- Notas
- Fecha de creación
- Fecha de actualización

### Relaciones:
- Muchos a Uno con Alumno
- Muchos a Uno con Responsable

## 18. Entidad: Actividad (Activity)

### Atributos:
- ID (bigint)
- Nombre
- Descripción (opcional)
- Horario (opcional)
- Docente (FK)
- Sala (FK)

### Relaciones:
- Muchos a Uno con Personal (docente)
- Muchos a Uno con Sala

## 19. Entidad: Contacto de Emergencia (Emergency_Contact)

### Atributos:
- ID (bigint)
- Alumno (FK)
- Nombre completo
- Relación
- Prioridad
- Teléfono
- Teléfono alternativo
- Autorizado para retiro

### Relaciones:
- Muchos a Uno con Alumno

## 20. Entidad: Rol (Role)

### Atributos:
- ID (bigint)
- Nombre del rol
- Nivel de acceso (FK)

### Relaciones:
- Muchos a Uno con Nivel de Acceso
- Uno a Muchos con Personal
- Uno a Muchos con Responsables
- Muchos a Muchos con Módulos y Acciones (a través de Role_Permission)

## 21. Entidad: Nivel de Acceso (Access_Level)

### Atributos:
- ID (bigint)
- Nombre del acceso
- Descripción

### Relaciones:
- Uno a Muchos con Roles

## 22. Entidad: Módulo del Sistema (System_Module)

### Atributos:
- ID (bigint)
- Nombre del módulo
- Clave del módulo
- Descripción
- Activo
- Orden de visualización

### Relaciones:
- Muchos a Muchos con Roles (a través de Role_Permission)

## 23. Entidad: Acción de Permiso (Permission_Action)

### Atributos:
- ID (bigint)
- Nombre de la acción
- Clave de la acción
- Descripción

### Relaciones:
- Muchos a Muchos con Roles (a través de Role_Permission)

## 24. Entidad: Permiso de Rol (Role_Permission)

### Atributos:
- Rol (FK)
- Módulo (FK)
- Acción (FK)
- Se otorga
- Actualizado por (staff, FK)
- Fecha de actualización

### Relaciones:
- Muchos a Uno con Rol
- Muchos a Uno con Módulo
- Muchos a Uno con Acción
- Muchos a Uno con Staff (actualizado por)

## Diagrama de Relaciones

### Estructura Principal:
Alumno ←→ Dirección (1:1)
Alumno ←→ Contacto de Emergencia (1:1)
Alumno ←→ Sala (N:1)
Alumno ←→ Responsable (N:N a través de Student_Guardian)
Alumno ←→ Documentos (1:N)
Alumno ←→ Historial de Estados (1:N)
Alumno ←→ Documentación Pendiente (1:N)
Alumno ←→ Asistencia (1:N)
Alumno ←→ Vacunas (1:N)
Alumno ←→ Revisión de Documentos (1:N)

### Estructura de Personal:
Personal ←→ Dirección (N:1)
Personal ←→ Sala (N:1)
Personal ←→ Rol (N:1)

### Estructura de Comunicación:
Sala ←→ Conversación (1:N)
Conversación ←→ Responsable (N:N)
Conversación ←→ Personal (N:N)
Conversación ←→ Mensajes (1:N)

### Estructura de Seguridad:
Rol ←→ Nivel de Acceso (N:1)
Rol ←→ Módulo ←→ Acción (N:N a través de Role_Permission)