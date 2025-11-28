// frontend/src/context/PermissionsContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';

const PermissionsContext = createContext();

export const PermissionsProvider = ({ children }) => {
    const { user } = useAuth();
    const [userPermissions, setUserPermissions] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.role) {
            loadUserPermissions(user.role);
        } else {
            setUserPermissions({});
            setLoading(false);
        }
    }, [user]);

    const loadUserPermissions = async (role) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            if (!token) {
                setUserPermissions({});
                setLoading(false);
                return;
            }

            const res = await axios.get('http://localhost:3000/api/permissions', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Filtrar solo los permisos del rol actual del usuario
            const rolePerms = {};
            res.data.forEach(perm => {
                if (perm.role_name === role && perm.has_permission) {
                    if (!rolePerms[perm.module_key]) {
                        rolePerms[perm.module_key] = [];
                    }
                    rolePerms[perm.module_key].push(perm.action_key);
                }
            });
            
            setUserPermissions(rolePerms);
            
            // Guardar en localStorage como caché
            localStorage.setItem('userPermissions', JSON.stringify(rolePerms));
        } catch (error) {
            console.error('Error loading user permissions:', error);
            
            // Intentar cargar desde caché si hay error
            const cached = localStorage.getItem('userPermissions');
            if (cached) {
                setUserPermissions(JSON.parse(cached));
            }
        } finally {
            setLoading(false);
        }
    };

    // Verificar si el usuario tiene un permiso específico
    const can = (module, action) => {
        return userPermissions[module]?.includes(action) || false;
    };

    // Verificar si el usuario tiene TODOS los permisos especificados
    const canAll = (permissions) => {
        return permissions.every(({ module, action }) => can(module, action));
    };

    // Verificar si el usuario tiene AL MENOS UNO de los permisos especificados
    const canAny = (permissions) => {
        return permissions.some(({ module, action }) => can(module, action));
    };

    // Verificar si el usuario tiene acceso a un módulo completo
    const canAccessModule = (module) => {
        return userPermissions[module] && userPermissions[module].length > 0;
    };

    // Obtener todas las acciones disponibles para un módulo
    const getModuleActions = (module) => {
        return userPermissions[module] || [];
    };

    // Limpiar permisos (útil para logout)
    const clearPermissions = () => {
        setUserPermissions({});
        localStorage.removeItem('userPermissions');
    };

    const value = {
        userPermissions,
        loading,
        can,
        canAll,
        canAny,
        canAccessModule,
        getModuleActions,
        clearPermissions,
        reloadPermissions: () => user?.role && loadUserPermissions(user.role)
    };

    return (
        <PermissionsContext.Provider value={value}>
            {children}
        </PermissionsContext.Provider>
    );
};

// Hook personalizado para usar permisos
export const usePermissions = () => {
    const context = useContext(PermissionsContext);
    if (!context) {
        throw new Error('usePermissions debe usarse dentro de PermissionsProvider');
    }
    return context;
};

export default PermissionsContext;
