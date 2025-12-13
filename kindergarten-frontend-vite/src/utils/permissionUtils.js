/**
 * Permission utilities for the kindergarten management system
 */

/**
 * Determines if a permission is protected based on role and module
 * @param {string} roleName - The name of the role
 * @param {string} moduleKey - The module key
 * @returns {boolean} - Whether the permission is protected
 */
export const isProtectedPermission = (roleName, moduleKey) => {
  const protectedModules = ['personal', 'configuracion', 'roles'];
  const protectedRoles = ['Administrator', 'Director'];
  return protectedRoles.includes(roleName) && protectedModules.includes(moduleKey);
};

/**
 * Determines which modules should be visible for a given role
 * @param {string} roleName - The name of the role
 * @param {Array} modules - Array of available modules
 * @returns {Array} - Array of module keys that are visible for the role
 */
export const getVisibleModulesForRole = (roleName, modules) => {
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