// frontend/src/components/ClassroomList.jsx
import React from 'react';
import { Table, Button, Spinner, Alert, Badge } from 'react-bootstrap';

const ClassroomList = ({ salas, loading, onEdit, onDelete, onSelect }) => {
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
            {salas.length === 0 ? (
                <Alert variant="info">No hay salas registradas.</Alert>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Capacidad</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {salas.map((sala) => (
                            <tr key={sala.id} onClick={() => onSelect(sala)} style={{ cursor: 'pointer' }}>
                                <td>{sala.id}</td>
                                <td><strong>{sala.nombre}</strong></td>
                                <td>
                                    <Badge bg="primary">{sala.capacidad} niños</Badge>
                                </td>
                                <td>
                                    <Badge bg={sala.capacidad > 20 ? 'success' : 'warning'}>
                                        {sala.capacidad > 20 ? 'Alta capacidad' : 'Capacidad limitada'}
                                    </Badge>
                                </td>
                                <td onClick={(e) => e.stopPropagation()}>
                                    <Button variant="warning" size="sm" className="me-2" onClick={() => onEdit(sala)}>
                                        Editar
                                    </Button>
                                    <Button variant="danger" size="sm" onClick={() => onDelete(sala.id)}>
                                        Eliminar
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default ClassroomList;
