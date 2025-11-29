import { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { ROLE_TRANSLATIONS } from '../utils/constants'; // Import from constants.js

function StaffForm({ show, onHide, onSave, staff, roles, classrooms = [], darkMode }) {
    const [formData, setFormData] = useState({
        first_name: '',
        middle_name_optional: '',
        third_name_optional: '',
        paternal_surname: '',
        maternal_surname: '',
        dni: '',
        phone: '',
        email: '',
        email_optional: '',
        role_id: '',
        classroom_id: '',
        is_active: true
    });

    useEffect(() => {
        if (staff) {
            setFormData({
                first_name: staff.first_name || '',
                middle_name_optional: staff.middle_name_optional || '',
                third_name_optional: staff.third_name_optional || '',
                paternal_surname: staff.paternal_surname || '',
                maternal_surname: staff.maternal_surname || '',
                dni: staff.dni || '',
                phone: staff.phone || '',
                email: staff.email || '',
                email_optional: staff.email_optional || '',
                role_id: staff.role_id || '',
                classroom_id: staff.classroom_id || '',
                is_active: staff.is_active !== undefined ? staff.is_active : true
            });
        }
    }, [staff]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" backdrop="static">
            <Modal.Header closeButton style={{
                background: darkMode ? '#1f2937' : '#fff',
                borderBottom: `1px solid ${darkMode ? '#374151' : '#dee2e6'}`
            }}>
                <Modal.Title style={{ color: darkMode ? '#e5e7eb' : '#212529' }}>
                    <span className="material-icons" style={{ fontSize: '1.5rem', verticalAlign: 'middle', marginRight: '0.5rem' }}>
                        {staff ? 'edit' : 'add'}
                    </span>
                    {staff ? 'Editar Personal' : 'Nuevo Personal'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{
                background: darkMode ? '#111827' : '#fff',
                color: darkMode ? '#e5e7eb' : '#212529'
            }}>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Primer Nombre *</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        background: darkMode ? '#1f2937' : '#fff',
                                        border: `1px solid ${darkMode ? '#374151' : '#dee2e6'}`,
                                        color: darkMode ? '#e5e7eb' : '#212529'
                                    }}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Segundo Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="middle_name_optional"
                                    value={formData.middle_name_optional}
                                    onChange={handleChange}
                                    style={{
                                        background: darkMode ? '#1f2937' : '#fff',
                                        border: `1px solid ${darkMode ? '#374151' : '#dee2e6'}`,
                                        color: darkMode ? '#e5e7eb' : '#212529'
                                    }}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Tercer Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="third_name_optional"
                                    value={formData.third_name_optional}
                                    onChange={handleChange}
                                    style={{
                                        background: darkMode ? '#1f2937' : '#fff',
                                        border: `1px solid ${darkMode ? '#374151' : '#dee2e6'}`,
                                        color: darkMode ? '#e5e7eb' : '#212529'
                                    }}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Apellido Paterno *</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="paternal_surname"
                                    value={formData.paternal_surname}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        background: darkMode ? '#1f2937' : '#fff',
                                        border: `1px solid ${darkMode ? '#374151' : '#dee2e6'}`,
                                        color: darkMode ? '#e5e7eb' : '#212529'
                                    }}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Apellido Materno</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="maternal_surname"
                                    value={formData.maternal_surname}
                                    onChange={handleChange}
                                    style={{
                                        background: darkMode ? '#1f2937' : '#fff',
                                        border: `1px solid ${darkMode ? '#374151' : '#dee2e6'}`,
                                        color: darkMode ? '#e5e7eb' : '#212529'
                                    }}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>DNI *</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="dni"
                                    value={formData.dni}
                                    onChange={handleChange}
                                    required
                                    disabled={!!staff}
                                    style={{
                                        background: darkMode ? '#1f2937' : '#fff',
                                        border: `1px solid ${darkMode ? '#374151' : '#dee2e6'}`,
                                        color: darkMode ? '#e5e7eb' : '#212529'
                                    }}
                                />
                                {!staff && (
                                    <Form.Text style={{ color: darkMode ? '#9ca3af' : '#6c757d' }}>
                                        El DNI será la contraseña inicial
                                    </Form.Text>
                                )}
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Teléfono</Form.Label>
                                <Form.Control
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    style={{
                                        background: darkMode ? '#1f2937' : '#fff',
                                        border: `1px solid ${darkMode ? '#374151' : '#dee2e6'}`,
                                        color: darkMode ? '#e5e7eb' : '#212529'
                                    }}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Email Principal</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    style={{
                                        background: darkMode ? '#1f2937' : '#fff',
                                        border: `1px solid ${darkMode ? '#374151' : '#dee2e6'}`,
                                        color: darkMode ? '#e5e7eb' : '#212529'
                                    }}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Email Alternativo</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email_optional"
                                    value={formData.email_optional}
                                    onChange={handleChange}
                                    style={{
                                        background: darkMode ? '#1f2937' : '#fff',
                                        border: `1px solid ${darkMode ? '#374151' : '#dee2e6'}`,
                                        color: darkMode ? '#e5e7eb' : '#212529'
                                    }}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Rol *</Form.Label>
                                <Form.Select
                                    name="role_id"
                                    value={formData.role_id}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        background: darkMode ? '#1f2937' : '#fff',
                                        border: `1px solid ${darkMode ? '#374151' : '#dee2e6'}`,
                                        color: darkMode ? '#e5e7eb' : '#212529'
                                    }}
                                >
                                    <option value="">Seleccionar rol...</option>
                                    {roles.map(role => (
                                        <option key={role.id} value={role.id}>
                                            {ROLE_TRANSLATIONS[role.role_name] || role.role_name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Sala Asignada</Form.Label>
                                <Form.Select
                                    name="classroom_id"
                                    value={formData.classroom_id}
                                    onChange={handleChange}
                                    style={{
                                        background: darkMode ? '#1f2937' : '#fff',
                                        border: `1px solid ${darkMode ? '#374151' : '#dee2e6'}`,
                                        color: darkMode ? '#e5e7eb' : '#212529'
                                    }}
                                >
                                    <option value="">Sin sala asignada</option>
                                    {classrooms.map(classroom => (
                                        <option key={classroom.id} value={classroom.id}>
                                            {classroom.nombre || classroom.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Check
                            type="checkbox"
                            name="is_active"
                            label="Personal Activo"
                            checked={formData.is_active}
                            onChange={handleChange}
                            style={{
                                color: darkMode ? '#e5e7eb' : '#212529'
                            }}
                        />
                    </Form.Group>

                    <div className="d-flex justify-content-end gap-2 mt-4">
                        <Button variant="secondary" onClick={onHide}>
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                border: 'none'
                            }}
                        >
                            {staff ? 'Actualizar' : 'Crear'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default StaffForm;
