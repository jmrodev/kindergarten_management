// frontend/src/pages/SalasPage.jsx
import React, { useState, useMemo } from 'react';
import { Row, Col, Button, Nav, Card } from 'react-bootstrap';
import ClassroomList from '../components/ClassroomList';
import ClassroomForm from '../components/ClassroomForm';
import SalaDetail from '../components/SalaDetail';
import AssignStudentModal from '../components/AssignStudentModal';
import AssignedStudentsModal from '../components/AssignedStudentsModal';

const SalasPage = ({
    salas,
    alumnos,
    loading,
    loadingAlumnos,
    onEdit,
    onDelete,
    onSubmit,
    onAssignStudent,
    showSuccess, // New prop
    showError     // New prop
}) => {
    const [showClassroomForm, setShowClassroomForm] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showAssignedModal, setShowAssignedModal] = useState(false);
    const [selectedClassroom, setSelectedClassroom] = useState(null);
    const [editingClassroom, setEditingClassroom] = useState(null);
    const [classroomForAssignment, setClassroomForAssignment] = useState(null);
    const [classroomForView, setClassroomForView] = useState(null);
    const [activeTab, setActiveTab] = useState('todos');

    // Agrupar salas por turno
    const groupedByTurno = useMemo(() => {
        const groups = {};
        salas.forEach(sala => {
            const turno = sala.turno || 'Sin turno';
            if (!groups[turno]) {
                groups[turno] = [];
            }
            groups[turno].push(sala);
        });
        return groups;
    }, [salas]);

    // Filtrar salas según pestaña activa
    const filteredSalas = useMemo(() => {
        if (activeTab === 'todos') {
            return salas;
        }
        return groupedByTurno[activeTab] || [];
    }, [activeTab, salas, groupedByTurno]);

    const handleEditClassroom = (classroom) => {
        setEditingClassroom(classroom);
        setShowClassroomForm(true);
        setSelectedClassroom(null);
    };

    const handleSubmitForm = async (classroomData) => {
        await onSubmit(editingClassroom, classroomData);
        setShowClassroomForm(false);
        setEditingClassroom(null);
    };

    const handleOpenAssignModal = (classroom) => {
        setClassroomForAssignment(classroom);
        setShowAssignModal(true);
    };

    const handleViewAssignedStudents = (classroom) => {
        setClassroomForView(classroom);
        setShowAssignedModal(true);
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>
                    <span className="material-icons" style={{ fontSize: '2rem', verticalAlign: 'middle', marginRight: '0.5rem' }}>
                        class
                    </span>
                    Salas
                </h2>
                <Button 
                    onClick={() => {
                        setShowClassroomForm(true);
                        setEditingClassroom(null);
                        setSelectedClassroom(null);
                    }}
                    style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
                    }}
                >
                    <span className="material-icons" style={{fontSize: '1.2rem', verticalAlign: 'middle', marginRight: '0.3rem'}}>add</span> 
                    Nueva Sala
                </Button>
            </div>

            {/* Pestañas de navegación */}
            <Nav variant="tabs" activeKey={activeTab} onSelect={setActiveTab} className="mb-4">
                <Nav.Item>
                    <Nav.Link eventKey="todos">
                        <span className="material-icons" style={{ fontSize: '1rem', verticalAlign: 'middle' }}>
                            view_module
                        </span>
                        {' '}Todas ({salas.length})
                    </Nav.Link>
                </Nav.Item>
                {Object.keys(groupedByTurno).sort().map(turno => (
                    <Nav.Item key={turno}>
                        <Nav.Link eventKey={turno}>
                            <span className="material-icons" style={{ fontSize: '1rem', verticalAlign: 'middle' }}>
                                schedule
                            </span>
                            {' '}{turno} ({groupedByTurno[turno].length})
                        </Nav.Link>
                    </Nav.Item>
                ))}
            </Nav>

            {filteredSalas.length === 0 && !loading ? (
                <Card>
                    <Card.Body className="text-center p-5">
                        <span className="material-icons" style={{ fontSize: '4rem', color: '#ccc' }}>
                            inbox
                        </span>
                        <p className="text-muted mt-3">No hay salas en esta categoría</p>
                    </Card.Body>
                </Card>
            ) : null}

            {showClassroomForm && (
                <ClassroomForm
                    show={showClassroomForm}
                    initialData={editingClassroom || {}}
                    onSubmit={handleSubmitForm}
                    onCancel={() => {
                        setShowClassroomForm(false);
                        setEditingClassroom(null);
                    }}
                    showError={showError} // Pass showError
                />
            )}

            <ClassroomList
                salas={filteredSalas}
                loading={loading}
                onEdit={handleEditClassroom}
                onDelete={onDelete}
                onSelect={setSelectedClassroom}
                onAssignStudent={handleOpenAssignModal}
                onViewAssigned={handleViewAssignedStudents}
                showSuccess={showSuccess} // Pass showSuccess
                showError={showError}     // Pass showError
            />

            <SalaDetail 
                sala={selectedClassroom}
                show={!!selectedClassroom}
                onHide={() => setSelectedClassroom(null)}
            />

            <AssignStudentModal
                show={showAssignModal}
                onHide={() => {
                    setShowAssignModal(false);
                    setClassroomForAssignment(null);
                }}
                sala={classroomForAssignment}
                alumnos={alumnos}
                loading={loadingAlumnos}
                onAssign={onAssignStudent}
            />

            <AssignedStudentsModal
                show={showAssignedModal}
                onHide={() => {
                    setShowAssignedModal(false);
                    setClassroomForView(null);
                }}
                sala={classroomForView}
                alumnos={alumnos}
                loading={loadingAlumnos}
            />
        </>
    );
};

export default SalasPage;
