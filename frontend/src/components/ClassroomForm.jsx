// frontend/src/components/ClassroomForm.jsx
import React, { useState, useEffect } from 'react';
import { Form, Button, Modal, Row, Col, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';

const ClassroomForm = ({ show, initialData = {}, onSubmit, onCancel, showError }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        capacidad: '',
        turno: 'Mañana',
        maestroId: '',
        ...initialData,
    });
    const [maestros, setMaestros] = useState([]);
    const [loadingMaestros, setLoadingMaestros] = useState(false);
    const [turnoError, setTurnoError] = useState(null);

    useEffect(() => {
        if (show) {
            loadMaestros();
        }
        if (initialData.id) {
            setFormData({
                nombre: initialData.nombre || '',
                capacidad: initialData.capacidad || '',
                turno: initialData.turno || 'Mañana',
                maestroId: initialData.maestroId || '',
            });
        } else {
            setFormData({
                nombre: '',
                capacidad: '',
                turno: 'Mañana',
                maestroId: '',
            });
        }
    }, [initialData, show]);

    const loadMaestros = async () => {
        try {
            setLoadingMaestros(true);
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/api/staff', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Filtrar solo maestros activos
            const maestrosFiltrados = response.data.filter(staff =>
                (staff.role_name === 'maestro' || staff.role_name === 'Teacher') && staff.is_active
            );
            setMaestros(maestrosFiltrados);
        } catch (error) {
            console.error('Error cargando maestros:', error);
            if (showError) {
                showError('Error', 'Error cargando maestros: ' + error.message);
            }
        } finally {
            setLoadingMaestros(false);
        }
    };

    const getMaestroInfo = (maestroId) => {
        return maestros.find(m => m.id === parseInt(maestroId));
    };

    const validateTurnoConflict = (turno, maestroId) => {
        if (!maestroId || maestroId === '') {
            setTurnoError(null);
            return true;
        }

        const maestro = getMaestroInfo(maestroId);
        if (!maestro || !maestro.classroom_id || maestro.classroom_id === initialData.id) {
            setTurnoError(null);
            return true;
        }

        // Obtener el turno de la sala actual del maestro
        const maestroTurno = maestro.classroom_shift;

        // Validar conflictos
        if (turno === maestroTurno) {
            setTurnoError({
                type: 'danger',
                message: `⛔ El/la maestro/a ya trabaja turno ${maestroTurno} en ${maestro.classroom_name}. No puede estar en dos salas al mismo tiempo.`
            });
            return false;
        }

        if (turno === 'Ambos') {
            setTurnoError({
                type: 'danger',
                message: `⛔ No puedes asignar turno "Ambos" porque el/la maestro/a ya trabaja turno ${maestroTurno} en ${maestro.classroom_name}.`
            });
            return false;
        }

        if (maestroTurno === 'Ambos') {
            setTurnoError({
                type: 'danger',
                message: `⛔ El/la maestro/a ya trabaja ambos turnos en ${maestro.classroom_name}. No puede ser asignado/a a otra sala.`
            });
            return false;
        }

        // Si llega aquí, los turnos son diferentes (Mañana vs Tarde), es válido
        setTurnoError({
            type: 'success',
            message: `✅ El/la maestro/a puede trabajar turno ${turno} aquí (ya trabaja turno ${maestroTurno} en otra sala).`
        });
        return true;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const newData = {
                ...prev,
                [name]: value,
            };

            // Validar cuando cambia el turno o el maestro
            if (name === 'turno' || name === 'maestroId') {
                const turnoToValidate = name === 'turno' ? value : newData.turno;
                const maestroToValidate = name === 'maestroId' ? value : newData.maestroId;
                validateTurnoConflict(turnoToValidate, maestroToValidate);
            }

            return newData;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validar una vez más antes de enviar
        if (!validateTurnoConflict(formData.turno, formData.maestroId)) {
            return;
        }

        onSubmit(formData);
    };

    const getMaestroDisplayText = (maestro) => {
        let text = `${maestro.first_name} ${maestro.paternal_surname} ${maestro.maternal_surname || ''}`.trim();
        
        if (maestro.classroom_id && maestro.classroom_id !== initialData.id) {
            text += ` - 📍 ${maestro.classroom_name} (${maestro.classroom_shift})`;
        }
        
        return text;
    };

    return (
        <Modal show={show} onHide={onCancel} backdrop="static" keyboard={false} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    <span className="material-icons" style={{fontSize: '1.5rem', verticalAlign: 'middle', marginRight: '0.5rem'}}>
                        {initialData.id ? 'edit' : 'add'}
                    </span>
                    {initialData.id ? 'Editar Sala' : 'Registrar Nueva Sala'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit} id="classroomForm">
                    <Row className="mb-3">
                        <Col md={12}>
                            <Form.Group controlId="formNombreSala">
                                <Form.Label>Nombre de la Sala *</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    name="nombre" 
                                    value={formData.nombre} 
                                    onChange={handleChange} 
                                    required 
                                    placeholder="Ej: Sala Roja, Sala Azul..."
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group controlId="formCapacidadSala">
                                <Form.Label>Capacidad *</Form.Label>
                                <Form.Control 
                                    type="number" 
                                    name="capacidad" 
                                    value={formData.capacidad} 
                                    onChange={handleChange} 
                                    required 
                                    min="1" 
                                    max="50"
                                    placeholder="Número de niños"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="formTurnoSala">
                                <Form.Label>Turno *</Form.Label>
                                <Form.Select 
                                    name="turno" 
                                    value={formData.turno} 
                                    onChange={handleChange} 
                                    required
                                >
                                    <option value="Mañana">🌅 Mañana</option>
                                    <option value="Tarde">🌆 Tarde</option>
                                    <option value="Ambos">⏰ Ambos Turnos</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={12}>
                            <Form.Group controlId="formMaestroSala">
                                <Form.Label>
                                    Maestro/a Asignado
                                    {loadingMaestros && (
                                        <Spinner animation="border" size="sm" className="ms-2" />
                                    )}
                                </Form.Label>
                                <Form.Select 
                                    name="maestroId" 
                                    value={formData.maestroId} 
                                    onChange={handleChange}
                                    disabled={loadingMaestros}
                                >
                                    <option value="">Sin maestro asignado</option>
                                    {maestros.map(maestro => (
                                        <option key={maestro.id} value={maestro.id}>
                                            {getMaestroDisplayText(maestro)}
                                        </option>
                                    ))}
                                </Form.Select>
                                <Form.Text className="text-muted">
                                    Opcional: Selecciona un maestro/a para esta sala
                                </Form.Text>
                            </Form.Group>
                        </Col>
                    </Row>

                    {turnoError && (
                        <Alert variant={turnoError.type} className="mb-3">
                            <strong>{turnoError.message}</strong>
                            {turnoError.type === 'success' && (
                                <div className="mt-2">
                                    <small>ℹ️ Un/a maestro/a puede trabajar en diferentes turnos en diferentes salas.</small>
                                </div>
                            )}
                        </Alert>
                    )}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onCancel}>
                    Cancelar
                </Button>
                <Button 
                    variant="primary" 
                    type="submit" 
                    form="classroomForm"
                    disabled={turnoError && turnoError.type === 'danger'}
                >
                    <span className="material-icons" style={{fontSize: '1rem', verticalAlign: 'middle', marginRight: '0.3rem'}}>
                        {initialData.id ? 'save' : 'add_circle'}
                    </span>
                    {initialData.id ? 'Guardar Cambios' : 'Registrar Sala'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ClassroomForm;
