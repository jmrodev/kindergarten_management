# 🎓 Sistema de Gestión de Jardín de Infantes

Sistema integral para la administración de un jardín de infantes, desarrollado con una arquitectura moderna de 3 capas.

## 📋 Descripción

Aplicación web completa para gestionar alumnos, salas, asistencia y relaciones del jardín de infantes. Incluye dashboard ejecutivo, sistema de asignación de alumnos a salas, búsqueda avanzada y gestión completa de datos.

## 🏗️ Arquitectura

```
kindergarten_project_guide/
├── backend/              # API REST en Node.js + Express
├── frontend/             # Interfaz en React + Vite
├── db/                   # Esquema de base de datos MariaDB
└── documentation/        # Documentación técnica (Mermaid)
```

### Stack Tecnológico

**Frontend:**
- React 19.2.0
- Vite 7
- Bootstrap 5.3.8
- React Bootstrap 2.10.10
- React Router DOM 6.30.2

**Backend:**
- Node.js
- Express 5
- MariaDB 3.4.5

**Base de Datos:**
- MariaDB/MySQL
- 17 tablas normalizadas

## 📊 Estado del Proyecto

**Versión Actual:** 0.3.0 (MVP Funcional)  
**Progreso:** 35% completado

### ✅ Módulos Implementados y Funcionales

#### 1. **Dashboard Ejecutivo** ✅
   - 6 indicadores principales (Total Alumnos, Salas, Capacidad, Ocupación, Edad Media, Sin Sala)
   - Modal de detalle de ocupación con estadísticas
   - Visualización de distribución por turnos
   - Top 5 salas más pobladas
   - Navegación rápida a módulos

#### 2. **Gestión de Alumnos** ✅ 
   - CRUD completo con formulario extenso
   - Búsqueda y filtros avanzados (nombre, apellido, sala, turno)
   - Vista de detalles completos en modal
   - Indicadores de edad con colores
   - Contador de resultados
   - Edición inline
   - Confirmación de eliminación

#### 3. **Gestión de Salas** ✅
   - CRUD completo con validación
   - Indicadores visuales de estado (Vacía, Disponible, Completa, Sobrepasada)
   - Asignación de alumnos a salas
   - Vista de alumnos asignados por sala
   - Modal de detalle por sala
   - Control de capacidad automático
   - Impide eliminación de salas con alumnos

#### 4. **Sistema de Navegación** ✅
   - React Router con URLs semánticas (/dashboard, /alumnos, /salas)
   - Navegación funcional con botones Atrás/Adelante
   - Persistencia de vista al refrescar
   - Botones con iconos Material Icons

#### 5. **Sistema de Notificaciones** ✅
   - Toast notifications (éxito, error, warning)
   - Confirmación de acciones destructivas
   - Mensajes contextuales

#### 6. **Modo Oscuro** ✅
   - Toggle entre modo claro/oscuro
   - Persistencia en localStorage
   - Estilos adaptativos

### ⚠️ En Desarrollo

- Optimización móvil
- Testing automatizado

### ❌ Pendientes (5 módulos principales)

1. **Gestión de Personal** (Alta prioridad)
2. **Control de Asistencia** (Alta prioridad)
3. **Autenticación y Autorización** (Crítico 🔴)
4. Calendario de Eventos (Media prioridad)
5. Sistema de Mensajería (Baja prioridad)

### ✨ Portal para Padres

**Portal autónomo para que padres registren la información de sus hijos** ✅

- Login con Google OAuth
- Optimizado para móvil
- Guardado progresivo automático
- 4 pasos: Datos alumno, Dirección, Contacto emergencia, Datos responsable
- Recuperación automática si se interrumpe
- Deslinda la carga de datos de los directivos

📚 **[Ver documentación completa del Portal para Padres](./documentation/PORTAL_PADRES.md)**

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ y pnpm 10+
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

# Opcional: Cargar datos de prueba
SOURCE db/seeds.sql;
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

**API Endpoints Disponibles:**
- `GET /api/students` - Listar alumnos
- `POST /api/students` - Crear alumno
- `PUT /api/students/:id` - Actualizar alumno
- `DELETE /api/students/:id` - Eliminar alumno
- `GET /api/students/search` - Buscar alumnos
- `PUT /api/students/:id/assign-classroom` - Asignar a sala
- `GET /api/classrooms` - Listar salas
- `POST /api/classrooms` - Crear sala
- `PUT /api/classrooms/:id` - Actualizar sala
- `DELETE /api/classrooms/:id` - Eliminar sala

### 4. Configurar Frontend

```bash
cd frontend
pnpm install

# Iniciar servidor de desarrollo
pnpm dev
```

El frontend estará disponible en `http://localhost:5173`

### 5. Configurar Portal para Padres (Opcional)

Si deseas habilitar el portal para padres con autenticación Google:

