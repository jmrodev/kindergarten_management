import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileEarmarkCheck, FileEarmark, FileEarmarkX, Clock } from 'react-bootstrap-icons';

const DocumentStatusWithLink = ({ studentId, status, className = '' }) => {
  const navigate = useNavigate();
  
  const getStatusConfig = (status) => {
    switch (status) {
      case 'completo':
      case 'activo':
        return {
          icon: <FileEarmarkCheck className="text-success" size={16} />,
          text: 'Completo',
          variant: 'success',
          title: 'Documentación completa'
        };
      case 'incompleto':
      case 'pendiente':
        return {
          icon: <Clock className="text-warning" size={16} />,
          text: 'Pendiente',
          variant: 'warning',
          title: 'Documentación pendiente'
        };
      case 'faltante':
        return {
          icon: <FileEarmarkX className="text-danger" size={16} />,
          text: 'Faltante',
          variant: 'danger',
          title: 'Documentación faltante'
        };
      default:
        return {
          icon: <FileEarmark className="text-secondary" size={16} />,
          text: 'Sin info',
          variant: 'secondary',
          title: 'Sin información de documentos'
        };
    }
  };

  const config = getStatusConfig(status);
  
  const handleClick = (e) => {
    e.stopPropagation();
    navigate(`/students/${studentId}/documents`);
  };

  return (
    <span 
      className={`document-status-link badge bg-${config.variant} text-capitalize ${className}`}
      onClick={handleClick}
      style={{ cursor: 'pointer', textDecoration: 'underline' }}
      title={config.title}
    >
      {config.icon}
      <span className="ms-1">{config.text}</span>
    </span>
  );
};

export default DocumentStatusWithLink;