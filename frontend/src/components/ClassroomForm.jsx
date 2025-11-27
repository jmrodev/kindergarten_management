// frontend/src/components/ClassroomForm.jsx
import React, { useState, useEffect } from 'react';
import { Form, Button, Modal, Row, Col } from 'react-bootstrap';

const ClassroomForm = ({ show, initialData = {}, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        capacidad: '',
        ...initialData,
    });

    useEffect(() => {
        if (initialData.id) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Modal show={show} onHide={onCancel} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>{initialData.id ? 'Editar Sala' : 'Registrar Nueva Sala'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit} id="classroomForm">
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group controlId="formNombreSala">
                                <Form.Label>Nombre de la Sala</Form.Label>
                                <Form.Control type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="formCapacidadSala">
                                <Form.Label>Capacidad</Form.Label>
                                <Form.Control type="number" name="capacidad" value={formData.capacidad} onChange={handleChange} required />
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onCancel}>
                    Cancelar
                </Button>
                <Button variant="primary" type="submit" form="classroomForm">
                    {initialData.id ? 'Guardar Cambios' : 'Registrar Sala'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ClassroomForm;
