# Portal para Padres - Guía de Configuración

## 📱 Características

El portal para padres permite que los padres/tutores carguen la información de sus hijos de manera independiente, sin necesidad de que los directivos lo hagan. Características principales:

- ✅ **Autenticación con Google OAuth** - Login simple y seguro
- ✅ **Optimizado para móvil** - Interfaz responsive adaptada a teléfonos
- ✅ **Guardado progresivo** - Los datos se guardan automáticamente al avanzar
- ✅ **Recuperación automática** - Si se interrumpe, continúa desde donde quedó
- ✅ **4 pasos simples** - Dividido en secciones claras y fáciles de completar

## 🚀 Configuración

### 1. Instalar dependencias

```bash
cd backend
pnpm install
```

### 2. Configurar Google OAuth

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Google OAuth 2.0
4. Crea credenciales (OAuth 2.0 Client ID):
   - Tipo de aplicación: Web application
   - URIs de redirección autorizados:
     - `http://localhost:3000/api/parent-portal/auth/google/callback` (desarrollo)
     - `https://tudominio.com/api/parent-portal/auth/google/callback` (producción)
   - Orígenes autorizados:
     - `http://localhost:5173` (desarrollo)
     - `https://tudominio.com` (producción)

5. Copia el Client ID y Client Secret

### 3. Configurar variables de entorno

Copia `.env.example` a `.env` y configura:

```bash
# Google OAuth Configuration
GOOGLE_CLIENT_ID=tu_client_id_de_google
GOOGLE_CLIENT_SECRET=tu_client_secret_de_google
GOOGLE_CALLBACK_URL=http://localhost:3000/api/parent-portal/auth/google/callback

# Frontend URL
FRONTEND_URL=http://localhost:5173
PARENT_PORTAL_REDIRECT_URL=http://localhost:5173/parent-portal

# Session Secret (CAMBIA ESTO EN PRODUCCIÓN)
SESSION_SECRET=un_secreto_muy_seguro_y_aleatorio
```

### 4. Inicializar tablas de base de datos

```bash
cd backend/scripts
./init_parent_portal.sh
```

O manualmente:

```bash
mysql -u kindergarten_user -p kindergarten_db < db/parent_portal_schema.sql
```

### 5. Iniciar los servidores

Terminal 1 - Backend:
```bash
cd backend
node server.js
```

Terminal 2 - Frontend:
```bash
cd frontend
pnpm dev
```

## 📱 Uso

### Acceso al portal

Los padres pueden acceder al portal en:
- **Desarrollo**: http://localhost:5173/parent-portal
- **Producción**: https://tudominio.com/parent-portal

### Flujo de registro

1. **Login con Google** - El padre inicia sesión con su cuenta de Gmail
2. **Paso 1: Datos del Alumno** - Nombre completo, apellidos, fecha de nacimiento, turno
3. **Paso 2: Dirección** - Dirección completa del domicilio
4. **Paso 3: Contacto de Emergencia** - Persona de contacto en caso de emergencia
5. **Paso 4: Datos del Responsable** - Información del padre/tutor

### Guardado automático

- Los datos se guardan automáticamente al hacer clic en "Siguiente"
- Si el usuario cierra el navegador, puede volver y continuar desde donde quedó
- El borrador se elimina automáticamente al completar el registro

## 🗄️ Estructura de Base de Datos

### Tablas creadas

1. **parent_portal_users** - Usuarios autenticados con Google
   - id, google_id, email, name, created_at

2. **parent_registration_drafts** - Borradores en progreso
   - id, user_id, form_data (JSON), current_step, updated_at

3. **parent_portal_submissions** - Registros completados
   - id, user_id, student_id, submitted_at

## 🔒 Seguridad

- Autenticación segura mediante Google OAuth
- Sessions con cookies seguras
- Validación de datos en backend
- Transacciones de base de datos para integridad
- CORS configurado correctamente

## 🎨 Personalización

### Cambiar colores

Edita `/frontend/src/pages/ParentPortalPage.jsx`:

```jsx
// Línea ~175 - Color del botón de Google
backgroundColor: '#4285f4',

// Línea ~433 - Color del botón Siguiente
backgroundColor: '#667eea',
```

### Agregar campos adicionales

1. Agrega el campo en `formData` (línea ~15)
2. Agrega el input en el paso correspondiente (línea ~230+)
3. Actualiza `handleSubmit` en el backend (ParentPortalController.js)

## 🐛 Troubleshooting

### Error: "Not authenticated"
- Verifica que las variables de entorno de Google estén configuradas
- Revisa que la URL de callback coincida en Google Console y .env

### Error: "Error al guardar progreso"
- Verifica la conexión a la base de datos
- Asegúrate de que las tablas estén creadas correctamente

### El login con Google no funciona
- Verifica que las URLs de redirección estén correctas en Google Console
- Asegúrate de que CORS esté configurado con `credentials: true`

## 📝 Notas de Producción

Para producción:

1. **Cambia los secretos** en `.env`:
   - `SESSION_SECRET` - Usa un string aleatorio largo
   - `JWT_SECRET` - Usa un string aleatorio diferente

2. **Configura HTTPS**:
   - Las cookies de sesión requieren `secure: true`
   - Configura SSL/TLS en tu servidor

3. **Actualiza las URLs**:
   - GOOGLE_CALLBACK_URL
   - FRONTEND_URL
   - PARENT_PORTAL_REDIRECT_URL

4. **Habilita rate limiting** para prevenir abuso

## 📞 Soporte

Para más ayuda, consulta la documentación de:
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [Passport.js](http://www.passportjs.org/packages/passport-google-oauth20/)
- [Express Session](https://www.npmjs.com/package/express-session)
