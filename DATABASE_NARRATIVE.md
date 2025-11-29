# Relato del Modelo de Datos: "La Vida de un Alumno en el Sistema"

Este relato desglosa minuciosamente cómo se representa un alumno, su entorno familiar, el espacio de aprendizaje y el equipo profesional que lo acompaña en el sistema de gestión del jardín de infantes.

---

## 1. El Protagonista: El Alumno (`student`)
En el centro de nuestro universo de datos está el **Alumno**. Cada niño o niña es una entidad única, identificada no solo por un número de legajo (`ID`), sino por una rica estructura de datos:
*   **Identidad**: Nombre completo (incluyendo segundos o terceros nombres), apellidos paterno y materno, y su apodo (`nickname_optional`). Su **DNI** actúa como identificador único legal.
*   **Ciclo Vital**: Su fecha de nacimiento (`birth_date`) es fundamental, ya que el sistema la utiliza para calcular su edad y sugerir la sala adecuada.
*   **Residencia**: El alumno "vive" en una dirección (`address`) específica (calle, número, ciudad, provincia, código postal), crucial para la logística y el contacto.

## 2. El Círculo Familiar y Legal: Responsables y Guardianes

### Los Responsables (`guardian`)
Un alumno nunca es un dato aislado; está rodeado de su red de contención. En la tabla `guardian` registramos a cada adulto responsable (madre, padre, tutor, abuelos).
*   **Datos Personales**: Nombre completo, DNI, teléfono personal y un email opcional.
*   **Datos Laborales**: Lugar de trabajo y teléfono laboral. Esto es vital: si ocurre una emergencia y no contestan al celular, el jardín sabe a dónde llamar.
*   **Dirección**: Puede ser distinta a la del alumno (ej. padres separados).

### La Relación (`student_guardian`)
La conexión entre un alumno y un adulto es compleja y se detalla en `student_guardian`:
*   **Vínculo**: ¿Es madre, padre, tío, abuelo o tutor legal?
*   **Jerarquía**: El campo `is_primary` indica quién es el contacto principal.
*   **Derechos Legales**: `custody_rights` marca si tiene la tenencia legal. `financial_responsible` indica quién paga la cuota.
*   **Permisos Operativos**:
    *   `authorized_pickup`: ¿Puede retirar al niño?
    *   `authorized_change`: ¿Puede autorizar cambios (ej. higiene)?

### Contactos de Emergencia (`emergency_contact`)
Aparte de los familiares directos, existe una red de seguridad adicional. Vecinos o familiares lejanos se registran aquí con su nombre, teléfono (y alternativo), relación y si están autorizados a retirar al menor. Se priorizan numéricamente (`priority`).

## 3. El Espacio de Aprendizaje: Las Salas (`classroom`)
El alumno no "flota" en el jardín; pertenece a una **Sala**.
*   **Identidad del Espacio**: Cada sala tiene un nombre (ej. "Sala Amarilla", "Los Patitos"), una **capacidad máxima** (`capacity`) que el sistema controla para no sobrepasar el cupo, y un año académico.
*   **Segmentación**:
    *   **Grupo Etario (`age_group`)**: Define para qué edad está pensada (ej. 3, 4 o 5 años).
    *   **Turno (`shift`)**: Mañana, Tarde o Completo. Esto es vital para organizar la asistencia.
*   **Estado**: Una sala puede estar `is_active` (funcionando) o inactiva (en refacción o cerrada temporalmente).

## 4. El Equipo Profesional: Staff, Maestros y Directivos (`staff`)
Quienes hacen funcionar el jardín son las personas registradas en `staff`. El sistema distingue minuciosamente sus funciones mediante **Roles** (`role`) y **Niveles de Acceso** (`access_level`).

### Jerarquía y Roles
1.  **Directivos (`Administrator`, `Director`)**:
    *   Tienen la visión global. Acceden a reportes financieros, gestionan el sorteo, configuran el sistema y pueden ver/editar la información de *cualquier* alumno o personal.
    *   Su rol les da permisos de "superusuario" para gestionar inscripciones críticas.
2.  **Maestros/Docentes (`Teacher`)**:
    *   Son el contacto directo. En la base de datos, un maestro está **asignado explícitamente a una Sala** (`classroom_id`).
    *   **Responsabilidades**: Toman asistencia (`attendance`), cargan actividades (`activity`) y se comunican con los padres.
    *   Solo ven los datos de *sus* alumnos asignados (por diseño de privacidad).
3.  **Secretaría (`Secretary`)**:
    *   Gestionan la documentación, atienden el teléfono y actualizan legajos. Tienen acceso a datos administrativos pero quizás no a la gestión pedagógica profunda.

### Datos del Personal
De cada miembro del staff guardamos:
*   **Credenciales**: Email (que es su usuario) y contraseña encriptada.
*   **Datos Personales**: Nombre completo, DNI, dirección y teléfono.
*   **Estado**: `is_active` determina si pueden iniciar sesión. `last_login` ayuda a auditoría.

## 5. El Proceso de Admisión: Del Sorteo a la Sala
La trayectoria administrativa es un viaje por estados (`status`), auditada paso a paso (`student_status_history`):
1.  **Solicitud**: Los padres llenan un formulario web. Entra como borrador (`draft`) o pendiente.
2.  **Revisión y Sorteo (`sorteo`)**: Si hay mucha demanda, el alumno entra en una lista de espera. El sistema prioriza automáticamente si `has_siblings_in_school` (tiene hermanos).
3.  **Inscripción (`inscripto`)**: Al asignarse una vacante, se vincula al alumno con una **Sala** específica.
    *   **Auditoría**: Cada cambio de estado se registra en `student_status_history` con la fecha, el motivo (`reason`) y *quién* realizó el cambio (`changed_by`), garantizando transparencia.
4.  **Documentación (`student_documents`)**:
    *   El sistema exige documentos digitales: DNI, certificados, autorizaciones.
    *   **Verificación**: Un administrativo debe marcar cada documento como `is_verified`. Se guarda quién verificó (`verified_by`) y cuándo (`verified_at`).
5.  **Activo**: El alumno asiste regularmente.

## 6. Salud Integral
La ficha médica es detallada:
*   **Cobertura**: Obra social y número de afiliado.
*   **Clínica**: Grupo sanguíneo, alergias, medicación habitual.
*   **Profesionales**: Datos del pediatra de cabecera.
*   **Vacunación**: Estado (`vaccination_status`) y control de certificados digitales.

## 7. Comunicación, Calendario y Día a Día
La vida diaria del jardín se refleja en varias entidades conectadas:
*   **Calendario (`calendar`)**: Cada sala tiene su propio calendario de eventos (ej. "Acto del 25 de Mayo", "Reunión de Padres"). Estos eventos tienen fecha, descripción y tipo.
*   **Actividades (`activity`)**: Los maestros crean actividades educativas específicas (ej. "Taller de Arte"). Cada actividad tiene nombre, descripción y está vinculada al **Maestro** responsable (`teacher_id`).
*   **Asistencia**: Se registra diariamente si el alumno estuvo presente, ausente o llegó tarde.
*   **Mensajería**: El sistema soporta conversaciones (`conversation`) entre el Staff y los Guardianes, agrupadas por sala o alumno, permitiendo un canal formal y registrado de comunicación.

---
**Conclusión**: Este modelo de datos teje una red donde el **Alumno** es sostenido por sus **Responsables** (legal y familiarmente), ubicado en un espacio físico seguro (**Sala**) y guiado por un profesional responsable (**Maestro**), todo bajo la supervisión estratégica de la **Dirección** y con un registro histórico y documental que asegura la transparencia institucional.
