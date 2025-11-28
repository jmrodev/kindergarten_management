// frontend/src/components/EmergencyContactForm.jsx
import React, { useState, useEffect } from 'react';
import { Form, Card, Row, Col, Alert } from 'react-bootstrap';

const EmergencyContactForm = ({ emergencyContact = null, onChange, required = true }) => {
    const [formData, setFormData] = useState({
        nombreCompleto: '',
        relacion: 'Abuela',
        telefono: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (emergencyContact) {
            setFormData({
                nombreCompleto: emergencyContact.nombreCompleto || '',
                relacion: emergencyContact.relacion || 'Abuela',
                telefono: emergencyContact.telefono || ''
            });
        }
    }, [emergencyContact]);

    const validate = () => {
        const newErrors = {};
        
        if (required) {
            if (!formData.nombreCompleto.trim()) {
                newErrors.nombreCompleto = 'El nombre completo es obligatorio';
            }
            if (!formData.relacion) {
                newErrors.relacion = 'La relación es obligatoria';
            }
            if (!formData.telefono.trim()) {
                newErrors.telefono = 'El teléfono es obligatorio';
            } else if (!/^\d{7,15}$/.test(formData.telefono.replace(/[\s-]/g, ''))) {
                newErrors.telefono = 'Teléfono inválido (7-15 dígitos)';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newData = {
            ...formData,
            [name]: value
        };
        setFormData(newData);
        
        // Limpiar error
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }

        // Notificar cambio al padre
        if (onChange) {
            onChange(newData, validate());
        }
    };

    // Exponer método de validación
    React.useImperativeHandle(onChange?.ref, () => ({
        validate
    }));

    return (
        <Card className="border-danger">
            <Card.Header className="bg-danger text-white">
                <h6 className="mb-0">
                    <span className="material-icons" style={{ fontSize: '1.2rem', verticalAlign: 'middle', marginRight: '0.5rem' }}>
                        emergency
                    </span>
                    Contacto de Emergencia {required && '*'}
                </h6>
            </Card.Header>
            <Card.Body>
                <Alert variant="info" className="mb-3">
                    <small>
                        <span className="material-icons" style={{ fontSize: '0.9rem', verticalAlign: 'middle' }}>
                            info
                        </span>
                        {' '}Este contacto se usará en caso de no poder comunicarse con los responsables principales.
                    </small>
                </Alert>

                <Row>
                    <Col md={12} className="mb-3">
                        <Form.Group>
                            <Form.Label>Nombre Completo {required && '*'}</Form.Label>
                            <Form.Control
                                type="text"
                                name="nombreCompleto"
                                value={formData.nombreCompleto}
                                onChange={handleChange}
                                isInvalid={!!errors.nombreCompleto}
                                placeholder="Ej: Ana María López García"
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.nombreCompleto}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                        <Form.Group>
                            <Form.Label>Relación {required && '*'}</Form.Label>
                            <Form.Select
                                name="relacion"
                                value={formData.relacion}
                                onChange={handleChange}
                                isInvalid={!!errors.relacion}
                            >
                                <option value="">Seleccione...</option>
                                <option value="Abuela">👵 Abuela</option>
                                <option value="Abuelo">👴 Abuelo</option>
                                <option value="Tía">👩‍🦱 Tía</option>
                                <option value="Tío">👨‍🦱 Tío</option>
                                <option value="Hermano">👦 Hermano/a Mayor</option>
                                <option value="Vecino">🏘️ Vecino/a</option>
                                <option value="Amigo">👥 Amigo/a de la Familia</option>
                                <option value="Otro">❓ Otro</option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                {errors.relacion}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                        <Form.Group>
                            <Form.Label>Teléfono {required && '*'}</Form.Label>
                            <Form.Control
                                type="tel"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleChange}
                                isInvalid={!!errors.telefono}
                                placeholder="123456789"
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.telefono}
                            </Form.Control.Feedback>
                            <Form.Text className="text-muted">
                                <small>
                                    <span className="material-icons" style={{ fontSize: '0.7rem', verticalAlign: 'middle' }}>
                                        tip
                                    </span>
                                    {' '}Preferentemente un número diferente a los responsables
                                </small>
                            </Form.Text>
                        </Form.Group>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default EmergencyContactForm;
