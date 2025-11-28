// frontend/src/components/AssignStudentModal.jsx
import React, { useState } from 'react';
import { Modal, Button, Form, Table, Badge, Alert, Spinner, Row, Col } from 'react-bootstrap';

const AssignStudentModal = ({ show, onHide, sala, alumnos, loading, onAssign }) => {
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSala, setFilterSala] = useState('all');
    const [filterTurno, setFilterTurno] = useState('all');

    if (!sala) return null;

    // Obtener salas únicas de los alumnos
    const salasUnicas = [...new Set(alumnos
        .filter(a => a.sala && a.sala.id !== sala.id)
        .map(a => JSON.stringify({ id: a.sala.id, nombre: a.sala.nombre }))
    )].map(s => JSON.parse(s));

    // Filtrar alumnos disponibles (excluir los que ya están en esta sala)
    const alumnosFiltrados = alumnos.filter(alumno => {
        // Excluir alumnos que ya están en esta sala
        const notInThisClassroom = !alumno.sala || alumno.sala.id !== sala.id;
        
        // Filtrar por búsqueda
        const matchesSearch = searchTerm === '' || 
            `${alumno.nombre} ${alumno.apellidoPaterno} ${alumno.apellidoMaterno}`.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Filtrar por sala
        const matchesSala = filterSala === 'all' || 
            (filterSala === 'sin-asignar' && !alumno.sala) ||
            (filterSala !== 'sin-asignar' && alumno.sala && alumno.sala.id.toString() === filterSala);
        
        // Filtrar por turno
        const matchesTurno = filterTurno === 'all' || alumno.turno === filterTurno;
        
        return notInThisClassroom && matchesSearch && matchesSala && matchesTurno;
    });

    const handleAssign = () => {
        if (selectedStudent) {
            onAssign(selectedStudent.id, sala.id);
            setSelectedStudent(null);
            setSearchTerm('');
            setFilterSala('all');
            setFilterTurno('all');
        }
    };

    const handleClose = () => {
        setSelectedStudent(null);
        setSearchTerm('');
        setFilterSala('all');
        setFilterTurno('all');
        onHide();
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setFilterSala('all');
        setFilterTurno('all');
        setSelectedStudent(null);
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    <span className="material-icons" style={{fontSize: '1.5rem', verticalAlign: 'middle', marginRight: '0.5rem'}}>
                        person_add
                    </span>
                    Asignar Alumno a {sala.nombre}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Alert variant="info" className="mb-3">
                    <strong>Sala:</strong> {sala.nombre} | 
                    <strong> Capacidad:</strong> {sala.capacidad} | 
                    <strong> Asignados:</strong> {sala.asignados || 0} | 
                    <strong> Disponibles:</strong> {sala.capacidad - (sala.asignados || 0)}
                </Alert>

                {alumnosFiltrados.length > 0 && (
                    <Alert variant="secondary" className="mb-3">
                        <small>
                            <span className="material-icons" style={{fontSize: '1rem', verticalAlign: 'middle'}}>
                                info
                            </span> Los alumnos ya asignados a esta sala no se muestran en la lista
                        </small>
                    </Alert>
                )}

                <Row className="mb-3">
                    <Col md={12} className="mb-2">
                        <Form.Group>
                            <Form.Label>
                                <span className="material-icons" style={{fontSize: '1rem', verticalAlign: 'middle'}}>
                                    search
                                </span> Buscar por Nombre o Apellido
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ej: Juan Pérez..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>
                                <span className="material-icons" style={{fontSize: '1rem', verticalAlign: 'middle'}}>
                                    meeting_room
                                </span> Filtrar por Sala Actual
                            </Form.Label>
                            <Form.Select 
                                value={filterSala} 
                                onChange={(e) => setFilterSala(e.target.value)}
                            >
                                <option value="all">Todas las salas</option>
                                <option value="sin-asignar">Sin asignar</option>
                                {salasUnicas.map(s => (
                                    <option key={s.id} value={s.id}>{s.nombre}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>
                                <span className="material-icons" style={{fontSize: '1rem', verticalAlign: 'middle'}}>
                                    schedule
                                </span> Filtrar por Turno
                            </Form.Label>
                            <Form.Select 
                                value={filterTurno} 
                                onChange={(e) => setFilterTurno(e.target.value)}
                            >
                                <option value="all">Todos los turnos</option>
                                <option value="Mañana">Mañana</option>
                                <option value="Tarde">Tarde</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                <div className="mb-3 d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                        Mostrando {alumnosFiltrados.length} alumno{alumnosFiltrados.length !== 1 ? 's' : ''}
                    </small>
                    {(searchTerm || filterSala !== 'all' || filterTurno !== 'all') && (
                        <Button 
                            variant="outline-secondary" 
                            size="sm" 
                            onClick={handleClearFilters}
                        >
                            <span className="material-icons" style={{fontSize: '0.9rem', verticalAlign: 'middle'}}>
                                clear
                            </span> Limpiar filtros
                        </Button>
                    )}
                </div>

                {loading ? (
                    <div className="text-center py-4">
                        <Spinner animation="border" />
                        <p>Cargando alumnos...</p>
                    </div>
                ) : (
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        <Table striped bordered hover size="sm">
                            <thead style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
                                <tr>
                                    <th>Seleccionar</th>
                                    <th>Nombre</th>
                                    <th>Sala Actual</th>
                                    <th>Turno</th>
                                </tr>
                            </thead>
                            <tbody>
                                {alumnosFiltrados.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="text-center text-muted">
                                            No se encontraron alumnos
                                        </td>
                                    </tr>
                                ) : (
                                    alumnosFiltrados.map((alumno) => (
                                        <tr 
                                            key={alumno.id}
                                            onClick={() => setSelectedStudent(alumno)}
                                            style={{ 
                                                cursor: 'pointer',
                                                backgroundColor: selectedStudent?.id === alumno.id ? '#e7f3ff' : 'transparent'
                                            }}
                                        >
                                            <td className="text-center">
                                                <Form.Check
                                                    type="radio"
                                                    checked={selectedStudent?.id === alumno.id}
                                                    onChange={() => setSelectedStudent(alumno)}
                                                />
                                            </td>
                                            <td>
                                                <strong>{alumno.nombre} {alumno.apellidoPaterno} {alumno.apellidoMaterno}</strong>
                                                {alumno.apodo && <small className="text-muted"> ({alumno.apodo})</small>}
                                            </td>
                                            <td>
                                                {alumno.sala ? (
                                                    <Badge bg="secondary">{alumno.sala.nombre}</Badge>
                                                ) : (
                                                    <Badge bg="warning" text="dark">Sin asignar</Badge>
                                                )}
                                            </td>
                                            <td>
                                                <Badge bg={alumno.turno === 'Mañana' ? 'info' : 'dark'}>
                                                    {alumno.turno}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancelar
                </Button>
                <Button 
                    variant="primary" 
                    onClick={handleAssign}
                    disabled={!selectedStudent}
                >
                    <span className="material-icons" style={{fontSize: '1rem', verticalAlign: 'middle'}}>
                        check
                    </span> Asignar Alumno
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AssignStudentModal;
