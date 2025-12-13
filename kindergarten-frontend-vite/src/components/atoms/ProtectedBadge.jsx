import React from 'react';
import { ShieldLock } from 'react-bootstrap-icons';

const ProtectedBadge = ({ title = "Permiso protegido" }) => {
  return (
    <span className="protected-badge" title={title}>
      <ShieldLock className="me-1" size={10} /> Protegido
    </span>
  );
};

export default ProtectedBadge;