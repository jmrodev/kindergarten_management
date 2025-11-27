// frontend/src/components/StudentDetail.jsx
import React from 'react';
import { Modal, ListGroup, Row, Col, Badge, Button } from 'react-bootstrap';

const StudentDetail = ({ student, show, onHide }) => {
    if (!student) {
        return null;
    }

    const calcularEdad = (fechaNacimiento) => {
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
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title>
                    👶 {student.nombre} {student.apellidoPaterno}
                    {student.alias && <Badge bg="light" text="dark" className="ms-2">"{student.alias}"</Badge>}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col md={6}>
                        <h6 className="text-primary mb-3">
                            <i className="bi bi-person-fill me-2"></i>
                            Información Personal
                        </h6>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <strong>Nombre Completo:</strong><br/>
                                {student.nombre} {student.segundoNombre} {student.tercerNombre} {student.apellidoPaterno} {student.apellidoMaterno}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Fecha de Nacimiento:</strong><br/>
                                {new Date(student.fechaNacimiento).toLocaleDateString('es-AR')}
                                <Badge bg="secondary" className="ms-2">{calcularEdad(student.fechaNacimiento)} años</Badge>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Turno:</strong> <Badge bg={
                                    student.turno === 'Mañana' ? 'warning' :
                                    student.turno === 'Tarde' ? 'secondary' :
                                    'success'
                                }>{student.turno}</Badge>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Sala:</strong> <Badge bg="info">{student.sala ? student.sala.nombre : 'N/A'}</Badge>
                            </ListGroup.Item>
                        </ListGroup>

                        <h6 className="text-primary mb-3 mt-4">
                            <i className="bi bi-geo-alt-fill me-2"></i>
                            Dirección
                        </h6>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <strong>Calle y Número:</strong><br/>
                                {student.direccion?.calle} {student.direccion?.numero}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Ciudad:</strong> {student.direccion?.ciudad}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Provincia:</strong> {student.direccion?.provincia}
                            </ListGroup.Item>
                            {student.direccion?.codigoPostal && (
                                <ListGroup.Item>
                                    <strong>Código Postal:</strong> {student.direccion.codigoPostal}
                                </ListGroup.Item>
                            )}
                        </ListGroup>
                    </Col>

                    <Col md={6}>
                        <h6 className="text-danger mb-3">
                            <i className="bi bi-telephone-fill me-2"></i>
                            Contacto de Emergencia
                        </h6>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <strong>Nombre:</strong><br/>
                                {student.contactoEmergencia?.nombreCompleto}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Relación:</strong><br/>
                                {student.contactoEmergencia?.relacion}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Teléfono:</strong><br/>
                                <a href={`tel:${student.contactoEmergencia?.telefono}`} className="text-decoration-none">
                                    📞 {student.contactoEmergencia?.telefono}
                                </a>
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default StudentDetail;
