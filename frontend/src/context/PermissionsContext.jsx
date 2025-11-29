// frontend/src/context/PermissionsContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';

const PermissionsContext = createContext();

export const PermissionsProvider = ({ children }) => {
    const { user } = useAuth();
    const [userPermissions, setUserPermissions] = useState({});
    const [allPermissionsData, setAllPermissionsData] = useState([]); // New state to store all permissions
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) { // Load permissions for any authenticated user
            loadPermissions();
        } else {
            setUserPermissions({});
            setAllPermissionsData([]);
            setLoading(false);
        }
    }, [user]);

    const loadPermissions = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            if (!token) {
                setUserPermissions({});
                setAllPermissionsData([]);
                setLoading(false);
                return;
            }

            const res = await axios.get('http://localhost:3000/api/permissions', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setAllPermissionsData(res.data); // Store all permissions fetched
            
            // Filter permissions only if the current user has a specific role
            if (user?.role) {
                const rolePerms = {};
                res.data.forEach(perm => {
                    if (perm.role_name === user.role && perm.has_permission) {
                        if (!rolePerms[perm.module_key]) {
                            rolePerms[perm.module_key] = [];
                        }
                        rolePerms[perm.module_key].push(perm.action_key);
                    }
                });
                setUserPermissions(rolePerms);
                localStorage.setItem('userPermissions', JSON.stringify(rolePerms));
            } else {
                // For users without a role (like parents), userPermissions will be empty
                setUserPermissions({});
                localStorage.removeItem('userPermissions');
            }
        } catch (error) {
            console.error('Error loading permissions:', error);
            const cached = localStorage.getItem('userPermissions');
            if (cached && user?.role) { // Only load from cache if it's relevant for the user
                setUserPermissions(JSON.parse(cached));
            }
            setAllPermissionsData([]);
        } finally {
            setLoading(false);
        }
    };

    // Verify if the user has a specific permission
    const can = (module, action) => {
        return userPermissions[module]?.includes(action) || false;
    };

    // New function to check permissions for any given role
    const canRole = (targetRoleName, module, action) => {
        const foundPermission = allPermissionsData.find(perm =>
            perm.role_name === targetRoleName &&
            perm.module_key === module &&
            perm.action_key === action &&
            perm.has_permission
        );
        return !!foundPermission;
    };

    // Verify if the user has ALL specified permissions
    const canAll = (permissions) => {
        return permissions.every(({ module, action }) => can(module, action));
    };

    // Verify if the user has AT LEAST ONE of the specified permissions
    const canAny = (permissions) => {
        return permissions.some(({ module, action }) => can(module, action));
    };

    // Verify if the user has access to a complete module
    const canAccessModule = (module) => {
        return userPermissions[module] && userPermissions[module].length > 0;
    };

    // Get all available actions for a module
    const getModuleActions = (module) => {
        return userPermissions[module] || [];
    };

    // Clear permissions (useful for logout)
    const clearPermissions = () => {
        setUserPermissions({});
        setAllPermissionsData([]); // Clear allPermissionsData on logout
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
        reloadPermissions: loadPermissions, // Renamed function
        canRole // Expose new function
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