```bash
# Ver documentación completa
cat documentation/PORTAL_PADRES.md

# 1. Configurar Google OAuth (ver guía)
# 2. Actualizar .env con credenciales
# 3. Inicializar tablas
cd backend/scripts
./init_parent_portal.sh
```

El portal estará disponible en `http://localhost:5173/parent-portal`

### 6. Acceder a la Aplicación

1. Abre `http://localhost:5173` en tu navegador
2. La app iniciará en el Dashboard
3. Usa los botones superiores para navegar:
   - **Dashboard**: Vista general con métricas
   - **Alumnos**: Gestión completa de alumnos
   - **Salas**: Gestión completa de salas
   - **Portal Padres**: `http://localhost:5173/parent-portal` (login con Google)

## 📚 Estructura de Componentes Frontend

```
frontend/src/
├── components/
│   ├── AssignedStudentsModal.jsx    # Modal lista alumnos por sala
│   ├── AssignStudentModal.jsx       # Modal asignar alumno a sala
│   ├── ClassroomForm.jsx            # Formulario crear/editar sala
│   ├── ClassroomList.jsx            # Tabla de salas con acciones
│   ├── ConfirmModal.jsx             # Modal confirmación genérico
│   ├── Dashboard.jsx                # Dashboard con métricas
│   ├── OcupacionModal.jsx           # Modal detalle ocupación
│   ├── SalaDetail.jsx               # Modal detalle de sala
│   ├── StudentDetail.jsx            # Modal detalle de alumno
│   ├── StudentFilter.jsx            # Filtros de búsqueda
│   ├── StudentForm.jsx              # Formulario crear/editar alumno
│   ├── StudentList.jsx              # Tabla de alumnos
│   └── ToastNotification.jsx       # Sistema de notificaciones
├── hooks/
│   ├── useAlumnos.js                # Hook gestión alumnos
│   └── useSalas.js                  # Hook gestión salas
├── pages/
│   ├── AlumnosPage.jsx              # Página alumnos
│   ├── DashboardPage.jsx            # Página dashboard
│   └── SalasPage.jsx                # Página salas
├── services/
│   ├── alumnoService.js             # API calls alumnos
│   └── salaService.js               # API calls salas
├── utils/
│   └── classroomStatus.js           # Utilidades estado salas
├── App.jsx                          # Router y lógica principal
├── main.jsx                         # Entry point
└── index.css                        # Estilos globales
```

## 🔧 Estructura Backend

```
backend/
├── routes/
│   ├── students.js                  # Rutas API alumnos
│   └── classrooms.js                # Rutas API salas
├── controllers/ (planificado)
├── models/ (planificado)
├── middleware/ (planificado)
├── server.js                        # Servidor Express
└── package.json
```

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

## 🎯 Funcionalidades Implementadas

### Dashboard Ejecutivo
- ✅ 6 métricas principales en tarjetas interactivas
- ✅ Cards clickeables (Alumnos → vista alumnos, Salas → vista salas, Ocupación → detalle)
- ✅ Modal de detalle de ocupación con:
  - Resumen general (ocupados, disponibles, capacidad, %)
  - Badges por estado (vacías, con espacio, completas, sobrepasadas)
  - Tabla detallada de todas las salas ordenadas por ocupación
  - Indicadores visuales con colores
- ✅ Distribución por turnos con barras de progreso
- ✅ Top 5 salas más pobladas
- ✅ Alerta de alumnos sin sala asignada

### Gestión de Alumnos
- ✅ Formulario extenso con validación
- ✅ Campos: datos personales, contacto, médicos, emergencia
- ✅ Búsqueda multi-criterio (nombre, apellido, sala, turno)
- ✅ Vista de detalle completa en modal
- ✅ Edición inline desde tabla
- ✅ Indicadores de edad con colores por rango
- ✅ Badges de turno con iconos
- ✅ Contador informativo de resultados
- ✅ Confirmación antes de eliminar
- ✅ Estados: Activo/Inactivo

### Gestión de Salas
- ✅ Formulario con capacidad y nivel
- ✅ Estados automáticos:
  - Vacía (0 asignados)
  - Banca Disponible (< capacidad)
  - Completa (= capacidad)
  - Sobrepasada (> capacidad)
- ✅ Click en número de asignados → modal con lista de alumnos
- ✅ Modal de alumnos asignados:
  - Lista completa con datos
  - Botón "Ver Detalles" por alumno
  - Scroll para listas largas
  - Header sticky
- ✅ Asignación de alumnos a salas:
  - Modal de selección
  - Búsqueda y filtros
  - Excluye alumnos ya asignados a esa sala
  - Validación de capacidad
- ✅ Botón "Banca Disponible" para asignar
- ✅ Protección: impide eliminar salas con alumnos
- ✅ Toast de advertencia si intenta eliminar sala ocupada
- ✅ Cálculo automático de disponibilidad

