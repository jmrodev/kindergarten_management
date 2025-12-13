import React from 'react';
import { ClipboardDataFill, InfoCircleFill } from 'react-bootstrap-icons';

const AuditCard = () => {
  return (
    <div className="configuracion-card mt-4">
      <div className="configuracion-card-header">
        <ClipboardDataFill className="me-2-custom" />
        Registro de Auditoría
      </div>
      <div className="configuracion-card-body">
        <p className="text-muted-custom mb-0">
          <InfoCircleFill className="me-2-custom" />
          Próximamente: Vista de cambios de permisos y registro de auditoría detallado
        </p>
      </div>
    </div>
  );
};

export default AuditCard;