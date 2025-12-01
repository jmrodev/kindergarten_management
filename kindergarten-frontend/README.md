# Sistema de Gestión para Jardín de Infantes - Frontend

Este es el frontend desarrollado en React para el sistema de gestión de jardín de infantes.

## Características

- Gestión completa de alumnos, personal, salas y responsables
- Control de vacunas y asistencia
- Sistema de calendario escolar
- Gestión de documentos y actas de reuniones
- Actividades especiales (arte, música, gimnasia, etc.)
- Panel de administración con estadísticas
- Sistema de autenticación y autorización
- Interfaz responsive y amigable

## Tecnologías utilizadas

- React 18
- React Router v6
- React Bootstrap
- Bootstrap Icons
- Axios para peticiones HTTP
- Diseño responsive con Bootstrap 5

## Instalación

1. Asegúrate de tener Node.js instalado en tu sistema.

2. Instala las dependencias:
```bash
npm install
```

3. Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
```env
REACT_APP_API_URL=http://localhost:3000/api
```

4. Para iniciar el servidor de desarrollo:
```bash
npm start
```

## Estructura del proyecto

```
src/
├── components/     # Componentes reutilizables
├── views/          # Vistas/Páginas de la aplicación
├── api/            # Servicios y llamadas a la API
├── contexts/       # Contextos de React (autenticación)
├── utils/          # Utilidades y funciones auxiliares
├── assets/         # Imágenes, estilos y recursos
└── styles/         # Archivos CSS personalizados
```

## Funcionalidades principales

### Gestión de Alumnos
- Registro y edición de información personal
- Seguimiento de vacunas
- Autorizaciones y documentos
- Estado y progreso escolar

### Gestión de Personal
- Administración de docentes y personal administrativo
- Asignación a salas
- Control de horarios y asistencia

### Asistencia
- Registro diario de asistencia de alumnos
- Control de asistencia de personal
- Reportes y estadísticas

### Calendario Escolar
- Eventos académicos y administrativos
- Actividades especiales
- Recordatorios y notificaciones

### Documentos
- Control de documentos entregados
- Revisión de documentos pendientes
- Seguimiento de vacunas

## Variables de entorno

- `REACT_APP_API_URL`: URL del backend del sistema

## Despliegue

Para crear una versión lista para producción:

```bash
npm run build
```

## Licencia

Este proyecto es de uso académico/institucional.