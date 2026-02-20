import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Cargar variables de entorno según el modo (development, production)
  // El tercer parámetro '' carga todas las variables sin importar el prefijo VITE_
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      host: true, // Necesario para Docker
      proxy: {
        '/api': {
          // Si estamos en Docker, el target debería ser 'http://backend:3000'
          // Si estamos local, 'http://localhost:3000'
          target: env.VITE_API_URL || 'http://backend:3000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
