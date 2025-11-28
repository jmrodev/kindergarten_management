// frontend/src/components/AssignedStudentsModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Table, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import StudentDetail from './StudentDetail';

const AssignedStudentsModal = ({ show, onHide, sala, alumnos, loading }) => {
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showStudentDetail, setShowStudentDetail] = useState(false);

    if (!sala) return null;

    // Filtrar alumnos asignados a esta sala
    const alumnosAsignados = alumnos.filter(alumno => 
        alumno.sala && alumno.sala.id === sala.id
    );

    const handleViewStudent = (student) => {
        setSelectedStudent(student);
        setShowStudentDetail(true);
    };

    const handleCloseStudentDetail = () => {
        setShowStudentDetail(false);
        setSelectedStudent(null);
    };

    const calcularEdad = (fechaNacimiento) => {
        if (!fechaNacimiento) return 'N/A';
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        return edad;
    };

    return (
        <>
            <Modal show={show && !showStudentDetail} onHide={onHide} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <span className="material-icons" style={{fontSize: '1.5rem', verticalAlign: 'middle', marginRight: '0.5rem'}}>
                            people
                        </span>
                        Alumnos de {sala.nombre}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Alert variant="info" className="mb-3">
                        <strong>Sala:</strong> {sala.nombre} | 
                        <strong> Capacidad:</strong> {sala.capacidad} | 
                        <strong> Asignados:</strong> {sala.asignados || 0} | 
                        <strong> Disponibles:</strong> {sala.capacidad - (sala.asignados || 0)}
                    </Alert>

                    {loading ? (
                        <div className="text-center py-4">
                            <Spinner animation="border" />
                            <p>Cargando alumnos...</p>
                        </div>
                    ) : alumnosAsignados.length === 0 ? (
                        <Alert variant="secondary">
                            <span className="material-icons" style={{fontSize: '1.2rem', verticalAlign: 'middle'}}>
                                info
                            </span> No hay alumnos asignados a esta sala
                        </Alert>
                    ) : (
                        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                            <Table striped bordered hover>
                                <thead style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
                                    <tr>
                                        <th>#</th>
                                        <th>Nombre Completo</th>
                                        <th>Edad</th>
                                        <th>Turno</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {alumnosAsignados.map((alumno, index) => (
                                        <tr key={alumno.id}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <strong>
                                                    {alumno.nombre} {alumno.apellidoPaterno} {alumno.apellidoMaterno}
                                                </strong>
                                                {alumno.apodo && (
                                                    <small className="text-muted d-block">
                                                        ({alumno.apodo})
                                                    </small>
                                                )}
                                            </td>
                                            <td>
                                                <Badge bg="secondary">
                                                    {calcularEdad(alumno.fechaNacimiento)} años
                                                </Badge>
                                            </td>
                                            <td>
                                                <Badge bg={alumno.turno === 'Mañana' ? 'info' : 'dark'}>
                                                    {alumno.turno}
                                                </Badge>
                                            </td>
                                            <td>
                                                <Button 
                                                    variant="primary" 
                                                    size="sm"
                                                    onClick={() => handleViewStudent(alumno)}
                                                >
                                                    <span className="material-icons" style={{fontSize: '0.9rem', verticalAlign: 'middle'}}>
                                                        visibility
                                                    </span> Ver Detalles
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <div className="w-100 d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                            Total: {alumnosAsignados.length} alumno{alumnosAsignados.length !== 1 ? 's' : ''}
                        </small>
                        <Button variant="secondary" onClick={onHide}>
                            Cerrar
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>

            {/* Modal de detalle del estudiante */}
            <StudentDetail 
                student={selectedStudent}
                show={showStudentDetail}
                onHide={handleCloseStudentDetail}
            />
        </>
    );
};

export default AssignedStudentsModal;
