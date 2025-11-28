// frontend/src/pages/EnrollmentsPage.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Form, InputGroup, Modal, Alert, Tabs, Tab } from 'react-bootstrap';
import EnrollmentForm from '../components/EnrollmentForm';
import EnrollmentDetail from '../components/EnrollmentDetail';
import EnrollmentStats from '../components/EnrollmentStats';

function EnrollmentsPage() {
    const [enrollments, setEnrollments] = useState([]);
    const [filteredEnrollments, setFilteredEnrollments] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showDetail, setShowDetail] = useState(false);
    const [activeTab, setActiveTab] = useState('all');
    
    // Filtros
    const [filters, setFilters] = useState({
        searchText: '',
        status: '',
        classroom: '',
        shift: ''
    });

    useEffect(() => {
        loadEnrollments();
        loadStats();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [enrollments, filters, activeTab]);

    const loadEnrollments = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/enrollments');
            const data = await response.json();
            
            if (data.success) {
                setEnrollments(data.data);
            }
        } catch (error) {
            console.error('Error al cargar inscripciones:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/enrollments/stats/summary?year=2026');
            const data = await response.json();
            
            if (data.success) {
                setStats(data.stats);
            }
        } catch (error) {
            console.error('Error al cargar estadísticas:', error);
        }
    };

    const applyFilters = () => {
        let filtered = [...enrollments];

        // Filtrar por tab
        if (activeTab !== 'all') {
            filtered = filtered.filter(e => e.status === activeTab);
        }

        // Filtrar por búsqueda
        if (filters.searchText) {
            const search = filters.searchText.toLowerCase();
            filtered = filtered.filter(e =>
                e.first_name?.toLowerCase().includes(search) ||
                e.paternal_surname?.toLowerCase().includes(search) ||
                e.maternal_surname?.toLowerCase().includes(search)
            );
        }

        // Filtrar por sala
        if (filters.classroom) {
            filtered = filtered.filter(e => e.classroom_name === filters.classroom);
        }

        // Filtrar por turno
        if (filters.shift) {
            filtered = filtered.filter(e => e.shift === filters.shift);
        }

        setFilteredEnrollments(filtered);
    };

    const handleViewDetail = async (studentId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/enrollments/${studentId}`);
            const data = await response.json();
            
            if (data.success) {
                setSelectedStudent(data.data);
                setShowDetail(true);
            }
        } catch (error) {
            console.error('Error al cargar detalle:', error);
        }
    };

    const handleUpdateStatus = async (studentId, newStatus, reason) => {
        try {
            const response = await fetch(`http://localhost:3000/api/enrollments/${studentId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus, reason })
            });

            const data = await response.json();
            
            if (data.success) {
                loadEnrollments();
                loadStats();
                alert('Estado actualizado exitosamente');
            }
        } catch (error) {
            console.error('Error al actualizar estado:', error);
        }
    };

    const getStatusBadge = (status) => {
        const variants = {
            inscripto: 'warning',
            activo: 'success',
            inactivo: 'secondary',
            egresado: 'info'
        };
        
        return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
    };

    const getCompletenessIndicator = (enrollment) => {
        const criticalFields = ['dni', 'birth_date', 'health_insurance', 'emergency_contact_name'];
        const missingCount = criticalFields.filter(field => !enrollment[field]).length;
        
        if (missingCount === 0) {
            return <Badge bg="success">Completo</Badge>;
        } else if (missingCount <= 2) {
            return <Badge bg="warning">Incompleto ({missingCount})</Badge>;
        } else {
            return <Badge bg="danger">Incompleto ({missingCount})</Badge>;
        }
    };

    if (loading) {
        return (
            <Container className="py-4">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                </div>
            </Container>
        );
    }

    return (
        <Container fluid className="py-3">
            <Row className="mb-3">
                <Col>
                    <h2>
                        <i className="material-icons align-middle">how_to_reg</i>
                        Inscripciones 2026
                    </h2>
                </Col>
                <Col xs="auto">
                    <Button 
                        variant="primary" 
                        onClick={() => setShowForm(true)}
                    >
                        <i className="material-icons align-middle">add</i>
                        Nueva Inscripción
                    </Button>
                </Col>
            </Row>

            {/* Estadísticas */}
            {stats && <EnrollmentStats stats={stats} />}

            {/* Filtros */}
            <Card className="mb-3">
                <Card.Body>
                    <Row className="g-2">
                        <Col md={4}>
                            <InputGroup size="sm">
                                <InputGroup.Text>
                                    <i className="material-icons" style={{ fontSize: '18px' }}>search</i>
                                </InputGroup.Text>
                                <Form.Control
                                    placeholder="Buscar por nombre o apellido..."
                                    value={filters.searchText}
                                    onChange={(e) => setFilters({ ...filters, searchText: e.target.value })}
                                />
                            </InputGroup>
                        </Col>
                        <Col md={3}>
                            <Form.Select
                                size="sm"
                                value={filters.classroom}
                                onChange={(e) => setFilters({ ...filters, classroom: e.target.value })}
                            >
                                <option value="">Todas las salas</option>
                                <option value="Sala 3">Sala 3</option>
                                <option value="Sala 4">Sala 4</option>
                                <option value="Sala 5">Sala 5</option>
                            </Form.Select>
                        </Col>
                        <Col md={2}>
                            <Form.Select
                                size="sm"
                                value={filters.shift}
                                onChange={(e) => setFilters({ ...filters, shift: e.target.value })}
                            >
                                <option value="">Todos los turnos</option>
                                <option value="Mañana">Mañana</option>
                                <option value="Tarde">Tarde</option>
                            </Form.Select>
                        </Col>
                        <Col md={3}>
                            <Button 
                                size="sm" 
                                variant="outline-secondary" 
                                onClick={() => setFilters({ searchText: '', status: '', classroom: '', shift: '' })}
                            >
                                <i className="material-icons align-middle" style={{ fontSize: '16px' }}>clear</i>
                                Limpiar Filtros
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Tabs por estado */}
            <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-3"
            >
                <Tab eventKey="all" title={`Todos (${enrollments.length})`}>
                </Tab>
                <Tab eventKey="inscripto" title={`Inscriptos (${enrollments.filter(e => e.status === 'inscripto').length})`}>
                </Tab>
                <Tab eventKey="activo" title={`Activos (${enrollments.filter(e => e.status === 'activo').length})`}>
                </Tab>
                <Tab eventKey="inactivo" title={`Inactivos (${enrollments.filter(e => e.status === 'inactivo').length})`}>
                </Tab>
            </Tabs>

            {/* Tabla de inscripciones */}
            <Card>
                <Card.Body className="p-0">
                    <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                        <Table hover size="sm" className="mb-0">
                            <thead style={{ position: 'sticky', top: 0, backgroundColor: 'var(--bs-body-bg)', zIndex: 1 }}>
                                <tr>
                                    <th>#</th>
                                    <th>Apellido y Nombre</th>
                                    <th>DNI</th>
                                    <th>Fecha Nac.</th>
                                    <th>Sala</th>
                                    <th>Turno</th>
                                    <th>Estado</th>
                                    <th>Completitud</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEnrollments.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" className="text-center py-4">
                                            No se encontraron inscripciones
                                        </td>
                                    </tr>
                                ) : (
                                    filteredEnrollments.map((enrollment, index) => (
                                        <tr key={enrollment.id}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <strong>
                                                    {enrollment.paternal_surname} {enrollment.maternal_surname} {enrollment.first_name}
                                                </strong>
                                            </td>
                                            <td>
                                                {enrollment.dni ? (
                                                    enrollment.dni
                                                ) : (
                                                    <Badge bg="danger" className="small">Sin DNI</Badge>
                                                )}
                                            </td>
                                            <td>
                                                {enrollment.birth_date ? (
                                                    new Date(enrollment.birth_date).toLocaleDateString()
                                                ) : (
                                                    <Badge bg="danger" className="small">Sin fecha</Badge>
                                                )}
                                            </td>
                                            <td>{enrollment.classroom_name || '-'}</td>
                                            <td>
                                                {enrollment.shift && (
                                                    <Badge bg={enrollment.shift === 'Mañana' ? 'info' : 'warning'}>
                                                        {enrollment.shift}
                                                    </Badge>
                                                )}
                                            </td>
                                            <td>{getStatusBadge(enrollment.status)}</td>
                                            <td>{getCompletenessIndicator(enrollment)}</td>
                                            <td>
                                                <Button
                                                    size="sm"
                                                    variant="outline-primary"
                                                    onClick={() => handleViewDetail(enrollment.id)}
                                                    title="Ver detalle"
                                                >
                                                    <i className="material-icons" style={{ fontSize: '16px' }}>visibility</i>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
                <Card.Footer className="text-muted small">
                    Mostrando {filteredEnrollments.length} de {enrollments.length} inscripciones
                </Card.Footer>
            </Card>

            {/* Modal de formulario */}
            <Modal 
                show={showForm} 
                onHide={() => setShowForm(false)}
                size="xl"
                fullscreen="md-down"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Nueva Inscripción</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <EnrollmentForm 
                        onSuccess={() => {
                            setShowForm(false);
                            loadEnrollments();
                            loadStats();
                        }}
                        onCancel={() => setShowForm(false)}
                    />
                </Modal.Body>
            </Modal>

            {/* Modal de detalle */}
            {selectedStudent && (
                <Modal 
                    show={showDetail} 
                    onHide={() => setShowDetail(false)}
                    size="xl"
                    fullscreen="md-down"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Detalle de Inscripción</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <EnrollmentDetail 
                            student={selectedStudent}
                            onUpdate={() => {
                                loadEnrollments();
                                loadStats();
                            }}
                            onStatusChange={handleUpdateStatus}
                        />
                    </Modal.Body>
                </Modal>
            )}
        </Container>
    );
}

export default EnrollmentsPage;
