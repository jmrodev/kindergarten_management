import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { PersonFill, CheckCircleFill } from 'react-bootstrap-icons';
import api from '../../api/api.js';
import Spinner from '../../components/atoms/Spinner';

const GoogleAuth = () => {
  const [error, setError] = useState('');
  const [authStatus, setAuthStatus] = useState('redirecting'); // Start as redirecting, as this component is for callback
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Check if user was redirected back from Google OAuth
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      // Save the token in localStorage and update auth context
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Load user data
      api.get('/auth/me')
        .then(response => {
          // Update context and navigate
          setAuthStatus('success');
          setTimeout(() => {
            navigate('/parent-dashboard');
          }, 1500);
        })
        .catch(err => {
          setError('Error al verificar el usuario');
          setAuthStatus('error');
          localStorage.removeItem('token');
        });
    } else {
      // If no token in URL, something went wrong or direct access
      setError('No se recibió el token de Google. Intente nuevamente.');
      setAuthStatus('error');
    }
  }, [navigate]);

  // If user is already logged in as admin/staff, redirect them appropriately
  useEffect(() => {
    if (currentUser && !currentUser.google_user) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        <div className="login-card">
          <div className="form-card-header bg-primary text-white text-center py-4">
            <h3 className="mb-0">
              <PersonFill className="me-2" />
              Portal de Padres
            </h3>
            <p className="mb-0">Inscripción y seguimiento de sus hijos</p>
          </div>
          <div className="form-card-body">
            {error && <div className="alert alert-danger">{error}</div>}

            {authStatus === 'redirecting' && (
              <div className="text-center">
                <Spinner role="status" className="me-2">
                  <span className="visually-hidden">Cargando...</span>
                </Spinner>
                <p>Procesando autenticación con Google...</p>
              </div>
            )}

            {authStatus === 'success' && (
              <div className="text-center">
                <CheckCircleFill className="text-success" size={48} />
                <h4 className="mt-3">¡Autenticación exitosa!</h4>
                <p>Redirigiendo al portal de padres...</p>
              </div>
            )}

            {authStatus === 'error' && (
              <div className="text-center">
                <h4 className="mt-3 text-danger">Error de Autenticación</h4>
                <p>{error || 'Hubo un problema al intentar iniciar sesión con Google.'}</p>
                <button
                  onClick={() => navigate('/login')}
                  className="btn btn-primary mt-3"
                >
                  Volver al inicio de sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleAuth;