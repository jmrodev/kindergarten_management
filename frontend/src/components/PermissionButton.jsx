// frontend/src/components/PermissionButton.jsx
import React from 'react';
import { Button } from 'react-bootstrap';
import { usePermissions } from '../context/PermissionsContext';

/**
 * Botón que se muestra solo si el usuario tiene el permiso requerido
 * 
 * @param {string} module - Módulo requerido (ej: 'alumnos', 'personal')
 * @param {string} action - Acción requerida (ej: 'crear', 'editar', 'eliminar')
 * @param {ReactNode} children - Contenido del botón
 * @param {object} ...props - Otras props de Button de react-bootstrap
 */
const PermissionButton = ({ module, action, children, disabled, ...props }) => {
    const { can } = usePermissions();

    // No mostrar el botón si no tiene permiso
    if (!can(module, action)) {
        return null;
    }

    return (
        <Button disabled={disabled} {...props}>
            {children}
        </Button>
    );
};

export default PermissionButton;
