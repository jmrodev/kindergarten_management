// frontend/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePermissions } from '../context/PermissionsContext';

const ProtectedRoute = ({ children, requiredRole, requiredPermission }) => {
    const { isAuthenticated, user } = useAuth();
    const { can, loading } = usePermissions();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Mostrar loading mientras se cargan permisos
    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando permisos...</span>
                </div>
                <p className="mt-3">Verificando permisos...</p>
            </div>
        );
    }

    // Verificar rol si se especifica
    if (requiredRole && user?.role !== requiredRole) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger">
                    <h4>
                        <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: '0.5rem' }}>
                            block
                        </span>
                        Acceso Denegado
                    </h4>
                    <p>No tienes el rol necesario para acceder a esta página.</p>
                    <p>Tu rol: <strong>{user?.role}</strong></p>
                    <p>Rol requerido: <strong>{requiredRole}</strong></p>
                </div>
            </div>
        );
    }

    // Verificar permiso específico si se especifica
    if (requiredPermission) {
        const { module, action } = requiredPermission;
        if (!can(module, action)) {
            return (
                <div className="container mt-5">
                    <div className="alert alert-warning">
                        <h4>
                            <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: '0.5rem' }}>
                                lock
                            </span>
                            Permiso Insuficiente
                        </h4>
                        <p>No tienes el permiso necesario para acceder a esta página.</p>
                        <p>Módulo: <strong>{module}</strong></p>
                        <p>Acción requerida: <strong>{action}</strong></p>
                        <p className="mb-0">Contacta al administrador si crees que deberías tener acceso.</p>
                    </div>
                </div>
            );
        }
    }

    return children;
};

export default ProtectedRoute;
