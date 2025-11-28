import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Container, ButtonGroup, Button } from 'react-bootstrap';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PermissionsProvider } from './context/PermissionsContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import Dashboard from './components/Dashboard';
import useAlumnos from './hooks/useAlumnos';
import useSalas from './hooks/useSalas';
import ConfirmModal from './components/ConfirmModal';
import ToastNotification from './components/ToastNotification';
import OcupacionModal from './components/OcupacionModal';
import alumnoService from './services/alumnoService';
import useToast from './hooks/useToast'; // Import useToast

// Importar componentes de páginas
import AlumnosPage from './pages/AlumnosPage';
import SalasPage from './pages/SalasPage';
import PersonalPage from './pages/PersonalPage';
import ConfiguracionPage from './pages/ConfiguracionPage';
import GuardiansPage from './pages/GuardiansPage';
import ParentPortalPage from './pages/ParentPortalPage';

function AppContent() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const { toastConfig, showSuccess, showError, hideToast } = useToast(); // Use the useToast hook
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showOcupacionModal, setShowOcupacionModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [confirmData, setConfirmData] = useState({ title: '', message: '' });
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('darkMode');
        return saved ? JSON.parse(saved) : false;
    });

    const { alumnos, loading: loadingAlumnos, searchAlumnos, fetchAlumnos, addAlumno, updateAlumno, deleteAlumno } = useAlumnos();
    const { salas, loading: loadingSalas, fetchSalas, addSala, updateSala, deleteSala } = useSalas();

    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
    }, [darkMode]);

    const isActive = (path) => location.pathname === path || (path === '/dashboard' && location.pathname === '/');

    // Student handlers
    const handleStudentSubmit = async (editingStudent, studentData) => {
        try {
            if (editingStudent) {
                await updateAlumno(editingStudent.id, studentData);
                showSuccess('Éxito', 'Alumno actualizado correctamente');
            } else {
                await addAlumno(studentData);
                showSuccess('Éxito', 'Alumno registrado correctamente');
            }
        } catch (error) {
            showError('Error', `Error: ${error.message}`);
        }
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
                setShowConfirmModal(false);
                showSuccess('Éxito', 'Alumno eliminado correctamente');
            } catch (error) {
                setShowConfirmModal(false);
                showError('Error', `Error al eliminar: ${error.message}`);
            }
        });
        setShowConfirmModal(true);
    };

    // Classroom handlers
    const handleClassroomSubmit = async (editingClassroom, classroomData) => {
        try {
            if (editingClassroom) {
                await updateSala(editingClassroom.id, classroomData);
                showSuccess('Éxito', 'Sala actualizada correctamente');
            } else {
                await addSala(classroomData);
                showSuccess('Éxito', 'Sala registrada correctamente');
            }
        } catch (error) {
            showError('Error', `Error: ${error.message}`);
        }
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
                setShowConfirmModal(false);
                showSuccess('Éxito', 'Sala eliminada correctamente');
            } catch (error) {
                setShowConfirmModal(false);
                showError('Error', `Error al eliminar: ${error.message}`);
            }
        });
        setShowConfirmModal(true);
    };

    const handleFilter = async (filters) => {
        try {
            await searchAlumnos(filters);
        } catch (error) {
            showError('Error', `Error en la búsqueda: ${error.message}`);
        }
    };

    const handleClearFilter = async () => {
        try {
            await fetchAlumnos();
        } catch (error) {
            showError('Error', `Error al cargar alumnos: ${error.message}`);
        }
    };

    const handleAssignStudent = async (studentId, classroomId) => {
        try {
            await alumnoService.assignClassroom(studentId, classroomId);
            showSuccess('Éxito', 'Alumno asignado correctamente a la sala');
            await fetchAlumnos();
            await fetchSalas();
        } catch (error) {
            showError('Error', `Error al asignar alumno: ${error.message}`);
        }
    };

    return (
        <>
            <Container className="mt-2 mb-3">
                <div className="text-center mb-2 position-relative">
                    <h1 className="h5 mb-0" style={{ fontWeight: '600' }}>
                        <span className="material-icons" style={{
                            fontSize: '1.2rem',
                            color: darkMode ? '#8b5cf6' : '#667eea',
                            verticalAlign: 'middle',
                            marginRight: '0.3rem'
                        }}>school</span>
                        <span style={{
                            color: darkMode ? '#8b5cf6' : '#667eea'
                        }}>Sistema de Gestión - Jardín de Infantes</span>
                    </h1>
                    {user && (
                        <div style={{
                            position: 'absolute',
                            right: '0',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            display: 'flex',
                            gap: '0.5rem',
                            alignItems: 'center'
                        }}>
                            <button 
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '0.25rem',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s ease'
                                }}
                                onClick={() => setDarkMode(!darkMode)}
                                title={darkMode ? 'Modo claro' : 'Modo oscuro'}
                                onMouseEnter={(e) => e.currentTarget.style.background = darkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(102, 126, 234, 0.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <span className="material-icons" style={{ 
                                    fontSize: '1.2rem',
                                    color: darkMode ? '#8b5cf6' : '#667eea'
                                }}>
                                    {darkMode ? 'light_mode' : 'dark_mode'}
                                </span>
                            </button>
                            <button 
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '0.25rem',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s ease'
                                }}
                                onClick={() => setShowLogoutModal(true)}
                                title="Cerrar sesión"
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(220, 38, 38, 0.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <span className="material-icons" style={{ 
                                    fontSize: '1.2rem',
                                    color: '#dc2626'
                                }}>
                                    logout
                                </span>
                            </button>
                        </div>
                    )}
                    {!user && (
                        <button 
                            style={{
                                position: 'absolute',
                                right: '0',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '0.25rem',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s ease'
                            }}
                            onClick={() => setDarkMode(!darkMode)}
                            title={darkMode ? 'Modo claro' : 'Modo oscuro'}
                            onMouseEnter={(e) => e.currentTarget.style.background = darkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(102, 126, 234, 0.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            <span className="material-icons" style={{ 
                                fontSize: '1.2rem',
                                color: darkMode ? '#8b5cf6' : '#667eea'
                            }}>
                                {darkMode ? 'light_mode' : 'dark_mode'}
                            </span>
                        </button>
                    )}
                </div>

                {user && (
                <ButtonGroup className="mb-2 w-100" size="sm">
                    <Button 
                        variant={isActive('/dashboard') ? 'primary' : 'outline-primary'}
                        onClick={() => navigate('/dashboard')}
                        className="py-2"
                        style={{
                            transition: 'all 0.2s ease',
                            borderWidth: '1.5px',
                            fontWeight: '500',
                            fontSize: '0.95rem',
                            background: isActive('/dashboard') ? '#667eea' : 'transparent',
                            borderColor: '#667eea',
                            color: isActive('/dashboard') ? 'white' : '#667eea'
                        }}
                    >
                        <span className="material-icons" style={{fontSize: '1.2rem', verticalAlign: 'middle', marginRight: '0.3rem'}}>dashboard</span> Dashboard
                    </Button>
                    <Button 
                        variant={isActive('/alumnos') ? 'primary' : 'outline-primary'}
                        onClick={() => navigate('/alumnos')}
                        className="py-2"
                        style={{
                            transition: 'all 0.2s ease',
                            borderWidth: '1.5px',
                            fontWeight: '500',
                            fontSize: '0.95rem',
                            background: isActive('/alumnos') ? '#667eea' : 'transparent',
                            borderColor: '#667eea',
                            color: isActive('/alumnos') ? 'white' : '#667eea'
                        }}
                    >
                        <span className="material-icons" style={{fontSize: '1.2rem', verticalAlign: 'middle', marginRight: '0.3rem'}}>people</span> Alumnos
                    </Button>
                    <Button 
                        variant={isActive('/salas') ? 'primary' : 'outline-primary'}
                        onClick={() => navigate('/salas')}
                        className="py-2"
                        style={{
                            transition: 'all 0.2s ease',
                            borderWidth: '1.5px',
                            fontWeight: '500',
                            fontSize: '0.95rem',
                            background: isActive('/salas') ? '#667eea' : 'transparent',
                            borderColor: '#667eea',
                            color: isActive('/salas') ? 'white' : '#667eea'
                        }}
                    >
                        <span className="material-icons" style={{fontSize: '1.2rem', verticalAlign: 'middle', marginRight: '0.3rem'}}>meeting_room</span> Salas
                    </Button>
                    <Button 
                        variant={isActive('/personal') ? 'primary' : 'outline-primary'}
                        onClick={() => navigate('/personal')}
                        className="py-2"
                        style={{
                            transition: 'all 0.2s ease',
                            borderWidth: '1.5px',
                            fontWeight: '500',
                            fontSize: '0.95rem',
                            background: isActive('/personal') ? '#667eea' : 'transparent',
                            borderColor: '#667eea',
                            color: isActive('/personal') ? 'white' : '#667eea'
                        }}
                    >
                        <span className="material-icons" style={{fontSize: '1.2rem', verticalAlign: 'middle', marginRight: '0.3rem'}}>badge</span> Personal
                    </Button>
                    <Button 
                        variant={isActive('/responsables') ? 'primary' : 'outline-primary'}
                        onClick={() => navigate('/responsables')}
                        className="py-2"
                        style={{
                            transition: 'all 0.2s ease',
                            borderWidth: '1.5px',
                            fontWeight: '500',
                            fontSize: '0.95rem',
                            background: isActive('/responsables') ? '#667eea' : 'transparent',
                            borderColor: '#667eea',
                            color: isActive('/responsables') ? 'white' : '#667eea'
                        }}
                    >
                        <span className="material-icons" style={{fontSize: '1.2rem', verticalAlign: 'middle', marginRight: '0.3rem'}}>family_restroom</span> Responsables
                    </Button>
                    {(user.role === 'Administrator' || user.role === 'Directivo') && ( // Updated role names
                        <Button 
                            variant={isActive('/configuracion') ? 'primary' : 'outline-primary'}
                            onClick={() => navigate('/configuracion')}
                            className="py-2"
                            style={{
                                transition: 'all 0.2s ease',
                                borderWidth: '1.5px',
                                fontWeight: '500',
                                fontSize: '0.95rem',
                                background: isActive('/configuracion') ? '#667eea' : 'transparent',
                                borderColor: '#667eea',
                                color: isActive('/configuracion') ? 'white' : '#667eea'
                            }}
                        >
                            <span className="material-icons" style={{fontSize: '1.2rem', verticalAlign: 'middle', marginRight: '0.3rem'}}>settings</span> Configuración
                        </Button>
                    )}
                </ButtonGroup>
                )}

                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/parent-portal" element={<ParentPortalPage />} />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route 
                        path="/dashboard" 
                        element={
                            <ProtectedRoute>
                                <Dashboard 
                                        alumnos={alumnos} 
                                    salas={salas}
                                    onNavigate={(view) => {
                                        const routeMap = {
                                            'students': '/alumnos',
                                            'classrooms': '/salas',
                                            'responsables': '/responsables',
                                            'alumnos': '/alumnos',
                                            'salas': '/salas',
                                            'personal': '/personal',
                                            'configuracion': '/configuracion'
                                        };
                                        navigate(routeMap[view] || `/${view}`);
                                    }}
                                    onShowOcupacion={() => setShowOcupacionModal(true)}
                                />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/alumnos" 
                        element={
                            <ProtectedRoute>
                                <AlumnosPage 
                                    alumnos={alumnos}
                                    loading={loadingAlumnos}
                                    salas={salas}
                                    onDelete={handleDeleteStudent}
                                    onFilter={handleFilter}
                                    onClearFilter={handleClearFilter}
                                    onSubmit={handleStudentSubmit}
                                    showSuccess={showSuccess} // Pass showSuccess
                                    showError={showError}     // Pass showError
                                />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/salas" 
                        element={
                            <ProtectedRoute>
                                <SalasPage 
                                    salas={salas}
                                    alumnos={alumnos}
                                    loading={loadingSalas}
                                    loadingAlumnos={loadingAlumnos}
                                    onDelete={handleDeleteClassroom}
                                    onSubmit={handleClassroomSubmit}
                                    onAssignStudent={handleAssignStudent}
                                    showSuccess={showSuccess} // Pass showSuccess
                                    showError={showError}     // Pass showError
                                />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/personal" 
                        element={
                            <ProtectedRoute>
                                <PersonalPage darkMode={darkMode} showSuccess={showSuccess} showError={showError} />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/configuracion" 
                        element={
                            <ProtectedRoute>
                                <ConfiguracionPage darkMode={darkMode} showSuccess={showSuccess} showError={showError} />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/responsables" 
                        element={
                            <ProtectedRoute>
                                <GuardiansPage showSuccess={showSuccess} showError={showError} />
                            </ProtectedRoute>
                        } 
                    />
                </Routes>

                <ConfirmModal
                    show={showConfirmModal}
                    onHide={() => setShowConfirmModal(false)}
                    onConfirm={confirmAction}
                    title={confirmData.title}
                    message={confirmData.message}
                    variant="danger"
                />
                
                <ConfirmModal
                    show={showLogoutModal}
                    onHide={() => setShowLogoutModal(false)}
                    onConfirm={() => {
                        logout();
                        navigate('/login');
                        setShowLogoutModal(false);
                        showSuccess('Sesión cerrada', 'Has cerrado sesión correctamente.');
                    }}
                    title="Cerrar Sesión"
                    message="¿Está seguro que desea cerrar sesión?"
                    variant="danger"
                />

                <ToastNotification
                    show={toastConfig.show}
                    onClose={hideToast}
                    message={toastConfig.message}
                    variant={toastConfig.variant}
                    title={toastConfig.title} // Pass the title from toastConfig
                />

                <OcupacionModal
                    show={showOcupacionModal}
                    onHide={() => setShowOcupacionModal(false)}
                    salas={salas}
                />
            </Container>
        </>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <PermissionsProvider>
                    <AppContent />
                </PermissionsProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
