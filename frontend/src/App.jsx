// frontend/src/App.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Button, ButtonGroup } from 'react-bootstrap';
import StudentList from './components/StudentList';
import StudentForm from './components/StudentForm';
import StudentDetail from './components/StudentDetail';
import StudentFilter from './components/StudentFilter';
import useAlumnos from './hooks/useAlumnos';
import ClassroomList from './components/ClassroomList';
import ClassroomForm from './components/ClassroomForm';
import SalaDetail from './components/SalaDetail';
import useSalas from './hooks/useSalas';
import ConfirmModal from './components/ConfirmModal';
import ToastNotification from './components/ToastNotification';

function App() {
    const [activeView, setActiveView] = useState('students'); // 'students' or 'classrooms'
    const [showStudentForm, setShowStudentForm] = useState(false);
    const [showClassroomForm, setShowClassroomForm] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedClassroom, setSelectedClassroom] = useState(null);
    const [editingStudent, setEditingStudent] = useState(null);
    const [editingClassroom, setEditingClassroom] = useState(null);
    const [message, setMessage] = useState(null);
    
    // Modal de confirmación
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [confirmData, setConfirmData] = useState({ title: '', message: '' });

    // Importar TODOS los valores del hook, no solo las funciones
    const { alumnos, loading: loadingAlumnos, searchAlumnos, fetchAlumnos, addAlumno, updateAlumno, deleteAlumno } = useAlumnos();
    const { salas, loading: loadingSalas, addSala, updateSala, deleteSala } = useSalas();

    // Student handlers
    const handleStudentSubmit = async (studentData) => {
        try {
            if (editingStudent) {
                await updateAlumno(editingStudent.id, studentData);
                setMessage({ type: 'success', text: 'Alumno actualizado correctamente' });
            } else {
                await addAlumno(studentData);
                setMessage({ type: 'success', text: 'Alumno registrado correctamente' });
            }
            setShowStudentForm(false);
            setEditingStudent(null);
            
        } catch (error) {
            setMessage({ type: 'danger', text: `Error: ${error.message}` });
        }
    };

    const handleEditStudent = (student) => {
        setEditingStudent(student);
        setShowStudentForm(true);
        setSelectedStudent(null);
    };

    const handleDeleteStudent = (id) => {
        const student = alumnos.find(a => a.id === id);
        const studentName = student ? `${student.nombre} ${student.apellidoPaterno}` : 'este alumno';
        
        setConfirmData({
            title: 'Confirmar eliminación',
            message: `¿Está seguro de que desea eliminar a ${studentName}? Esta acción no se puede deshacer.`
        });
        setConfirmAction(() => async () => {
            try {
                await deleteAlumno(id);
                setMessage({ type: 'success', text: 'Alumno eliminado correctamente' });
                setSelectedStudent(null);
                
            } catch (error) {
                setMessage({ type: 'danger', text: `Error al eliminar: ${error.message}` });
            }
        });
        setShowConfirmModal(true);
    };

    const handleSelectStudent = (student) => {
        setSelectedStudent(student);
    };

    const handleCancelStudentForm = () => {
        setShowStudentForm(false);
        setEditingStudent(null);
    };

    // Classroom handlers
    const handleClassroomSubmit = async (classroomData) => {
        try {
            if (editingClassroom) {
                await updateSala(editingClassroom.id, classroomData);
                setMessage({ type: 'success', text: 'Sala actualizada correctamente' });
            } else {
                await addSala(classroomData);
                setMessage({ type: 'success', text: 'Sala registrada correctamente' });
            }
            setShowClassroomForm(false);
            setEditingClassroom(null);
            
        } catch (error) {
            setMessage({ type: 'danger', text: `Error: ${error.message}` });
        }
    };

    const handleEditClassroom = (classroom) => {
        setEditingClassroom(classroom);
        setShowClassroomForm(true);
        setSelectedClassroom(null);
    };

    const handleDeleteClassroom = (id) => {
        const classroom = salas.find(s => s.id === id);
        const classroomName = classroom ? classroom.nombre : 'esta sala';
        
        setConfirmData({
            title: 'Confirmar eliminación',
            message: `¿Está seguro de que desea eliminar la sala "${classroomName}"? Esta acción no se puede deshacer.`
        });
        setConfirmAction(() => async () => {
            try {
                await deleteSala(id);
                setMessage({ type: 'success', text: 'Sala eliminada correctamente' });
                setSelectedClassroom(null);
                
            } catch (error) {
                setMessage({ type: 'danger', text: `Error al eliminar: ${error.message}` });
            }
        });
        setShowConfirmModal(true);
    };

    const handleSelectClassroom = (classroom) => {
        setSelectedClassroom(classroom);
        setShowClassroomForm(false);
    };

    const handleCancelClassroomForm = () => {
        setShowClassroomForm(false);
        setEditingClassroom(null);
    };

    const switchToStudents = () => {
        setActiveView('students');
        setShowClassroomForm(false);
        setSelectedClassroom(null);
        setEditingClassroom(null);
    };

    const switchToClassrooms = () => {
        setActiveView('classrooms');
        setShowStudentForm(false);
        setSelectedStudent(null);
        setEditingStudent(null);
    };

    // Filter handlers
    const handleFilter = async (filters) => {
        try {
            await searchAlumnos(filters);
        } catch (error) {
            setMessage({ type: 'danger', text: `Error en la búsqueda: ${error.message}` });
        }
    };

    const handleClearFilter = async () => {
        try {
            await fetchAlumnos();
        } catch (error) {
            setMessage({ type: 'danger', text: `Error al cargar alumnos: ${error.message}` });
        }
    };

    return (
        <Container className="mt-4 mb-5">
            <div className="text-center mb-5">
                <h1 className="display-4 fw-bold mb-2" style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                }}>
                    <span style={{fontSize: '3rem'}}>🎓</span> Sistema de Gestión
                </h1>
                <p className="text-muted fs-5">Jardín de Infantes</p>
            </div>

            <ButtonGroup className="mb-4 w-100 shadow-sm" size="lg">
                <Button 
                    variant={activeView === 'students' ? 'primary' : 'outline-primary'}
                    onClick={switchToStudents}
                    className="py-3 fw-semibold"
                    style={{
                        transition: 'all 0.3s ease',
                        borderWidth: '2px'
                    }}
                >
                    <span style={{fontSize: '1.5rem'}}>👶</span> Alumnos
                </Button>
                <Button 
                    variant={activeView === 'classrooms' ? 'primary' : 'outline-primary'}
                    onClick={switchToClassrooms}
                    className="py-3 fw-semibold"
                    style={{
                        transition: 'all 0.3s ease',
                        borderWidth: '2px'
                    }}
                >
                    <span style={{fontSize: '1.5rem'}}>🏫</span> Salas
                </Button>
            </ButtonGroup>

            {activeView === 'students' && (
                <>
                    <Row className="mb-4">
                        <Col>
                            <Button 
                                variant="success" 
                                size="lg"
                                onClick={() => {
                                    setShowStudentForm(true);
                                    setEditingStudent(null);
                                    setSelectedStudent(null);
                                }}
                                className="shadow-sm px-4 py-3 fw-semibold"
                                style={{
                                    background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                                    border: 'none',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                                }}
                            >
                                <span style={{fontSize: '1.3rem'}}>➕</span> Registrar Nuevo Alumno
                            </Button>
                        </Col>
                    </Row>

                    <StudentFilter 
                        onFilter={handleFilter}
                        onClear={handleClearFilter}
                        salas={salas}
                    />

                    {showStudentForm && (
                        <StudentForm
                            show={showStudentForm}
                            initialData={editingStudent || {}}
                            onSubmit={handleStudentSubmit}
                            onCancel={handleCancelStudentForm}
                        />
                    )}

                    <StudentList
                        alumnos={alumnos}
                        loading={loadingAlumnos}
                        onEdit={handleEditStudent}
                        onDelete={handleDeleteStudent}
                        onSelect={handleSelectStudent}
                    />

                    <StudentDetail 
                        student={selectedStudent}
                        show={!!selectedStudent}
                        onHide={() => setSelectedStudent(null)}
                    />
                </>
            )}

            {activeView === 'classrooms' && (
                <>
                    <Row className="mb-4">
                        <Col>
                            <Button 
                                variant="success"
                                size="lg"
                                onClick={() => {
                                    setShowClassroomForm(true);
                                    setEditingClassroom(null);
                                    setSelectedClassroom(null);
                                }}
                                className="shadow-sm px-4 py-3 fw-semibold"
                                style={{
                                    background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                                    border: 'none',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                                }}
                            >
                                <span style={{fontSize: '1.3rem'}}>➕</span> Registrar Nueva Sala
                            </Button>
                        </Col>
                    </Row>

                    {showClassroomForm && (
                        <ClassroomForm
                            show={showClassroomForm}
                            initialData={editingClassroom || {}}
                            onSubmit={handleClassroomSubmit}
                            onCancel={handleCancelClassroomForm}
                        />
                    )}

                    {selectedClassroom && !showClassroomForm && (
                        <SalaDetail sala={selectedClassroom} />
                    )}

                    <ClassroomList
                        salas={salas}
                        loading={loadingSalas}
                        onEdit={handleEditClassroom}
                        onDelete={handleDeleteClassroom}
                        onSelect={handleSelectClassroom}
                    />
                </>
            )}
            
            {/* Modal de confirmación */}
            <ConfirmModal
                show={showConfirmModal}
                onHide={() => setShowConfirmModal(false)}
                onConfirm={confirmAction}
                title={confirmData.title}
                message={confirmData.message}
                variant="danger"
            />
            
            {/* Toast de notificaciones */}
            <ToastNotification
                show={!!message}
                onClose={() => setMessage(null)}
                message={message?.text}
                variant={message?.type}
            />
        </Container>
    );
}

export default App;
