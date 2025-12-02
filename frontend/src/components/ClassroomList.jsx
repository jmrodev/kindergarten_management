// frontend/src/components/ClassroomList.jsx
import React from 'react';
import { Table, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { getClassroomStatus, getAvailableSpaces } from '../utils/classroomStatus';

const ClassroomList = ({ salas, loading, onEdit, onDelete, onSelect, onAssignStudent, onShowMessage, onViewAssigned }) => {
    if (loading) {
        return (
            <div className="text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Cargando salas...</span>
                </Spinner>
                <p>Cargando salas...</p>
            </div>
        );
    }

    if (!salas) {
        return <Alert variant="info">No hay datos disponibles.</Alert>;
    }

    return (
        <div>
            <h2>Listado de Salas</h2>
            {Array.isArray(salas) && salas.length === 0 ? (
                <Alert variant="info">No hay salas registradas.</Alert>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Turno</th>
                            <th>Maestro/a</th>
                            <th>Capacidad</th>
                            <th>Asignados</th>
                            <th>Disponibles</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(salas) ? salas.map((sala) => {
                            const status = getClassroomStatus(sala.asignados, sala.capacidad);
                            const disponibles = getAvailableSpaces(sala.asignados, sala.capacidad);
                            
                            const getTurnoIcon = (turno) => {
                                if (turno === 'Mañana') return '🌅';
                                if (turno === 'Tarde') return '🌆';
                                return '⏰';
                            };
                            
                            return (
                                <tr key={sala.id} onClick={() => onSelect(sala)} style={{ cursor: 'pointer' }}>
                                    <td>{sala.id}</td>
                                    <td><strong>{sala.nombre}</strong></td>
                                    <td>
                                        <Badge bg={sala.turno === 'Mañana' ? 'warning' : sala.turno === 'Tarde' ? 'info' : 'secondary'}>
                                            {getTurnoIcon(sala.turno)} {sala.turno}
                                        </Badge>
                                    </td>
                                    <td>
                                        {sala.maestros ? (
                                            <div style={{ fontSize: '0.9rem' }}>
                                                <span className="material-icons" style={{ fontSize: '0.9rem', verticalAlign: 'middle', color: '#10b981' }}>
                                                    person
                                                </span> {sala.maestros}
                                            </div>
                                        ) : (
                                            <Badge bg="secondary">Sin asignar</Badge>
                                        )}
                                    </td>
                                    <td>
                                        <Badge bg="primary">{sala.capacidad} niños</Badge>
                                    </td>
                                    <td onClick={(e) => e.stopPropagation()}>
                                        <Badge 
                                            bg="info" 
                                            style={{ cursor: sala.asignados > 0 ? 'pointer' : 'default' }}
                                            onClick={() => sala.asignados > 0 && onViewAssigned && onViewAssigned(sala)}
                                            title={sala.asignados > 0 ? 'Ver alumnos asignados' : 'Sin alumnos'}
                                        >
                                            {sala.asignados || 0}
                                        </Badge>
                                    </td>
                                    <td>
                                        <Badge bg={disponibles > 0 ? 'success' : 'secondary'}>
                                            {disponibles}
                                        </Badge>
                                    </td>
                                    <td onClick={(e) => e.stopPropagation()}>
                                        {status.estado === 'Banca Disponible' ? (
                                            <Button 
                                                variant={status.variant} 
                                                size="sm"
                                                onClick={() => onAssignStudent(sala)}
                                                style={{ minWidth: '160px' }}
                                            >
                                                <span className="material-icons" style={{fontSize: '0.9rem', verticalAlign: 'middle'}}>
                                                    {status.icon}
                                                </span> {status.estado}
                                            </Button>
                                        ) : (
                                            <Badge bg={status.variant}>
                                                <span className="material-icons" style={{fontSize: '0.9rem', verticalAlign: 'middle'}}>
                                                    {status.icon}
                                                </span> {status.estado}
                                            </Badge>
                                        )}
                                    </td>
                                    <td onClick={(e) => e.stopPropagation()}>
                                        <Button 
                                            variant="warning" 
                                            size="sm" 
                                            className="me-2" 
                                            onClick={() => onEdit(sala)}
                                        >
                                            <span className="material-icons" style={{fontSize: '0.9rem', verticalAlign: 'middle'}}>
                                                edit
                                            </span> Editar
                                        </Button>
                                        <Button 
                                            variant={sala.asignados > 0 ? 'secondary' : 'danger'}
                                            size="sm" 
                                            onClick={() => {
                                                if (sala.asignados > 0) {
                                                    if (onShowMessage) {
                                                        onShowMessage({ 
                                                            type: 'warning', 
                                                            text: `No se puede eliminar la sala "${sala.nombre}": tiene ${sala.asignados} alumno(s) asignado(s). Por favor, reasigne o elimine los alumnos primero.` 
                                                        });
                                                    }
                                                    return;
                                                }
                                                onDelete(sala.id);
                                            }}
                                            title={sala.asignados > 0 ? `No se puede eliminar: ${sala.asignados} alumno(s) asignado(s)` : 'Eliminar sala'}
                                        >
                                            <span className="material-icons" style={{fontSize: '0.9rem', verticalAlign: 'middle'}}>
                                                delete
                                            </span> Eliminar
                                        </Button>
                                    </td>
                                </tr>
                            );
                        }) : null}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default ClassroomList;
