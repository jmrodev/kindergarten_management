import React, { useState, useEffect } from 'react';
import { GearFill, ClipboardDataFill } from 'react-bootstrap-icons';
import { usePermissions } from '../contexts/PermissionsContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import api from '../api/api.js';
import { RoleCard, AuditCard } from '../components/organisms/index.jsx';
import { RoleFilter } from '../components/molecules/index.jsx';
import { getVisibleModulesForRole as getVisibleModulesForRoleUtil } from '../utils/permissionUtils.js';
import '../index.css'; // Import the external CSS file

const ConfiguracionPage = () => {
  const { canRole, reloadPermissions } = usePermissions();
  const { currentUser } = useAuth();

  // Check if user is authorized to access configuration
  const isAdminOrDirector = currentUser &&
    (currentUser.role_name === 'Administrator' || currentUser.role_name === 'Director' ||
     currentUser.role === 'Administrator' || currentUser.role === 'Director');

  if (!isAdminOrDirector) {
    return (
      <div className="configuracion-page">
        <div className="access-denied-card">
          <div className="alert-danger-custom">
            <h5>Acceso Denegado</h5>
            <p>Solo Administradores y Directores pueden acceder a la configuración del sistema.</p>
          </div>
        </div>
      </div>
    );
  }

  const [roles, setRoles] = useState([]);
  const [modules, setModules] = useState([]);
  const [actions, setActions] = useState([]);
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('');

  useEffect(() => {
    loadConfigData();
  }, []);

  const loadConfigData = async () => {
    try {
      setLoading(true);

      // Fetch all necessary data in parallel
      const [permissionsRes, modulesRes, actionsRes, rolesRes] = await Promise.all([
        api.get('/permissions'),
        api.get('/permissions/modules'),
        api.get('/permissions/actions'),
        api.get('/roles') // Fetch roles separately
      ]);

      setModules(modulesRes.data);
      setActions(actionsRes.data);

      // Organize permissions by role and module
      const organizedPerms = {};

      permissionsRes.data.forEach(perm => {
        const role = perm.role_name;
        const module = perm.module_key;
        const action = perm.action_key;

        if (!organizedPerms[role]) {
          organizedPerms[role] = {};
        }
        if (!organizedPerms[role][module]) {
          organizedPerms[role][module] = {};
        }

        organizedPerms[role][module][action] = perm.has_permission;
      });

      setPermissions(organizedPerms);
      setRoles(rolesRes.data);
    } catch (err) {
      // If roles endpoint fails, we can still get roles from permissions data as fallback
      if (err.response?.status === 403 || err.response?.status === 401) {
        // User doesn't have permission to get roles, use data from permissions response
        const permissionsRes = await api.get('/permissions');
        const modulesRes = await api.get('/permissions/modules');
        const actionsRes = await api.get('/permissions/actions');

        setModules(modulesRes.data);
        setActions(actionsRes.data);

        // Organize permissions and extract unique roles
        const organizedPerms = {};
        const uniqueRoles = [];

        permissionsRes.data.forEach(perm => {
          const role = perm.role_name;
          const module = perm.module_key;
          const action = perm.action_key;

          if (!organizedPerms[role]) {
            organizedPerms[role] = {};
          }
          if (!organizedPerms[role][module]) {
            organizedPerms[role][module] = {};
          }

          organizedPerms[role][module][action] = perm.has_permission;

          // Add role if not already in uniqueRoles
          if (!uniqueRoles.some(r => r.role_name === role)) {
            uniqueRoles.push({ id: perm.role_id, role_name: role });
          }
        });

        setPermissions(organizedPerms);
        setRoles(uniqueRoles);
      } else {
        setError('Error loading configuration data');
        console.error('Error loading configuration:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionToggle = async (roleId, moduleId, actionId, isGranted) => {
    try {
      await api.post('/permissions/toggle', {
        roleId,
        moduleId,
        actionId,
        isGranted: !isGranted
      });

      // Update local state optimistically
      const newPermissions = { ...permissions };
      const roleObj = roles.find(r => r.id === roleId);
      const roleName = roleObj?.role_name;
      const module = modules.find(m => m.id === moduleId)?.module_key;
      const action = actions.find(a => a.id === actionId)?.action_key;

      if (roleName && module && action) {
        if (!newPermissions[roleName]) newPermissions[roleName] = {};
        if (!newPermissions[roleName][module]) newPermissions[roleName][module] = {};
        newPermissions[roleName][module][action] = !isGranted;
        setPermissions(newPermissions);
      }

      // Reload permissions to ensure consistency
      reloadPermissions();
    } catch (err) {
      setError('Error updating permission');
      console.error('Error updating permission:', err);
    }
  };

  // Wrapper function to call the utility function with modules
  const getVisibleModulesForRole = (roleName) => {
    return getVisibleModulesForRoleUtil(roleName, modules);
  };



  if (loading) {
    return (
      <div className="configuracion-page">
        <div className="loading loading-center loading-height-60">
          <div className="text-center">
            <div className="spinner-border-custom text-primary">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-2 mb-0">Cargando configuración...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="configuracion-page">
        <div className="alert-danger-custom m-3">
          <h5 className="alert-heading">Error</h5>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="configuracion-page">
      <div className="container-fluid px-3 px-md-4">
        <div className="configuracion-header">
          <h1 className="configuracion-title">
            <GearFill className="me-2-custom" />
            Configuración
          </h1>
        </div>

        <RoleFilter
          roles={roles}
          selectedRoleFilter={selectedRoleFilter}
          onFilterChange={setSelectedRoleFilter}
        />

        <div className={`role-grid-container ${selectedRoleFilter ? 'filtered' : ''}`}>
          {roles
            .filter(role => {
              if (!selectedRoleFilter) return true;
              const roleName = role.role_name || role;
              return roleName === selectedRoleFilter;
            })
            .map(role => (
              <RoleCard
                key={role.role_name || role}
                role={role}
                modules={modules}
                actions={actions}
                permissions={permissions}
                roles={roles}
                getVisibleModulesForRole={getVisibleModulesForRole}
                handlePermissionToggle={handlePermissionToggle}
              />
            ))}
        </div>

        <AuditCard />
      </div>
    </div>
  );
};

export default ConfiguracionPage;