# Configuración Rápida del Portal de Padres

## Estado Actual

⚠️ **Portal deshabilitado** - Se requiere configuración de Google OAuth

## Pasos para Habilitar (5 minutos)

### 1. Obtener Credenciales de Google

1. Ve a https://console.cloud.google.com/
2. Crea un proyecto nuevo (o usa uno existente)
3. En "APIs y servicios" > "Credenciales"
4. Click en "Crear credenciales" > "ID de cliente de OAuth 2.0"
5. Tipo de aplicación: **Aplicación web**
6. Nombre: `Kindergarten Parent Portal`
7. **URIs de redirección autorizados**, agrega:
   ```
   http://localhost:3000/api/parent-portal/auth/google/callback
   ```
8. **Orígenes autorizados de JavaScript**, agrega:
   ```
   http://localhost:5173
   ```
9. Click en **Crear**
10. **Copia el ID de cliente y el Secreto de cliente**

### 2. Configurar el Backend

Edita el archivo `/backend/.env` y descomenta estas líneas:

```bash
# Portal de Padres (OPCIONAL - Descomente y configure para habilitar)
SESSION_SECRET=tu_secreto_aleatorio_muy_largo_y_seguro_aqui
GOOGLE_CLIENT_ID=tu_client_id_aqui.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu_client_secret_aqui
GOOGLE_CALLBACK_URL=http://localhost:3000/api/parent-portal/auth/google/callback
FRONTEND_URL=http://localhost:5173
PARENT_PORTAL_REDIRECT_URL=http://localhost:5173/parent-portal
```

**Importante:** Reemplaza `tu_client_id_aqui` y `tu_client_secret_aqui` con tus credenciales reales de Google.

### 3. Inicializar la Base de Datos

```bash
cd backend/scripts
./init_parent_portal.sh
```

O manualmente:
```bash
mysql -u root -p kindergarten_db < db/parent_portal_schema.sql
```

### 4. Reiniciar el Servidor

```bash
cd backend
node server.js
```

Deberías ver:
```
✅ Google OAuth configurado para Portal de Padres
Server running on port 3000
Connected to MariaDB!
```

### 5. Probar el Portal

1. Abre http://localhost:5173/parent-portal
2. Deberías ver el botón "Iniciar sesión con Google"
3. Click en el botón
4. Autoriza la aplicación con tu cuenta de Google
5. ¡Listo! Ya puedes usar el portal

## Troubleshooting

### Error: "redirect_uri_mismatch"
- Verifica que la URL en Google Console sea exactamente: `http://localhost:3000/api/parent-portal/auth/google/callback`
- No debe tener espacios ni caracteres extras

### El servidor no arranca
- Verifica que las credenciales estén correctas en `.env`
- Asegúrate de que no haya espacios antes o después de los valores

### No redirige después del login
- Verifica `PARENT_PORTAL_REDIRECT_URL` en `.env`
- Debe ser: `http://localhost:5173/parent-portal`

## Producción

Para producción, necesitas:

1. **Configurar dominio real** en Google Console:
   ```
   https://tudominio.com/api/parent-portal/auth/google/callback
   ```

2. **Actualizar .env**:
   ```bash
   GOOGLE_CALLBACK_URL=https://tudominio.com/api/parent-portal/auth/google/callback
   FRONTEND_URL=https://tudominio.com
   PARENT_PORTAL_REDIRECT_URL=https://tudominio.com/parent-portal
   NODE_ENV=production
   ```

3. **Cambiar el SESSION_SECRET** a algo aleatorio y seguro

## Desactivar el Portal

Si no quieres usar el portal, simplemente comenta o elimina las líneas de Google OAuth en `.env`. El sistema funcionará normalmente sin el portal.

```bash
# Portal de Padres (OPCIONAL - Descomente y configure para habilitar)
# SESSION_SECRET=...
# GOOGLE_CLIENT_ID=...
# GOOGLE_CLIENT_SECRET=...
# ...
```

Reinicia el servidor y verás:
```
⚠️  Portal de Padres deshabilitado
```
