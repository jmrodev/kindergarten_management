// frontend/src/components/SalaDetail.jsx
import React from 'react';
import { Card, ListGroup } from 'react-bootstrap'; // Import Bootstrap components

const SalaDetail = ({ sala }) => {
    if (!sala) {
        return <p className="text-center text-muted">Seleccione una sala para ver los detalles.</p>;
    }

    return (
        <Card className="mb-3">
            <Card.Header as="h5">Detalles de la Sala: {sala.nombre}</Card.Header>
            <Card.Body>
                <ListGroup variant="flush">
                    <ListGroup.Item><strong>ID:</strong> {sala.id}</ListGroup.Item>
                    <ListGroup.Item><strong>Nombre:</strong> {sala.nombre}</ListGroup.Item>
                    <ListGroup.Item><strong>Capacidad:</strong> {sala.capacidad}</ListGroup.Item>
                </ListGroup>
            </Card.Body>
        </Card>
    );
};

export default SalaDetail;
