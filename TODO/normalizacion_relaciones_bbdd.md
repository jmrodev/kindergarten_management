# Normalización del Sistema de Gestión del Jardín de Infantes

## Análisis de Relaciones y Atributos

Basado en el documento "relaciones_bbdd.md", he identificado las siguientes entidades y relaciones del sistema.

## 1. Primera Forma Normal (1FN)

### Objetivo: Eliminar valores no atómicos

**Antes de la normalización (Valores no atómicos detectados):**
- Nombre completo como un solo campo
- Múltiples nombres en un solo campo
- Dirección completa como un solo campo
- Múltiples contactos de emergencia
- Múltiples responsables
- Múltiples documentos
- Múltiples vacunas
- Múltiples estados
- Múltiples asistencias
- Múltiples actas de reuniones

**Después de aplicar 1FN:**
- Separar nombre completo en campos individuales (nombre, segundo_nombre, tercer_nombre, apellido_paterno, apellido_materno)
- Separar dirección en campos individuales (calle, número, ciudad, provincia, código_postal)
- Crear tablas separadas para contactos de emergencia
- Crear tabla intermedia para relación alumno-responsable
- Crear tabla separada para documentos
- Crear tabla separada para vacunas
- Crear tabla separada para historial de estados
- Crear tabla separada para asistencias
- Crear tabla separada para actas de reuniones

## 2. Segunda Forma Normal (2FN)

### Objetivo: Eliminar dependencias parciales

**Antes de la normalización (Dependencias parciales detectadas):**
- En una tabla con clave primaria compuesta (alumno_id, responsable_id):
  - autorizado_para_retiro depende de alumno_id y responsable_id
  - nombre_responsable depende solo de responsable_id
  - telefono_responsable depende solo de responsable_id

**Después de aplicar 2FN:**
- Separar la información del responsable en su propia tabla
- Mantener solo los atributos que dependen de ambas partes en la tabla intermedia
- Crear tabla AlumnoResponsable con: alumno_id, responsable_id, tipo_relacion, autorizado_retiro, autorizado_cambio_pañal, derechos_custodia, responsable_financiero
- Crear tabla Responsable con: responsable_id, nombre, apellido, telefono, email, etc.

### Tablas después de 2FN:

**Alumno:**
- alumno_id (PK)
- nombre, segundo_nombre_opcional, tercer_nombre_opcional, apellido_paterno, apellido_materno, alias_opcional
- dni, fecha_nacimiento
- direccion_id (FK)
- contacto_emergencia_id (FK)
- sala_id (FK)
- turno, status, fecha_inscripcion, fecha_retiro
- Información médica: seguro_salud, numero_afiliado, alergias, medicamentos, observaciones_medicas, tipo_sangre, nombre_pediatra, telefono_pediatra
- Autorizaciones: autorizacion_foto, autorizacion_excursion, autorizacion_atencion_medica
- Información adicional: tiene_hermanos_escuela, necesidades_especiales, estado_vacunacion, observaciones

**Responsable:**
- responsable_id (PK)
- nombre, segundo_nombre_opcional, apellido_paterno, apellido_materno, apellido_preferido
- dni, telefono, email_opcional
- lugar_trabajo, telefono_trabajo
- autorizado_retiro, autorizado_cambio
- direccion_id (FK)
- usuario_portal_padres_id (FK)
- rol_id (FK)

**AlumnoResponsable (Relación N:M):**
- alumno_id (PK, FK)
- responsable_id (PK, FK)
- tipo_relacion, es_primario, autorizado_retiro, autorizado_cambio_pañal, derechos_custodia, responsable_financiero
- notas, fecha_creacion, fecha_actualizacion

**Direccion:**
- direccion_id (PK)
- calle, numero, ciudad, provincia, codigo_postal_opcional

**ContactoEmergencia:**
- contacto_id (PK)
- nombre_completo, relacion, prioridad, telefono, telefono_alternativo, autorizado_para_retiro
- alumno_id (FK)

