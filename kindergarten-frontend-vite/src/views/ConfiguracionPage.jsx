import React, { useState, useEffect } from 'react';
import { GearFill, InfoCircleFill, FolderFill, ShieldLock, KeyFill, ClipboardDataFill, ShieldCheck, Shield, CheckCircle, XCircle } from 'react-bootstrap-icons';
import { usePermissions } from '../contexts/PermissionsContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import api from '../api/api.js';
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
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="alert alert-danger mt-3">
              <h5>Acceso Denegado</h5>
              <p>Solo Administradores y Directores pueden acceder a la configuración del sistema.</p>
            </div>
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

  const isProtectedPermission = (roleName, moduleKey) => {
    const protectedModules = ['personal', 'configuracion', 'roles'];
    const protectedRoles = ['Administrator', 'Director'];
    return protectedRoles.includes(roleName) && protectedModules.includes(moduleKey);
  };

  // Determine which modules should be visible for a given role
  const getVisibleModulesForRole = (roleName) => {
    // Normalize role name for comparison
    const normalizedRoleName = roleName ? roleName.trim().toLowerCase() : '';

    // Define which modules each role should have access to
    const roleModuleMap = {
      'tutor': ['alumnos', 'inscripciones', 'vacunas', 'asistencias'],
      'teacher': ['alumnos', 'inscripciones', 'vacunas', 'asistencias', 'salas'],
      'secretaria': ['alumnos', 'asistencia', 'responsables', 'mensajes', 'salas'],
      'secretary': ['alumnos', 'asistencia', 'responsables', 'mensajes', 'salas'], // In case it's stored as "Secretary"
      'administrative': ['alumnos', 'inscripciones', 'vacunas', 'asistencias', 'personal', 'salas'],
      'director': ['alumnos', 'inscripciones', 'vacunas', 'asistencias', 'salas'], // Removed 'personal', 'configuracion'
      'administrator': ['alumnos', 'inscripciones', 'vacunas', 'asistencias', 'salas'] // Removed 'personal', 'configuracion', 'roles'
    };

    // If a specific role mapping exists, use it; otherwise, show all modules
    return roleModuleMap[normalizedRoleName] || modules.map(module => module.module_key);
  };


  if (loading) {
    return (
      <div className="configuracion-page">
        <div className="loading d-flex justify-content-center align-items-center loading-height-60">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
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
        <div className="alert alert-danger m-3" role="alert">
          <h5 className="alert-heading">Error</h5>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="configuracion-page">
      <div className="container-fluid px-3 px-md-4">
        <div className="page-header">
          <h1 className="page-title">
            <GearFill className="me-2" />
            Configuración del Sistema
          </h1>
          <p className="page-subtitle">
            Gestión de permisos y roles del personal
          </p>
        </div>

        <div className="alert alert-info mb-4" role="alert">
          <InfoCircleFill className="me-2" />
          Esta sección solo es visible para <strong>Administradores</strong> y <strong>Directores</strong>.
          Haz clic en los interruptores para cambiar permisos.
        </div>

        {/* Role Filter */}
        <div className="mb-4">
          <label htmlFor="roleFilter" className="form-label fw-bold">Filtrar por Rol:</label>
          <select
            id="roleFilter"
            className="form-select w-auto"
            value={selectedRoleFilter}
            onChange={(e) => {
              setSelectedRoleFilter(e.target.value);
            }}
          >
            <option value="">Ver todos los roles</option>
            {roles.map(role => {
              const roleName = role.role_name || role;
              return (
                <option key={`filter-${roleName}`} value={roleName}>
                  {roleName}
                </option>
              );
            })}
          </select>
        </div>

        <div className={`role-grid-container ${selectedRoleFilter ? 'filtered' : ''}`}>
          {roles
            .filter(role => {
              if (!selectedRoleFilter) return true;
              const roleName = role.role_name || role;
              return roleName === selectedRoleFilter;
            })
            .map(role => {
            const roleName = role.role_name || role;
            const visibleModules = getVisibleModulesForRole(roleName);
            const roleNormalized = roleName.toLowerCase();

            // Determine role badge class based on role name
            let roleBadgeClass = 'role-badge';
            if (roleNormalized.includes('admin')) roleBadgeClass += ' role-badge-admin';
            else if (roleNormalized.includes('direct')) roleBadgeClass += ' role-badge-director';
            else if (roleNormalized.includes('teacher')) roleBadgeClass += ' role-badge-teacher';
            else if (roleNormalized.includes('secret')) roleBadgeClass += ' role-badge-secretary';
            else if (roleNormalized.includes('tutor')) roleBadgeClass += ' role-badge-tutor';

            return (
              <div key={roleName} id={`role-card-${roleName}`} className="role-grid-item">
                <div className="role-card-header">
                  <span>{roleName}</span>
                  <span className={roleBadgeClass}>{roleName}</span>
                </div>
                <div className="role-modules-container">
                  {modules
                    .filter(module => visibleModules.includes(module.module_key))
                    .map(module => (
                      <div key={`${roleName}-${module.id}`} className="module-card">
                        <h5 className="module-card-title">
                          <FolderFill className="me-2" />
                          {module.module_name}
                        </h5>
                        <div className="action-grid">
                          {actions.map(action => {
                            const isGranted = permissions[roleName]?.[module.module_key]?.[action.action_key];
                            const isProtected = isProtectedPermission(roleName, module.module_key);
                            const roleId = typeof role === 'object' ? role.id : roles.find(r => r.role_name === roleName)?.id;
                            const moduleId = module.id;
                            const actionId = action.id;

                            return (
                              <div
                                key={`${roleName}-${module.module_key}-${action.action_key}`}
                                className={`action-item ${isGranted ? 'text-success' : 'text-muted'}`}
                                title={isProtected
                                  ? `${action.action_name}: Permiso protegido (no modificable)`
                                  : `${action.action_name}: ${isGranted ? 'Activo' : 'Inactivo'}`}
                              >
                                <input
                                  className="action-checkbox"
                                  type="checkbox"
                                  id={`${roleName}-${module.module_key}-${action.action_key}`}
                                  checked={!!isGranted}
                                  disabled={isProtected}
                                  onChange={() => handlePermissionToggle(roleId, moduleId, actionId, isGranted)}
                                />
                                <label
                                  className="action-label"
                                  htmlFor={`${roleName}-${module.module_key}-${action.action_key}`}
                                >
                                  {action.action_name}
                                  {isProtected && (
                                    <span className="protected-badge" title="Permiso protegido">
                                      <ShieldLock className="me-1" size={10} /> Protegido
                                    </span>
                                  )}
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend Section */}
        <div className="configuracion-card mt-4">
          <div className="configuracion-card-header">
            <KeyFill className="me-2" />
            Leyenda
          </div>
          <div className="configuracion-card-body">
            <div className="legend-container">
              <div className="legend-item">
                <CheckCircle className="legend-color-active me-2" />
                <span>Permiso activo</span>
              </div>
              <div className="legend-item">
                <XCircle className="legend-color-inactive me-2" />
                <span>Permiso inactivo</span>
              </div>
              <div className="legend-item">
                <Shield className="legend-color-protected me-2" />
                <span>Permiso protegido (no modificable)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Audit Log Section */}
        <div className="configuracion-card mt-4">
          <div className="configuracion-card-header">
            <ClipboardDataFill className="me-2" />
            Registro de Auditoría
          </div>
          <div className="configuracion-card-body">
            <p className="text-muted mb-0">
              <InfoCircleFill className="me-2" />
              Próximamente: Vista de cambios de permisos y registro de auditoría detallado
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfiguracionPage;