import { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Badge, Modal, Alert, Spinner, Row, Col, Form } from 'react-bootstrap';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { usePermissions } from '../context/PermissionsContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function EnrollmentsManagementPage({ darkMode }) {
    const { user } = useAuth();
    const { can } = usePermissions();
    const [pendingEnrollments, setPendingEnrollments] = useState([]);
    const [completedEnrollments, setCompletedEnrollments] = useState([]);
    const [activeTab, setActiveTab] = useState('pending');
    const [selectedEnrollment, setSelectedEnrollment] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadEnrollments();
    }, []);

    const loadEnrollments = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            const [pendingRes, completedRes] = await Promise.all([
                axios.get(`${API_URL}/api/enrollment-management/pending`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`${API_URL}/api/enrollment-management/completed`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            setPendingEnrollments(pendingRes.data.data || []);
            setCompletedEnrollments(completedRes.data.data || []);
        } catch (error) {
            console.error('Error loading enrollments:', error);
            setError('Error al cargar las inscripciones');
        } finally {
            setLoading(false);
        }
    };

    const [showDocumentVerificationModal, setShowDocumentVerificationModal] = useState(false);
    const [documents, setDocuments] = useState([]);
    const [loadingDocuments, setLoadingDocuments] = useState(false);
    const [docVerificationLoading, setDocVerificationLoading] = useState({});
    const [preEnrolledStudents, setPreEnrolledStudents] = useState([]);
    const [activeTabInternal, setActiveTabInternal] = useState('pending'); // For internal tab switching in modal

    const loadPreEnrolledStudents = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/api/enrollment-management/pre-enrolled`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPreEnrolledStudents(response.data.data || []);
        } catch (error) {
            console.error('Error loading pre-enrolled students:', error);
            setError('Error al cargar estudiantes preinscriptos');
        }
    };

    const handleViewDetails = async (enrollmentId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/api/enrollment-management/${enrollmentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSelectedEnrollment(response.data.data);
            setShowDetailModal(true);
        } catch (error) {
            console.error('Error loading enrollment details:', error);
            setError('Error al cargar los detalles de la inscripción');
        }
    };

    const handleViewDocuments = async (enrollmentId) => {
        try {
            const token = localStorage.getItem('token');
            setLoadingDocuments(true);

            // Load documents for this enrollment
            const response = await axios.get(`${API_URL}/api/enrollment-management/${enrollmentId}/documents`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setDocuments(response.data.data);
            setSelectedEnrollment(prev => ({ ...prev, id: enrollmentId })); // Store enrollment ID
            setActiveTabInternal('documents');
            setShowDocumentVerificationModal(true);
        } catch (error) {
            console.error('Error loading documents:', error);
            setError('Error al cargar los documentos');
        } finally {
            setLoadingDocuments(false);
        }
    };

    const toggleDocumentVerification = async (documentId, currentStatus) => {
        if (!selectedEnrollment || !selectedEnrollment.id) return;

        setDocVerificationLoading(prev => ({ ...prev, [documentId]: true }));

        try {
            const token = localStorage.getItem('token');
            const endpoint = currentStatus
                ? `${API_URL}/api/enrollment-management/${selectedEnrollment.id}/documents/${documentId}/unverify`
                : `${API_URL}/api/enrollment-management/${selectedEnrollment.id}/documents/${documentId}/verify`;

            await axios.patch(endpoint, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update the document status in the local state
            setDocuments(prev => prev.map(doc =>
                doc.id === documentId
                    ? { ...doc, delivery_verified: !currentStatus }
                    : doc
            ));
        } catch (error) {
            console.error('Error toggling document verification:', error);
            setError('Error al ' + (currentStatus ? 'desverificar' : 'verificar') + ' el documento');
        } finally {
            setDocVerificationLoading(prev => ({ ...prev, [documentId]: false }));
        }
    };

    const handleApprove = async (enrollmentId) => {
        try {
            setActionLoading(true);
            const token = localStorage.getItem('token');
            
            await axios.patch(`${API_URL}/api/enrollment-management/${enrollmentId}/approve`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setShowApproveModal(false);
            loadEnrollments(); // Reload to reflect changes
        } catch (error) {
            console.error('Error approving enrollment:', error);
            setError('Error al aprobar la inscripción: ' + (error.response?.data?.error || error.message));
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async (enrollmentId) => {
        if (!rejectReason.trim()) {
            setError('Debe proporcionar un motivo para rechazar la inscripción');
            return;
        }

        try {
            setActionLoading(true);
            const token = localStorage.getItem('token');
            
            await axios.patch(`${API_URL}/api/enrollment-management/${enrollmentId}/reject`, {
                reason: rejectReason
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setShowRejectModal(false);
            setRejectReason('');
            loadEnrollments(); // Reload to reflect changes
        } catch (error) {
            console.error('Error rejecting enrollment:', error);
            setError('Error al rechazar la inscripción: ' + (error.response?.data?.error || error.message));
        } finally {
            setActionLoading(false);
        }
    };

    const getStatusBadgeVariant = (status) => {
        const variants = {
            'pending_review': 'warning',
            'approved': 'success',
            'rejected': 'danger'
        };
        return variants[status] || 'secondary';
    };

    const getStatusText = (status) => {
        const texts = {
            'pending_review': 'Pendiente de Revisión',
            'approved': 'Aprobada',
            'rejected': 'Rechazada'
        };
        return texts[status] || status;
    };

    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: es });
        } catch {
            return dateString;
        }
    };

    if (!user || !['Administrator', 'Directivo', 'Secretary'].includes(user.role)) {
        return (
            <Container className="text-center mt-5">
                <h2>Acceso Denegado</h2>
                <p>Usted no tiene permisos para acceder a esta página.</p>
            </Container>
        );
    }

    const currentEnrollments = activeTab === 'pending' ? pendingEnrollments : completedEnrollments;

    return (
        <Container fluid style={{
            paddingTop: '2rem',
            paddingBottom: '2rem',
            minHeight: 'calc(100vh - 80px)'
        }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 style={{ color: darkMode ? '#e5e7eb' : '#212529', marginBottom: '0.5rem' }}>
                        <span className="material-icons" style={{ fontSize: '2rem', verticalAlign: 'middle', marginRight: '0.5rem' }}>
                            assignment
                        </span>
                        Control de Inscripciones
                    </h2>
                    <p style={{ color: darkMode ? '#9ca3af' : '#6c757d', marginBottom: 0 }}>
                        Gestión de inscripciones pendientes y completadas
                    </p>
                </div>
            </div>

            {error && (
                <Alert variant="danger" onClose={() => setError('')} dismissible>
                    {error}
                </Alert>
            )}

            <Card style={{
                background: darkMode ? '#1f2937' : '#fff',
                border: `1px solid ${darkMode ? '#374151' : '#dee2e6'}`
            }}>
                <Card.Header style={{
                    background: darkMode ? '#374151' : '#f8f9fa',
                    borderBottom: `1px solid ${darkMode ? '#4b5563' : '#dee2e6'}`,
                    fontWeight: 'bold'
                }}>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            Inscripciones {activeTab === 'pending' ? 'Pendientes' : 'Completadas'}
                            {activeTab === 'pending' && (
                                <Badge bg="warning" className="ms-2">
                                    {pendingEnrollments.length}
                                </Badge>
                            )}
                        </div>
                        <div className="btn-group" role="group">
                            <Button
                                variant={activeTab === 'pending' ? 'primary' : 'outline-secondary'}
                                size="sm"
                                onClick={() => setActiveTab('pending')}
                            >
                                Pendientes
                            </Button>
                            <Button
                                variant={activeTab === 'completed' ? 'primary' : 'outline-secondary'}
                                size="sm"
                                onClick={() => setActiveTab('completed')}
                            >
                                Completadas
                            </Button>
                        </div>
                    </div>
                </Card.Header>
                <Card.Body>
                    {loading ? (
                        <div className="text-center">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-2">Cargando inscripciones...</p>
                        </div>
                    ) : (
                        <Table responsive hover style={{
                            color: darkMode ? '#e5e7eb' : '#212529',
                            marginBottom: 0
                        }}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Alumno</th>
                                    <th>Turno</th>
                                    <th>Fecha de Solicitud</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentEnrollments.length > 0 ? (
                                    currentEnrollments.map(enrollment => (
                                        <tr key={enrollment.id}>
                                            <td>{enrollment.id}</td>
                                            <td>
                                                {enrollment.first_name} {enrollment.paternal_surname} {enrollment.maternal_surname}
                                            </td>
                                            <td>
                                                <Badge bg="info">
                                                    {enrollment.shift}
                                                </Badge>
                                            </td>
                                            <td>{formatDate(enrollment.submitted_at)}</td>
                                            <td>
                                                <Badge bg={getStatusBadgeVariant(enrollment.status)}>
                                                    {getStatusText(enrollment.status)}
                                                </Badge>
                                            </td>
                                            <td>
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    onClick={() => handleViewDetails(enrollment.id)}
                                                    className="me-1"
                                                >
                                                    <span className="material-icons" style={{ fontSize: '1rem' }}>visibility</span> Ver
                                                </Button>
                                                <Button
                                                    variant="outline-info"
                                                    size="sm"
                                                    onClick={() => handleViewDocuments(enrollment.id)}
                                                    className="me-1"
                                                >
                                                    <span className="material-icons" style={{ fontSize: '1rem' }}>fact_check</span> Doc
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center">
                                            {activeTab === 'pending'
                                                ? 'No hay inscripciones pendientes de revisión.'
                                                : 'No hay inscripciones completadas.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>

            {/* Modal para ver detalles de inscripción */}
            <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="xl">
                <Modal.Header closeButton style={{
                    background: darkMode ? '#374151' : '#f8f9fa',
                    color: darkMode ? '#e5e7eb' : '#212529'
                }}>
                    <Modal.Title>
                        <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: '0.5rem' }}>
                            person
                        </span>
                        Detalles de Inscripción
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ background: darkMode ? '#1f2937' : '#fff' }}>
                    {selectedEnrollment ? (
                        <div>
                            {/* Información del alumno */}
                            <Card className="mb-4" style={{ background: darkMode ? '#374151' : '#fff' }}>
                                <Card.Header style={{ background: darkMode ? '#4b5563' : '#f8f9fa' }}>
                                    <h5 className="mb-0">
                                        <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: '0.5rem' }}>
                                            child_care
                                        </span>
                                        Información del Alumno
                                    </h5>
                                </Card.Header>
                                <Card.Body>
                                    <Row>
                                        <Col md={6}>
                                            <p><strong>Nombre:</strong> {selectedEnrollment.first_name} {selectedEnrollment.middle_name_optional || ''} {selectedEnrollment.third_name_optional || ''}</p>
                                            <p><strong>Apellidos:</strong> {selectedEnrollment.paternal_surname} {selectedEnrollment.maternal_surname}</p>
                                            <p><strong>Alias:</strong> {selectedEnrollment.nickname_optional || 'N/A'}</p>
                                            <p><strong>DNI:</strong> {selectedEnrollment.student_dni || 'N/A'}</p>
                                            <p><strong>Fecha de Nacimiento:</strong> {selectedEnrollment.birth_date ? formatDate(selectedEnrollment.birth_date) : 'N/A'}</p>
                                        </Col>
                                        <Col md={6}>
                                            <p><strong>Turno:</strong> {selectedEnrollment.shift}</p>
                                            <p><strong>Estado:</strong> <Badge bg={getStatusBadgeVariant(selectedEnrollment.status)}>{getStatusText(selectedEnrollment.status)}</Badge></p>
                                            <p><strong>Fecha de Inscripción:</strong> {selectedEnrollment.enrollment_date ? formatDate(selectedEnrollment.enrollment_date) : 'N/A'}</p>
                                            <p><strong>Fecha de Solicitud:</strong> {selectedEnrollment.submitted_at ? formatDate(selectedEnrollment.submitted_at) : 'N/A'}</p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <p><strong>Obra Social:</strong> {selectedEnrollment.health_insurance || 'N/A'}</p>
                                            <p><strong>Nº Afiliado:</strong> {selectedEnrollment.affiliate_number || 'N/A'}</p>
                                            <p><strong>Grupo Sanguíneo:</strong> {selectedEnrollment.blood_type || 'N/A'}</p>
                                        </Col>
                                        <Col md={6}>
                                            <p><strong>Alergias:</strong> {selectedEnrollment.allergies || 'N/A'}</p>
                                            <p><strong>Medicación:</strong> {selectedEnrollment.medications || 'N/A'}</p>
                                            <p><strong>Estado de Vacunación:</strong> {selectedEnrollment.vaccination_status || 'N/A'}</p>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>

                            {/* Información de contacto de emergencia */}
                            <Card className="mb-4" style={{ background: darkMode ? '#374151' : '#fff' }}>
                                <Card.Header style={{ background: darkMode ? '#4b5563' : '#f8f9fa' }}>
                                    <h5 className="mb-0">
                                        <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: '0.5rem' }}>
                                            emergency
                                        </span>
                                        Contacto de Emergencia
                                    </h5>
                                </Card.Header>
                                <Card.Body>
                                    <Row>
                                        <Col md={6}>
                                            <p><strong>Nombre:</strong> {selectedEnrollment.emergency_contact_name}</p>
                                            <p><strong>Relación:</strong> {selectedEnrollment.emergency_contact_relationship}</p>
                                        </Col>
                                        <Col md={6}>
                                            <p><strong>Teléfono:</strong> {selectedEnrollment.emergency_contact_phone}</p>
                                            <p><strong>Teléfono Alternativo:</strong> {selectedEnrollment.emergency_contact_alt_phone || 'N/A'}</p>
                                        </Col>
                                    </Row>
                                    <p><strong>Autorizado para Retirar:</strong> {selectedEnrollment.emergency_contact_authorized_pickup ? 'Sí' : 'No'}</p>
                                </Card.Body>
                            </Card>

                            {/* Información de dirección */}
                            <Card className="mb-4" style={{ background: darkMode ? '#374151' : '#fff' }}>
                                <Card.Header style={{ background: darkMode ? '#4b5563' : '#f8f9fa' }}>
                                    <h5 className="mb-0">
                                        <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: '0.5rem' }}>
                                            home
                                        </span>
                                        Dirección
                                    </h5>
                                </Card.Header>
                                <Card.Body>
                                    <p><strong>Dirección:</strong> {selectedEnrollment.street} {selectedEnrollment.number}</p>
                                    <Row>
                                        <Col md={6}>
                                            <p><strong>Ciudad:</strong> {selectedEnrollment.city}</p>
                                            <p><strong>Provincia:</strong> {selectedEnrollment.provincia}</p>
                                        </Col>
                                        <Col md={6}>
                                            <p><strong>Código Postal:</strong> {selectedEnrollment.postal_code_optional || 'N/A'}</p>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>

                            {/* Información del responsable */}
                            <Card className="mb-4" style={{ background: darkMode ? '#374151' : '#fff' }}>
                                <Card.Header style={{ background: darkMode ? '#4b5563' : '#f8f9fa' }}>
                                    <h5 className="mb-0">
                                        <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: '0.5rem' }}>
                                            person
                                        </span>
                                        Información del Responsable
                                    </h5>
                                </Card.Header>
                                <Card.Body>
                                    <Row>
                                        <Col md={6}>
                                            <p><strong>Nombre:</strong> {selectedEnrollment.guardian_first_name} {selectedEnrollment.guardian_middle_name || ''}</p>
                                            <p><strong>Apellidos:</strong> {selectedEnrollment.guardian_paternal_surname} {selectedEnrollment.guardian_maternal_surname}</p>
                                            <p><strong>Apellido Preferido:</strong> {selectedEnrollment.guardian_preferred_surname || 'N/A'}</p>
                                            <p><strong>DNI:</strong> {selectedEnrollment.guardian_dni || 'N/A'}</p>
                                        </Col>
                                        <Col md={6}>
                                            <p><strong>Teléfono:</strong> {selectedEnrollment.guardian_phone}</p>
                                            <p><strong>Email:</strong> {selectedEnrollment.guardian_email || 'N/A'}</p>
                                            <p><strong>Lugar de Trabajo:</strong> {selectedEnrollment.guardian_workplace || 'N/A'}</p>
                                            <p><strong>Teléfono Trabajo:</strong> {selectedEnrollment.guardian_work_phone || 'N/A'}</p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <p><strong>Relación con Alumno:</strong> {selectedEnrollment.guardian_relationship || 'N/A'}</p>
                                            <p><strong>Autorizado para Retirar:</strong> {selectedEnrollment.guardian_authorized_pickup ? 'Sí' : 'No'}</p>
                                        </Col>
                                        <Col md={6}>
                                            <p><strong>Autorizado para Cambio:</strong> {selectedEnrollment.guardian_authorized_change ? 'Sí' : 'No'}</p>
                                            <p><strong>Es Principal:</strong> {selectedEnrollment.guardian_is_primary ? 'Sí' : 'No'}</p>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>

                            {/* Documentos */}
                            <Card className="mb-4" style={{ background: darkMode ? '#374151' : '#fff' }}>
                                <Card.Header style={{ background: darkMode ? '#4b5563' : '#f8f9fa' }}>
                                    <h5 className="mb-0">
                                        <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: '0.5rem' }}>
                                            description
                                        </span>
                                        Documentos
                                    </h5>
                                </Card.Header>
                                <Card.Body>
                                    {selectedEnrollment.documents && selectedEnrollment.documents.length > 0 ? (
                                        <Table responsive>
                                            <thead>
                                                <tr>
                                                    <th>Tipo</th>
                                                    <th>Nombre del Archivo</th>
                                                    <th>Fecha de Subida</th>
                                                    <th>Acción</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedEnrollment.documents.map(doc => (
                                                    <tr key={doc.id}>
                                                        <td>
                                                            <Badge bg="info">{doc.document_type}</Badge>
                                                        </td>
                                                        <td>{doc.file_name}</td>
                                                        <td>{doc.upload_date ? formatDate(doc.upload_date) : 'N/A'}</td>
                                                        <td>
                                                            <a href={`${API_URL}${doc.file_path}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm">
                                                                <span className="material-icons" style={{ fontSize: '1rem' }}>visibility</span> Ver
                                                            </a>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    ) : (
                                        <p>No se han subido documentos.</p>
                                    )}
                                </Card.Body>
                            </Card>
                        </div>
                    ) : (
                        <div className="text-center">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-2">Cargando detalles...</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer style={{
                    background: darkMode ? '#374151' : '#f8f9fa'
                }}>
                    {activeTab === 'pending' && selectedEnrollment?.status === 'pending_review' && (
                        <>
                            <Button variant="success" onClick={() => {
                                setShowDetailModal(false);
                                setShowApproveModal(true);
                            }}>
                                <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: '0.25rem' }}>check</span> Aprobar
                            </Button>
                            <Button variant="danger" onClick={() => {
                                setShowDetailModal(false);
                                setShowRejectModal(true);
                            }}>
                                <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: '0.25rem' }}>block</span> Rechazar
                            </Button>
                        </>
                    )}
                    <Button variant="secondary" onClick={() => {
                        setShowDetailModal(false);
                        setSelectedEnrollment(null);
                    }}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal para aprobar inscripción */}
            <Modal show={showApproveModal} onHide={() => setShowApproveModal(false)}>
                <Modal.Header closeButton style={{
                    background: darkMode ? '#374151' : '#f8f9fa',
                    color: darkMode ? '#e5e7eb' : '#212529'
                }}>
                    <Modal.Title>Aprobar Inscripción</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ background: darkMode ? '#1f2937' : '#fff' }}>
                    <p>¿Está seguro que desea aprobar esta inscripción?</p>
                    <p>Una vez aprobada, el alumno quedará como <strong>inscripto</strong> y podrá ser asignado a una sala.</p>
                </Modal.Body>
                <Modal.Footer style={{
                    background: darkMode ? '#374151' : '#f8f9fa'
                }}>
                    <Button variant="secondary" onClick={() => setShowApproveModal(false)} disabled={actionLoading}>
                        Cancelar
                    </Button>
                    <Button 
                        variant="success" 
                        onClick={() => selectedEnrollment && handleApprove(selectedEnrollment.id)} 
                        disabled={actionLoading}
                    >
                        {actionLoading ? (
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
                                <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: '0.25rem' }}>check</span> Aprobar
                            </>
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal para rechazar inscripción */}
            <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)}>
                <Modal.Header closeButton style={{
                    background: darkMode ? '#374151' : '#f8f9fa',
                    color: darkMode ? '#e5e7eb' : '#212529'
                }}>
                    <Modal.Title>Rechazar Inscripción</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ background: darkMode ? '#1f2937' : '#fff' }}>
                    <p>¿Está seguro que desea rechazar esta inscripción?</p>
                    <p>Por favor, indique el motivo del rechazo:</p>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="Ingrese el motivo del rechazo..."
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer style={{
                    background: darkMode ? '#374151' : '#f8f9fa'
                }}>
                    <Button variant="secondary" onClick={() => {
                        setShowRejectModal(false);
                        setRejectReason('');
                    }} disabled={actionLoading}>
                        Cancelar
                    </Button>
                    <Button 
                        variant="danger" 
                        onClick={() => selectedEnrollment && handleReject(selectedEnrollment.id)} 
                        disabled={actionLoading}
                    >
                        {actionLoading ? (
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
                                <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: '0.25rem' }}>block</span> Rechazar
                            </>
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Modal para verificación de documentos */}
            <Modal
                show={showDocumentVerificationModal}
                onHide={() => {
                    setShowDocumentVerificationModal(false);
                    setDocuments([]);
                }}
                size="lg"
            >
                <Modal.Header closeButton style={{
                    background: darkMode ? '#374151' : '#f8f9fa',
                    color: darkMode ? '#e5e7eb' : '#212529'
                }}>
                    <Modal.Title>Verificación de Documentos</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ background: darkMode ? '#1f2937' : '#fff' }}>
                    {loadingDocuments ? (
                        <div className="text-center">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-2">Cargando documentos...</p>
                        </div>
                    ) : (
                        <div>
                            <div className="d-flex mb-3">
                                <Button
                                    variant={activeTabInternal === 'documents' ? 'primary' : 'outline-secondary'}
                                    size="sm"
                                    onClick={() => setActiveTabInternal('documents')}
                                    className="me-2"
                                >
                                    Documentos
                                </Button>
                                <Button
                                    variant={activeTabInternal === 'status' ? 'primary' : 'outline-secondary'}
                                    size="sm"
                                    onClick={() => setActiveTabInternal('status')}
                                >
                                    Revisión
                                </Button>
                            </div>

                            {activeTabInternal === 'documents' && (
                                <div>
                                    <h6>Documentos del Alumno</h6>
                                    {documents.length > 0 ? (
                                        <Table responsive hover>
                                            <thead>
                                                <tr>
                                                    <th>Tipo de Documento</th>
                                                    <th>Nombre de Archivo</th>
                                                    <th>Fecha de Subida</th>
                                                    <th>Verificado</th>
                                                    <th>Acción</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {documents.map((doc) => (
                                                    <tr key={doc.id}>
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                <span className="me-2">
                                                                    {doc.document_type === 'dni' && '🆔'}
                                                                    {doc.document_type === 'certificado_nacimiento' && '👶'}
                                                                    {doc.document_type === 'certificado_vacunas' && '💉'}
                                                                    {doc.document_type === 'certificado_medico' && '🏥'}
                                                                    {doc.document_type === 'autorizacion_firmada' && '✍️'}
                                                                    {doc.document_type === 'foto' && '📷'}
                                                                    {doc.document_type === 'otro' && '📄'}
                                                                </span>
                                                                <div>
                                                                    {doc.document_type.replace('_', ' ')}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>{doc.file_name}</td>
                                                        <td>{formatDate(doc.upload_date)}</td>
                                                        <td>
                                                            <Badge bg={doc.delivery_verified ? 'success' : 'warning'}>
                                                                {doc.delivery_verified ? 'Verificado' : 'Pendiente'}
                                                            </Badge>
                                                        </td>
                                                        <td>
                                                            <Button
                                                                variant={doc.delivery_verified ? 'outline-warning' : 'outline-success'}
                                                                size="sm"
                                                                onClick={() => toggleDocumentVerification(doc.id, doc.delivery_verified)}
                                                                disabled={docVerificationLoading[doc.id]}
                                                                className="me-1"
                                                            >
                                                                {docVerificationLoading[doc.id] ? (
                                                                    <Spinner as="span" size="sm" animation="border" />
                                                                ) : (
                                                                    doc.delivery_verified ? 'Desverificar' : 'Verificar'
                                                                )}
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    ) : (
                                        <p>No hay documentos para este alumno.</p>
                                    )}
                                </div>
                            )}

                            {activeTabInternal === 'status' && (
                                <div>
                                    <h6>Estado de Revisión</h6>
                                    <p>Use los checkboxes para confirmar visualmente cada documento entregado.</p>
                                    <p><strong>Regla:</strong> Puede aprobar para sorteo incluso si faltan documentos (<em>"si no entrego pasa a sorteo igual"</em>).</p>
                                    <p>Lo importante es confirmar visualmente (con checkboxes) los documentos que se entregaron.</p>
                                </div>
                            )}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer style={{
                    background: darkMode ? '#374151' : '#f8f9fa'
                }}>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setShowDocumentVerificationModal(false);
                            setDocuments([]);
                        }}
                    >
                        Cerrar
                    </Button>
                    <Button
                        variant="primary"
                        onClick={async () => {
                            if (selectedEnrollment && selectedEnrollment.id) {
                                try {
                                    setActionLoading(true);
                                    const token = localStorage.getItem('token');

                                    await axios.patch(
                                        `${API_URL}/api/enrollment-management/${selectedEnrollment.id}/approve-with-verification`,
                                        {},
                                        {
                                            headers: { Authorization: `Bearer ${token}` }
                                        }
                                    );

                                    setShowDocumentVerificationModal(false);
                                    setDocuments([]);
                                    loadEnrollments(); // Reload pending enrollments
                                    setError('Inscripción aprobada y estudiante movido a lista de sorteo');
                                } catch (error) {
                                    console.error('Error approving enrollment:', error);
                                    setError('Error al aprobar la inscripción: ' + (error.response?.data?.error || error.message));
                                } finally {
                                    setActionLoading(false);
                                }
                            }
                        }}
                        disabled={actionLoading}
                    >
                        {actionLoading ? (
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
                            'Aprobar para Sorteo'
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default EnrollmentsManagementPage;