## 3. Tercera Forma Normal (3FN)

### Objetivo: Eliminar dependencias transitivas

**Antes de la normalización (Dependencias transitivas detectadas):**
- En la tabla Alumno, algunos campos no dependen directamente del alumno_id
- Por ejemplo, si hubiera información del personal de salud asignado basada en el tipo de necesidad especial
- O si hubiera información del pediatra que dependiera del seguro de salud

**Después de aplicar 3FN:**
- Separar información que depende transitivamente de otros atributos
- Asegurar que todos los atributos no clave dependan directamente del identificador principal
- Crear tablas relacionales para eliminar dependencias transitivas

### Tablas después de 3FN:

**Alumno:**
- alumno_id (PK)
- nombre, segundo_nombre_opcional, tercer_nombre_opcional, apellido_paterno, apellido_materno, alias_opcional
- dni, fecha_nacimiento
- direccion_id (FK)
- contacto_emergencia_id (FK)
- sala_id (FK)
- turno, status, fecha_inscripcion, fecha_retiro
- Información médica: seguro_salud, numero_afiliado, alergias, medicamentos, observaciones_medicas, tipo_sangre, nombre_pediatra, telefono_pediatra
- Autorizaciones: autorizacion_foto, autorizacion_excursion, autorizacion_atencion_medica
- Información adicional: tiene_hermanos_escuela, necesidades_especiales, estado_vacunacion, observaciones

**Sala:**
- sala_id (PK)
- nombre, capacidad, turno, año_academico, grupo_edad, esta_activa

**Personal:**
- personal_id (PK)
- nombre, segundo_nombre_opcional, tercer_nombre_opcional, apellido_paterno, apellido_materno, apellido_preferido
- dni, email, contraseña_hash
- esta_activo, ultimo_login, fecha_creacion
- direccion_id (FK), sala_id (FK), rol_id (FK)
- telefono, email_opcional

**Rol:**
- rol_id (PK)
- nombre_rol, nivel_acceso_id (FK)

**NivelAcceso:**
- nivel_acceso_id (PK)
- nombre_acceso, descripcion

**Documento:**
- documento_id (PK)
- alumno_id (FK), tipo_documento, nombre_archivo, ruta_archivo, tamaño_archivo, tipo_mime
- subido_por (FK), fecha_subida, fecha_expiracion, notas
- esta_verificado, verificado_por (FK), fecha_verificacion
- entrega_verificada, entrega_verificada_por (FK), fecha_verificacion_entrega

**Vacuna:**
- vacuna_id (PK)
- alumno_id (FK), nombre_vacuna, fecha_vacuna, numero_lote, numero_dosis, proxima_fecha
- estado (activo/faltante/completo/exento), administrado_por, notas
- fecha_creacion, fecha_actualizacion

**Asistencia:**
- asistencia_id (PK)
- alumno_id (FK), fecha, estado, tipo_salida_opcional
- sala_id (FK), registrado_por (FK)

**HistorialEstado:**
- historial_id (PK)
- alumno_id (FK), estado_anterior, nuevo_estado, fecha_cambio, razon, cambiado_por (FK)

**Calendario:**
- calendario_id (PK)
- fecha, descripcion, tipo_evento, sala_id (FK), personal_id (FK)

**ActaReunion:**
- acta_id (PK)
- tipo_reunion, fecha_reunion, hora_reunion, participantes, proposito, conclusiones
- responsable_acta (FK), creado_por (FK), fecha_creacion, actualizado_por (FK), fecha_actualizacion

## 4. Aplicación de Normalización a Relaciones Específicas

### 4.1 Relación Alumno-Dirección
- **Verificación:** Esta relación cumple con 3FN ya que dirección_id depende completamente del alumno_id y no hay dependencias transitivas

### 4.2 Relación Alumno-Contacto de Emergencia
- **Verificación:** Esta relación cumple con 3FN ya que contacto_emergencia_id depende completamente del alumno_id y no hay dependencias transitivas

