import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Función para verificar usuario actual
  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      // Configurar el token en la instancia de API
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Obtener información del usuario actual
      const response = await api.get('/auth/me');
      setCurrentUser(response.data);
    } catch (error) {
      console.error('Error fetching current user:', error);
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      setCurrentUser(null);
    }
  };

  // Función para login
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;

      // Guardar token en localStorage
      localStorage.setItem('token', token);
      setCurrentUser(user);

      // Configurar el token en la instancia de API
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error de autenticación'
      };
    }
  };

  // Función para logout
  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setCurrentUser(null);
    navigate('/login');
  };

  // Función para registro
  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data;
      
      // Guardar token en localStorage
      localStorage.setItem('token', token);
      setCurrentUser(user);
      
      // Configurar el token en la instancia de API
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return { success: true, user };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error en el registro' 
      };
    }
  };

  // Función para cargar el usuario actual desde el token
  const loadUser = async () => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        // Configurar el token en la instancia de API
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Hacer una solicitud para validar el token y obtener la información del usuario
        const response = await api.get('/auth/me');
        setCurrentUser(response.data);  // response.data ya contiene la información del usuario
      } catch (error) {
        // Si el token no es válido, eliminarlo
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    loadUser();

    // Listener para el evento de token expirado
    const handleTokenExpired = () => {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      setCurrentUser(null);
      navigate('/login');
    };

    window.addEventListener('tokenExpired', handleTokenExpired);

    // Cleanup
    return () => {
      window.removeEventListener('tokenExpired', handleTokenExpired);
    };
  }, []);

  // Función para iniciar sesión con Google
  const initiateGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/auth/google`;
  };

  const value = {
    currentUser,
    login,
    logout,
    register,
    initiateGoogleLogin
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}