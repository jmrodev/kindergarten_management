import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Clock, ExclamationTriangle, QuestionCircle } from 'react-bootstrap-icons';

const VaccinationStatusWithLink = ({ studentId, status, className = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getStatusConfig = (status) => {
    switch (status) {
      case 'completo':
        return {
          icon: <ShieldCheck className="text-success" size={16} />,
          text: 'Completo',
          variant: 'success',
          title: 'Vacunas completas'
        };
      case 'incompleto':
        return {
          icon: <ExclamationTriangle className="text-warning" size={16} />,
          text: 'Incompleto',
          variant: 'warning',
          title: 'Vacunas incompletas'
        };
      case 'pendiente':
        return {
          icon: <Clock className="text-info" size={16} />,
          text: 'Pendiente',
          variant: 'info',
          title: 'Vacunas pendientes'
        };
      default:
        return {
          icon: <QuestionCircle className="text-secondary" size={16} />,
          text: 'No informado',
          variant: 'secondary',
          title: 'Sin información de vacunas'
        };
    }
  };

  const config = getStatusConfig(status);

  const handleClick = (e) => {
    e.stopPropagation();
    navigate(`/students/${studentId}/vaccinations`, { state: { from: location.pathname } });
  };

  return (
    <span
      className={`vaccination-status-link ${className}`}
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
      title={config.title}
    >
      <span className={`badge bg-${config.variant} text-capitalize`}>
        {config.icon}
        <span className="ms-1">{config.text}</span>
      </span>
    </span>
  );
};

export default VaccinationStatusWithLink;