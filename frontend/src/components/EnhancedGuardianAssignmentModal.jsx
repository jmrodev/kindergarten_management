// frontend/src/components/EnhancedGuardianAssignmentModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col, ListGroup, Badge, InputGroup, Alert, Tabs, Tab } from 'react-bootstrap';
import alumnoService from '../services/alumnoService';
import guardianService from '../services/guardianService';
import GuardianForm from './GuardianForm';

const EnhancedGuardianAssignmentModal = ({ 
    show, 
    student, 
    onSuccess, 
    onCancel, 
    showError,
    showSuccess
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(student || null);
    const [loading, setLoading] = useState(false);
    const [relationData, setRelationData] = useState({
        relacion: 'Padre',
        esPrincipal: false,
        autorizadoRetiro: true,
        autorizadoPañales: false,
        noContacto: false,
        notas: ''
    });
    const [error, setError] = useState(null);
    const [existingGuardians, setExistingGuardians] = useState([]);
    const [selectedExistingGuardian, setSelectedExistingGuardian] = useState(null);
    const [showNewGuardianForm, setShowNewGuardianForm] = useState(false);
    const [searchGuardianTerm, setSearchGuardianTerm] = useState('');
    const [loadingGuardians, setLoadingGuardians] = useState(false);
    const [activeTab, setActiveTab] = useState('search');

    // Load existing guardians when student is selected
    useEffect(() => {
        if (selectedStudent) {
            loadExistingGuardians();
        }
    }, [selectedStudent]);

    const loadExistingGuardians = async (term = '') => {
        setLoadingGuardians(true);
        try {
            const guardians = await guardianService.getAll();
            if (term.trim()) {
                const filtered = guardians.filter(guardian => 
                    guardian.nombre.toLowerCase().includes(term.toLowerCase()) ||
                    guardian.apellidoPaterno.toLowerCase().includes(term.toLowerCase()) ||
                    guardian.apellidoMaterno.toLowerCase().includes(term.toLowerCase()) ||
                    guardian.telefono.includes(term)
                );
                setExistingGuardians(filtered);
            } else {
                setExistingGuardians(guardians);
            }
        } catch (err) {
            console.error('Error loading existing guardians:', err);
            showError('Error', 'Error al cargar responsables existentes');
        } finally {
            setLoadingGuardians(false);
        }
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

    const handleGuardianSearchChange = (e) => {
        const value = e.target.value;
        setSearchGuardianTerm(value);
        if (value.length >= 2) {
            loadExistingGuardians(value);
        } else if (value.length === 0) {
            loadExistingGuardians();
        }
    };

    const handleSelectExistingGuardian = (guardian) => {
        setSelectedExistingGuardian(guardian);
    };

    const handleRelationChange = (e) => {
        const { name, value, type, checked } = e.target;

        setRelationData(prev => {
            let newData = { ...prev, [name]: type === 'checkbox' ? checked : value };

            // Si se marca como no contacto, desmarcar otras autorizaciones
            if (name === 'noContacto' && checked) {
                newData = {
                    ...newData,
                    autorizadoRetiro: false,
                    autorizadoPañales: false,
                    esPrincipal: false
                };
            }

            // Si se marca alguna autorización, desmarcar no contacto
            if ((name === 'autorizadoRetiro' || name === 'autorizadoPañales' || name === 'esPrincipal') && checked) {
                newData.noContacto = false;
            }

            return newData;
        });
    };

    const handleNewGuardianSave = async (guardianData) => {
        try {
            // First, save the new guardian
            const newGuardian = await guardianService.create({
                ...guardianData,
                direccionId: 1  // Default address ID
            });

            // Then, assign to the student
            await handleAssignToStudent(newGuardian);

            showSuccess('Éxito', 'Responsable creado y asignado correctamente');
            setShowNewGuardianForm(false);
            resetForm();
            onSuccess?.();
        } catch (err) {
            console.error('Error creating and assigning guardian:', err);
            const errorMessage = err.response?.data?.message || 'Error al crear y asignar responsable';
            setError(errorMessage);
            showError('Error', errorMessage);
        }
    };

    const handleAssignToStudent = async (guardian) => {
        // If no student selected, return
        if (!selectedStudent) {
            showError('Validación', 'Debe seleccionar un alumno');
            return;
        }

        if (!relationData.relacion) {
            showError('Validación', 'Debe especificar la relación');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // If no contacto, add it to notes
            const updatedRelationData = { ...relationData };
            if (relationData.noContacto) {
                if (updatedRelationData.notas) {
                    updatedRelationData.notas += ' - No contacto (restringido)';
                } else {
                    updatedRelationData.notas = 'No contacto (restringido)';
                }
            }

            await guardianService.assignToStudent(
                selectedStudent.id,
                guardian.id,
                updatedRelationData
            );
        } catch (err) {
            console.error('Error asignando responsable:', err);
            const errorMessage = err.response?.data?.message || 'Error al asignar responsable al alumno';
            setError(errorMessage);
            showError('Error', errorMessage);
            throw err; // Re-throw to be caught by calling function
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedStudent) {
            showError('Validación', 'Debe seleccionar un alumno');
            return;
        }

        if (activeTab === 'search' && !selectedExistingGuardian) {
            showError('Validación', 'Debe seleccionar un responsable existente');
            return;
        }

        if (activeTab === 'new') {
            // If we're in the "new" tab, we should show the form to create a new guardian
            // The user would click the "Crear Nuevo Responsable" button instead of the submit button
            // So this case should not happen, but we handle it by opening the form
            setShowNewGuardianForm(true);
            return;
        }

        if (activeTab === 'search' && selectedExistingGuardian) {
            setLoading(true);
            setError(null);

            try {
                await handleAssignToStudent(selectedExistingGuardian);
                showSuccess('Éxito', 'Responsable asignado correctamente');
                resetForm();
                onSuccess?.();
            } catch (err) {
                // Error handling is done in handleAssignToStudent
            } finally {
                setLoading(false);
            }
        }
    };

    const resetForm = () => {
        setSearchTerm('');
        setStudents([]);
        setSelectedStudent(student || null);
        setSelectedExistingGuardian(null);
        setRelationData({
            relacion: 'Padre',
            esPrincipal: false,
            autorizadoRetiro: true,
            autorizadoPañales: false,
            noContacto: false,
            notas: ''
        });
        setSearchGuardianTerm('');
        setExistingGuardians([]);
        setError(null);
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

    const getRelationIcon = (relation) => {
        const icons = {
            'Padre': '👨', 'Madre': '👩', 'Tutor': '👤',
            'Abuelo': '👴', 'Abuela': '👵', 'Tío': '👨‍🦱',
            'Tía': '👩‍🦱', 'Hermano': '👦', 'Otro': '👥'
        };
        return icons[relation] || '👤';
    };

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

                    {/* Buscador de Alumnos si no se proporcionó un alumno */}
                    {!student && (
                        <>
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
                                        disabled={!!selectedStudent}
                                    />
                                    <Button
                                        variant="outline-secondary"
                                        onClick={() => handleSearch()}
                                        disabled={loading || !searchTerm.trim() || !!selectedStudent}
                                    >
                                        {loading ? (
                                            <span className="spinner-border spinner-border-sm" />
                                        ) : (
                                            <span className="material-icons">search</span>
                                        )}
                                    </Button>
                                </InputGroup>
                            </Form.Group>

                            {/* Lista de Alumnos Encontrados */}
                            {!selectedStudent && students.length > 0 && (
                                <div className="mb-3">
                                    <h6>Alumnos encontrados ({students.length}):</h6>
                                    <ListGroup style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                        {students.map((student) => (
                                            <ListGroup.Item
                                                key={student.id}
                                                action
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
                                                <span className="material-icons text-primary">
                                                    person_add
                                                </span>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                </div>
                            )}
                        </>
                    )}

                    {/* Información del Alumno seleccionado */}
                    {selectedStudent && (
                        <Alert variant="info">
                            <h6>
                                <span className="material-icons" style={{ fontSize: '1rem', verticalAlign: 'middle' }}>
                                    school
                                </span>
                                {' '}Alumno: <strong>{selectedStudent.nombre} {selectedStudent.apellidoPaterno} {selectedStudent.apellidoMaterno}</strong>
                                {selectedStudent.alias && <Badge bg="light" text="dark" className="ms-2">"{selectedStudent.alias}"</Badge>}
                            </h6>
                            <small>
                                <span className="material-icons" style={{ fontSize: '0.9rem', verticalAlign: 'middle' }}>
                                    cake
                                </span>
                                {' '}{calcularEdad(selectedStudent.fechaNacimiento)} años • {selectedStudent.turno}
                                {selectedStudent.sala && ` • ${selectedStudent.sala.nombre}`}
                            </small>
                        </Alert>
                    )}

                    {/* Pestañas para seleccionar existente o crear nuevo */}
                    {selectedStudent && (
                        <Tabs
                            id="guardian-selection-tabs"
                            activeKey={activeTab}
                            onSelect={(k) => setActiveTab(k)}
                            className="mb-3"
                        >
                            <Tab eventKey="search" title="Seleccionar Existente">
                                {/* Buscador de responsables existentes */}
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        <span className="material-icons" style={{ fontSize: '1rem', verticalAlign: 'middle' }}>
                                            search
                                        </span>
                                        {' '}Buscar Responsable Existente
                                    </Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type="text"
                                            placeholder="Buscar por nombre o teléfono..."
                                            value={searchGuardianTerm}
                                            onChange={handleGuardianSearchChange}
                                        />
                                        <Button
                                            variant="outline-secondary"
                                            onClick={() => loadExistingGuardians(searchGuardianTerm)}
                                            disabled={loadingGuardians}
                                        >
                                            {loadingGuardians ? (
                                                <span className="spinner-border spinner-border-sm" />
                                            ) : (
                                                <span className="material-icons">search</span>
                                            )}
                                        </Button>
                                    </InputGroup>
                                    <Form.Text className="text-muted">
                                        Buscar responsables existentes para asignar al alumno.
                                    </Form.Text>
                                </Form.Group>

                                {/* Lista de responsables existentes */}
                                <div className="mb-3">
                                    <h6>Responsables existentes ({existingGuardians.length}):</h6>
                                    <ListGroup style={{ maxHeight: '250px', overflowY: 'auto' }}>
                                        {existingGuardians.map((guardian) => (
                                            <ListGroup.Item
                                                key={guardian.id}
                                                action
                                                active={selectedExistingGuardian?.id === guardian.id}
                                                onClick={() => handleSelectExistingGuardian(guardian)}
                                                className="d-flex justify-content-between align-items-center"
                                            >
                                                <div>
                                                    <strong>
                                                        {getRelationIcon(guardian.relationship || 'Otro')} {guardian.nombre} {guardian.apellidoPaterno} {guardian.apellidoMaterno}
                                                    </strong>
                                                    <br />
                                                    <small className="text-muted">
                                                        <span className="material-icons" style={{ fontSize: '0.8rem', verticalAlign: 'middle' }}>
                                                            phone
                                                        </span>
                                                        {' '}{guardian.telefono}
                                                    </small>
                                                </div>
                                                {selectedExistingGuardian?.id === guardian.id && (
                                                    <span className="material-icons text-success">
                                                        check_circle
                                                    </span>
                                                )}
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                </div>
                            </Tab>
                            <Tab eventKey="new" title="Crear Nuevo">
                                <p className="text-muted">Crear un nuevo responsable y asignarlo al alumno.</p>
                                <Button
                                    variant="outline-primary"
                                    onClick={() => setShowNewGuardianForm(true)}
                                    disabled={loading}
                                    className="d-flex align-items-center gap-2"
                                >
                                    <span className="material-icons">person_add</span>
                                    Crear Nuevo Responsable
                                </Button>

                                {/* Mostrar el formulario de nuevo responsable si está activo */}
                                {showNewGuardianForm && (
                                    <div className="mt-3 p-3 border rounded bg-light">
                                        <h6 className="mb-3">
                                            <span className="material-icons" style={{ fontSize: '1rem', verticalAlign: 'middle' }}>
                                                person_add
                                            </span>
                                            {' '}Datos del Nuevo Responsable
                                        </h6>
                                        <p className="text-muted small">Complete los datos del nuevo responsable y configúrelo para el alumno.</p>
                                    </div>
                                )}
                            </Tab>
                        </Tabs>
                    )}

                    {/* Configuración de la Relación */}
                    {(selectedStudent && selectedExistingGuardian) && (
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
                                        {/* Opción para responsable restringido (no contacto) */}
                                        <Form.Check
                                            type="checkbox"
                                            name="noContacto"
                                            label="No contacto (restringido)"
                                            checked={relationData.noContacto || false}
                                            onChange={handleRelationChange}
                                            className="text-danger"
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
                    {selectedStudent && activeTab === 'search' && selectedExistingGuardian && (
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={loading || !selectedStudent || !selectedExistingGuardian}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" />
                                    Asignando...
                                </>
                            ) : (
                                <>
                                    <span className="material-icons" style={{ fontSize: '1rem', verticalAlign: 'middle' }}>
                                        person_add
                                    </span>
                                    {' '}Asignar Responsable
                                </>
                            )}
                        </Button>
                    )}
                </Modal.Footer>
            </Form>

            {/* Modal para crear nuevo responsable */}
            <GuardianForm
                show={showNewGuardianForm}
                guardian={null}
                onSave={handleNewGuardianSave}
                onCancel={() => setShowNewGuardianForm(false)}
                title="Crear Nuevo Responsable"
            />
        </Modal>
    );
};

export default EnhancedGuardianAssignmentModal;