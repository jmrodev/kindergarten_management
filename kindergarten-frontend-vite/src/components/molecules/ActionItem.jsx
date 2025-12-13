import React from 'react';
import PermissionToggle from '../atoms/PermissionToggle.jsx';
import ProtectedBadge from '../atoms/ProtectedBadge.jsx';

const ActionItem = ({
  id,
  actionName,
  isGranted,
  isProtected,
  onToggle
}) => {
  return (
    <div
      className={`action-item ${isGranted ? 'text-success' : 'text-muted'}`}
      title={isProtected
        ? `${actionName}: Permiso protegido (no modificable)`
        : `${actionName}: ${isGranted ? 'Activo' : 'Inactivo'}`}
    >
      <PermissionToggle
        id={id}
        checked={isGranted}
        disabled={isProtected}
        onChange={onToggle}
        label={
          <>
            {actionName}
            {isProtected && <ProtectedBadge />}
          </>
        }
      />
    </div>
  );
};

export default ActionItem;