// frontend/src/pages/AlumnosPage.jsx
import React, { useState, useMemo } from 'react';
import { Row, Col, Button, Nav, Card } from 'react-bootstrap';
import StudentList from '../components/StudentList';
import StudentForm from '../components/StudentForm';
import StudentDetail from '../components/StudentDetail';
import StudentFilter from '../components/StudentFilter';
import { usePermissions } from '../context/PermissionsContext'; // Import usePermissions

const AlumnosPage = ({ 
    alumnos, 
    loading, 
    salas,
    onEdit,
    onDelete,
    onFilter,
    onClearFilter,
    onSubmit
}) => {
    const { can } = usePermissions(); // Use the usePermissions hook
    const [showStudentForm, setShowStudentForm] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [editingStudent, setEditingStudent] = useState(null);
    const [activeTab, setActiveTab] = useState('todos');

    const canCreateAlumnos = can('alumnos', 'crear'); // Check permission for creating alumnos

    // Agrupar alumnos por sala y turno
    const groupedBySalaTurno = useMemo(() => {
        const groups = {};
        const alumnosValidos = Array.isArray(alumnos) ? alumnos : [];
        alumnosValidos.forEach(alumno => {
            if (alumno.sala && alumno.turno) {
                const key = `${alumno.sala.nombre}-${alumno.turno}`;
                if (!groups[key]) {
                    groups[key] = {
                        sala: alumno.sala.nombre,
                        turno: alumno.turno,
                        alumnos: []
                    };
                }
                groups[key].alumnos.push(alumno);
            }
        });
        return groups;
    }, [alumnos]);

    // Filtrar alumnos según pestaña activa
    const filteredAlumnos = useMemo(() => {
        const alumnosValidos = Array.isArray(alumnos) ? alumnos : [];
        if (activeTab === 'todos') {
            return alumnosValidos;
        }
        return groupedBySalaTurno[activeTab]?.alumnos || [];
    }, [activeTab, alumnos, groupedBySalaTurno]);

    const handleEditStudent = (student) => {
        setEditingStudent(student);
        setShowStudentForm(true);
        setSelectedStudent(null);
    };

    const handleSubmitForm = async (studentData) => {
        await onSubmit(editingStudent, studentData);
        setShowStudentForm(false);
        setEditingStudent(null);
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>
                    <span className="material-icons" style={{ fontSize: '2rem', verticalAlign: 'middle', marginRight: '0.5rem' }}>
                        school
                    </span>
                    Alumnos
                </h2>
                {canCreateAlumnos && ( // Conditionally render button
                    <Button 
                        onClick={() => {
                            setShowStudentForm(true);
                            setEditingStudent(null);
                            setSelectedStudent(null);
                        }}
                        style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            border: 'none',
                            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
                        }}
                    >
                        <span className="material-icons" style={{fontSize: '1.2rem', verticalAlign: 'middle', marginRight: '0.3rem'}}>add</span>
                        Nuevo Alumno
                    </Button>
                )}
            </div>

            <StudentFilter 
                onFilter={onFilter}
                onClear={onClearFilter}
                salas={salas}
            />

            {/* Pestañas de navegación */}
            <Nav variant="tabs" activeKey={activeTab} onSelect={setActiveTab} className="mb-4">
                <Nav.Item>
                    <Nav.Link eventKey="todos">
                        <span className="material-icons" style={{ fontSize: '1rem', verticalAlign: 'middle' }}>
                            groups
                        </span>
                        {' '}Todos ({Array.isArray(alumnos) ? alumnos.length : 0})
                    </Nav.Link>
                </Nav.Item>
                {Object.keys(groupedBySalaTurno).sort().map(key => {
                    const group = groupedBySalaTurno[key];
                    return (
                        <Nav.Item key={key}>
                            <Nav.Link eventKey={key}>
                                <span className="material-icons" style={{ fontSize: '1rem', verticalAlign: 'middle' }}>
                                    class
                                </span>
                                {' '}{group.sala} - {group.turno} ({Array.isArray(group.alumnos) ? group.alumnos.length : 0})
                            </Nav.Link>
                        </Nav.Item>
                    );
                })}
            </Nav>

            {Array.isArray(filteredAlumnos) && filteredAlumnos.length === 0 && !loading ? (
                <Card>
                    <Card.Body className="text-center p-5">
                        <span className="material-icons" style={{ fontSize: '4rem', color: '#ccc' }}>
                            inbox
                        </span>
                        <p className="text-muted mt-3">No hay alumnos en esta categoría</p>
                    </Card.Body>
                </Card>
            ) : null}

            {showStudentForm && (
                <StudentForm
                    show={showStudentForm}
                    initialData={editingStudent || {}}
                    onSubmit={handleSubmitForm}
                    onCancel={() => {
                        setShowStudentForm(false);
                        setEditingStudent(null);
                    }}
                />
            )}

            <StudentList
                alumnos={filteredAlumnos}
                loading={loading}
                onEdit={handleEditStudent}
                onDelete={onDelete}
                onSelect={setSelectedStudent}
            />

            <StudentDetail 
                student={selectedStudent}
                show={!!selectedStudent}
                onHide={() => setSelectedStudent(null)}
            />
        </>
    );
};

export default AlumnosPage;
