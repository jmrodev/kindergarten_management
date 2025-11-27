# 🎓 Sistema de Gestión de Jardín de Infantes

Sistema integral para la administración de un jardín de infantes, desarrollado con una arquitectura moderna de 3 capas.

## 📋 Descripción

Aplicación web completa para gestionar todos los aspectos de un jardín de infantes, incluyendo alumnos, tutores, personal, asistencia, calendario de eventos y comunicación interna.

## 🏗️ Arquitectura

```
kindergarten_project_guide/
├── backend/              # API REST en Node.js + Express
├── frontend/             # Interfaz en React + Vite
├── db/                   # Esquema de base de datos MariaDB
├── documentation/        # Documentación técnica (Mermaid)
└── IMPLEMENTATION_STATUS.md  # Estado actual del proyecto
```

### Stack Tecnológico

**Frontend:**
- React 19
- Vite 7
- Bootstrap 5
- React Bootstrap

**Backend:**
- Node.js
- Express 5
- MariaDB 3.4

**Base de Datos:**
- MariaDB/MySQL
- 17 tablas normalizadas

## 📊 Estado del Proyecto

**Versión Actual:** 0.2.0 (MVP Parcial)  
**Progreso:** 20% completado

### ✅ Módulos Implementados

- **Gestión de Alumnos** - CRUD completo con formulario extenso
- **Gestión de Salas** - CRUD completo con indicadores visuales

### ⚠️ En Desarrollo

- Frontend base funcional
- API REST parcial

### ❌ Pendientes (7 módulos principales)

1. **Gestión de Tutores/Padres** (Alta prioridad)
2. **Gestión de Personal** (Alta prioridad)
3. **Control de Asistencia** (Alta prioridad)
4. **Autenticación y Autorización** (Crítico 🔴)
5. Calendario de Eventos (Media prioridad)
6. Gestión de Actividades (Media prioridad)
7. Sistema de Mensajería (Baja prioridad)

> **Ver detalles completos en:** [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md)

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ y pnpm
- MariaDB/MySQL 10.5+
- Git

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd kindergarten_project_guide
```

### 2. Configurar Base de Datos

```bash
# Crear base de datos
mysql -u root -p
CREATE DATABASE kindergarten_db;
USE kindergarten_db;
SOURCE db/schema.sql;
exit;
```

### 3. Configurar Backend

```bash
cd backend
pnpm install

# Crear archivo .env
cat > .env << EOF
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=kindergarten_db
PORT=3000
EOF

# Iniciar servidor
node server.js
```

El backend estará disponible en `http://localhost:3000`

### 4. Configurar Frontend

```bash
cd frontend
pnpm install

# Iniciar servidor de desarrollo
pnpm dev
```

El frontend estará disponible en `http://localhost:5173`

## 📚 Documentación

### Documentación Técnica

La carpeta `/documentation` contiene diagramas Mermaid con:

- **index.mmd** - Guía general del proyecto
- **business_analysis.mmd** - Análisis de negocio y casos de uso
- **design_architecture.mmd** - Arquitectura y diseño del sistema
- **data_modeling.mmd** - Modelo de datos (ERD)
- **entity_relationship_diagram.mmd** - Diagrama ER detallado
- **testing.mmd** - Estrategia de testing
- **project_management.mmd** - Gestión del proyecto (Agile/Scrum)

Cada archivo tiene versión HTML para visualización directa.

### Esquema de Base de Datos

El archivo `/db/schema.sql` contiene el esquema completo con 17 tablas:

**Entidades Principales:**
- `student` - Alumnos
- `guardian` - Tutores/Padres
- `staff` - Personal
- `classroom` - Salas
- `attendance` - Asistencia
- `calendar` - Calendario de eventos
- `activity` - Actividades
- `conversation` - Conversaciones
- `guardian_message` / `staff_message` - Mensajes

**Entidades de Soporte:**
- `address` - Direcciones
- `emergency_contact` - Contactos de emergencia
- `role` - Roles del sistema
- `access_level` - Niveles de acceso

