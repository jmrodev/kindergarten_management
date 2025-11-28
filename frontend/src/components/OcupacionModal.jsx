// frontend/src/components/OcupacionModal.jsx
import React from 'react';
import { Modal, Badge, ProgressBar, Row, Col, Table } from 'react-bootstrap';
import { getClassroomStatus } from '../utils/classroomStatus';

const OcupacionModal = ({ show, onHide, salas }) => {
    const salasValidas = salas || [];
    const haySalas = salasValidas.length > 0;

    const capacidadTotal = salasValidas.reduce((sum, s) => sum + s.capacidad, 0);
    const ocupacionTotal = salasValidas.reduce((sum, s) => sum + (s.asignados || 0), 0);
    const porcentajeOcupacion = capacidadTotal > 0 ? (ocupacionTotal / capacidadTotal) * 100 : 0;
    const espaciosDisponibles = capacidadTotal - ocupacionTotal;

    const salasVacias = salasValidas.filter(s => s.asignados === 0).length;
    const salasDisponibles = salasValidas.filter(s => s.asignados > 0 && s.asignados < s.capacidad).length;
    const salasCompletas = salasValidas.filter(s => s.asignados === s.capacidad).length;
    const salasSobrepasadas = salasValidas.filter(s => s.asignados > s.capacidad).length;

    // Ordenar salas por ocupación descendente
    const salasOrdenadas = [...salasValidas].sort((a, b) => {
        const ocupA = (a.asignados / a.capacidad) * 100;
        const ocupB = (b.asignados / b.capacidad) * 100;
        return ocupB - ocupA;
    });

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    <span className="material-icons" style={{fontSize: '1.5rem', verticalAlign: 'middle', marginRight: '0.5rem'}}>
                        pie_chart
                    </span>
                    Detalle de Ocupación
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Resumen general */}
                <div className="mb-3 p-3 bg-light rounded">
                    <Row className="text-center">
                        <Col md={3}>
                            <h4 className="mb-0 text-primary">{ocupacionTotal}</h4>
                            <small className="text-muted">Ocupados</small>
                        </Col>
                        <Col md={3}>
                            <h4 className="mb-0 text-success">{espaciosDisponibles}</h4>
                            <small className="text-muted">Disponibles</small>
                        </Col>
                        <Col md={3}>
                            <h4 className="mb-0 text-info">{capacidadTotal}</h4>
                            <small className="text-muted">Capacidad Total</small>
                        </Col>
                        <Col md={3}>
                            <h4 className="mb-0" style={{
                                color: porcentajeOcupacion > 90 ? '#f5576c' : porcentajeOcupacion > 70 ? '#f39c12' : '#38ef7d'
                            }}>
                                {porcentajeOcupacion.toFixed(1)}%
                            </h4>
                            <small className="text-muted">Ocupación</small>
                        </Col>
                    </Row>
                    
                    <ProgressBar className="mt-3" style={{ height: '25px' }}>
                        <ProgressBar 
                            variant="success" 
                            now={(ocupacionTotal / capacidadTotal) * 100} 
                            label={`${ocupacionTotal}`}
                        />
                    </ProgressBar>
                </div>

                {/* Estadísticas por estado */}
                <Row className="mb-3">
                    <Col md={3} className="text-center">
                        <Badge bg="secondary" className="p-2 w-100">
                            <div className="d-flex flex-column">
                                <span style={{fontSize: '1.5rem'}}>{salasVacias}</span>
                                <small>Vacías</small>
                            </div>
                        </Badge>
                    </Col>
                    <Col md={3} className="text-center">
                        <Badge bg="success" className="p-2 w-100">
                            <div className="d-flex flex-column">
                                <span style={{fontSize: '1.5rem'}}>{salasDisponibles}</span>
                                <small>Con Espacio</small>
                            </div>
                        </Badge>
                    </Col>
                    <Col md={3} className="text-center">
                        <Badge bg="warning" className="p-2 w-100">
                            <div className="d-flex flex-column">
                                <span style={{fontSize: '1.5rem'}}>{salasCompletas}</span>
                                <small>Completas</small>
                            </div>
                        </Badge>
                    </Col>
                    <Col md={3} className="text-center">
                        <Badge bg="danger" className="p-2 w-100">
                            <div className="d-flex flex-column">
                                <span style={{fontSize: '1.5rem'}}>{salasSobrepasadas}</span>
                                <small>Sobrepasadas</small>
                            </div>
                        </Badge>
                    </Col>
                </Row>

                {/* Tabla de salas */}
                <h6 className="mb-2">
                    <span className="material-icons" style={{fontSize: '1rem', verticalAlign: 'middle'}}>
                        list
                    </span> Detalle por Sala
                </h6>
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <Table striped bordered hover size="sm">
                        <thead style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
                            <tr>
                                <th>#</th>
                                <th>Sala</th>
                                <th>Asignados</th>
                                <th>Capacidad</th>
                                <th>Disponibles</th>
                                <th>%</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!haySalas ? (
                                <tr>
                                    <td colSpan="7" className="text-center text-muted py-4">
                                        <span className="material-icons d-block" style={{fontSize: '3rem', opacity: 0.3}}>
                                            meeting_room
                                        </span>
                                        No hay salas registradas
                                    </td>
                                </tr>
                            ) : (
                                salasOrdenadas.map((sala, index) => {
                                    const status = getClassroomStatus(sala.asignados, sala.capacidad);
                                    const porcentaje = sala.capacidad > 0 ? ((sala.asignados / sala.capacidad) * 100).toFixed(1) : 0;
                                    const disponibles = sala.capacidad - (sala.asignados || 0);
                                    
                                    return (
                                        <tr key={sala.id}>
                                            <td>{index + 1}</td>
                                            <td><strong>{sala.nombre}</strong></td>
                                            <td className="text-center">
                                                <Badge bg="info">{sala.asignados || 0}</Badge>
                                            </td>
                                            <td className="text-center">
                                                <Badge bg="primary">{sala.capacidad}</Badge>
                                            </td>
                                            <td className="text-center">
                                                <Badge bg={disponibles > 0 ? 'success' : 'secondary'}>
                                                    {disponibles}
                                                </Badge>
                                            </td>
                                            <td className="text-center">
                                                <strong style={{
                                                    color: porcentaje >= 100 ? '#f5576c' : porcentaje >= 90 ? '#f39c12' : '#38ef7d'
                                                }}>
                                                    {porcentaje}%
                                                </strong>
                                            </td>
                                            <td>
                                                <Badge bg={status.variant}>
                                                    {status.label}
                                                </Badge>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </Table>
                </div>

                {/* Leyenda */}
                <div className="mt-3 p-2 bg-light rounded">
                    <small className="text-muted">
                        <strong>Estados:</strong> 
                        <Badge bg="secondary" className="ms-2 me-1">Vacía</Badge> 0 asignados |
                        <Badge bg="success" className="ms-2 me-1">Banca Disponible</Badge> &lt; capacidad |
                        <Badge bg="warning" className="ms-2 me-1">Completa</Badge> = capacidad |
                        <Badge bg="danger" className="ms-2 me-1">Sobrepasada</Badge> &gt; capacidad
                    </small>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default OcupacionModal;
