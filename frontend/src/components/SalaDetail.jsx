// frontend/src/components/SalaDetail.jsx
import React from 'react';
import { Modal, ListGroup, Badge, Row, Col, ProgressBar } from 'react-bootstrap';
import { getClassroomStatus, getAvailableSpaces } from '../utils/classroomStatus';

const SalaDetail = ({ sala, show, onHide }) => {
    if (!sala) {
        return null;
    }

    const status = getClassroomStatus(sala.asignados, sala.capacidad);
    const disponibles = getAvailableSpaces(sala.asignados, sala.capacidad);
    const porcentajeOcupacion = (sala.asignados / sala.capacidad) * 100;

    const getTurnoIcon = (turno) => {
        if (turno === 'Mañana') return '🌅';
        if (turno === 'Tarde') return '🌆';
        return '⏰';
    };

    return (
        <Modal show={show} onHide={onHide} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    <span className="material-icons" style={{fontSize: '1.5rem', verticalAlign: 'middle', marginRight: '0.5rem'}}>
                        meeting_room
                    </span>
                    Detalles de la Sala
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ListGroup variant="flush">
                    <ListGroup.Item>
                        <strong>ID:</strong> <Badge bg="secondary">{sala.id}</Badge>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <strong>Nombre:</strong> {sala.nombre}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <strong>Turno:</strong>{' '}
                        <Badge bg={sala.turno === 'Mañana' ? 'warning' : sala.turno === 'Tarde' ? 'info' : 'secondary'}>
                            {getTurnoIcon(sala.turno)} {sala.turno}
                        </Badge>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <strong>Maestro/a:</strong>{' '}
                        {sala.maestros ? (
                            <span>
                                <span className="material-icons" style={{ fontSize: '1rem', verticalAlign: 'middle', color: '#10b981' }}>
                                    person
                                </span> {sala.maestros}
                            </span>
                        ) : (
                            <Badge bg="secondary">Sin asignar</Badge>
                        )}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <strong>Capacidad Total:</strong> <Badge bg="primary">{sala.capacidad} niños</Badge>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Row>
                            <Col xs={6}>
                                <strong>Asignados:</strong> <Badge bg="info">{sala.asignados || 0}</Badge>
                            </Col>
                            <Col xs={6}>
                                <strong>Disponibles:</strong> <Badge bg={disponibles > 0 ? 'success' : 'secondary'}>{disponibles}</Badge>
                            </Col>
                        </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <strong>Ocupación:</strong>
                        <ProgressBar 
                            now={porcentajeOcupacion} 
                            label={`${porcentajeOcupacion.toFixed(0)}%`}
                            variant={porcentajeOcupacion > 100 ? 'danger' : porcentajeOcupacion === 100 ? 'warning' : 'success'}
                            className="mt-2"
                        />
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <strong>Estado:</strong>{' '}
                        <Badge bg={status.variant} className="ms-2">
                            <span className="material-icons" style={{fontSize: '0.9rem', verticalAlign: 'middle'}}>
                                {status.icon}
                            </span> {status.estado}
                        </Badge>
                    </ListGroup.Item>
                </ListGroup>
            </Modal.Body>
        </Modal>
    );
};

export default SalaDetail;