### 4.3 Relación Alumno-Sala
- **Verificación:** Esta relación cumple con 3FN ya que sala_id depende completamente del alumno_id y no hay dependencias transitivas

### 4.4 Relación Alumno-Responsable
- **Verificación:** Esta relación N:M está correctamente modelada con la tabla intermedia AlumnoResponsable que almacena únicamente los atributos que dependen de ambos identificadores

### 4.5 Relación Alumno-Documento
- **Verificación:** Esta relación 1:N cumple con 3FN ya que todos los atributos dependen directamente de documento_id

### 4.6 Relación Alumno-Vacuna
- **Verificación:** Esta relación 1:N cumple con 3FN ya que todos los atributos dependen directamente de vacuna_id

## 5. Análisis de Anomalías Eliminadas

### 5.1 Anomalía de Inserción
- Antes: No se podía insertar un alumno sin tener toda su información completa
- Después: Se pueden insertar alumnos y sus entidades relacionadas por separado, respetando las restricciones de integridad referencial

### 5.2 Anomalía de Actualización
- Antes: Cambiar la dirección de una calle afectaría a todos los alumnos en esa calle
- Después: Cada dirección es independiente y puede actualizarse sin afectar a otros alumnos

### 5.3 Anomalía de Eliminación
- Antes: Eliminar un alumno podría eliminar información compartida
- Después: La información compartida se mantiene en tablas separadas y puede ser reutilizada

## 6. Validación Final de Normalización

### 6.1 Verificación de 1FN
- ✓ Todos los campos contienen valores atómicos
- ✓ No hay campos multivaluados
- ✓ Se eliminaron los grupos repetidos

### 6.2 Verificación de 2FN
- ✓ No hay dependencias parciales en claves compuestas
- ✓ Todos los atributos de la tabla intermedia dependen de ambos lados de la relación
- ✓ Los atributos no dependen de parte de la clave compuesta

### 6.3 Verificación de 3FN
- ✓ No hay dependencias transitivas
- ✓ Todos los atributos no clave dependen directamente de la clave primaria
- ✓ No hay campos que dependan de otros campos no clave

## 7. Recomendaciones de Índices para Rendimiento

Después de la normalización, se requieren índices para mantener el rendimiento:

```sql
-- Índices en tablas principales
CREATE INDEX idx_alumno_direccion ON alumno(direccion_id);
CREATE INDEX idx_alumno_sala ON alumno(sala_id);
CREATE INDEX idx_alumno_contacto_emergencia ON alumno(contacto_emergencia_id);
CREATE INDEX idx_alumno_documento ON documento(alumno_id);
CREATE INDEX idx_alumno_vacuna ON vacuna(alumno_id);
CREATE INDEX idx_alumno_asistencia ON asistencia(alumno_id);

-- Índices en tablas intermedias
CREATE INDEX idx_alumno_responsable_alumno ON alumno_responsable(alumno_id);
CREATE INDEX idx_alumno_responsable_responsable ON alumno_responsable(responsable_id);

-- Índices en tablas de historial
CREATE INDEX idx_historial_estado_alumno ON historial_estado(alumno_id);
CREATE INDEX idx_asistencia_fecha ON asistencia(fecha);
CREATE INDEX idx_documento_tipo ON documento(tipo_documento);
```

## 8. Conclusiones de la Normalización

El proceso de normalización aplicado al sistema de gestión del jardín de infantes ha:

1. **Eliminado redundancias:** La información ya no se repite innecesariamente en múltiples lugares
2. **Mejorado la integridad de datos:** Las restricciones referenciles aseguran la consistencia
3. **Facilitado el mantenimiento:** Cambios en información compartida se realizan en un solo lugar
4. **Asegurado la flexibilidad:** El sistema puede adaptarse a cambios sin afectar la estructura fundamental
5. **Optimizado el rendimiento:** Con los índices adecuados, las consultas complejas se ejecutan eficientemente

La estructura final es coherente con los principios de normalización y cumple con los requisitos funcionales descritos en el documento original de relaciones de la base de datos.