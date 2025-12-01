import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { checker } from 'vite-plugin-checker';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // Para manejar JSX en archivos .js necesitamos la configuración específica
    react({
      jsxRuntime: 'classic',
    }),
    checker({
      typescript: false, // Desactivado ya que usamos JS vanilla
      eslint: {
        lintCommand: 'eslint src --ext .js,.jsx',
      },
    }),
    // Add node polyfills if needed for compatibility
    nodePolyfills({
      globals: {
        Buffer: true,
      }
    })
  ],
  server: {
    port: 3001, // Changed from 3000 to avoid conflict with backend
    open: true, // Automatically open browser
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Proxy API calls to backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',
  },
  define: {
    global: 'globalThis',
    'process.env': {},
  },
  // Configuración especial para manejar JSX en archivos .js
  esbuild: {
    loader: 'jsx',
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      }
    }
  }
});