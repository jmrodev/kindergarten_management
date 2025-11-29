import React, { useState, useEffect } from 'react';
import { Container, Form, Button, ProgressBar, Card, Alert, Row, Col, Modal } from 'react-bootstrap';
import axios from 'axios';
import { usePermissions } from '../context/PermissionsContext'; // Import usePermissions

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const ParentPortalPage = () => {
    const [step, setStep] = useState(1);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [enrollmentId, setEnrollmentId] = useState(null);
    const [studentName, setStudentName] = useState('');
    const [enrollmentOpen, setEnrollmentOpen] = useState(true);
    const [checkingStatus, setCheckingStatus] = useState(true);

    const [formData, setFormData] = useState({
        nombre: '', segundoNombre: '', tercerNombre: '', alias: '',
        apellidoPaterno: '', apellidoMaterno: '', dni: '', fechaNacimiento: '',
        turno: 'Mañana', salaPreferida: '', tieneHermanos: false,
        calle: '', numero: '', ciudad: '', provincia: '', codigoPostal: '',
        obraSocial: '', numeroAfiliado: '', grupoSanguineo: '', alergias: '',
        medicacion: '', observacionesMedicas: '', pediatraNombre: '',
        pediatraTelefono: '', estadoVacunacion: 'completo', necesidadesEspeciales: '',
        nombreEmergencia: '', relacionEmergencia: '', telefonoEmergencia: '',
        telefonoAlternativoEmergencia: '', autorizadoRetiroEmergencia: false,
        nombrePadre: '', segundoNombrePadre: '', apellidoPaternoPadre: '',
        apellidoMaternoPadre: '', apellidoPreferidoPadre: '', dniPadre: '',
        telefonoPadre: '', emailPadre: '', lugarTrabajo: '', telefonoTrabajo: '',
        relacionConAlumno: 'madre', autorizadoRetiro: true, autorizadoCambio: true,
        autorizacionFotos: false, autorizacionSalidas: false, autorizacionAtencionMedica: false
    });

    const [availableClassrooms, setAvailableClassrooms] = useState([]);
    const [documents, setDocuments] = useState({
        dniAlumno: null, dniResponsable: null, certificadoNacimiento: null,
        carnetVacunas: null, certificadoMedico: null, constanciaObraSocial: null
    });

    useEffect(() => {
        const checkEnrollmentStatus = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/parent-portal/enrollment-status`);
                setEnrollmentOpen(response.data.enrollmentOpen);

                // Cargar salas disponibles si las inscripciones están abiertas
                if (response.data.enrollmentOpen) {
                    loadClassrooms();
                }
            } catch (error) {
                console.error('Error checking enrollment status:', error);
                setEnrollmentOpen(true);
            } finally {
                setCheckingStatus(false);
            }
        };

        const loadClassrooms = async () => {
            try {
                // Usar el endpoint de salas sin autenticación, ya que el portal de padres no está completamente autenticado
                const response = await axios.get(`${API_URL}/api/classrooms`);
                setAvailableClassrooms(response.data || []);
            } catch (error) {
                console.error('Error loading classrooms for parent portal:', error);
                // Si no se puede cargar, dejar listado vacío
                setAvailableClassrooms([]);
            }
        };

        checkEnrollmentStatus();
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/parent-portal/check-auth`, { withCredentials: true });
            if (response.data.authenticated) {
                setUser(response.data.user);
                loadDraft();
            }
        } catch (error) {
            if (error.response?.status === 404) {
                setError('Portal de Padres no configurado. Contacte al administrador.');
            }
        } finally {
            setLoading(false);
        }
    };

    const loadDraft = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/parent-portal/draft`, { withCredentials: true });
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
            await axios.post(`${API_URL}/api/parent-portal/draft`, { data: formData, currentStep: step }, { withCredentials: true });
            setSuccess('Progreso guardado');
            setTimeout(() => setSuccess(''), 2000);
        } catch (error) {
            setError('Error al guardar progreso');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleFileChange = async (documentType, e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            setError('El archivo no debe superar los 5MB');
            return;
        }
        setDocuments(prev => ({ ...prev, [documentType]: file }));
        setSuccess(`Archivo "${file.name}" seleccionado`);
        setTimeout(() => setSuccess(''), 2000);
    };

    const handleNext = async () => {
        await saveDraft();
        if (step < 6) {
            setStep(step + 1);
            window.scrollTo(0, 0);
        } else {
            await handleSubmit();
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
            window.scrollTo(0, 0);
        }
    };

    const handleSubmit = async () => {
        setSaving(true);
        setError('');
        try {
            const uploadedDocs = {};
            for (const [key, file] of Object.entries(documents)) {
                if (file) {
                    const formDataDoc = new FormData();
                    formDataDoc.append('document', file);
                    formDataDoc.append('documentType', key);
                    const response = await axios.post(`${API_URL}/api/parent-portal/upload-document`, formDataDoc, {
                        withCredentials: true,
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                    uploadedDocs[key] = response.data.filePath;
                }
            }
            await axios.post(`${API_URL}/api/parent-portal/submit`, { ...formData, documents: uploadedDocs }, { withCredentials: true });
            
            // Guardar información para la confirmación
            const fullName = `${formData.nombre} ${formData.apellidoPaterno}`;
            setStudentName(fullName);
            
            // Verificar que se guardó en la BD
            try {
                const verifyResponse = await axios.get(
                    `${API_URL}/api/enrollments?status=inscripto`, 
                    { withCredentials: true }
                );
                
                if (verifyResponse.data.success && verifyResponse.data.data.length > 0) {
                    // Buscar el alumno recién creado por nombre
                    const recentStudent = verifyResponse.data.data.find(s => 
                        s.first_name === formData.nombre && 
                        s.paternal_surname === formData.apellidoPaterno
                    );
                    
                    if (recentStudent) {
                        setEnrollmentId(recentStudent.id);
                    }
                }
            } catch (verifyError) {
                console.log('No se pudo verificar ID, pero la inscripción fue exitosa');
            }
            
            // Limpiar formulario
            setFormData({
                nombre: '', segundoNombre: '', tercerNombre: '', alias: '',
                apellidoPaterno: '', apellidoMaterno: '', dni: '', fechaNacimiento: '',
                turno: 'Mañana', salaPreferida: '', tieneHermanos: false,
                calle: '', numero: '', ciudad: '', provincia: '', codigoPostal: '',
                obraSocial: '', numeroAfiliado: '', grupoSanguineo: '', alergias: '',
                medicacion: '', observacionesMedicas: '', pediatraNombre: '',
                pediatraTelefono: '', estadoVacunacion: 'completo', necesidadesEspeciales: '',
                nombreEmergencia: '', relacionEmergencia: '', telefonoEmergencia: '',
                telefonoAlternativoEmergencia: '', autorizadoRetiroEmergencia: false,
                nombrePadre: '', segundoNombrePadre: '', apellidoPaternoPadre: '',
                apellidoMaternoPadre: '', apellidoPreferidoPadre: '', dniPadre: '',
                telefonoPadre: '', emailPadre: '', lugarTrabajo: '', telefonoTrabajo: '',
                relacionConAlumno: 'madre', autorizadoRetiro: true, autorizadoCambio: true,
                autorizacionFotos: false, autorizacionSalidas: false, autorizacionAtencionMedica: false
            });
            setDocuments({
                dniAlumno: null, dniResponsable: null, certificadoNacimiento: null,
                carnetVacunas: null, certificadoMedico: null, constanciaObraSocial: null
            });
            await axios.delete(`${API_URL}/api/parent-portal/draft`, { withCredentials: true });
            
            // Marcar como enviado exitosamente
            setSubmitted(true);
            window.scrollTo(0, 0);
            
        } catch (error) {
            setError(error.response?.data?.error || error.response?.data?.details || 'Error al enviar el formulario');
            window.scrollTo(0, 0);
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
                        <span className="material-icons" style={{ fontSize: '4rem', color: '#667eea', marginBottom: '1rem' }}>family_restroom</span>
                        <h2 className="mb-3">Portal para Padres</h2>
                        {error ? (
                            <>
                                <Alert variant="warning" className="mb-3"><strong>Portal no disponible</strong><br/>{error}</Alert>
                                <p className="text-muted small">El portal requiere configuración de Google OAuth.<br/>Contacte al administrador.</p>
                            </>
                        ) : (
                            <>
                                <p className="text-muted mb-4">Ingrese con su cuenta de Google para registrar la información de su hijo/a</p>
                                <Button onClick={handleGoogleLogin} style={{ backgroundColor: '#4285f4', borderColor: '#4285f4', padding: '0.75rem 2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', margin: '0 auto' }}>
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

    const progress = (step / 6) * 100;

    // Pantalla de confirmación exitosa
    if (submitted) {
        return (
            <Modal show={true} onHide={() => {}} backdrop="static" keyboard={false} centered size="lg">
                <Modal.Body className="text-center p-5">
                    <div className="mb-4">
                        <div style={{ 
                            width: '100px', 
                            height: '100px', 
                            margin: '0 auto',
                            borderRadius: '50%',
                            backgroundColor: '#d4edda',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            animation: 'scaleIn 0.5s ease-out'
                        }}>
                            <span className="material-icons" style={{ fontSize: '4rem', color: '#28a745' }}>
                                check_circle
                            </span>
                        </div>
                    </div>
                    
                    <h2 className="text-success mb-3" style={{ fontWeight: 'bold' }}>
                        ¡Inscripción Completada Exitosamente!
                    </h2>
                    
                    <p className="lead text-muted mb-4">
                        Hemos recibido toda la información correctamente
                    </p>
                    
                    {enrollmentId && (
                        <Card className="mb-4 border-success" style={{ backgroundColor: '#f8f9fa' }}>
                            <Card.Body>
                                <Row className="align-items-center">
                                    <Col md={2} className="text-center">
                                        <span className="material-icons" style={{ fontSize: '3rem', color: '#28a745' }}>
                                            assignment_turned_in
                                        </span>
                                    </Col>
                                    <Col md={10}>
                                        <h4 className="mb-2" style={{ color: '#28a745' }}>
                                            Número de Inscripción: <strong>#{enrollmentId}</strong>
                                        </h4>
                                        <p className="mb-0 text-muted">
                                            <strong>Alumno:</strong> {studentName}
                                        </p>
                                        <small className="text-muted">
                                            Guarde este número para futuras consultas
                                        </small>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    )}
                    
                    <Alert variant="info" className="text-start mb-4">
                        <div className="d-flex">
                            <span className="material-icons me-3" style={{ fontSize: '2rem' }}>info</span>
                            <div>
                                <h5 className="mb-3"><strong>¿Qué sigue ahora?</strong></h5>
                                <ul className="mb-2">
                                    <li className="mb-2">✅ Su información ha sido guardada en nuestro sistema</li>
                                    <li className="mb-2">✅ Los documentos se han almacenado correctamente</li>
                                    <li className="mb-2">📧 Recibirá un email de confirmación en las próximas 24-48 horas</li>
                                    <li className="mb-2">📞 El jardín se contactará con usted para confirmar los detalles</li>
                                    <li className="mb-2">📋 Revise su email (incluyendo spam) para más información</li>
                                </ul>
                            </div>
                        </div>
                    </Alert>
                    
                    <div className="d-grid gap-2">
                        <Button 
                            variant="success" 
                            size="lg"
                            onClick={() => {
                                setSubmitted(false);
                                setStep(1);
                                setEnrollmentId(null);
                                setStudentName('');
                            }}
                            className="mb-2"
                        >
                            <span className="material-icons align-middle me-2">check</span>
                            Entendido
                        </Button>
                        <Button 
                            variant="outline-primary" 
                            size="lg"
                            onClick={() => {
                                setSubmitted(false);
                                setStep(1);
                                setEnrollmentId(null);
                                setStudentName('');
                            }}
                        >
                            <span className="material-icons align-middle me-2">add</span>
                            Registrar otro alumno
                        </Button>
                    </div>
                    
                    <div className="mt-4 pt-3 border-top">
                        <p className="text-muted small mb-2">
                            <strong>¿Necesita ayuda?</strong>
                        </p>
                        <p className="text-muted small mb-0">
                            Puede contactarnos por teléfono o email
                        </p>
                    </div>
                </Modal.Body>
            </Modal>
        );
    }

    return (
        <Container style={{ maxWidth: '700px', padding: '1rem', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            <Card className="mt-3 mb-3 shadow">
                <Card.Header className="bg-primary text-white">
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0"><span className="material-icons align-middle me-2">person_add</span>Inscripción 2026</h5>
                        <small>{user.email}</small>
                    </div>
                </Card.Header>
                <Card.Body>
                    <ProgressBar animated now={progress} label={`Paso ${step}/6`} className="mb-4" style={{ height: '30px', fontSize: '16px' }} />
                    {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
                    {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

                    {!enrollmentOpen && !checkingStatus && (
                        <Alert variant="danger" className="text-center">
                            <span className="material-icons align-middle me-2">block</span>
                            <strong>Las inscripciones están actualmente cerradas.</strong> No se pueden registrar nuevos alumnos en este momento.
                        </Alert>
                    )}

                    <Form>
                        {/* PASO 1 */}
                        {step === 1 && (
                            <>
                                <h5 className="mb-4 text-center text-primary"><span className="material-icons align-middle me-2">child_care</span>Datos del Alumno</h5>
                                <Row>
                                    <Col md={6}><Form.Group className="mb-3"><Form.Label>Nombre *</Form.Label><Form.Control type="text" name="nombre" value={formData.nombre} onChange={handleChange} required size="lg" disabled={!enrollmentOpen && !checkingStatus} /></Form.Group></Col>
                                    <Col md={6}><Form.Group className="mb-3"><Form.Label>Segundo Nombre</Form.Label><Form.Control type="text" name="segundoNombre" value={formData.segundoNombre} onChange={handleChange} size="lg" disabled={!enrollmentOpen && !checkingStatus} /></Form.Group></Col>
                                </Row>
                                <Row>
                                    <Col md={6}><Form.Group className="mb-3"><Form.Label>Apellido Paterno *</Form.Label><Form.Control type="text" name="apellidoPaterno" value={formData.apellidoPaterno} onChange={handleChange} required size="lg" disabled={!enrollmentOpen && !checkingStatus} /></Form.Group></Col>
                                    <Col md={6}><Form.Group className="mb-3"><Form.Label>Apellido Materno</Form.Label><Form.Control type="text" name="apellidoMaterno" value={formData.apellidoMaterno} onChange={handleChange} size="lg" disabled={!enrollmentOpen && !checkingStatus} /></Form.Group></Col>
                                </Row>
                                <Row>
                                    <Col md={6}><Form.Group className="mb-3"><Form.Label>DNI *</Form.Label><Form.Control type="text" name="dni" value={formData.dni} onChange={handleChange} required size="lg" placeholder="Sin puntos" disabled={!enrollmentOpen && !checkingStatus} /></Form.Group></Col>
                                    <Col md={6}><Form.Group className="mb-3"><Form.Label>Fecha Nacimiento *</Form.Label><Form.Control type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} required size="lg" disabled={!enrollmentOpen && !checkingStatus} /></Form.Group></Col>
                                </Row>
                                <Row>
                                    <Col md={6}><Form.Group className="mb-3"><Form.Label>Turno *</Form.Label><Form.Select name="turno" value={formData.turno} onChange={handleChange} required size="lg" disabled={!enrollmentOpen && !checkingStatus}><option value="Mañana">Mañana</option><option value="Tarde">Tarde</option></Form.Select></Form.Group></Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Sala Preferida</Form.Label>
                                            <Form.Select
                                                name="salaPreferida"
                                                value={formData.salaPreferida}
                                                onChange={handleChange}
                                                size="lg"
                                                disabled={!enrollmentOpen && !checkingStatus}
                                            >
                                                <option value="">Sin preferencia</option>
                                                {availableClassrooms.map(sala => (
                                                    <option key={sala.id} value={sala.id}>
                                                        {sala.nombre || sala.name} - Capacidad: {sala.capacidad || sala.capacity}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}><Form.Group className="mb-3"><Form.Label>Apodo</Form.Label><Form.Control type="text" name="alias" value={formData.alias} onChange={handleChange} size="lg" disabled={!enrollmentOpen && !checkingStatus} /></Form.Group></Col>
                                    <Col md={6}><Form.Group className="mb-3"><Form.Check type="checkbox" name="tieneHermanos" checked={formData.tieneHermanos} onChange={handleChange} label="Tiene hermanos en el jardín" disabled={!enrollmentOpen && !checkingStatus} /></Form.Group></Col>
                                </Row>
                            </>
                        )}

                        {/* PASO 2 */}
                        {step === 2 && (
                            <>
                                <h5 className="mb-4 text-center text-primary"><span className="material-icons align-middle me-2">home</span>Dirección</h5>
                                <Row>
                                    <Col md={8}><Form.Group className="mb-3"><Form.Label>Calle *</Form.Label><Form.Control type="text" name="calle" value={formData.calle} onChange={handleChange} required size="lg" /></Form.Group></Col>
                                    <Col md={4}><Form.Group className="mb-3"><Form.Label>Número *</Form.Label><Form.Control type="text" name="numero" value={formData.numero} onChange={handleChange} required size="lg" /></Form.Group></Col>
                                </Row>
                                <Row>
                                    <Col md={6}><Form.Group className="mb-3"><Form.Label>Ciudad *</Form.Label><Form.Control type="text" name="ciudad" value={formData.ciudad} onChange={handleChange} required size="lg" /></Form.Group></Col>
                                    <Col md={6}><Form.Group className="mb-3"><Form.Label>Provincia *</Form.Label><Form.Control type="text" name="provincia" value={formData.provincia} onChange={handleChange} required size="lg" /></Form.Group></Col>
                                </Row>
                                <Form.Group className="mb-3"><Form.Label>Código Postal</Form.Label><Form.Control type="text" name="codigoPostal" value={formData.codigoPostal} onChange={handleChange} size="lg" /></Form.Group>
                            </>
                        )}

                        {/* PASO 3 */}
                        {step === 3 && (
                            <>
                                <h5 className="mb-4 text-center text-primary"><span className="material-icons align-middle me-2">medical_services</span>Información Médica</h5>
                                <Row>
                                    <Col md={6}><Form.Group className="mb-3"><Form.Label>Obra Social *</Form.Label><Form.Control type="text" name="obraSocial" value={formData.obraSocial} onChange={handleChange} required size="lg" /></Form.Group></Col>
                                    <Col md={6}><Form.Group className="mb-3"><Form.Label>Nº Afiliado</Form.Label><Form.Control type="text" name="numeroAfiliado" value={formData.numeroAfiliado} onChange={handleChange} size="lg" /></Form.Group></Col>
                                </Row>
                                <Row>
                                    <Col md={6}><Form.Group className="mb-3"><Form.Label>Grupo Sanguíneo</Form.Label><Form.Select name="grupoSanguineo" value={formData.grupoSanguineo} onChange={handleChange} size="lg"><option value="">Seleccione...</option><option value="A+">A+</option><option value="A-">A-</option><option value="B+">B+</option><option value="B-">B-</option><option value="AB+">AB+</option><option value="AB-">AB-</option><option value="O+">O+</option><option value="O-">O-</option></Form.Select></Form.Group></Col>
                                    <Col md={6}><Form.Group className="mb-3"><Form.Label>Vacunación *</Form.Label><Form.Select name="estadoVacunacion" value={formData.estadoVacunacion} onChange={handleChange} required size="lg"><option value="completo">Completo</option><option value="incompleto">Incompleto</option><option value="pendiente">Pendiente</option></Form.Select></Form.Group></Col>
                                </Row>
                                <Form.Group className="mb-3"><Form.Label>Alergias</Form.Label><Form.Control as="textarea" rows={2} name="alergias" value={formData.alergias} onChange={handleChange} size="lg" placeholder="Ej: Polen, alimentos, medicamentos..." /></Form.Group>
                                <Form.Group className="mb-3"><Form.Label>Medicación Habitual</Form.Label><Form.Control as="textarea" rows={2} name="medicacion" value={formData.medicacion} onChange={handleChange} size="lg" placeholder="Medicamentos que toma regularmente..." /></Form.Group>
                                <Row>
                                    <Col md={6}><Form.Group className="mb-3"><Form.Label>Pediatra *</Form.Label><Form.Control type="text" name="pediatraNombre" value={formData.pediatraNombre} onChange={handleChange} required size="lg" placeholder="Nombre completo" /></Form.Group></Col>
                                    <Col md={6}><Form.Group className="mb-3"><Form.Label>Tel. Pediatra *</Form.Label><Form.Control type="tel" name="pediatraTelefono" value={formData.pediatraTelefono} onChange={handleChange} required size="lg" /></Form.Group></Col>
                                </Row>
                                <Form.Group className="mb-3"><Form.Label>Necesidades Especiales</Form.Label><Form.Control as="textarea" rows={2} name="necesidadesEspeciales" value={formData.necesidadesEspeciales} onChange={handleChange} size="lg" /></Form.Group>
                                <Form.Group className="mb-3"><Form.Label>Observaciones Médicas</Form.Label><Form.Control as="textarea" rows={2} name="observacionesMedicas" value={formData.observacionesMedicas} onChange={handleChange} size="lg" /></Form.Group>
                            </>
                        )}

                        {/* PASO 4 */}
                        {step === 4 && (
                            <>
                                <h5 className="mb-4 text-center text-primary"><span className="material-icons align-middle me-2">emergency</span>Contacto de Emergencia</h5>
                                <Alert variant="info" className="mb-4"><strong>Importante:</strong> Será contactado si no ubicamos a los responsables.</Alert>
                                <Form.Group className="mb-3"><Form.Label>Nombre Completo *</Form.Label><Form.Control type="text" name="nombreEmergencia" value={formData.nombreEmergencia} onChange={handleChange} required size="lg" /></Form.Group>
                                <Row>
                                    <Col md={6}><Form.Group className="mb-3"><Form.Label>Relación *</Form.Label><Form.Control type="text" name="relacionEmergencia" value={formData.relacionEmergencia} onChange={handleChange} placeholder="Ej: Abuela, Tío" required size="lg" /></Form.Group></Col>
                                    <Col md={6}><Form.Group className="mb-3"><Form.Label>Teléfono *</Form.Label><Form.Control type="tel" name="telefonoEmergencia" value={formData.telefonoEmergencia} onChange={handleChange} required size="lg" /></Form.Group></Col>
                                </Row>
                                <Form.Group className="mb-3"><Form.Label>Teléfono Alternativo</Form.Label><Form.Control type="tel" name="telefonoAlternativoEmergencia" value={formData.telefonoAlternativoEmergencia} onChange={handleChange} size="lg" /></Form.Group>
                                <Form.Group className="mb-3"><Form.Check type="checkbox" name="autorizadoRetiroEmergencia" checked={formData.autorizadoRetiroEmergencia} onChange={handleChange} label="Autorizado para retirar al alumno" /></Form.Group>
                            </>
                        )}

                        {/* PASO 5 */}
                        {step === 5 && (
                            <>
                                <h5 className="mb-4 text-center text-primary"><span className="material-icons align-middle me-2">person</span>Datos del Responsable</h5>
                                <Form.Group className="mb-3"><Form.Label>Relación *</Form.Label><Form.Select name="relacionConAlumno" value={formData.relacionConAlumno} onChange={handleChange} required size="lg"><option value="madre">Madre</option><option value="padre">Padre</option><option value="tutor">Tutor/a Legal</option><option value="abuelo">Abuelo</option><option value="abuela">Abuela</option><option value="tio">Tío</option><option value="tia">Tía</option><option value="otro">Otro</option></Form.Select></Form.Group>
                                <Row>
                                    <Col md={6}><Form.Group className="mb-3"><Form.Label>Nombre *</Form.Label><Form.Control type="text" name="nombrePadre" value={formData.nombrePadre} onChange={handleChange} required size="lg" /></Form.Group></Col>
                                    <Col md={6}><Form.Group className="mb-3"><Form.Label>Segundo Nombre</Form.Label><Form.Control type="text" name="segundoNombrePadre" value={formData.segundoNombrePadre} onChange={handleChange} size="lg" /></Form.Group></Col>
                                </Row>
                                <Row>
                                    <Col md={6}><Form.Group className="mb-3"><Form.Label>Apellido Paterno *</Form.Label><Form.Control type="text" name="apellidoPaternoPadre" value={formData.apellidoPaternoPadre} onChange={handleChange} required size="lg" /></Form.Group></Col>
                                    <Col md={6}><Form.Group className="mb-3"><Form.Label>Apellido Materno</Form.Label><Form.Control type="text" name="apellidoMaternoPadre" value={formData.apellidoMaternoPadre} onChange={handleChange} size="lg" /></Form.Group></Col>
                                </Row>
                                <Form.Group className="mb-3"><Form.Label>DNI *</Form.Label><Form.Control type="text" name="dniPadre" value={formData.dniPadre} onChange={handleChange} required size="lg" placeholder="Sin puntos" /></Form.Group>
                                <Row>
                                    <Col md={6}><Form.Group className="mb-3"><Form.Label>Teléfono *</Form.Label><Form.Control type="tel" name="telefonoPadre" value={formData.telefonoPadre} onChange={handleChange} required size="lg" /></Form.Group></Col>
                                    <Col md={6}><Form.Group className="mb-3"><Form.Label>Email</Form.Label><Form.Control type="email" name="emailPadre" value={formData.emailPadre} onChange={handleChange} size="lg" /></Form.Group></Col>
                                </Row>
                                <Row>
                                    <Col md={6}><Form.Group className="mb-3"><Form.Label>Lugar de Trabajo</Form.Label><Form.Control type="text" name="lugarTrabajo" value={formData.lugarTrabajo} onChange={handleChange} size="lg" /></Form.Group></Col>
                                    <Col md={6}><Form.Group className="mb-3"><Form.Label>Tel. Laboral</Form.Label><Form.Control type="tel" name="telefonoTrabajo" value={formData.telefonoTrabajo} onChange={handleChange} size="lg" /></Form.Group></Col>
                                </Row>
                                <Form.Group className="mb-3"><Form.Check type="checkbox" name="autorizadoRetiro" checked={formData.autorizadoRetiro} onChange={handleChange} label="Autorizado para retirar" /></Form.Group>
                                <Form.Group className="mb-3"><Form.Check type="checkbox" name="autorizadoCambio" checked={formData.autorizadoCambio} onChange={handleChange} label="Autorizado para cambio de pañal" /></Form.Group>
                            </>
                        )}

                        {/* PASO 6 */}
                        {step === 6 && (
                            <>
                                <h5 className="mb-4 text-center text-primary"><span className="material-icons align-middle me-2">verified_user</span>Autorizaciones y Documentos</h5>
                                <Alert variant="warning" className="mb-4"><strong>Lea cada autorización cuidadosamente.</strong></Alert>
                                <Card className="mb-4">
                                    <Card.Header className="bg-light"><strong>Autorizaciones</strong></Card.Header>
                                    <Card.Body>
                                        <Form.Group className="mb-3"><Form.Check type="checkbox" name="autorizacionFotos" checked={formData.autorizacionFotos} onChange={handleChange} label={<span><strong>Fotos/Videos:</strong> Autorizo al jardín a tomar fotos y videos para uso interno.</span>} /></Form.Group>
                                        <Form.Group className="mb-3"><Form.Check type="checkbox" name="autorizacionSalidas" checked={formData.autorizacionSalidas} onChange={handleChange} label={<span><strong>Salidas Educativas:</strong> Autorizo a participar en salidas con docentes.</span>} /></Form.Group>
                                        <Form.Group className="mb-3"><Form.Check type="checkbox" name="autorizacionAtencionMedica" checked={formData.autorizacionAtencionMedica} onChange={handleChange} label={<span><strong>Atención Médica Urgente:</strong> Autorizo atención médica de urgencia.</span>} /></Form.Group>
                                    </Card.Body>
                                </Card>
                                <Card className="mb-4">
                                    <Card.Header className="bg-light"><strong>Documentos</strong> <small className="text-muted">(JPG, PNG, PDF. Máx 5MB)</small></Card.Header>
                                    <Card.Body>
                                        <Form.Group className="mb-3"><Form.Label><span className="material-icons align-middle me-2 text-danger">badge</span>DNI Alumno *</Form.Label><Form.Control type="file" accept="image/*,application/pdf" onChange={(e) => handleFileChange('dniAlumno', e)} size="lg" />{documents.dniAlumno && <small className="text-success">✓ {documents.dniAlumno.name}</small>}</Form.Group>
                                        <Form.Group className="mb-3"><Form.Label><span className="material-icons align-middle me-2 text-danger">badge</span>DNI Responsable *</Form.Label><Form.Control type="file" accept="image/*,application/pdf" onChange={(e) => handleFileChange('dniResponsable', e)} size="lg" />{documents.dniResponsable && <small className="text-success">✓ {documents.dniResponsable.name}</small>}</Form.Group>
                                        <Form.Group className="mb-3"><Form.Label><span className="material-icons align-middle me-2">description</span>Cert. Nacimiento *</Form.Label><Form.Control type="file" accept="image/*,application/pdf" onChange={(e) => handleFileChange('certificadoNacimiento', e)} size="lg" />{documents.certificadoNacimiento && <small className="text-success">✓ {documents.certificadoNacimiento.name}</small>}</Form.Group>
                                        <Form.Group className="mb-3"><Form.Label><span className="material-icons align-middle me-2">vaccines</span>Carnet Vacunas *</Form.Label><Form.Control type="file" accept="image/*,application/pdf" onChange={(e) => handleFileChange('carnetVacunas', e)} size="lg" />{documents.carnetVacunas && <small className="text-success">✓ {documents.carnetVacunas.name}</small>}</Form.Group>
                                        <Form.Group className="mb-3"><Form.Label><span className="material-icons align-middle me-2">local_hospital</span>Cert. Médico</Form.Label><Form.Control type="file" accept="image/*,application/pdf" onChange={(e) => handleFileChange('certificadoMedico', e)} size="lg" />{documents.certificadoMedico && <small className="text-success">✓ {documents.certificadoMedico.name}</small>}</Form.Group>
                                        <Form.Group className="mb-3"><Form.Label><span className="material-icons align-middle me-2">health_and_safety</span>Constancia Obra Social</Form.Label><Form.Control type="file" accept="image/*,application/pdf" onChange={(e) => handleFileChange('constanciaObraSocial', e)} size="lg" />{documents.constanciaObraSocial && <small className="text-success">✓ {documents.constanciaObraSocial.name}</small>}</Form.Group>
                                    </Card.Body>
                                </Card>
                                <Alert variant="info">Los documentos con * son obligatorios. Máx 5MB cada uno.</Alert>
                            </>
                        )}

                        <div className="d-flex justify-content-between mt-4">
                            <Button variant="secondary" onClick={handleBack} disabled={step === 1 || saving} size="lg"><span className="material-icons align-middle me-2">arrow_back</span>Anterior</Button>
                            <Button
                                variant="primary"
                                onClick={handleNext}
                                disabled={saving || (!enrollmentOpen && !checkingStatus)}
                                size="lg"
                            >
                                {saving ? (
                                    <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>{step === 6 ? 'Enviando...' : 'Guardando...'}</>
                                ) : (
                                    <>{step === 6 ? (<><span className="material-icons align-middle me-2">send</span>Enviar</>) : (<>Siguiente<span className="material-icons align-middle ms-2">arrow_forward</span></>)}</>
                                )}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
            {!enrollmentOpen && !checkingStatus && ( // Display message if registrations are closed
                <Alert variant="warning" className="mt-3 text-center">
                    <span className="material-icons align-middle me-2">info</span>
                    Las inscripciones de alumnos no están disponibles actualmente. Por favor, intente más tarde.
                </Alert>
            )}
        </Container>
    );
};

export default ParentPortalPage;
