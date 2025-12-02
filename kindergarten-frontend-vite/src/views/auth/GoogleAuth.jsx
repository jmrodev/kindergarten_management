import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { Google, PersonFill, CheckCircleFill } from 'react-bootstrap-icons';
import api from '../../api/api.js';

const GoogleAuth = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState('initial'); // initial, redirecting, success, error
  const { currentUser, login } = useAuth();
  const navigate = useNavigate();

  // Function to handle Google Sign-In
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setAuthStatus('redirecting');
      setError('');

      // Redirect to backend Google OAuth endpoint
      window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/auth/google`;
    } catch (err) {
      setError('Error iniciando sesión con Google');
      setAuthStatus('error');
      console.error('Google login error:', err);
    } finally {
      setLoading(false);
    }
  };

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
    }
  }, [navigate]);

  // If user is already logged in as admin/staff, redirect them appropriately
  useEffect(() => {
    if (currentUser && !currentUser.google_user) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  return (
    <Container fluid className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <Row className="w-100 justify-content-center">
        <Col xs={12} md={6} lg={4}>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white text-center py-4">
              <h3 className="mb-0">
                <PersonFill className="me-2" />
                Portal de Padres
              </h3>
              <p className="mb-0">Inscripción y seguimiento de sus hijos</p>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}

              {authStatus === 'redirecting' && (
                <div className="text-center">
                  <Spinner animation="border" role="status" className="me-2">
                    <span className="visually-hidden">Cargando...</span>
                  </Spinner>
                  <p>Redirigiendo a Google para autenticación...</p>
                </div>
              )}

              {authStatus === 'success' && (
                <div className="text-center">
                  <CheckCircleFill className="text-success" size={48} />
                  <h4 className="mt-3">¡Autenticación exitosa!</h4>
                  <p>Redirigiendo al portal de padres...</p>
                </div>
              )}

              {authStatus === 'initial' && (
                <div className="d-grid gap-3">
                  <p className="text-center">Iniciar sesión con Google para acceder al portal de padres</p>
                  
                  <Button
                    variant="outline-primary"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="d-flex align-items-center justify-content-center"
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          className="me-2"
                        />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <Google className="me-2" />
                        Iniciar sesión con Google
                      </>
                    )}
                  </Button>
                  
                  <small className="text-muted text-center">
                    Al iniciar sesión con Google, usted acepta el uso de su información según los términos de servicio del jardín.
                  </small>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default GoogleAuth;