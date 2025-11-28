// frontend/src/components/PermissionGuard.jsx
import React from 'react';
import { usePermissions } from '../context/PermissionsContext';

/**
 * Componente que renderiza children solo si el usuario tiene los permisos requeridos
 * 
 * @param {string} module - Módulo requerido
 * @param {string} action - Acción requerida
 * @param {array} anyOf - Array de permisos [{module, action}], muestra si tiene AL MENOS UNO
 * @param {array} allOf - Array de permisos [{module, action}], muestra solo si tiene TODOS
 * @param {ReactNode} fallback - Componente alternativo si no tiene permiso
 * @param {ReactNode} children - Contenido a mostrar si tiene permiso
 */
const PermissionGuard = ({ 
    module, 
    action, 
    anyOf, 
    allOf, 
    fallback = null, 
    children 
}) => {
    const { can, canAny, canAll } = usePermissions();

    let hasPermission = false;

    if (module && action) {
        // Permiso simple
        hasPermission = can(module, action);
    } else if (anyOf && anyOf.length > 0) {
        // Tiene al menos uno de los permisos
        hasPermission = canAny(anyOf);
    } else if (allOf && allOf.length > 0) {
        // Tiene todos los permisos
        hasPermission = canAll(allOf);
    }

    if (!hasPermission) {
        return fallback;
    }

    return <>{children}</>;
};

export default PermissionGuard;
