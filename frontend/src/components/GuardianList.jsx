// frontend/src/components/GuardianList.jsx
import React from 'react';
import { Card, Badge, Button, Row, Col, Alert } from 'react-bootstrap';

const GuardianList = ({ guardians: rawGuardians = [], onEdit, onRemove, onAdd, canEdit = true }) => {
    const guardians = Array.isArray(rawGuardians) ? rawGuardians : [];
    const getRelationIcon = (relation) => {
        const icons = {
            'Padre': '👨',
            'Madre': '👩',
            'Tutor': '👤',
            'Abuelo': '👴',
            'Abuela': '👵',
            'Tío': '👨‍🦱',
            'Tía': '👩‍🦱',
            'Hermano': '👦',
            'Otro': '👥'
        };
        return icons[relation] || '👤';
    };

    if (guardians.length === 0) {
        return (
            <Alert variant="warning">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: '0.5rem' }}>
                            warning
                        </span>
                        <strong>No hay responsables registrados.</strong>
                        <p className="mb-0 mt-2">Debe agregar al menos un responsable para el alumno.</p>
                    </div>
                    {canEdit && (
                        <Button variant="warning" onClick={onAdd}>
                            <span className="material-icons" style={{ fontSize: '1rem', verticalAlign: 'middle' }}>
                                person_add
                            </span>
                            {' '}Agregar
                        </Button>
                    )}
                </div>
            </Alert>
        );
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">
                    <span className="material-icons" style={{ fontSize: '1rem', verticalAlign: 'middle', marginRight: '0.3rem' }}>
                        group
                    </span>
                    Responsables ({guardians.length})
                </h6>
                {canEdit && (
                    <Button variant="outline-primary" size="sm" onClick={onAdd}>
                        <span className="material-icons" style={{ fontSize: '0.9rem', verticalAlign: 'middle' }}>
                            add
                        </span>
                        {' '}Agregar Otro
                    </Button>
                )}
            </div>

            <Row>
                {guardians.map((guardian, index) => (
                    <Col md={12} key={guardian.id || index} className="mb-3">
                        <Card className={guardian.isPrimary ? 'border-warning' : ''}>
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-start">
                                    <div className="flex-grow-1">
                                        {/* Nombre y Principal */}
                                        <div className="d-flex align-items-center mb-2">
                                            <h5 className="mb-0">
                                                {getRelationIcon(guardian.relationship || guardian.relacion)}{' '}
                                                {guardian.nombre} {guardian.apellidoPaterno} {guardian.apellidoMaterno}
                                            </h5>
                                            {guardian.isPrimary && (
                                                <Badge bg="warning" text="dark" className="ms-2">
                                                    <span className="material-icons" style={{ fontSize: '0.8rem', verticalAlign: 'middle' }}>
                                                        star
                                                    </span>
                                                    {' '}Principal
                                                </Badge>
                                            )}
                                        </div>

                                        {/* Relación */}
                                        <p className="text-muted mb-2">
                                            <strong>{guardian.relationship || guardian.relacion}</strong>
                                        </p>

                                        {/* Contacto */}
                                        <Row className="mb-2">
                                            <Col md={6}>
                                                <small>
                                                    <span className="material-icons" style={{ fontSize: '0.9rem', verticalAlign: 'middle' }}>
                                                        phone
                                                    </span>
                                                    {' '}{guardian.telefono}
                                                </small>
                                            </Col>
                                            {guardian.email && (
                                                <Col md={6}>
                                                    <small>
                                                        <span className="material-icons" style={{ fontSize: '0.9rem', verticalAlign: 'middle' }}>
                                                            email
                                                        </span>
                                                        {' '}{guardian.email}
                                                    </small>
                                                </Col>
                                            )}
                                        </Row>

                                        {/* Autorizaciones */}
                                        <div className="d-flex gap-2 flex-wrap mb-2">
                                            {(guardian.authorizedPickupRelation !== undefined ? guardian.authorizedPickupRelation : guardian.autorizadoRetiro) ? (
                                                <Badge bg="success" className="d-flex align-items-center gap-1">
                                                    <span className="material-icons" style={{ fontSize: '0.8rem' }}>
                                                        check_circle
                                                    </span>
                                                    Puede retirar
                                                </Badge>
                                            ) : (
                                                <Badge bg="secondary" className="d-flex align-items-center gap-1">
                                                    <span className="material-icons" style={{ fontSize: '0.8rem' }}>
                                                        cancel
                                                    </span>
                                                    No puede retirar
                                                </Badge>
                                            )}

                                            {(guardian.authorizedDiaperChange !== undefined ? guardian.authorizedDiaperChange : guardian.autorizadoPañales) ? (
                                                <Badge bg="info" className="d-flex align-items-center gap-1">
                                                    <span className="material-icons" style={{ fontSize: '0.8rem' }}>
                                                        child_care
                                                    </span>
                                                    Puede cambiar pañales
                                                </Badge>
                                            ) : (
                                                <Badge bg="secondary" className="d-flex align-items-center gap-1">
                                                    <span className="material-icons" style={{ fontSize: '0.8rem' }}>
                                                        child_care
                                                    </span>
                                                    No cambia pañales
                                                </Badge>
                                            )}
                                        </div>

                                        {/* Notas */}
                                        {guardian.notes && (
                                            <div className="mt-2">
                                                <small className="text-muted">
                                                    <span className="material-icons" style={{ fontSize: '0.8rem', verticalAlign: 'middle' }}>
                                                        note
                                                    </span>
                                                    {' '}{guardian.notes}
                                                </small>
                                            </div>
                                        )}
                                    </div>

                                    {/* Botones de acción */}
                                    {canEdit && (
                                        <div className="d-flex flex-column gap-2">
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                onClick={() => onEdit(guardian)}
                                                title="Editar responsable"
                                            >
                                                <span className="material-icons" style={{ fontSize: '1rem' }}>
                                                    edit
                                                </span>
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => onRemove(guardian)}
                                                disabled={guardians.length === 1}
                                                title={guardians.length === 1 ? 'No se puede eliminar el único responsable' : 'Eliminar responsable'}
                                            >
                                                <span className="material-icons" style={{ fontSize: '1rem' }}>
                                                    delete
                                                </span>
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {!guardians.some(g => g.authorizedPickupRelation || g.autorizadoRetiro) && (
                <Alert variant="danger">
                    <span className="material-icons" style={{ fontSize: '1rem', verticalAlign: 'middle' }}>
                        error
                    </span>
                    {' '}<strong>Atención:</strong> Debe haber al menos un responsable autorizado para retirar al alumno.
                </Alert>
            )}
        </div>
    );
};

export default GuardianList;
