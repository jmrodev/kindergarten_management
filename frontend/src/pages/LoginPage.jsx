// frontend/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div 
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
        >
            <Container style={{ maxWidth: '450px' }}>
                <Card className="shadow-lg border-0">
                    <Card.Body className="p-5">
                        <div className="text-center mb-4">
                            <span 
                                className="material-icons" 
                                style={{ fontSize: '4rem', color: '#667eea' }}
                            >
                                school
                            </span>
                            <h2 className="mt-3 mb-1">Jardín de Infantes</h2>
                            <p className="text-muted">Sistema de Gestión</p>
                        </div>

                        {error && (
                            <Alert variant="danger" dismissible onClose={() => setError('')}>
                                <span className="material-icons" style={{ fontSize: '1.2rem', verticalAlign: 'middle' }}>
                                    error
                                </span>
                                {' '}{error}
                            </Alert>
                        )}

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    <span className="material-icons" style={{ fontSize: '1rem', verticalAlign: 'middle' }}>
                                        email
                                    </span> Email
                                </Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Ingresa tu email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoFocus
                                />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label>
                                    <span className="material-icons" style={{ fontSize: '1rem', verticalAlign: 'middle' }}>
                                        lock
                                    </span> Contraseña
                                </Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Ingresa tu contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Button
                                variant="primary"
                                type="submit"
                                className="w-100 py-2"
                                disabled={loading}
                                style={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    border: 'none'
                                }}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" />
                                        Iniciando sesión...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-icons" style={{ fontSize: '1.2rem', verticalAlign: 'middle' }}>
                                            login
                                        </span> Iniciar Sesión
                                    </>
                                )}
                            </Button>
                        </Form>

                        <div className="mt-4 text-center">
                            <small className="text-muted">
                                <span className="material-icons" style={{ fontSize: '0.8rem', verticalAlign: 'middle' }}>
                                    info
                                </span>
                                {' '}Usuario por defecto: <strong>admin@jardin.com</strong> / <strong>12345678</strong>
                            </small>
                        </div>
                    </Card.Body>
                </Card>

                <div className="text-center mt-3">
                    <small style={{ color: 'white' }}>
                        © 2024 Jardín de Infantes - Sistema de Gestión
                    </small>
                </div>
            </Container>
        </div>
    );
};

export default LoginPage;
