// frontend/src/components/StudentForm.jsx
import React, { useState, useEffect } from 'react';
import { Form, Button, Modal, Row, Col, Alert, Tabs, Tab } from 'react-bootstrap';
import useSalas from '../hooks/useSalas';
import { formatDateForInput } from '../utils/dataConverters';
import { 
    VALIDATION_PATTERNS, 
    sanitizeInput, 
    validateSecurity 
} from '../utils';
import GuardiansManager from './GuardiansManager';
import EnhancedGuardianAssignmentModal from './EnhancedGuardianAssignmentModal';

const StudentForm = ({ show, initialData = {}, onSubmit, onCancel, showError, showSuccess }) => {
    const { salas } = useSalas();

    const [errors, setErrors] = useState({});
    
    // Estado inicial con valores por defecto
    const getInitialFormData = () => ({
        nombre: initialData.nombre || '',
        segundoNombre: initialData.segundoNombre || '',
        tercerNombre: initialData.tercerNombre || '',
        alias: initialData.alias || '',
        apellidoPaterno: initialData.apellidoPaterno || '',
        apellidoMaterno: initialData.apellidoMaterno || '',
        fechaNacimiento: formatDateForInput(initialData.fechaNacimiento),
        turno: initialData.turno || 'Mañana',
        direccion: {
            id: initialData.direccion?.id || null,
            calle: initialData.direccion?.calle || '',
            numero: initialData.direccion?.numero || '',
            ciudad: initialData.direccion?.ciudad || '',
            provincia: initialData.direccion?.provincia || '',
            codigoPostal: initialData.direccion?.codigoPostal || ''
        },
        contactoEmergencia: {
            id: initialData.contactoEmergencia?.id || null,
            nombreCompleto: initialData.contactoEmergencia?.nombreCompleto || '',
            relacion: initialData.contactoEmergencia?.relacion || '',
            telefono: initialData.contactoEmergencia?.telefono || ''
        },
        sala: {
            id: initialData.sala?.id || '',
            name: initialData.sala?.nombre || initialData.sala?.name || '',
            capacity: initialData.sala?.capacidad || initialData.sala?.capacity || 0
        }
    });

    const [formData, setFormData] = useState(getInitialFormData());
    const [guardians, setGuardians] = useState([]);
    const [emergencyContact, setEmergencyContact] = useState(null);
    const [activeTab, setActiveTab] = useState('datos');

    // Estado para el modal de asignación de guardianes
    const [showEnhancedGuardianModal, setShowEnhancedGuardianModal] = useState(false);

    // Actualizar el formulario cuando initialData cambie (para el modo edición)
    useEffect(() => {
        if (initialData.id) {
            setFormData(getInitialFormData());
            // TODO: Cargar responsables del alumno desde la API
            // guardianService.getByStudent(initialData.id).then(setGuardians);
        } else {
            // Limpiar al crear nuevo
            setGuardians([]);
            setEmergencyContact(null);
            setActiveTab('datos');
        }
    }, [initialData.id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const sanitized = sanitizeInput(value);
        
        // Validar según el tipo de campo
        let pattern = null;
        if (['nombre', 'segundoNombre', 'tercerNombre', 'apellidoPaterno', 'apellidoMaterno', 'alias'].includes(name)) {
            pattern = VALIDATION_PATTERNS.name;
        }
        
        const securityResult = validateSecurity(sanitized);
        const patternValid = !pattern || pattern.test(sanitized);
        
        if (!securityResult.isValid || !patternValid) {
            setErrors(prev => ({
                ...prev,
                [name]: securityResult.message || 'Entrada no válida. Solo se permiten caracteres seguros.'
            }));
            return;
        }
        
        // Limpiar error si la validación pasa
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
        });
        
        setFormData((prev) => ({
            ...prev,
            [name]: sanitized,
        }));
    };

    const handleNestedChange = (section, field, value) => {
        const sanitized = sanitizeInput(value);
        
        // Validar según el tipo de campo
        let pattern = null;
        const fieldKey = `${section}.${field}`;
        
        if (section === 'direccion') {
            pattern = VALIDATION_PATTERNS.address;
            if (field === 'codigoPostal') {
                pattern = VALIDATION_PATTERNS.postalCode;
            }
        } else if (section === 'contactoEmergencia') {
            if (field === 'nombreCompleto' || field === 'relacion') {
                pattern = VALIDATION_PATTERNS.name;
            } else if (field === 'telefono') {
                pattern = VALIDATION_PATTERNS.phone;
            }
        }
        
        const securityResult = validateSecurity(sanitized);
        const patternValid = !pattern || pattern.test(sanitized);
        
        if (!securityResult.isValid || !patternValid) {
            setErrors(prev => ({
                ...prev,
                [fieldKey]: securityResult.message || 'Entrada no válida. Solo se permiten caracteres seguros.'
            }));
            return;
        }
        
        // Limpiar error
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[fieldKey];
            return newErrors;
        });
        
        setFormData((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: sanitized
            }
        }));
    };

    const handleSalaChange = (e) => {
        const salaId = parseInt(e.target.value);
        const selectedSala = salas.find(s => s.id === salaId);
        if (selectedSala) {
            setFormData((prev) => ({
                ...prev,
                sala: {
                    id: selectedSala.id,
                    name: selectedSala.nombre,
                    capacity: selectedSala.capacidad
                }
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validación final antes de enviar
        const hasErrors = Object.keys(errors).length > 0;
        if (hasErrors) {
            return;
        }

        // Validar que haya al menos un responsable
        if (guardians.length === 0) {
            alert('Debe agregar al menos un responsable para el alumno');
            setActiveTab('responsables');
            return;
        }

        // Validar que haya al menos uno autorizado para retiro
        const hasAuthorizedPickup = guardians.some(g => g.autorizadoRetiro || g.authorizedPickupRelation);
        if (!hasAuthorizedPickup) {
            alert('Debe haber al menos un responsable autorizado para retirar al alumno');
            setActiveTab('responsables');
            return;
        }

        // Validar contacto de emergencia
        if (!emergencyContact || !emergencyContact.nombreCompleto || !emergencyContact.telefono) {
            alert('Debe completar el contacto de emergencia');
            setActiveTab('responsables');
            return;
        }

        // Sanitizar todos los campos antes de enviar
        const sanitizedData = {
            ...formData,
            nombre: sanitizeInput(formData.nombre),
            segundoNombre: sanitizeInput(formData.segundoNombre),
            tercerNombre: sanitizeInput(formData.tercerNombre),
            alias: sanitizeInput(formData.alias),
            apellidoPaterno: sanitizeInput(formData.apellidoPaterno),
            apellidoMaterno: sanitizeInput(formData.apellidoMaterno),
            direccion: formData.direccion ? {
                id: formData.direccion.id,
                calle: sanitizeInput(formData.direccion.calle),
                numero: sanitizeInput(formData.direccion.numero),
                ciudad: sanitizeInput(formData.direccion.ciudad),
                provincia: sanitizeInput(formData.direccion.provincia),
                codigoPostal: sanitizeInput(formData.direccion.codigoPostal)
            } : null,
            contactoEmergencia: emergencyContact ? {
                nombreCompleto: sanitizeInput(emergencyContact.nombreCompleto),
                relacion: sanitizeInput(emergencyContact.relacion),
                telefono: sanitizeInput(emergencyContact.telefono)
            } : null,
            sala: formData.sala || null,
            guardians: guardians // Agregar responsables
        };
        
        onSubmit(sanitizedData);
    };

    return (
        <Modal show={show} onHide={onCancel} size="lg" backdrop="static" keyboard={false} centered>
            <Modal.Header closeButton style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderBottom: 'none'
            }}>
                <Modal.Title className="text-white d-flex align-items-center gap-2">
                    <span className="material-icons" style={{fontSize: '1.5rem', verticalAlign: 'middle'}}>
                        {initialData.id ? 'edit' : 'person_add'}
                    </span>
                    {initialData.id ? 'Editar Alumno' : 'Registrar Nuevo Alumno'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto', padding: '1rem' }}>
                <Tabs
                    activeKey={activeTab}
                    onSelect={(k) => setActiveTab(k)}
                    className="mb-3"
                    variant="pills"
                >
                    <Tab 
                        eventKey="datos" 
                        title={
                            <span>
                                <span className="material-icons" style={{fontSize: '1rem', verticalAlign: 'middle', marginRight: '0.3rem'}}>
                                    person
                                </span>
                                Datos del Alumno
                            </span>
                        }
                    >
                        <Form onSubmit={handleSubmit} id="studentForm">
                            <h6 className="mb-3 d-flex align-items-center gap-2" style={{ 
                                color: '#667eea', 
                                borderBottom: '2px solid #e0e7ff',
                                paddingBottom: '0.75rem',
                                fontWeight: '600'
                            }}>
                                <span className="material-icons" style={{fontSize: '1.2rem', verticalAlign: 'middle'}}>badge</span>
                                Datos Personales
                            </h6>
                    <Row className="mb-3">
                        <Col md={4}>
                            <Form.Group controlId="formNombre">
                                <Form.Label>Nombre *</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    name="nombre" 
                                    value={formData.nombre} 
                                    onChange={handleChange}
                                    isInvalid={!!errors.nombre}
                                    pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+"
                                    title="Solo letras y espacios"
                                    maxLength="100"
                                    required 
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.nombre || 'Este campo es obligatorio'}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group controlId="formSegundoNombre">
                                <Form.Label>Segundo Nombre</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    name="segundoNombre" 
                                    value={formData.segundoNombre} 
                                    onChange={handleChange}
                                    isInvalid={!!errors.segundoNombre}
                                    pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*"
                                    title="Solo letras y espacios"
                                    maxLength="100"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.segundoNombre}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group controlId="formTercerNombre">
                                <Form.Label>Tercer Nombre</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    name="tercerNombre" 
                                    value={formData.tercerNombre} 
                                    onChange={handleChange}
                                    isInvalid={!!errors.tercerNombre}
                                    pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*"
                                    title="Solo letras y espacios"
                                    maxLength="100"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.tercerNombre}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={4}>
                            <Form.Group controlId="formApellidoPaterno">
                                <Form.Label>Apellido Paterno *</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    name="apellidoPaterno" 
                                    value={formData.apellidoPaterno} 
                                    onChange={handleChange}
                                    isInvalid={!!errors.apellidoPaterno}
                                    pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+"
                                    title="Solo letras y espacios"
                                    maxLength="100"
                                    required 
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.apellidoPaterno || 'Este campo es obligatorio'}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group controlId="formApellidoMaterno">
                                <Form.Label>Apellido Materno *</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    name="apellidoMaterno" 
                                    value={formData.apellidoMaterno} 
                                    onChange={handleChange}
                                    isInvalid={!!errors.apellidoMaterno}
                                    pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+"
                                    title="Solo letras y espacios"
                                    maxLength="100"
                                    required 
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.apellidoMaterno || 'Este campo es obligatorio'}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group controlId="formAlias">
                                <Form.Label>Alias</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    name="alias" 
                                    value={formData.alias} 
                                    onChange={handleChange}
                                    isInvalid={!!errors.alias}
                                    pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*"
                                    title="Solo letras y espacios"
                                    maxLength="50"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.alias}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={4}>
                            <Form.Group controlId="formFechaNacimiento">
                                <Form.Label>Fecha de Nacimiento *</Form.Label>
                                <Form.Control 
                                    type="date" 
                                    name="fechaNacimiento" 
                                    value={formData.fechaNacimiento} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group controlId="formTurno">
                                <Form.Label>Turno *</Form.Label>
                                <Form.Select 
                                    name="turno" 
                                    value={formData.turno} 
                                    onChange={handleChange} 
                                    required
                                >
                                    <option value="Mañana">Mañana</option>
                                    <option value="Tarde">Tarde</option>
                                    <option value="Completo">Completo</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group controlId="formSala">
                                <Form.Label>Sala *</Form.Label>
                                <Form.Select 
                                    value={formData.sala?.id || ''} 
                                    onChange={handleSalaChange} 
                                    required
                                >
                                    <option value="">Seleccionar sala...</option>
                                    {salas.map(sala => (
                                        <option key={sala.id} value={sala.id}>
                                            {sala.nombre} (Cap: {sala.capacidad})
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    <h6 className="mb-3 mt-4 d-flex align-items-center gap-2" style={{ 
                        color: '#667eea', 
                        borderBottom: '2px solid #e0e7ff',
                        paddingBottom: '0.75rem',
                        fontWeight: '600'
                    }}>
                        <span className="material-icons" style={{fontSize: '1.2rem', verticalAlign: 'middle'}}>home</span>
                        Dirección
                    </h6>
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group controlId="formCalle">
                                <Form.Label>Calle *</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    value={formData.direccion?.calle || ''} 
                                    onChange={(e) => handleNestedChange('direccion', 'calle', e.target.value)}
                                    isInvalid={!!errors['direccion.calle']}
                                    pattern="[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s,.#º\-]+"
                                    title="Letras, números y caracteres básicos"
                                    maxLength="200"
                                    required 
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors['direccion.calle'] || 'Este campo es obligatorio'}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={2}>
                            <Form.Group controlId="formNumero">
                                <Form.Label>Número *</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    value={formData.direccion?.numero || ''} 
                                    onChange={(e) => handleNestedChange('direccion', 'numero', e.target.value)}
                                    isInvalid={!!errors['direccion.numero']}
                                    pattern="[a-zA-Z0-9\s\-]+"
                                    title="Números y letras"
                                    maxLength="20"
                                    required 
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors['direccion.numero'] || 'Este campo es obligatorio'}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group controlId="formCiudad">
                                <Form.Label>Ciudad *</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    value={formData.direccion?.ciudad || ''} 
                                    onChange={(e) => handleNestedChange('direccion', 'ciudad', e.target.value)}
                                    isInvalid={!!errors['direccion.ciudad']}
                                    pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+"
                                    title="Solo letras y espacios"
                                    maxLength="100"
                                    required 
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors['direccion.ciudad'] || 'Este campo es obligatorio'}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group controlId="formProvincia">
                                <Form.Label>Provincia *</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    value={formData.direccion?.provincia || ''} 
                                    onChange={(e) => handleNestedChange('direccion', 'provincia', e.target.value)}
                                    isInvalid={!!errors['direccion.provincia']}
                                    pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+"
                                    title="Solo letras y espacios"
                                    maxLength="100"
                                    required 
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors['direccion.provincia'] || 'Este campo es obligatorio'}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="formCodigoPostal">
                                <Form.Label>Código Postal</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    value={formData.direccion?.codigoPostal || ''} 
                                    onChange={(e) => handleNestedChange('direccion', 'codigoPostal', e.target.value)}
                                    isInvalid={!!errors['direccion.codigoPostal']}
                                    pattern="[a-zA-Z0-9\s\-]*"
                                    title="Números, letras y guiones"
                                    maxLength="20"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors['direccion.codigoPostal']}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                        </Form>
                    </Tab>

                    <Tab 
                        eventKey="responsables" 
                        title={
                            <span>
                                <span className="material-icons" style={{fontSize: '1rem', verticalAlign: 'middle', marginRight: '0.3rem'}}>
                                    family_restroom
                                </span>
                                Responsables
                                {guardians.length > 0 && (
                                    <span className="badge bg-success ms-2">{guardians.length}</span>
                                )}
                            </span>
                        }
                    >
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="mb-0">
                                <span className="material-icons" style={{fontSize: '1rem', verticalAlign: 'middle', marginRight: '0.3rem'}}>
                                    family_restroom
                                </span>
                                Responsables
                                {guardians.length > 0 && (
                                    <span className="badge bg-success ms-2">{guardians.length}</span>
                                )}
                            </h6>
                            {initialData.id && (
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() => setShowEnhancedGuardianModal(true)}
                                >
                                    <span className="material-icons" style={{ fontSize: '0.9rem', verticalAlign: 'middle' }}>
                                        person_add
                                    </span>
                                    {' '}Agregar Responsable
                                </Button>
                            )}
                        </div>
                        <GuardiansManager
                            initialGuardians={guardians}
                            initialEmergencyContact={emergencyContact}
                            onGuardiansChange={setGuardians}
                            onEmergencyContactChange={setEmergencyContact}
                            mode="local"
                            canEdit={true}
                        />
                    </Tab>
                </Tabs>
            </Modal.Body>
            <Modal.Footer style={{ 
                background: '#f8f9fa',
                borderTop: '1px solid #e9ecef',
                padding: '1.25rem'
            }}>
                <Button 
                    variant="outline-secondary" 
                    onClick={onCancel}
                    style={{
                        borderWidth: '1.5px',
                        fontWeight: '500',
                        padding: '0.5rem 1.5rem'
                    }}
                >
                    <span className="material-icons" style={{fontSize: '1.1rem', verticalAlign: 'middle', marginRight: '0.3rem'}}>close</span>
                    Cancelar
                </Button>
                <Button 
                    variant="primary" 
                    type="submit" 
                    form="studentForm"
                    style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        fontWeight: '500',
                        padding: '0.5rem 1.5rem'
                    }}
                >
                    <span className="material-icons" style={{fontSize: '1.1rem', verticalAlign: 'middle', marginRight: '0.3rem'}}>
                        {initialData.id ? 'save' : 'check_circle'}
                    </span>
                    {initialData.id ? 'Guardar Cambios' : 'Registrar Alumno'}
                </Button>
            </Modal.Footer>

            {/* Modal de Asignación Mejorada de Responsables */}
            {initialData.id && (
                <EnhancedGuardianAssignmentModal
                    show={showEnhancedGuardianModal}
                    student={initialData}
                    onSuccess={() => {
                        setShowEnhancedGuardianModal(false);
                        // Opcional: recargar responsables si es necesario
                        // guardianService.getByStudent(initialData.id).then(setGuardians);
                    }}
                    onCancel={() => setShowEnhancedGuardianModal(false)}
                    showError={showError}
                    showSuccess={showSuccess}
                />
            )}
        </Modal>
    );
};

export default StudentForm;

