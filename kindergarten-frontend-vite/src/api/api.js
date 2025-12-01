import axios from 'axios';

// Crear una instancia de axios con configuración predeterminada
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api', // URL base del backend (Vite environment variable)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para incluir el token en cada solicitud
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Manejar errores de autenticación (token expirado o inválido)
    if (error.response && error.response.status === 401) {
      // Verificar si es un error de token inválido/expirado o un problema de autorización
      const errorDetail = error.response.data?.message || '';

      // Solo limpiar el token y redirigir si es un problema de token, no de permisos
      if (errorDetail.toLowerCase().includes('token') ||
          errorDetail.toLowerCase().includes('authorized, no token') ||
          errorDetail.toLowerCase().includes('token failed')) {
        localStorage.removeItem('token');
        // Lanzar un evento personalizado para que AuthContext pueda manejarlo
        window.dispatchEvent(new Event('tokenExpired'));
        window.location.href = '/login';
      }
      // Para problemas de permisos (no autorizado para acción específica), no redirigir
    }

    return Promise.reject(error);
  }
);

export default api;