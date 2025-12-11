import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext.jsx'; // Adjust import based on your actual AuthContext location
import api from '../api/api.js';

const PermissionsContext = createContext();

export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }
  return context;
};

export const PermissionsProvider = ({ children }) => {
  const [userPermissions, setUserPermissions] = useState({});
  const [allPermissionsData, setAllPermissionsData] = useState([]);
  const { currentUser } = useAuth(); // Adjust based on your actual auth context

  useEffect(() => {
    if (currentUser) {
      // Only load permissions for users with admin/director roles
      const userRole = currentUser.role_name || currentUser.role;
      if (userRole && ['Administrator', 'Directivo', 'Director', 'admin', 'director'].includes(userRole)) {
        loadPermissions();
      } else {
        // For other users (like parents), set empty permissions
        setUserPermissions({});
        setAllPermissionsData([]);
      }
    } else {
      setUserPermissions({});
      setAllPermissionsData([]);
    }
  }, [currentUser]);

  const loadPermissions = async () => {
    try {
      // Clear previous data
      setUserPermissions({});
      setAllPermissionsData([]);

      // Load all permissions data
      const res = await api.get('/permissions');
      setAllPermissionsData(res.data);

      // Organize user-specific permissions
      const userRole = currentUser?.role_name || currentUser?.role;
      if (userRole) {
        const rolePerms = res.data
          .filter(perm => perm.role_name === userRole && perm.has_permission)
          .reduce((acc, perm) => {
            if (!acc[perm.module_key]) {
              acc[perm.module_key] = [];
            }
            acc[perm.module_key].push(perm.action_key);
            return acc;
          }, {});

        setUserPermissions(rolePerms);
        localStorage.setItem('userPermissions', JSON.stringify(rolePerms));
      } else {
        // For users without a role (like parents), userPermissions will be empty
        setUserPermissions({});
        localStorage.removeItem('userPermissions');
      }
    } catch (error) {
      // Si es un error de autorización (403), es normal para usuarios sin permisos
      if (error.response && error.response.status === 403) {
        console.log('User does not have permission to access permissions data:', error.message);
        setUserPermissions({});
        setAllPermissionsData([]);
        localStorage.removeItem('userPermissions');
      } else {
        console.error('Error loading permissions:', error);
        // Load cached permissions if available
        const cached = localStorage.getItem('userPermissions');
        if (cached) {
          setUserPermissions(JSON.parse(cached));
        }
        setAllPermissionsData([]);
      }
    }
  };

  // Check if current user has a specific permission
  const can = (module, action) => {
    return userPermissions[module]?.includes(action) || false;
  };

  // Check if a specific role has a permission (used for permission management)
  const canRole = (roleName, module, action) => {
    const foundPermission = allPermissionsData.find(perm =>
      perm.role_name === roleName &&
      perm.module_key === module &&
      perm.action_key === action
    );
    return foundPermission ? foundPermission.has_permission : false;
  };

  // Verify if the user has ALL specified permissions
  const canAll = (permissions) => {
    return permissions.every(({ module, action }) => can(module, action));
  };

  // Verify if the user has AT LEAST ONE of the specified permissions
  const canAny = (permissions) => {
    return permissions.some(({ module, action }) => can(module, action));
  };

  // Check if user has any permissions for a module
  const canModule = (module) => {
    return userPermissions[module] && userPermissions[module].length > 0;
  };

  // Get all permissions for a module
  const getModulePermissions = (module) => {
    return userPermissions[module] || [];
  };

  // Clear permissions (useful for logout)
  const clearPermissions = () => {
    setUserPermissions({});
    setAllPermissionsData([]);
    localStorage.removeItem('userPermissions');
  };

  const value = {
    userPermissions,
    allPermissionsData,
    can,
    canRole,
    canAll,
    canAny,
    canModule,
    getModulePermissions,
    clearPermissions,
    reloadPermissions: loadPermissions
  };

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
};

export default PermissionsContext;