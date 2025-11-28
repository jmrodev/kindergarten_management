// frontend/src/components/GuardianForm.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col, Alert } from 'react-bootstrap';

const GuardianForm = ({ show, guardian = null, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        segundoNombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        apellidoPreferido: '',
        telefono: '',
        email: '',
        relacion: 'Padre',
        esPrincipal: false,
        autorizadoRetiro: true,
        autorizadoPañales: false,
        notas: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (guardian) {
            setFormData({
                nombre: guardian.nombre || '',
                segundoNombre: guardian.segundoNombre || '',
                apellidoPaterno: guardian.apellidoPaterno || '',
                apellidoMaterno: guardian.apellidoMaterno || '',
                apellidoPreferido: guardian.apellidoPreferido || '',
                telefono: guardian.telefono || '',
                email: guardian.email || '',
                relacion: guardian.relationship || 'Padre',
                esPrincipal: guardian.isPrimary || false,
                autorizadoRetiro: guardian.authorizedPickupRelation !== undefined ? guardian.authorizedPickupRelation : true,
                autorizadoPañales: guardian.authorizedDiaperChange || false,
                notas: guardian.notes || ''
            });
        } else {
            // Reset form
            setFormData({
                nombre: '',
                segundoNombre: '',
                apellidoPaterno: '',
                apellidoMaterno: '',
                apellidoPreferido: '',
                telefono: '',
                email: '',
                relacion: 'Padre',
                esPrincipal: false,
                autorizadoRetiro: true,
                autorizadoPañales: false,
                notas: ''
            });
        }
        setErrors({});
    }, [guardian, show]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Limpiar error del campo
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validate = () => {
        const newErrors = {};
        
        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es obligatorio';
        }
        if (!formData.apellidoPaterno.trim()) {
            newErrors.apellidoPaterno = 'El apellido paterno es obligatorio';
        }
        if (!formData.apellidoMaterno.trim()) {
            newErrors.apellidoMaterno = 'El apellido materno es obligatorio';
        }
        if (!formData.telefono.trim()) {
            newErrors.telefono = 'El teléfono es obligatorio';
        } else if (!/^\d{7,15}$/.test(formData.telefono.replace(/[\s-]/g, ''))) {
            newErrors.telefono = 'Teléfono inválido (7-15 dígitos)';
        }
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }
        if (!formData.relacion) {
            newErrors.relacion = 'La relación es obligatoria';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSave(formData);
        }
    };

    return (
        <Modal show={show} onHide={onCancel} size="lg" backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>
                    <span className="material-icons" style={{ fontSize: '1.5rem', verticalAlign: 'middle', marginRight: '0.5rem' }}>
                        {guardian ? 'edit' : 'person_add'}
                    </span>
                    {guardian ? 'Editar Responsable' : 'Agregar Responsable'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit} id="guardianForm">
                    {/* Datos Personales */}
                    <h6 className="mb-3">
                        <span className="material-icons" style={{ fontSize: '1rem', verticalAlign: 'middle', marginRight: '0.3rem' }}>
                            badge
                        </span>
                        Datos Personales
                    </h6>
                    
                    <Row className="mb-3">
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Nombre *</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    isInvalid={!!errors.nombre}
                                    placeholder="Juan"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.nombre}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Segundo Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="segundoNombre"
                                    value={formData.segundoNombre}
                                    onChange={handleChange}
                                    placeholder="Carlos"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Apellido Preferido</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="apellidoPreferido"
                                    value={formData.apellidoPreferido}
                                    onChange={handleChange}
                                    placeholder="Opcional"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Apellido Paterno *</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="apellidoPaterno"
                                    value={formData.apellidoPaterno}
                                    onChange={handleChange}
                                    isInvalid={!!errors.apellidoPaterno}
                                    placeholder="García"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.apellidoPaterno}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Apellido Materno *</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="apellidoMaterno"
                                    value={formData.apellidoMaterno}
                                    onChange={handleChange}
                                    isInvalid={!!errors.apellidoMaterno}
                                    placeholder="López"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.apellidoMaterno}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Contacto */}
                    <h6 className="mb-3 mt-4">
                        <span className="material-icons" style={{ fontSize: '1rem', verticalAlign: 'middle', marginRight: '0.3rem' }}>
                            contact_phone
                        </span>
                        Información de Contacto
                    </h6>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Teléfono *</Form.Label>
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
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Email (opcional)</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    isInvalid={!!errors.email}
                                    placeholder="ejemplo@mail.com"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.email}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Relación y Permisos */}
                    <h6 className="mb-3 mt-4">
                        <span className="material-icons" style={{ fontSize: '1rem', verticalAlign: 'middle', marginRight: '0.3rem' }}>
                            family_restroom
                        </span>
                        Relación y Autorizaciones
                    </h6>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Relación con el Alumno *</Form.Label>
                                <Form.Select
                                    name="relacion"
                                    value={formData.relacion}
                                    onChange={handleChange}
                                    isInvalid={!!errors.relacion}
                                >
                                    <option value="Padre">👨 Padre</option>
                                    <option value="Madre">👩 Madre</option>
                                    <option value="Tutor">👤 Tutor/a Legal</option>
                                    <option value="Abuelo">👴 Abuelo</option>
                                    <option value="Abuela">👵 Abuela</option>
                                    <option value="Tío">👨‍🦱 Tío</option>
                                    <option value="Tía">👩‍🦱 Tía</option>
                                    <option value="Hermano">👦 Hermano/a Mayor</option>
                                    <option value="Otro">👥 Otro</option>
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    {errors.relacion}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6} className="d-flex align-items-center">
                            <Form.Check
                                type="checkbox"
                                name="esPrincipal"
                                checked={formData.esPrincipal}
                                onChange={handleChange}
                                label={
                                    <span>
                                        <span className="material-icons" style={{ fontSize: '1.2rem', verticalAlign: 'middle', color: '#fbbf24' }}>
                                            star
                                        </span>
                                        {' '}Es el responsable <strong>principal</strong>
                                    </span>
                                }
                            />
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Check
                                type="checkbox"
                                name="autorizadoRetiro"
                                checked={formData.autorizadoRetiro}
                                onChange={handleChange}
                                label={
                                    <span>
                                        <span className="material-icons" style={{ fontSize: '1rem', verticalAlign: 'middle', color: '#10b981' }}>
                                            check_circle
                                        </span>
                                        {' '}Autorizado para <strong>retirar</strong> al niño/a
                                    </span>
                                }
                            />
                        </Col>
                        <Col md={6}>
                            <Form.Check
                                type="checkbox"
                                name="autorizadoPañales"
                                checked={formData.autorizadoPañales}
                                onChange={handleChange}
                                label={
                                    <span>
                                        <span className="material-icons" style={{ fontSize: '1rem', verticalAlign: 'middle', color: '#3b82f6' }}>
                                            child_care
                                        </span>
                                        {' '}Autorizado para <strong>cambiar pañales</strong>
                                    </span>
                                }
                            />
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={12}>
                            <Form.Group>
                                <Form.Label>Notas Adicionales</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="notas"
                                    value={formData.notas}
                                    onChange={handleChange}
                                    placeholder="Ej: Horario de trabajo, disponibilidad, observaciones..."
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    {!formData.autorizadoRetiro && (
                        <Alert variant="warning" className="mb-0">
                            <span className="material-icons" style={{ fontSize: '1rem', verticalAlign: 'middle' }}>
                                warning
                            </span>
                            {' '}Debe haber al menos un responsable autorizado para retirar al alumno.
                        </Alert>
                    )}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onCancel}>
                    Cancelar
                </Button>
                <Button variant="primary" type="submit" form="guardianForm">
                    <span className="material-icons" style={{ fontSize: '1rem', verticalAlign: 'middle', marginRight: '0.3rem' }}>
                        {guardian ? 'save' : 'add_circle'}
                    </span>
                    {guardian ? 'Guardar Cambios' : 'Agregar Responsable'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default GuardianForm;
