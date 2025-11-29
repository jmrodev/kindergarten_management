// frontend/src/pages/GuardiansPage.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Badge, Spinner, Form, InputGroup, ListGroup, Nav, Modal, Alert } from 'react-bootstrap';
import guardianService from '../services/guardianService';
import GuardianForm from '../components/GuardianForm';
import AssignGuardianToStudentModal from '../components/AssignGuardianToStudentModal';

const GuardiansPage = ({ showSuccess, showError }) => { // Accept showSuccess and showError
    const [relationships, setRelationships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingGuardian, setEditingGuardian] = useState(null);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedGuardian, setSelectedGuardian] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('todos');
    const [allGuardians, setAllGuardians] = useState([]);
    const [unassignedGuardians, setUnassignedGuardians] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        await loadRelationships();
    };

    const loadRelationships = async (search = '') => {
        try {
            setLoading(true);
            const data = await guardianService.getAllRelationships(search);
            setRelationships(data);
            
            // Cargar todos los responsables
            const all = await guardianService.getAll();
            setAllGuardians(all);
            
            // Calcular sin asignar
            const assignedIds = new Set(data.map(r => r.guardian_id));
            const unassigned = all.filter(g => !assignedIds.has(g.id));
            setUnassignedGuardians(unassigned);
        } catch (error) {
            showError('Error', 'Error al cargar relaciones'); // Use showError
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        loadRelationships(searchTerm);
    };

    const handleSearchChange = (value) => {
        setSearchTerm(value);
        if (value.length >= 2 || value.length === 0) {
            loadRelationships(value);
        }
    };

    const handleAdd = () => {
        setEditingGuardian(null);
        setShowForm(true);
    };

    const handleEdit = (guardian) => {
        setEditingGuardian(guardian);
        setShowForm(true);
    };

    const handleSaveGuardian = async (guardianData) => {
        try {
            const dataToSave = {
                ...guardianData,
                direccionId: 1
            };

            if (editingGuardian) {
                await guardianService.update(editingGuardian.guardian_id, dataToSave);
                showSuccess('Éxito', 'Responsable actualizado correctamente'); // Use showSuccess
            } else {
                await guardianService.create(dataToSave);
                showSuccess('Éxito', 'Responsable creado correctamente'); // Use showSuccess
            }
            
            setShowForm(false);
            setEditingGuardian(null);
            loadRelationships(searchTerm);
        } catch (error) {
            showError('Error', 'Error al guardar responsable'); // Use showError
            console.error(error);
        }
    };

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [relationshipToDelete, setRelationshipToDelete] = useState(null);

    const handleDeleteClick = (relationship) => {
        setRelationshipToDelete(relationship);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!relationshipToDelete) return;
        
        console.log('Eliminando relación:', relationshipToDelete);
        
        try {
            const result = await guardianService.removeFromStudent(
                relationshipToDelete.student_id, 
                relationshipToDelete.guardian_id
            );
            console.log('Resultado eliminación:', result);
            showSuccess('Éxito', 'Relación eliminada correctamente'); // Use showSuccess
            await loadRelationships(searchTerm);
        } catch (error) {
            console.error('Error completo al eliminar relación:', error);
            console.error('Response:', error.response);
            if (error.response?.status === 409) {
                showError('Advertencia', error.response?.data?.message || 'No se puede eliminar: es el único responsable del alumno'); // Use showError
            } else if (error.response?.data?.message) {
                showError('Error', error.response.data.message); // Use showError
            } else {
                showError('Error', 'Error al eliminar la relación: ' + (error.message || 'Error desconocido')); // Use showError
            }
        } finally {
            setShowDeleteModal(false);
            setRelationshipToDelete(null);
        }
    };

    const handleAssign = (guardianData) => {
        setSelectedGuardian({
            id: guardianData.guardian_id,
            nombre: guardianData.g_first_name,
            segundoNombre: guardianData.g_middle_name,
            apellidoPaterno: guardianData.g_paternal_surname,
            apellidoMaterno: guardianData.g_maternal_surname,
            telefono: guardianData.g_phone,
            email: guardianData.g_email
        });
        setShowAssignModal(true);
    };

    const handleAssignSuccess = () => {
        showSuccess('Éxito', 'Responsable asignado al alumno correctamente'); // Use showSuccess
        setShowAssignModal(false);
        setSelectedGuardian(null);
        loadRelationships(searchTerm);
    };

    const handleAssignCancel = () => {
        setShowAssignModal(false);
        setSelectedGuardian(null);
    };

    const getRelationIcon = (relation) => {
        const icons = {
            'Padre': '👨', 'Madre': '👩', 'Tutor': '👤',
            'Abuelo': '👴', 'Abuela': '👵', 'Tío': '👨‍🦱',
            'Tía': '👩‍🦱', 'Hermano': '👦', 'Otro': '👥'
        };
        return icons[relation] || '👤';
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

    // Función para obtener color más oscuro
    const darkerColor = (color, percent) => {
        // Convertir color hexadecimal a RGB
        let R = parseInt(color.substring(1, 3), 16);
        let G = parseInt(color.substring(3, 5), 16);
        let B = parseInt(color.substring(5, 7), 16);

        // Ajustar el porcentaje
        R = Math.floor(R * (100 - percent) / 100);
        G = Math.floor(G * (100 - percent) / 100);
        B = Math.floor(B * (100 - percent) / 100);

        // Convertir de nuevo a hexadecimal
        R = Math.min(255, Math.max(0, R)).toString(16).padStart(2, '0');
        G = Math.min(255, Math.max(0, G)).toString(16).padStart(2, '0');
        B = Math.min(255, Math.max(0, B)).toString(16).padStart(2, '0');

        return `#${R}${G}${B}`;
    };

    // Función para determinar tipo de responsable
    const getGuardianType = (relationship, authorizedPickup, authorizedDiaperChange, isPrimary, notes) => {
        // Verificar si es responsable restringido (no contacto)
        if (notes && (notes.toLowerCase().includes('alerta') || notes.toLowerCase().includes('restringido') || notes.toLowerCase().includes('no contacto'))) {
            return { type: 'no-contact', label: '.Restricto', color: '#dc3545' }; // Rojo
        }

        // Responsable directo (primario)
        if (isPrimary) {
            return { type: 'direct', label: 'Responsable Directo', color: '#f59e0b' }; // Amarillo
        }

        // Responsable que solo puede retirar
        if (authorizedPickup && !authorizedDiaperChange) {
            return { type: 'pickup', label: 'Retiro', color: '#10b981' }; // Verde
        }

        // Responsable que solo puede cambiar pañales
        if (!authorizedPickup && authorizedDiaperChange) {
            return { type: 'diaper', label: 'Cambio de Pañales', color: '#3b82f6' }; // Azul
        }

        // Responsable que puede retirar y cambiar pañales
        if (authorizedPickup && authorizedDiaperChange) {
            return { type: 'both', label: 'Retiro y Cambio', color: '#8b5cf6' }; // Morado
        }

        // Responsable solo de contacto
        if (!authorizedPickup && !authorizedDiaperChange) {
            return { type: 'contact', label: 'Contacto', color: '#6b7280' }; // Gris
        }

        // Por defecto
        return { type: 'other', label: relationship, color: '#6b7280' }; // Gris
    };

    // Agrupar relaciones por responsable
    const groupedByGuardian = relationships.reduce((acc, rel) => {
        const key = rel.guardian_id;
        if (!acc[key]) {
            acc[key] = {
                guardian: {
                    id: rel.guardian_id,
                    nombre: rel.g_first_name,
                    segundoNombre: rel.g_middle_name,
                    apellidoPaterno: rel.g_paternal_surname,
                    apellidoMaterno: rel.g_maternal_surname,
                    telefono: rel.g_phone,
                    email: rel.g_email
                },
                students: []
            };
        }
        acc[key].students.push({
            id: rel.student_id,
            nombre: rel.s_first_name,
            apellidoPaterno: rel.s_paternal_surname,
            apellidoMaterno: rel.s_maternal_surname,
            alias: rel.s_nickname,
            fechaNacimiento: rel.birth_date,
            turno: rel.shift,
            sala: rel.classroom_name,
            salaId: rel.classroom_id,
            relationship: rel.relationship,
            isPrimary: rel.is_primary,
            authorizedPickup: rel.authorized_pickup,
            authorizedDiaperChange: rel.authorized_diaper_change,
            notes: rel.notes
        });
        return acc;
    }, {});

    // Obtener salas únicas
    const salasUnicas = [...new Set(relationships.map(r => ({
        id: r.classroom_id,
        nombre: r.classroom_name,
        turno: r.shift
    })).filter(s => s.nombre).map(s => JSON.stringify(s)))].map(s => JSON.parse(s));

    // Agrupar por sala/turno
    const groupedBySala = salasUnicas.reduce((acc, sala) => {
        const key = `${sala.nombre}-${sala.turno}`;
        acc[key] = {
            sala: sala.nombre,
            turno: sala.turno,
            guardians: {}
        };
        return acc;
    }, {});

    // Llenar cada sala con sus responsables
    Object.values(groupedByGuardian).forEach(guardianGroup => {
        guardianGroup.students.forEach(student => {
            const key = `${student.sala}-${student.turno}`;
            if (groupedBySala[key]) {
                const gId = guardianGroup.guardian.id;
                if (!groupedBySala[key].guardians[gId]) {
                    groupedBySala[key].guardians[gId] = {
                        guardian: guardianGroup.guardian,
                        students: []
                    };
                }
                groupedBySala[key].guardians[gId].students.push(student);
            }
        });
    });

    // Estado para las pestañas de cada responsable
    const [activeStudentTabs, setActiveStudentTabs] = useState({});

    const handleStudentTabChange = (guardianId, tabIndex) => {
        setActiveStudentTabs(prev => ({
            ...prev,
            [guardianId]: tabIndex
        }));
    };

    // Componente helper para renderizar tarjetas de responsables
    const renderGuardianCard = (guardianGroup, showDeleteButton = true) => {
        const activeStudentTab = activeStudentTabs[guardianGroup.guardian.id] || 0;
        const hasMultipleStudents = guardianGroup.students && guardianGroup.students.length > 1;
        
        return (
            <Card className="h-100 shadow-sm" style={{ 
                backgroundColor: 'var(--bs-body-bg)', 
                borderColor: 'var(--bs-border-color)' 
            }}>
                <Card.Header style={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none'
                }}>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 className="mb-0">
                                <span className="material-icons" style={{ fontSize: '1rem', verticalAlign: 'middle', marginRight: '0.3rem' }}>
                                    person
                                </span>
                                {guardianGroup.guardian.nombre} {guardianGroup.guardian.apellidoPaterno} {guardianGroup.guardian.apellidoMaterno}
                            </h6>
                            <small>
                                <span className="material-icons" style={{ fontSize: '0.8rem', verticalAlign: 'middle' }}>
                                    phone
                                </span>
                                {' '}{guardianGroup.guardian.telefono}
                            </small>
                        </div>
                        <Badge bg="light" text="dark">
                            {guardianGroup.students?.length || 0} {guardianGroup.students?.length === 1 ? 'alumno' : 'alumnos'}
                        </Badge>
                    </div>
                </Card.Header>
                <Card.Body style={{ 
                    backgroundColor: 'var(--bs-body-bg)', 
                    color: 'var(--bs-body-color)' 
                }}>
                    {guardianGroup.students && guardianGroup.students.length > 0 ? (
                        <>
                            {/* Pestañas para múltiples alumnos */}
                            {hasMultipleStudents && (
                                <Nav variant="pills" className="mb-3" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {guardianGroup.students.map((student, idx) => (
                                        <Nav.Item key={idx}>
                                            <Nav.Link
                                                active={activeStudentTab === idx}
                                                onClick={() => handleStudentTabChange(guardianGroup.guardian.id, idx)}
                                                style={{
                                                    cursor: 'pointer',
                                                    padding: '0.375rem 0.75rem',
                                                    fontSize: '0.875rem',
                                                    backgroundColor: activeStudentTab === idx 
                                                        ? 'rgba(102, 126, 234, 0.1)' 
                                                        : 'transparent',
                                                    color: activeStudentTab === idx 
                                                        ? '#667eea' 
                                                        : 'var(--bs-body-color)',
                                                    border: '1px solid',
                                                    borderColor: activeStudentTab === idx 
                                                        ? '#667eea' 
                                                        : 'var(--bs-border-color)'
                                                }}
                                            >
                                                {student.nombre} {student.apellidoPaterno}
                                            </Nav.Link>
                                        </Nav.Item>
                                    ))}
                                </Nav>
                            )}
                            
                            {/* Contenido del alumno seleccionado */}
                            {guardianGroup.students.map((student, idx) => (
                                hasMultipleStudents && activeStudentTab !== idx ? null : (
                                    <div key={idx}>
                                        <div className="d-flex justify-content-between align-items-start">
                                            <div className="flex-grow-1">
                                        <div className="d-flex align-items-center mb-1">
                                            {(() => {
                                                const guardianType = getGuardianType(
                                                    student.relationship,
                                                    student.authorizedPickup,
                                                    student.authorizedDiaperChange,
                                                    student.isPrimary,
                                                    student.notes
                                                );
                                                return (
                                                    <div className="d-flex align-items-center gap-2">
                                                        {guardianType.type === 'no-contact' ? (
                                                            <span className="material-icons text-danger" title="Restringido - No contacto">
                                                                block
                                                            </span>
                                                        ) : (
                                                            <span>{getRelationIcon(student.relationship)}</span>
                                                        )}
                                                        <strong
                                                            className={guardianType.type === 'no-contact' ? 'text-danger text-decoration-line-through' : ''}
                                                            title={guardianType.type === 'no-contact' ? 'Resposable restringido - contacto prohibido' : ''}
                                                        >
                                                            {student.nombre} {student.apellidoPaterno}
                                                        </strong>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                        <small style={{ color: 'var(--bs-body-color)', opacity: 0.8 }}>
                                            {(() => {
                                                const guardianType = getGuardianType(
                                                    student.relationship,
                                                    student.authorizedPickup,
                                                    student.authorizedDiaperChange,
                                                    student.isPrimary,
                                                    student.notes
                                                );
                                                return guardianType.type === 'no-contact' ? (
                                                    <Badge style={{
                                                        background: 'linear-gradient(135deg, #dc3545 0%, #a71e2a 100%)',
                                                        color: 'white'
                                                    }}>⚠ {student.relationship}</Badge>
                                                ) : (
                                                    <Badge style={{
                                                        background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                                                        color: 'white'
                                                    }}>{student.relationship}</Badge>
                                                );
                                            })()}
                                            {' • '}{calcularEdad(student.fechaNacimiento)} años
                                            {' • '}{student.turno}
                                            {student.sala && <> • {student.sala}</>}
                                        </small>
                                        {/* Tipo de responsable con indicadores visuales */}
                                        <div className="mt-1">
                                            {(() => {
                                                const guardianType = getGuardianType(
                                                    student.relationship,
                                                    student.authorizedPickup,
                                                    student.authorizedDiaperChange,
                                                    student.isPrimary,
                                                    student.notes
                                                );
                                                return (
                                                    <span className="d-inline-block">
                                                        <Badge style={{
                                                            background: `linear-gradient(135deg, ${guardianType.color} 0%, ${darkerColor(guardianType.color, 20)} 100%)`,
                                                            color: 'white',
                                                            border: student.isPrimary ? `2px solid ${darkerColor(guardianType.color, 30)}` : 'none',
                                                            boxShadow: student.isPrimary ? `0 0 8px ${guardianType.color}40` : 'none'
                                                        }}>
                                                            {student.isPrimary ? '⭐ ' : ''}
                                                            {guardianType.label}
                                                        </Badge>
                                                    </span>
                                                );
                                            })()}
                                        </div>
                                        {/* Mostrar autorizaciones secundarias si no están incluidas en el tipo principal */}
                                        {/* No mostrar autorizaciones para guardianes no-contact (restringidos) */}
                                        {getGuardianType(student.relationship, student.authorizedPickup, student.authorizedDiaperChange, student.isPrimary, student.notes).type !== 'no-contact' && (
                                            <div className="d-flex gap-1 mt-1 flex-wrap">
                                                {student.authorizedPickup &&
                                                    !student.isPrimary &&
                                                    getGuardianType(student.relationship, student.authorizedPickup, student.authorizedDiaperChange, student.isPrimary, student.notes).type !== 'pickup' &&
                                                    getGuardianType(student.relationship, student.authorizedPickup, student.authorizedDiaperChange, student.isPrimary, student.notes).type !== 'both' && (
                                                    <Badge bg="success" className="text-xs">✓ Retiro</Badge>
                                                )}
                                                {student.authorizedDiaperChange &&
                                                    !student.isPrimary &&
                                                    getGuardianType(student.relationship, student.authorizedPickup, student.authorizedDiaperChange, student.isPrimary, student.notes).type !== 'diaper' &&
                                                    getGuardianType(student.relationship, student.authorizedPickup, student.authorizedDiaperChange, student.isPrimary, student.notes).type !== 'both' && (
                                                    <Badge bg="info" className="text-xs">🍼 Pañales</Badge>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    {showDeleteButton && (
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => handleDeleteClick({ 
                                                guardian_id: guardianGroup.guardian.id, 
                                                student_id: student.id,
                                                g_first_name: guardianGroup.guardian.nombre,
                                                g_paternal_surname: guardianGroup.guardian.apellidoPaterno,
                                                s_first_name: student.nombre,
                                                s_paternal_surname: student.apellidoPaterno
                                            })}
                                        >
                                            <span className="material-icons" style={{ fontSize: '0.9rem' }}>link_off</span>
                                        </Button>
                                    )}
                                </div>
                                    </div>
                                )
                            ))}
                        </>
                    ) : (
                        <p className="text-muted text-center">Sin alumnos asignados</p>
                    )}
                    <div className="mt-3 text-center">
                        <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => handleAssign({
                                guardian_id: guardianGroup.guardian.id,
                                g_first_name: guardianGroup.guardian.nombre,
                                g_middle_name: guardianGroup.guardian.segundoNombre,
                                g_paternal_surname: guardianGroup.guardian.apellidoPaterno,
                                g_maternal_surname: guardianGroup.guardian.apellidoMaterno,
                                g_phone: guardianGroup.guardian.telefono,
                                g_email: guardianGroup.guardian.email
                            })}
                        >
                            <span className="material-icons" style={{ fontSize: '0.9rem', verticalAlign: 'middle' }}>
                                person_add
                            </span>
                            {' '}Asignar alumno
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        );
    };

    if (loading) {
        return (
            <Container className="mt-4 text-center">
                <Spinner animation="border" />
                <p>Cargando responsables...</p>
            </Container>
        );
    }

    return (
        <Container>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>
                    <span className="material-icons" style={{ fontSize: '2rem', verticalAlign: 'middle', marginRight: '0.5rem' }}>
                        family_restroom
                    </span>
                    Responsables
                </h2>
                <Button 
                    onClick={handleAdd}
                    style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
                    }}
                >
                    <span className="material-icons" style={{ fontSize: '1.2rem', verticalAlign: 'middle', marginRight: '0.3rem' }}>
                        add
                    </span>
                    Nuevo Responsable
                </Button>
            </div>



            {/* Buscador */}
            <Card className="mb-4">
                <Card.Body>
                    <Form onSubmit={handleSearch}>
                        <InputGroup>
                            <InputGroup.Text>
                                <span className="material-icons" style={{ fontSize: '1.2rem' }}>
                                    search
                                </span>
                            </InputGroup.Text>
                            <Form.Control
                                type="text"
                                placeholder="Buscar por nombre de responsable o alumno..."
                                value={searchTerm}
                                onChange={(e) => handleSearchChange(e.target.value)}
                            />
                            {searchTerm && (
                                <Button 
                                    variant="outline-secondary" 
                                    onClick={() => {
                                        setSearchTerm('');
                                        loadRelationships('');
                                    }}
                                >
                                    <span className="material-icons">clear</span>
                                </Button>
                            )}
                        </InputGroup>
                        <Form.Text className="text-muted">
                            Busca por nombre, apellido o sala. Ejemplo: "Elías" mostrará responsables y alumnos con ese nombre.
                        </Form.Text>
                    </Form>
                </Card.Body>
            </Card>

            {/* Pestañas de navegación */}
            <Nav variant="tabs" activeKey={activeTab} onSelect={setActiveTab} className="mb-4">
                <Nav.Item>
                    <Nav.Link eventKey="todos">
                        <span className="material-icons" style={{ fontSize: '1rem', verticalAlign: 'middle' }}>
                            groups
                        </span>
                        {' '}Todos ({Object.keys(groupedByGuardian).length})
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="sinAsignar">
                        <span className="material-icons" style={{ fontSize: '1rem', verticalAlign: 'middle' }}>
                            person_off
                        </span>
                        {' '}Sin Asignar ({unassignedGuardians.length})
                    </Nav.Link>
                </Nav.Item>
                {Object.keys(groupedBySala).map(key => {
                    const sala = groupedBySala[key];
                    return (
                        <Nav.Item key={key}>
                            <Nav.Link eventKey={key}>
                                <span className="material-icons" style={{ fontSize: '1rem', verticalAlign: 'middle' }}>
                                    class
                                </span>
                                {' '}{sala.sala} - {sala.turno} ({Object.keys(sala.guardians).length})
                            </Nav.Link>
                        </Nav.Item>
                    );
                })}
            </Nav>

            {/* Contenido de las pestañas */}
            {activeTab === 'todos' && (
                <Row>
                    {Object.keys(groupedByGuardian).length === 0 ? (
                        <Col>
                            <Card>
                                <Card.Body className="text-center p-5">
                                    <span className="material-icons" style={{ fontSize: '4rem', color: '#ccc' }}>
                                        person_off
                                    </span>
                                    <p className="text-muted mt-3">No hay responsables registrados</p>
                                </Card.Body>
                            </Card>
                        </Col>
                    ) : (
                        Object.values(groupedByGuardian).map((group) => (
                            <Col xs={12} sm={6} md={4} lg={3} key={group.guardian.id} className="mb-3">
                                {renderGuardianCard(group)}
                            </Col>
                        ))
                    )}
                </Row>
            )}

            {activeTab === 'sinAsignar' && (
                <Row>
                    {unassignedGuardians.length === 0 ? (
                        <Col>
                            <Card>
                                <Card.Body className="text-center p-5">
                                    <span className="material-icons" style={{ fontSize: '4rem', color: '#28a745' }}>
                                        check_circle
                                    </span>
                                    <p className="text-muted mt-3">Todos los responsables tienen alumnos asignados</p>
                                </Card.Body>
                            </Card>
                        </Col>
                    ) : (
                        unassignedGuardians.map((guardian) => (
                            <Col xs={12} sm={6} md={4} lg={3} key={guardian.id} className="mb-3">
                                {renderGuardianCard({
                                    guardian: {
                                        id: guardian.id,
                                        nombre: guardian.nombre,
                                        segundoNombre: guardian.segundoNombre,
                                        apellidoPaterno: guardian.apellidoPaterno,
                                        apellidoMaterno: guardian.apellidoMaterno,
                                        telefono: guardian.telefono,
                                        email: guardian.email
                                    },
                                    students: []
                                }, false)}
                            </Col>
                        ))
                    )}
                </Row>
            )}

            {Object.keys(groupedBySala).includes(activeTab) && (
                <Row>
                    {Object.values(groupedBySala[activeTab].guardians).length === 0 ? (
                        <Col>
                            <Card>
                                <Card.Body className="text-center p-5">
                                    <span className="material-icons" style={{ fontSize: '4rem', color: '#ccc' }}>
                                        inbox
                                    </span>
                                    <p className="text-muted mt-3">No hay responsables en esta sala</p>
                                </Card.Body>
                            </Card>
                        </Col>
                    ) : (
                        Object.values(groupedBySala[activeTab].guardians).map((group) => (
                            <Col xs={12} sm={6} md={4} lg={3} key={group.guardian.id} className="mb-3">
                                {renderGuardianCard(group)}
                            </Col>
                        ))
                    )}
                </Row>
            )}

            {/* Modal de Formulario */}
            <GuardianForm
                show={showForm}
                guardian={editingGuardian}
                onSave={handleSaveGuardian}
                onCancel={() => {
                    setShowForm(false);
                    setEditingGuardian(null);
                }}
            />

            {/* Modal de Asignación a Alumno */}
            <AssignGuardianToStudentModal
                show={showAssignModal}
                guardian={selectedGuardian}
                onSuccess={handleAssignSuccess}
                onCancel={handleAssignCancel}
                showError={showError} // Pass showError
            />

            {/* Modal de Confirmación de Eliminación */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton style={{ 
                    backgroundColor: 'var(--bs-body-bg)', 
                    borderColor: 'var(--bs-border-color)' 
                }}>
                    <Modal.Title>
                        <span className="material-icons" style={{ fontSize: '1.5rem', verticalAlign: 'middle', marginRight: '0.5rem', color: '#dc3545' }}>
                            warning
                        </span>
                        Confirmar eliminación
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ 
                    backgroundColor: 'var(--bs-body-bg)', 
                    color: 'var(--bs-body-color)' 
                }}>
                    {relationshipToDelete && (
                        <p>
                            ¿Está seguro que desea eliminar la relación entre <strong>{relationshipToDelete.g_first_name} {relationshipToDelete.g_paternal_surname}</strong> y <strong>{relationshipToDelete.s_first_name} {relationshipToDelete.s_paternal_surname}</strong>?
                        </p>
                    )}
                    <Alert variant="warning" className="mt-3">
                        <small>Esta acción no se puede deshacer.</small>
                    </Alert>
                </Modal.Body>
                <Modal.Footer style={{ 
                    backgroundColor: 'var(--bs-body-bg)', 
                    borderColor: 'var(--bs-border-color)' 
                }}>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        <span className="material-icons" style={{ fontSize: '1rem', verticalAlign: 'middle', marginRight: '0.3rem' }}>
                            delete
                        </span>
                        Eliminar relación
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default GuardiansPage;
