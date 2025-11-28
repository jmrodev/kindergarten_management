import React, { useState, useEffect } from 'react';
import { Container, Form, Button, ProgressBar, Card, Alert } from 'react-bootstrap';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const ParentPortalPage = () => {
    const [step, setStep] = useState(1);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const [formData, setFormData] = useState({
        // Datos del alumno
        nombre: '',
        segundoNombre: '',
        tercerNombre: '',
        alias: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        fechaNacimiento: '',
        turno: 'mañana',
        
        // Dirección
        calle: '',
        numero: '',
        ciudad: '',
        provincia: '',
        codigoPostal: '',
        
        // Contacto de emergencia
        nombreEmergencia: '',
        relacionEmergencia: '',
        telefonoEmergencia: '',
        
        // Datos del tutor/padre
        nombrePadre: '',
        segundoNombrePadre: '',
        apellidoPaternoPadre: '',
        apellidoMaternoPadre: '',
        apellidoPreferidoPadre: '',
        telefonoPadre: '',
        emailPadre: '',
        autorizadoRetiro: true,
        autorizadoCambio: true
    });

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/parent-portal/check-auth`, {
                withCredentials: true
            });
            if (response.data.authenticated) {
                setUser(response.data.user);
                loadDraft();
            }
        } catch (error) {
            if (error.response?.status === 404) {
                setError('Portal de Padres no configurado. Contacte al administrador.');
            }
            console.error('Auth check failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadDraft = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/parent-portal/draft`, {
                withCredentials: true
            });
            if (response.data.draft) {
                setFormData(response.data.draft.data);
                setStep(response.data.draft.currentStep || 1);
            }
        } catch (error) {
            console.error('Error loading draft:', error);
        }
    };

    const saveDraft = async () => {
        setSaving(true);
        try {
            await axios.post(`${API_URL}/api/parent-portal/draft`, {
                data: formData,
                currentStep: step
            }, { withCredentials: true });
            setSuccess('Progreso guardado');
            setTimeout(() => setSuccess(''), 2000);
        } catch (error) {
            console.error('Error saving draft:', error);
            setError('Error al guardar progreso');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleNext = async () => {
        await saveDraft();
        if (step < 4) {
            setStep(step + 1);
        } else {
            await handleSubmit();
        }
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = async () => {
        setSaving(true);
        setError('');
        try {
            await axios.post(`${API_URL}/api/parent-portal/submit`, formData, {
                withCredentials: true
            });
            setSuccess('¡Registro completado exitosamente!');
            // Limpiar el formulario
            setFormData({
                nombre: '', segundoNombre: '', tercerNombre: '', alias: '',
                apellidoPaterno: '', apellidoMaterno: '', fechaNacimiento: '', turno: 'mañana',
                calle: '', numero: '', ciudad: '', provincia: '', codigoPostal: '',
                nombreEmergencia: '', relacionEmergencia: '', telefonoEmergencia: '',
                nombrePadre: '', segundoNombrePadre: '', apellidoPaternoPadre: '',
                apellidoMaternoPadre: '', apellidoPreferidoPadre: '', telefonoPadre: '',
                emailPadre: '', autorizadoRetiro: true, autorizadoCambio: true
            });
            setStep(1);
            // Eliminar borrador
            await axios.delete(`${API_URL}/api/parent-portal/draft`, { withCredentials: true });
        } catch (error) {
            setError(error.response?.data?.message || 'Error al enviar el formulario');
        } finally {
            setSaving(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = `${API_URL}/api/parent-portal/auth/google`;
    };

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </Container>
        );
    }

    if (!user) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
                <Card style={{ maxWidth: '400px', width: '100%', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    <Card.Body className="text-center p-4">
                        <span className="material-icons" style={{ fontSize: '4rem', color: '#667eea', marginBottom: '1rem' }}>
                            family_restroom
                        </span>
                        <h2 className="mb-3">Portal para Padres</h2>
                        {error ? (
                            <>
                                <Alert variant="warning" className="mb-3">
                                    <strong>Portal no disponible</strong><br/>
                                    {error}
                                </Alert>
                                <p className="text-muted small">
                                    El portal de padres requiere configuración de Google OAuth.<br/>
                                    Por favor, contacte al administrador del sistema.
                                </p>
                            </>
                        ) : (
                            <>
                                <p className="text-muted mb-4">
                                    Ingrese con su cuenta de Google para registrar la información de su hijo/a
                                </p>
                                <Button 
                                    onClick={handleGoogleLogin}
                                    style={{ 
                                        backgroundColor: '#4285f4',
                                        borderColor: '#4285f4',
                                        padding: '0.75rem 2rem',
                                        fontSize: '1.1rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        margin: '0 auto'
                                    }}
                                >
                                    <span className="material-icons">login</span>
                                    Iniciar sesión con Google
                                </Button>
                            </>
                        )}
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    const progress = (step / 4) * 100;

    return (
        <Container style={{ maxWidth: '600px', padding: '1rem', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            <Card className="mt-3 mb-3 shadow-sm">
                <Card.Header className="bg-primary text-white">
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Registro de Alumno</h5>
                        <small>{user.email}</small>
                    </div>
                </Card.Header>
                <Card.Body>
                    <ProgressBar now={progress} label={`${Math.round(progress)}%`} className="mb-3" style={{ height: '25px' }} />
                    
                    {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
                    {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

                    <Form>
                        {step === 1 && (
                            <>
                                <h5 className="mb-3 text-center">Datos del Alumno</h5>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nombre *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        required
                                        size="lg"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Segundo Nombre</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="segundoNombre"
                                        value={formData.segundoNombre}
                                        onChange={handleChange}
                                        size="lg"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Tercer Nombre</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="tercerNombre"
                                        value={formData.tercerNombre}
                                        onChange={handleChange}
                                        size="lg"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Alias / Apodo</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="alias"
                                        value={formData.alias}
                                        onChange={handleChange}
                                        size="lg"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Apellido Paterno *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="apellidoPaterno"
                                        value={formData.apellidoPaterno}
                                        onChange={handleChange}
                                        required
                                        size="lg"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Apellido Materno *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="apellidoMaterno"
                                        value={formData.apellidoMaterno}
                                        onChange={handleChange}
                                        required
                                        size="lg"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Fecha de Nacimiento *</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="fechaNacimiento"
                                        value={formData.fechaNacimiento}
                                        onChange={handleChange}
                                        required
                                        size="lg"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Turno *</Form.Label>
                                    <Form.Select
                                        name="turno"
                                        value={formData.turno}
                                        onChange={handleChange}
                                        required
                                        size="lg"
                                    >
                                        <option value="mañana">Mañana</option>
                                        <option value="tarde">Tarde</option>
                                    </Form.Select>
                                </Form.Group>
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <h5 className="mb-3 text-center">Dirección</h5>
                                <Form.Group className="mb-3">
                                    <Form.Label>Calle *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="calle"
                                        value={formData.calle}
                                        onChange={handleChange}
                                        required
                                        size="lg"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Número *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="numero"
                                        value={formData.numero}
                                        onChange={handleChange}
                                        required
                                        size="lg"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Ciudad *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="ciudad"
                                        value={formData.ciudad}
                                        onChange={handleChange}
                                        required
                                        size="lg"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Provincia *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="provincia"
                                        value={formData.provincia}
                                        onChange={handleChange}
                                        required
                                        size="lg"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Código Postal</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="codigoPostal"
                                        value={formData.codigoPostal}
                                        onChange={handleChange}
                                        size="lg"
                                    />
                                </Form.Group>
                            </>
                        )}

                        {step === 3 && (
                            <>
                                <h5 className="mb-3 text-center">Contacto de Emergencia</h5>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nombre Completo *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="nombreEmergencia"
                                        value={formData.nombreEmergencia}
                                        onChange={handleChange}
                                        required
                                        size="lg"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Relación *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="relacionEmergencia"
                                        value={formData.relacionEmergencia}
                                        onChange={handleChange}
                                        placeholder="Ej: Madre, Padre, Tío, Abuela"
                                        required
                                        size="lg"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Teléfono *</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        name="telefonoEmergencia"
                                        value={formData.telefonoEmergencia}
                                        onChange={handleChange}
                                        required
                                        size="lg"
                                    />
                                </Form.Group>
                            </>
                        )}

                        {step === 4 && (
                            <>
                                <h5 className="mb-3 text-center">Datos del Responsable</h5>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nombre *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="nombrePadre"
                                        value={formData.nombrePadre}
                                        onChange={handleChange}
                                        required
                                        size="lg"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Segundo Nombre</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="segundoNombrePadre"
                                        value={formData.segundoNombrePadre}
                                        onChange={handleChange}
                                        size="lg"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Apellido Paterno *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="apellidoPaternoPadre"
                                        value={formData.apellidoPaternoPadre}
                                        onChange={handleChange}
                                        required
                                        size="lg"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Apellido Materno *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="apellidoMaternoPadre"
                                        value={formData.apellidoMaternoPadre}
                                        onChange={handleChange}
                                        required
                                        size="lg"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Apellido Preferido</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="apellidoPreferidoPadre"
                                        value={formData.apellidoPreferidoPadre}
                                        onChange={handleChange}
                                        size="lg"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Teléfono *</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        name="telefonoPadre"
                                        value={formData.telefonoPadre}
                                        onChange={handleChange}
                                        required
                                        size="lg"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="emailPadre"
                                        value={formData.emailPadre}
                                        onChange={handleChange}
                                        size="lg"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Check
                                        type="checkbox"
                                        name="autorizadoRetiro"
                                        label="Autorizado para retirar al alumno"
                                        checked={formData.autorizadoRetiro}
                                        onChange={handleChange}
                                        style={{ fontSize: '1.1rem' }}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Check
                                        type="checkbox"
                                        name="autorizadoCambio"
                                        label="Autorizado para realizar cambios"
                                        checked={formData.autorizadoCambio}
                                        onChange={handleChange}
                                        style={{ fontSize: '1.1rem' }}
                                    />
                                </Form.Group>
                            </>
                        )}

                        <div className="d-flex justify-content-between mt-4">
                            <Button
                                variant="secondary"
                                onClick={handleBack}
                                disabled={step === 1 || saving}
                                size="lg"
                                style={{ minWidth: '120px' }}
                            >
                                Anterior
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleNext}
                                disabled={saving}
                                size="lg"
                                style={{ minWidth: '120px', backgroundColor: '#667eea', borderColor: '#667eea' }}
                            >
                                {saving ? 'Guardando...' : step === 4 ? 'Enviar' : 'Siguiente'}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ParentPortalPage;
