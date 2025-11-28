// frontend/src/pages/ConfiguracionPage.jsx
import { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Table, Badge, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ROLE_TRANSLATIONS } from '../utils/constants'; // Import from constants.js

const API_URL = 'http://localhost:3000/api';

function ConfiguracionPage({ darkMode, showSuccess, showError }) { // Accept showSuccess and showError
    const { user } = useAuth();
    const navigate = useNavigate();
    const [permissions, setPermissions] = useState({});
    const [modules, setModules] = useState([]);
    const [actions, setActions] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || (user.role !== 'Administrator' && user.role !== 'Directivo')) { // Updated role names
            navigate('/dashboard');
            return;
        }
        loadPermissions();
    }, [user, navigate]);

    const loadPermissions = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            const [permsRes, modsRes, actsRes, rolesRes] = await Promise.all([
                axios.get(`${API_URL}/permissions`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`${API_URL}/permissions/modules`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`${API_URL}/permissions/actions`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`${API_URL}/staff/roles`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            const organizedPerms = {};
            permsRes.data.forEach(perm => {
                if (!organizedPerms[perm.role_name]) {
                    organizedPerms[perm.role_name] = {};
                }
                if (!organizedPerms[perm.role_name][perm.module_key]) {
                    organizedPerms[perm.role_name][perm.module_key] = [];
                }
                if (perm.has_permission) {
                    organizedPerms[perm.role_name][perm.module_key].push(perm.action_key);
                }
            });

            setPermissions(organizedPerms);
            setModules(modsRes.data);
            setActions(actsRes.data);
            setRoles(rolesRes.data);
        } catch (error) {
            console.error('Error loading permissions:', error);
            showError('Error', 'Error al cargar permisos'); // Use showError
        } finally {
            setLoading(false);
        }
    };

    const isPermissionLocked = (roleName, moduleKey) => {
        // Permisos bloqueados que no se pueden modificar
        const lockedPermissions = {
            Administrator: ['personal', 'configuracion'], // Updated role names
            Directivo: ['personal', 'configuracion']     // Updated role names
        };
        
        return lockedPermissions[roleName]?.includes(moduleKey) || false;
    };

    const togglePermission = async (roleId, roleName, moduleId, moduleKey, actionId, actionKey) => {
        // Verificar si el permiso está bloqueado
        if (isPermissionLocked(roleName, moduleKey)) {
            showError('Advertencia', 'Los permisos de Personal y Configuración para Administrador/Directivo están protegidos y no pueden modificarse'); // Use showError
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const currentHasPermission = hasPermission(roleName, moduleKey, actionKey);

            await axios.post(`${API_URL}/permissions/toggle`, {
                roleId,
                moduleId,
                actionId,
                isGranted: !currentHasPermission
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const newPerms = { ...permissions };
            if (!newPerms[roleName]) newPerms[roleName] = {};
            if (!newPerms[roleName][moduleKey]) newPerms[roleName][moduleKey] = [];

            if (currentHasPermission) {
                newPerms[roleName][moduleKey] = newPerms[roleName][moduleKey].filter(a => a !== actionKey);
            } else {
                newPerms[roleName][moduleKey].push(actionKey);
            }

            setPermissions(newPerms);
            showSuccess('Éxito', `Permiso ${!currentHasPermission ? 'otorgado' : 'revocado'} exitosamente`); // Use showSuccess
        } catch (error) {
            console.error('Error toggling permission:', error);
            showError('Error', 'Error al cambiar permiso'); // Use showError
        }
    };

    const hasPermission = (role, module, action) => {
        return permissions[role]?.[module]?.includes(action) || false;
    };

    const getRoleBadgeVariant = (role) => {
        const variants = {
            Administrator: 'danger',
            Directivo: 'warning',
            Secretary: 'info',
            Teacher: 'success',
            Guardian: 'secondary'
        };
        return variants[role] || 'secondary';
    };

    const getActionsByModule = (moduleKey) => {
        const moduleActions = {
            alumnos: ['ver', 'crear', 'editar', 'eliminar'],
            salas: ['ver', 'crear', 'editar', 'eliminar'],
            personal: ['ver', 'crear', 'editar', 'eliminar'],
            tutores: ['ver', 'crear', 'editar', 'eliminar'],
            asistencia: ['ver', 'registrar', 'editar', 'reportes'],
            reportes: ['ver', 'exportar'],
            mensajeria: ['ver', 'enviar', 'gestionar'],
            configuracion: ['ver', 'modificar']
        };
        
        return actions.filter(a => moduleActions[moduleKey]?.includes(a.action_key));
    };

    if (!user || (user.role !== 'Administrator' && user.role !== 'Directivo')) { // Updated role names
        return null;
    }

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Cargando configuración...</p>
            </Container>
        );
    }

    return (
        <Container fluid style={{ 
            paddingTop: '2rem',
            paddingBottom: '2rem',
            minHeight: 'calc(100vh - 80px)'
        }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 style={{ color: darkMode ? '#e5e7eb' : '#212529', marginBottom: '0.5rem' }}>
                        <span className="material-icons" style={{ fontSize: '2rem', verticalAlign: 'middle', marginRight: '0.5rem' }}>
                            settings
                        </span>
                        Configuración del Sistema
                    </h2>
                    <p style={{ color: darkMode ? '#9ca3af' : '#6c757d', marginBottom: 0 }}>
                        Gestión de permisos y roles del personal
                    </p>
                </div>
            </div>

            <Alert variant="info" className="mb-4">
                <span className="material-icons" style={{ fontSize: '1.2rem', verticalAlign: 'middle', marginRight: '0.5rem' }}>
                    info
                </span>
                Esta sección solo es visible para <strong>Administradores</strong> y <strong>Directores/as</strong>. 
                Haz clic en los iconos ✓ o ✗ para cambiar permisos.
            </Alert>

            <Row className="g-4">
                {modules.map(module => (
                    <Col xs={12} key={module.id}>
                        <Card style={{
                            background: darkMode ? '#1f2937' : '#fff',
                            border: `1px solid ${darkMode ? '#374151' : '#dee2e6'}`,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                            <Card.Header style={{
                                background: darkMode ? '#374151' : '#f8f9fa',
                                borderBottom: `1px solid ${darkMode ? '#4b5563' : '#dee2e6'}`,
                                fontWeight: 'bold'
                            }}>
                                <span className="material-icons" style={{ fontSize: '1.2rem', verticalAlign: 'middle', marginRight: '0.5rem' }}>
                                    {module.icon}
                                </span>
                                {module.module_name}
                            </Card.Header>
                            <Card.Body>
                                <Table responsive hover style={{
                                    color: darkMode ? '#e5e7eb' : '#212529',
                                    marginBottom: 0
                                }}>
                                    <thead>
                                        <tr>
                                            <th style={{ 
                                                background: darkMode ? '#374151' : '#f8f9fa',
                                                border: `1px solid ${darkMode ? '#4b5563' : '#dee2e6'}`
                                            }}>Rol</th>
                                            {getActionsByModule(module.module_key).map(action => (
                                                <th key={action.id} className="text-center" style={{ 
                                                    background: darkMode ? '#374151' : '#f8f9fa',
                                                    border: `1px solid ${darkMode ? '#4b5563' : '#dee2e6'}`
                                                }}>
                                                    {action.action_name}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {roles.map(role => (
                                            <tr key={role.id}>
                                                <td style={{ 
                                                    border: `1px solid ${darkMode ? '#4b5563' : '#dee2e6'}`,
                                                    verticalAlign: 'middle'
                                                }}>
                                                    <Badge bg={getRoleBadgeVariant(role.role_name)}>
                                                        {ROLE_TRANSLATIONS[role.role_name] || role.role_name}
                                                    </Badge>
                                                </td>
                                                {getActionsByModule(module.module_key).map(action => {
                                                    const hasPerm = hasPermission(role.role_name, module.module_key, action.action_key);
                                                    const isLocked = isPermissionLocked(role.role_name, module.module_key);
                                                    return (
                                                        <td 
                                                            key={action.id} 
                                                            className="text-center" 
                                                            style={{ 
                                                                border: `1px solid ${darkMode ? '#4b5563' : '#dee2e6'}`,
                                                                verticalAlign: 'middle',
                                                                cursor: isLocked ? 'not-allowed' : 'pointer',
                                                                opacity: isLocked ? 0.6 : 1,
                                                                background: isLocked ? (darkMode ? '#1f2937' : '#f3f4f6') : 'transparent'
                                                            }}
                                                            onClick={() => togglePermission(
                                                                role.id, 
                                                                role.role_name, 
                                                                module.id, 
                                                                module.module_key, 
                                                                action.id, 
                                                                action.action_key
                                                            )}
                                                            title={isLocked ? 'Permiso protegido - no modificable' : 'Click para cambiar'}
                                                        >
                                                            {isLocked && (
                                                                <span className="material-icons" style={{ 
                                                                    color: '#f59e0b',
                                                                    fontSize: '1rem',
                                                                    position: 'absolute',
                                                                    marginLeft: '-10px',
                                                                    marginTop: '-10px'
                                                                }}>
                                                                    lock
                                                                </span>
                                                            )}
                                                            <span className="material-icons" style={{ 
                                                                color: hasPerm ? '#10b981' : '#6b7280',
                                                                fontSize: '1.5rem',
                                                                transition: 'all 0.2s'
                                                            }}>
                                                                {hasPerm ? 'check_circle' : 'cancel'}
                                                            </span>
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Card className="mt-4" style={{
                background: darkMode ? '#1f2937' : '#fff',
                border: `1px solid ${darkMode ? '#374151' : '#dee2e6'}`
            }}>
                <Card.Body>
                    <h5 style={{ color: darkMode ? '#e5e7eb' : '#212529' }}>
                        <span className="material-icons" style={{ fontSize: '1.2rem', verticalAlign: 'middle', marginRight: '0.5rem' }}>
                            lock
                        </span>
                        Reglas Especiales
                    </h5>
                    <ul style={{ color: darkMode ? '#9ca3af' : '#6c757d' }}>
                        <li>Los roles de <strong>Administrador</strong> y <strong>Director/a</strong> no pueden ser eliminados ni modificados.</li>
                        <li>Solo <strong>Administrador</strong> y <strong>Director/a</strong> pueden acceder a esta configuración.</li>
                        <li>Los permisos de <strong>Personal</strong> y <strong>Configuración</strong> están <span className="material-icons" style={{ fontSize: '0.9rem', verticalAlign: 'middle', color: '#f59e0b' }}>lock</span> <strong>protegidos</strong> para Admin/Directivo y no pueden modificarse.</li>
                        <li>La contraseña inicial de todo el personal es su <strong>DNI</strong>.</li>
                        <li>Los <strong>Maestros/as</strong> solo pueden ver información de alumnos de su sala asignada.</li>
                        <li>Los <strong>Padres/Tutores</strong> solo pueden ver información de sus propios hijos.</li>
                        <li>Todos los cambios se guardan automáticamente y se registran en el historial de auditoría.</li>
                    </ul>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default ConfiguracionPage;