### Sistema de Navegación
- ✅ React Router 6.30.2 implementado
- ✅ URLs semánticas:
  - `/dashboard` - Dashboard principal
  - `/alumnos` - Gestión de alumnos
  - `/salas` - Gestión de salas
- ✅ Navegación con botones del navegador (Atrás/Adelante)
- ✅ Persistencia de vista al refrescar (F5)
- ✅ Botones con resaltado según ruta activa
- ✅ Redireccionamiento automático de `/` a `/dashboard`

### Sistema de Notificaciones
- ✅ Toast notifications en esquina superior derecha
- ✅ Tipos: success, error, warning, info
- ✅ Auto-cierre después de 5 segundos
- ✅ z-index alto para máxima visibilidad
- ✅ Confirmación antes de eliminación
- ✅ Mensajes contextuales por acción

### UI/UX
- ✅ Modo oscuro con toggle persistente
- ✅ Material Icons para iconografía consistente
- ✅ Bootstrap 5 para componentes
- ✅ Diseño compacto optimizado para viewport
- ✅ Header minimalista
- ✅ Badges informativos (no clickeables, texto gris)
- ✅ Colores dinámicos según estado
- ✅ Hover effects en cards interactivas
- ✅ Modales con animaciones suaves

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

## 📈 Roadmap

### ✅ Fase 0: MVP Básico (COMPLETADO)
- [x] Setup inicial del proyecto
- [x] Esquema de base de datos
- [x] CRUD de alumnos
- [x] CRUD de salas
- [x] Dashboard básico
- [x] React Router
- [x] Sistema de notificaciones

### 🚧 Fase 1: Mejoras UX (EN PROGRESO)
- [x] Dashboard con métricas
- [x] Modal de ocupación detallada
- [x] Asignación de alumnos a salas
- [x] Filtros y búsqueda avanzada
- [ ] Optimización móvil
- [ ] Breadcrumbs de navegación

### 📋 Fase 2: Tutores y Personal (SIGUIENTE)
- [ ] CRUD de tutores/padres
- [ ] Vinculación tutor-alumno
- [ ] CRUD de personal
- [ ] Asignación de roles
- [ ] Dashboard por rol

### 🔐 Fase 3: Autenticación (CRÍTICO)
- [ ] Sistema de login
- [ ] JWT authentication
- [ ] Protección de rutas
- [ ] Roles y permisos
- [ ] Sesiones persistentes

### 📊 Fase 4: Asistencia y Reportes
- [ ] Registro de asistencia diaria
- [ ] Reportes de asistencia
- [ ] Estadísticas por alumno
- [ ] Notificaciones de ausencias
- [ ] Exportación a PDF/Excel

### 📅 Fase 5: Calendario y Actividades
- [ ] Calendario de eventos
- [ ] Gestión de actividades
- [ ] Notificaciones de eventos
- [ ] Sincronización con calendario externo

### 💬 Fase 6: Comunicación
- [ ] Sistema de mensajería
- [ ] WebSockets para tiempo real
- [ ] Notificaciones push
- [ ] Chat tutores-maestros

### 🧪 Fase 7: Testing y Deploy
- [ ] Tests unitarios (Jest)
- [ ] Tests de integración
- [ ] Tests E2E (Cypress)
- [ ] CI/CD pipeline
- [ ] Docker containerization
- [ ] Deploy a producción

**Tiempo Total Estimado:** 14-18 semanas (1 desarrollador full-time)

## 🔒 Seguridad

**⚠️ ADVERTENCIAS DE SEGURIDAD ACTUAL:**

- ❌ No hay sistema de autenticación implementado
- ❌ Sin protección de rutas en backend
- ❌ Sin validación robusta de entrada
- ❌ CORS abierto a todos los orígenes
- ❌ Credenciales de BD en archivo .env (correcto) pero sin .env.example

**⚠️ CRÍTICO: No desplegar en producción sin resolver estos problemas de seguridad.**

**Plan de Seguridad (Próximas Fases):**
1. Implementar JWT authentication
2. Middleware de autorización por rol
3. Validación de entrada con Joi/Zod
4. CORS configurado por entorno
5. Rate limiting en API
6. Sanitización de queries SQL

## 📱 Compatibilidad

**Navegadores Soportados:**
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

**Resoluciones Probadas:**
- Desktop: 1920x1080, 1366x768
- Tablet: Pendiente optimización
- Mobile: Pendiente optimización

**Nota:** La UI está optimizada para desktop. Responsividad móvil en desarrollo.

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

**Última Actualización:** 27 de Noviembre, 2024 20:30  
**Versión:** 0.3.0  
**Estado:** En Desarrollo Activo 🚧  
**Funcionalidad:** Dashboard + CRUD Alumnos + CRUD Salas + Asignaciones ✅