## 🎯 Casos de Uso Principales

Según la documentación de análisis de negocio:

1. **Gestión de Alumnos** ✅
   - Registrar nuevo alumno
   - Actualizar información
   - Buscar y filtrar
   - Ver detalles completos

2. **Gestión de Tutores** ❌
   - Registrar tutores
   - Vincular con estudiantes
   - Autorización de recogida
   - Autorización de cambios

3. **Gestión de Personal** ❌
   - Registrar staff
   - Asignar roles
   - Asignar a salas
   - Control de acceso

4. **Control de Asistencia** ❌
   - Registro diario
   - Reportes de asistencia
   - Notificaciones a tutores

5. **Comunicación Interna** ❌
   - Chat tutores-maestros
   - Mensajes por sala
   - Notificaciones

## 🧪 Testing

**Estado Actual:** No hay tests implementados ❌

**Estrategia Planificada** (según testing.mmd):

- **Unitarias:** Jest, Pytest
- **Integración:** Postman, Insomnia
- **E2E:** Cypress, Playwright

## 👥 Actores del Sistema

Según business_analysis.mmd:

1. **Administrador del Jardín**
   - Acceso completo al sistema
   - Gestión de personal y configuración

2. **Secretaria**
   - Gestión de alumnos y tutores
   - Control de asistencia
   - Generación de reportes

3. **Maestro/a**
   - Ver información de su sala
   - Registro de asistencia
   - Comunicación con tutores

4. **Tutor/Padre**
   - Ver información de sus hijos
   - Comunicación con maestros
   - Recibir notificaciones

## 📈 Plan de Desarrollo

### Fase 1: Fundamentos (1-2 semanas) 🔴 CRÍTICO
- [ ] Implementar autenticación (JWT)
- [ ] Configurar variables de entorno
- [ ] Crear datos de prueba (seeds)

### Fase 2: Módulos Core (3-4 semanas)
- [ ] Gestión de Tutores
- [ ] Gestión de Personal
- [ ] Control de Asistencia

### Fase 3: Funcionalidades Adicionales (2-3 semanas)
- [ ] Calendario de Eventos
- [ ] Gestión de Actividades

### Fase 4: Comunicación (3-4 semanas)
- [ ] Sistema de Mensajería
- [ ] WebSockets para tiempo real
- [ ] Notificaciones

### Fase 5: Calidad y Despliegue (2-3 semanas)
- [ ] Testing completo
- [ ] Documentación de API (Swagger)
- [ ] CI/CD y Docker
- [ ] Despliegue en producción

**Tiempo Total Estimado:** 12-16 semanas (1 desarrollador full-time)

## 🔒 Seguridad

**⚠️ ADVERTENCIAS DE SEGURIDAD ACTUAL:**

- ❌ No hay sistema de autenticación
- ❌ Credenciales de BD hardcodeadas en código
- ❌ Sin protección de rutas
- ❌ Sin validación de entrada robusta
- ❌ CORS abierto a todos los orígenes

**Estas vulnerabilidades deben ser resueltas antes de cualquier despliegue en producción.**

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama de feature (`git checkout -b feature/NuevaFuncionalidad`)
3. Commit cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/NuevaFuncionalidad`)
5. Crear Pull Request

## 📝 Convenciones de Código

- **Backend:** Nombres en inglés (Student, Classroom, etc.)
- **Frontend:** Mix español/inglés (componentes en inglés, UI en español)
- **Base de Datos:** Snake_case en inglés
- **Git:** Commits descriptivos en español

## 📄 Licencia

Este proyecto es privado y no tiene licencia pública.

## 📞 Soporte

Para reportar problemas o solicitar funcionalidades:
- Crear un issue en el repositorio
- Revisar [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md)
- Consultar documentación en `/documentation`

---

**Última Actualización:** 27 de Noviembre, 2024  
**Versión:** 0.2.0  
**Estado:** En Desarrollo Activo 🚧
