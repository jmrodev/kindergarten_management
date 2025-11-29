import { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Badge, Modal, Alert, Spinner, Row, Col, Form } from 'react-bootstrap';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { usePermissions } from '../context/PermissionsContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function LotteryManagementPage({ darkMode }) {
    const { user } = useAuth();
    const { can } = usePermissions();
    const [pendingStudents, setPendingStudents] = useState([]);
    const [completedStudents, setCompletedStudents] = useState([]);
    const [activeTab, setActiveTab] = useState('pending');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showAcceptModal, setShowAcceptModal] = useState(false);
    const [showPendingDocsModal, setShowPendingDocsModal] = useState(false);
    const [classroomId, setClassroomId] = useState('');
    const [pendingDocumentation, setPendingDocumentation] = useState([]);
    const [availableClassrooms, setAvailableClassrooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadStudents();
        loadClassrooms();
    }, []);

    const loadStudents = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            const [pendingRes, completedRes] = await Promise.all([
                axios.get(`${API_URL}/api/lottery/pending`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`${API_URL}/api/lottery/completed`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            setPendingStudents(pendingRes.data.data || []);
            setCompletedStudents(completedRes.data.data || []);
        } catch (error) {
            console.error('Error loading lottery students:', error);
            setError('Error al cargar alumnos en lista de sorteo');
        } finally {
            setLoading(false);
        }
    };

    const loadClassrooms = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/api/classrooms`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAvailableClassrooms(response.data || []);
        } catch (error) {
            console.error('Error loading classrooms:', error);
        }
    };

    const handleAcceptStudent = async () => {
        if (!classroomId) {
            setError('Debe seleccionar una sala para aceptar al alumno');
            return;
        }

        try {
            setActionLoading(true);
            const token = localStorage.getItem('token');
            
            await axios.patch(
                `${API_URL}/api/lottery/${selectedStudent.id}/accept`, 
                { 
                    classroomId,
                    pendingDocumentation: pendingDocumentation.filter(doc => doc.pending)
                }, 
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setShowAcceptModal(false);
            setClassroomId('');
            setPendingDocumentation([]);
            loadStudents(); // Reload to reflect changes
        } catch (error) {
            console.error('Error accepting student:', error);
            setError('Error al aceptar alumno: ' + (error.response?.data?.error || error.message));
        } finally {
            setActionLoading(false);
        }
    };

    const handleViewPendingDocs = async (studentId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/api/lottery/pending-documentation/${studentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSelectedStudent(prev => ({ ...prev, pendingDocs: response.data.data }));
            setShowPendingDocsModal(true);
        } catch (error) {
            console.error('Error loading pending documentation:', error);
            setError('Error al cargar documentación pendiente');
        }
    };

    const getStatusBadgeVariant = (status) => {
        const variants = {
            'sorteo': 'warning',
            'inscripto': 'success',
            'activo': 'primary',
            'inactivo': 'secondary',
            'egresado': 'info',
            'rechazado': 'danger'
        };
        return variants[status] || 'dark';
    };

    const getStatusText = (status) => {
        const texts = {
            'sorteo': 'En Sorteo',
            'inscripto': 'Inscripto',
            'activo': 'Activo',
            'inactivo': 'Inactivo',
            'egresado': 'Egresado',
            'rechazado': 'Rechazado'
        };
        return texts[status] || status;
    };

    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'dd/MM/yyyy', { locale: es });
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

    const currentStudents = activeTab === 'pending' ? pendingStudents : completedStudents;

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
                            shuffle
                        </span>
                        Lista de Sorteo
                    </h2>
                    <p style={{ color: darkMode ? '#9ca3af' : '#6c757d', marginBottom: 0 }}>
                        Gestión de alumnos en lista de sorteo y aceptación final
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
                            Alumnos {activeTab === 'pending' ? 'en Lista de Sorteo' : 'Aceptados'}
                            {activeTab === 'pending' && (
                                <Badge bg="warning" className="ms-2">
                                    {pendingStudents.length}
                                </Badge>
                            )}
                        </div>
                        <div className="btn-group" role="group">
                            <Button
                                variant={activeTab === 'pending' ? 'primary' : 'outline-secondary'}
                                size="sm"
                                onClick={() => setActiveTab('pending')}
                            >
                                En Sorteo
                            </Button>
                            <Button
                                variant={activeTab === 'completed' ? 'primary' : 'outline-secondary'}
                                size="sm"
                                onClick={() => setActiveTab('completed')}
                            >
                                Aceptados
                            </Button>
                        </div>
                    </div>
                </Card.Header>
                <Card.Body>
                    {loading ? (
                        <div className="text-center">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-2">Cargando alumnos...</p>
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
                                    <th>DNI</th>
                                    <th>Fecha de Ingreso a Sorteo</th>
                                    <th>Turno</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentStudents.length > 0 ? (
                                    currentStudents.map(student => (
                                        <tr key={student.id}>
                                            <td>{student.id}</td>
                                            <td>
                                                {student.first_name} {student.paternal_surname} {student.maternal_surname}
                                            </td>
                                            <td>{student.dni}</td>
                                            <td>{student.approved_at ? formatDate(student.approved_at) : 'N/A'}</td>
                                            <td>
                                                <Badge bg="info">
                                                    {student.shift}
                                                </Badge>
                                            </td>
                                            <td>
                                                <Badge bg={getStatusBadgeVariant(student.status)}>
                                                    {getStatusText(student.status)}
                                                </Badge>
                                            </td>
                                            <td>
                                                {activeTab === 'pending' && (
                                                    <>
                                                        <Button
                                                            variant="success"
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedStudent(student);
                                                                setShowAcceptModal(true);
                                                            }}
                                                            className="me-1"
                                                        >
                                                            <span className="material-icons" style={{ fontSize: '1rem' }}>check</span> Aceptar
                                                        </Button>
                                                    </>
                                                )}
                                                <Button
                                                    variant="outline-info"
                                                    size="sm"
                                                    onClick={() => handleViewPendingDocs(student.id)}
                                                    className="me-1"
                                                >
                                                    <span className="material-icons" style={{ fontSize: '1rem' }}>description</span> Docs
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center">
                                            {activeTab === 'pending'
                                                ? 'No hay alumnos en la lista de sorteo.'
                                                : 'No hay alumnos aceptados del sorteo.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>

            {/* Modal para aceptar alumno en sala */}
            <Modal show={showAcceptModal} onHide={() => setShowAcceptModal(false)}>
                <Modal.Header closeButton style={{
                    background: darkMode ? '#374151' : '#f8f9fa',
                    color: darkMode ? '#e5e7eb' : '#212529'
                }}>
                    <Modal.Title>
                        <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: '0.5rem' }}>
                            check_circle
                        </span>
                        Aceptar Alumno en Sala
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ background: darkMode ? '#1f2937' : '#fff' }}>
                    {selectedStudent && (
                        <div>
                            <p><strong>Alumno:</strong> {selectedStudent.first_name} {selectedStudent.paternal_surname}</p>
                            <p><strong>DNI:</strong> {selectedStudent.dni}</p>
                            <p><strong>Turno:</strong> {selectedStudent.shift}</p>
                            
                            <Form.Group className="mb-3">
                                <Form.Label>Sala de Destino:</Form.Label>
                                <Form.Select
                                    value={classroomId}
                                    onChange={(e) => setClassroomId(e.target.value)}
                                    disabled={actionLoading}
                                >
                                    <option value="">Seleccionar sala</option>
                                    {availableClassrooms.map(classroom => (
                                        <option key={classroom.id} value={classroom.id}>
                                            {classroom.nombre || classroom.name} - Capacidad: {classroom.capacidad || classroom.capacity}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            
                            <Form.Group className="mb-3">
                                <Form.Label>Documentación Pendiente (a controlar):</Form.Label>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="dniStudent"
                                        onChange={(e) => {
                                            const exists = pendingDocumentation.findIndex(doc => doc.type === 'dni_alumno');
                                            if (e.target.checked) {
                                                if (exists === -1) {
                                                    setPendingDocumentation([...pendingDocumentation, {
                                                        type: 'dni_alumno',
                                                        pending: true,
                                                        name: 'DNI Alumno'
                                                    }]);
                                                }
                                            } else {
                                                if (exists !== -1) {
                                                    const updated = [...pendingDocumentation];
                                                    updated.splice(exists, 1);
                                                    setPendingDocumentation(updated);
                                                }
                                            }
                                        }}
                                    />
                                    <label className="form-check-label" htmlFor="dniStudent">
                                        DNI Alumno
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="dniGuardian"
                                        onChange={(e) => {
                                            const exists = pendingDocumentation.findIndex(doc => doc.type === 'dni_responsable');
                                            if (e.target.checked) {
                                                if (exists === -1) {
                                                    setPendingDocumentation([...pendingDocumentation, {
                                                        type: 'dni_responsable',
                                                        pending: true,
                                                        name: 'DNI Responsable'
                                                    }]);
                                                }
                                            } else {
                                                if (exists !== -1) {
                                                    const updated = [...pendingDocumentation];
                                                    updated.splice(exists, 1);
                                                    setPendingDocumentation(updated);
                                                }
                                            }
                                        }}
                                    />
                                    <label className="form-check-label" htmlFor="dniGuardian">
                                        DNI Responsable
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="birthCertificate"
                                        onChange={(e) => {
                                            const exists = pendingDocumentation.findIndex(doc => doc.type === 'certificado_nacimiento');
                                            if (e.target.checked) {
                                                if (exists === -1) {
                                                    setPendingDocumentation([...pendingDocumentation, {
                                                        type: 'certificado_nacimiento',
                                                        pending: true,
                                                        name: 'Certificado de Nacimiento'
                                                    }]);
                                                }
                                            } else {
                                                if (exists !== -1) {
                                                    const updated = [...pendingDocumentation];
                                                    updated.splice(exists, 1);
                                                    setPendingDocumentation(updated);
                                                }
                                            }
                                        }}
                                    />
                                    <label className="form-check-label" htmlFor="birthCertificate">
                                        Certificado de Nacimiento
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="vaccination"
                                        onChange={(e) => {
                                            const exists = pendingDocumentation.findIndex(doc => doc.type === 'certificado_vacunas');
                                            if (e.target.checked) {
                                                if (exists === -1) {
                                                    setPendingDocumentation([...pendingDocumentation, {
                                                        type: 'certificado_vacunas',
                                                        pending: true,
                                                        name: 'Certificado de Vacunas'
                                                    }]);
                                                }
                                            } else {
                                                if (exists !== -1) {
                                                    const updated = [...pendingDocumentation];
                                                    updated.splice(exists, 1);
                                                    setPendingDocumentation(updated);
                                                }
                                            }
                                        }}
                                    />
                                    <label className="form-check-label" htmlFor="vaccination">
                                        Certificado de Vacunas
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="medical"
                                        onChange={(e) => {
                                            const exists = pendingDocumentation.findIndex(doc => doc.type === 'certificado_medico');
                                            if (e.target.checked) {
                                                if (exists === -1) {
                                                    setPendingDocumentation([...pendingDocumentation, {
                                                        type: 'certificado_medico',
                                                        pending: true,
                                                        name: 'Certificado Médico'
                                                    }]);
                                                }
                                            } else {
                                                if (exists !== -1) {
                                                    const updated = [...pendingDocumentation];
                                                    updated.splice(exists, 1);
                                                    setPendingDocumentation(updated);
                                                }
                                            }
                                        }}
                                    />
                                    <label className="form-check-label" htmlFor="medical">
                                        Certificado Médico
                                    </label>
                                </div>
                            </Form.Group>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer style={{
                    background: darkMode ? '#374151' : '#f8f9fa'
                }}>
                    <Button variant="secondary" onClick={() => {
                        setShowAcceptModal(false);
                        setSelectedStudent(null);
                        setClassroomId('');
                        setPendingDocumentation([]);
                    }} disabled={actionLoading}>
                        Cancelar
                    </Button>
                    <Button 
                        variant="success" 
                        onClick={handleAcceptStudent} 
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
                                <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: '0.25rem' }}>check</span> Aceptar Alumno
                            </>
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal para ver documentación pendiente */}
            <Modal show={showPendingDocsModal} onHide={() => setShowPendingDocsModal(false)}>
                <Modal.Header closeButton style={{
                    background: darkMode ? '#374151' : '#f8f9fa',
                    color: darkMode ? '#e5e7eb' : '#212529'
                }}>
                    <Modal.Title>
                        <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: '0.5rem' }}>
                            description
                        </span>
                        Documentación Pendiente
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ background: darkMode ? '#1f2937' : '#fff' }}>
                    {selectedStudent && selectedStudent.pendingDocs && selectedStudent.pendingDocs.length > 0 ? (
                        <Table responsive>
                            <thead>
                                <tr>
                                    <th>Tipo</th>
                                    <th>Notas</th>
                                    <th>Fecha de Requerimiento</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedStudent.pendingDocs.map(doc => (
                                    <tr key={doc.id}>
                                        <td>{doc.document_type}</td>
                                        <td>{doc.notes || 'N/A'}</td>
                                        <td>{doc.created_at ? formatDate(doc.created_at) : 'N/A'}</td>
                                        <td>
                                            {doc.completed_at ? (
                                                <Badge bg="success">Completado</Badge>
                                            ) : (
                                                <Badge bg="warning">Pendiente</Badge>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <p>No hay documentación pendiente registrada para este alumno.</p>
                    )}
                </Modal.Body>
                <Modal.Footer style={{
                    background: darkMode ? '#374151' : '#f8f9fa'
                }}>
                    <Button variant="secondary" onClick={() => {
                        setShowPendingDocsModal(false);
                        setSelectedStudent(null);
                    }}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default LotteryManagementPage;