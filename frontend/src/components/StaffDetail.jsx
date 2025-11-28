import { Modal, Button, Row, Col, Badge } from 'react-bootstrap';
import { ROLE_TRANSLATIONS } from '../utils/constants'; // Import from constants.js

function StaffDetail({ show, onHide, staff, onEdit, darkMode }) {
    if (!staff) return null;

    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton style={{
                background: darkMode ? '#1f2937' : '#fff',
                borderBottom: `1px solid ${darkMode ? '#374151' : '#dee2e6'}`
            }}>
                <Modal.Title style={{ color: darkMode ? '#e5e7eb' : '#212529' }}>
                    <span className="material-icons" style={{ fontSize: '1.5rem', verticalAlign: 'middle', marginRight: '0.5rem' }}>
                        person
                    </span>
                    Detalles del Personal
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{
                background: darkMode ? '#111827' : '#fff',
                color: darkMode ? '#e5e7eb' : '#212529'
            }}>
                <div className="mb-4">
                    <h5 style={{
                        color: darkMode ? '#a78bfa' : '#667eea',
                        borderBottom: `2px solid ${darkMode ? '#4b5563' : '#dee2e6'}`,
                        paddingBottom: '0.5rem',
                        marginBottom: '1rem'
                    }}>
                        Información Personal
                    </h5>
                    <Row>
                        <Col md={6}>
                            <p className="mb-2">
                                <strong>Nombre Completo:</strong><br />
                                {[
                                    staff.first_name,
                                    staff.middle_name_optional,
                                    staff.third_name_optional,
                                    staff.paternal_surname,
                                    staff.maternal_surname
                                ].filter(Boolean).join(' ')}
                            </p>
                        </Col>
                        <Col md={6}>
                            <p className="mb-2">
                                <strong>DNI:</strong><br />
                                {staff.dni || 'No registrado'}
                            </p>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <p className="mb-2">
                                <strong>Estado:</strong><br />
                                <Badge bg={staff.is_active ? 'success' : 'secondary'} className="mt-1">
                                    {staff.is_active ? 'Activo' : 'Inactivo'}
                                </Badge>
                            </p>
                        </Col>
                    </Row>
                </div>

                <div className="mb-4">
                    <h5 style={{
                        color: darkMode ? '#a78bfa' : '#667eea',
                        borderBottom: `2px solid ${darkMode ? '#4b5563' : '#dee2e6'}`,
                        paddingBottom: '0.5rem',
                        marginBottom: '1rem'
                    }}>
                        Contacto
                    </h5>
                    <Row>
                        <Col md={6}>
                            <p className="mb-2">
                                <strong>Teléfono:</strong><br />
                                {staff.phone || 'No registrado'}
                            </p>
                        </Col>
                        <Col md={6}>
                            <p className="mb-2">
                                <strong>Email Principal:</strong><br />
                                {staff.email || 'No registrado'}
                            </p>
                        </Col>
                    </Row>
                    {staff.email_optional && (
                        <Row>
                            <Col md={12}>
                                <p className="mb-2">
                                    <strong>Email Alternativo:</strong><br />
                                    {staff.email_optional}
                                </p>
                            </Col>
                        </Row>
                    )}
                </div>

                <div className="mb-4">
                    <h5 style={{
                        color: darkMode ? '#a78bfa' : '#667eea',
                        borderBottom: `2px solid ${darkMode ? '#4b5563' : '#dee2e6'}`,
                        paddingBottom: '0.5rem',
                        marginBottom: '1rem'
                    }}>
                        Información Laboral
                    </h5>
                    <Row>
                        <Col md={6}>
                            <p className="mb-2">
                                <strong>Rol:</strong><br />
                                <Badge bg="info" className="mt-1" style={{ fontSize: '0.9rem' }}>
                                    {ROLE_TRANSLATIONS[staff.role_name] || staff.role_name}
                                </Badge>
                            </p>
                        </Col>
                        <Col md={6}>
                            <p className="mb-2">
                                <strong>Sala Asignada:</strong><br />
                                {staff.classroom_name || 'Sin sala asignada'}
                            </p>
                        </Col>
                    </Row>
                </div>

                {(staff.created_at || staff.last_login) && (
                    <div className="mb-3">
                        <h5 style={{
                            color: darkMode ? '#a78bfa' : '#667eea',
                            borderBottom: `2px solid ${darkMode ? '#4b5563' : '#dee2e6'}`,
                            paddingBottom: '0.5rem',
                            marginBottom: '1rem'
                        }}>
                            Información del Sistema
                        </h5>
                        <Row>
                            {staff.created_at && (
                                <Col md={6}>
                                    <p className="mb-2">
                                        <strong>Fecha de Registro:</strong><br />
                                        {new Date(staff.created_at).toLocaleString('es-ES')}
                                    </p>
                                </Col>
                            )}
                            {staff.last_login && (
                                <Col md={6}>
                                    <p className="mb-2">
                                        <strong>Último Acceso:</strong><br />
                                        {new Date(staff.last_login).toLocaleString('es-ES')}
                                    </p>
                                </Col>
                            )}
                        </Row>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer style={{
                background: darkMode ? '#1f2937' : '#fff',
                borderTop: `1px solid ${darkMode ? '#374151' : '#dee2e6'}`
            }}>
                <Button variant="secondary" onClick={onHide}>
                    Cerrar
                </Button>
                <Button
                    variant="warning"
                    onClick={() => {
                        onHide();
                        onEdit(staff);
                    }}
                >
                    <span className="material-icons" style={{ fontSize: '1rem', verticalAlign: 'middle', marginRight: '0.3rem' }}>
                        edit
                    </span>
                    Editar
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default StaffDetail;
