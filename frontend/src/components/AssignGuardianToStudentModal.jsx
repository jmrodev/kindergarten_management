// frontend/src/components/AssignGuardianToStudentModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col, ListGroup, Badge, InputGroup } from 'react-bootstrap';
import alumnoService from '../services/alumnoService';
import guardianService from '../services/guardianService';

const AssignGuardianToStudentModal = ({ show, guardian, onSuccess, onCancel, showError }) => { // Accept showError
    const [searchTerm, setSearchTerm] = useState('');
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [relationData, setRelationData] = useState({
        relacion: 'Padre',
        esPrincipal: false,
        autorizadoRetiro: true,
        autorizadoPañales: false,
        notas: ''
    });

    useEffect(() => {
        if (show && guardian) {
            // Establecer apellido del padre como búsqueda por defecto
            const defaultSearch = guardian.apellidoPaterno || '';
            setSearchTerm(defaultSearch);
            if (defaultSearch) {
                handleSearch(defaultSearch);
            }
        } else {
            resetForm();
        }
    }, [show, guardian]);

    const resetForm = () => {
        setSearchTerm('');
        setStudents([]);
        setSelectedStudent(null);
        setRelationData({
            relacion: 'Padre',
            esPrincipal: false,
            autorizadoRetiro: true,
            autorizadoPañales: false,
            notas: ''
        });
    };

    const handleSearch = async (term = searchTerm) => {
        if (!term.trim()) {
            setStudents([]);
            return;
        }

        setLoading(true);
        try {
            const results = await alumnoService.searchAlumnos({ searchText: term });
            setStudents(results);
            if (results.length === 0) {
                showError('Búsqueda', 'No se encontraron alumnos con ese apellido'); // Use showError
            }
        } catch (err) {
            console.error('Error buscando alumnos:', err);
            showError('Error', 'Error al buscar alumnos'); // Use showError
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (value.length >= 2) {
            handleSearch(value);
        } else if (value.length === 0) {
            setStudents([]);
        }
    };

    const handleSelectStudent = (student) => {
        setSelectedStudent(student);
    };

    const handleRelationChange = (e) => {
        const { name, value, type, checked } = e.target;
        setRelationData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedStudent) {
            showError('Validación', 'Debe seleccionar un alumno'); // Use showError
            return;
        }

        if (!relationData.relacion) {
            showError('Validación', 'Debe especificar la relación'); // Use showError
            return;
        }

        setLoading(true);

        try {
            await guardianService.assignToStudent(
                selectedStudent.id,
                guardian.id,
                relationData
            );
            
            onSuccess?.();
            resetForm();
        } catch (err) {
            console.error('Error asignando responsable:', err);
            showError('Error', err.response?.data?.message || 'Error al asignar responsable al alumno'); // Use showError
        } finally {
            setLoading(false);
        }
    };

    const calcularEdad = (fechaNacimiento) => {
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        return edad;
    };

    if (!guardian) return null;

    return (
        <Modal show={show} onHide={onCancel} size="lg" centered>
            <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title>
                    <span className="material-icons" style={{ fontSize: '1.3rem', verticalAlign: 'middle', marginRight: '0.5rem' }}>
                        person_add
                    </span>
                    Asignar Responsable a Alumno
                </Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {error && (
                        <Alert variant="danger" dismissible onClose={() => setError(null)}>
                            {error}
                        </Alert>
                    )}

                    {/* Información del Responsable */}
                    <Alert variant="info">
                        <h6>
                            <span className="material-icons" style={{ fontSize: '1rem', verticalAlign: 'middle' }}>
                                person
                            </span>
                            {' '}Responsable: <strong>{guardian.nombre} {guardian.apellidoPaterno} {guardian.apellidoMaterno}</strong>
                        </h6>
                        <small>
                            <span className="material-icons" style={{ fontSize: '0.9rem', verticalAlign: 'middle' }}>
                                phone
                            </span>
                            {' '}{guardian.telefono}
                        </small>
                    </Alert>

                    {/* Buscador de Alumnos */}
                    <Form.Group className="mb-3">
                        <Form.Label>
                            <span className="material-icons" style={{ fontSize: '1rem', verticalAlign: 'middle' }}>
                                search
                            </span>
                            {' '}Buscar Alumno
                        </Form.Label>
                        <InputGroup>
                            <Form.Control
                                type="text"
                                placeholder="Buscar por nombre o apellido..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                autoFocus
                            />
                            <Button 
                                variant="outline-secondary" 
                                onClick={() => handleSearch()}
                                disabled={loading || !searchTerm.trim()}
                            >
                                {loading ? (
                                    <span className="spinner-border spinner-border-sm" />
                                ) : (
                                    <span className="material-icons">search</span>
                                )}
                            </Button>
                        </InputGroup>
                        <Form.Text className="text-muted">
                            Por defecto busca alumnos con apellido "{guardian.apellidoPaterno}". Puede cambiar la búsqueda si tienen diferente apellido.
                        </Form.Text>
                    </Form.Group>

                    {/* Lista de Alumnos Encontrados */}
                    {students.length > 0 && (
                        <div className="mb-3">
                            <h6>Alumnos encontrados ({students.length}):</h6>
                            <ListGroup style={{ maxHeight: '250px', overflowY: 'auto' }}>
                                {students.map((student) => (
                                    <ListGroup.Item
                                        key={student.id}
                                        action
                                        active={selectedStudent?.id === student.id}
                                        onClick={() => handleSelectStudent(student)}
                                        className="d-flex justify-content-between align-items-center"
                                    >
                                        <div>
                                            <strong>
                                                {student.nombre} {student.apellidoPaterno} {student.apellidoMaterno}
                                            </strong>
                                            {student.alias && (
                                                <Badge bg="light" text="dark" className="ms-2">
                                                    "{student.alias}"
                                                </Badge>
                                            )}
                                            <br />
                                            <small className="text-muted">
                                                <span className="material-icons" style={{ fontSize: '0.8rem', verticalAlign: 'middle' }}>
                                                    cake
                                                </span>
                                                {' '}{calcularEdad(student.fechaNacimiento)} años
                                                {' '} • {' '}
                                                <span className="material-icons" style={{ fontSize: '0.8rem', verticalAlign: 'middle' }}>
                                                    schedule
                                                </span>
                                                {' '}{student.turno}
                                                {student.sala && (
                                                    <>
                                                        {' '} • {' '}
                                                        <span className="material-icons" style={{ fontSize: '0.8rem', verticalAlign: 'middle' }}>
                                                            class
                                                        </span>
                                                        {' '}{student.sala.nombre}
                                                    </>
                                                )}
                                            </small>
                                        </div>
                                        {selectedStudent?.id === student.id && (
                                            <span className="material-icons text-success">
                                                check_circle
                                            </span>
                                        )}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </div>
                    )}

                    {/* Configuración de la Relación */}
                    {selectedStudent && (
                        <div className="border rounded p-3 bg-light">
                            <h6 className="mb-3">
                                <span className="material-icons" style={{ fontSize: '1rem', verticalAlign: 'middle' }}>
                                    settings
                                </span>
                                {' '}Configurar Relación
                            </h6>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Relación con el alumno *</Form.Label>
                                        <Form.Select
                                            name="relacion"
                                            value={relationData.relacion}
                                            onChange={handleRelationChange}
                                            required
                                        >
                                            <option value="Padre">Padre</option>
                                            <option value="Madre">Madre</option>
                                            <option value="Tutor">Tutor</option>
                                            <option value="Abuelo">Abuelo</option>
                                            <option value="Abuela">Abuela</option>
                                            <option value="Tío">Tío</option>
                                            <option value="Tía">Tía</option>
                                            <option value="Hermano">Hermano</option>
                                            <option value="Otro">Otro</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Check
                                            type="checkbox"
                                            name="esPrincipal"
                                            label="Responsable Principal"
                                            checked={relationData.esPrincipal}
                                            onChange={handleRelationChange}
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            name="autorizadoRetiro"
                                            label="Autorizado para retirar"
                                            checked={relationData.autorizadoRetiro}
                                            onChange={handleRelationChange}
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            name="autorizadoPañales"
                                            label="Autorizado cambio de pañales"
                                            checked={relationData.autorizadoPañales}
                                            onChange={handleRelationChange}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group className="mb-3">
                                <Form.Label>Notas (opcional)</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    name="notas"
                                    placeholder="Información adicional sobre la relación..."
                                    value={relationData.notas}
                                    onChange={handleRelationChange}
                                />
                            </Form.Group>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onCancel} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button 
                        variant="primary" 
                        type="submit" 
                        disabled={loading || !selectedStudent}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" />
                                Asignando...
                            </>
                        ) : (
                            <>
                                <span className="material-icons" style={{ fontSize: '1rem', verticalAlign: 'middle' }}>
                                    save
                                </span>
                                {' '}Asignar Responsable
                            </>
                        )}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default AssignGuardianToStudentModal;
