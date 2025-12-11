import React from 'react';
import './ChildProfileCard.css';

const ChildProfileCard = ({ child }) => {
  return (
    <div className="child-profile-card">
      <div className="card-header">
        <h3>Perfil de {child.nombre} {child.apellidoPaterno}</h3>
      </div>
      <div className="card-body">
        <div className="profile-header">
          <div className="avatar-container">
            <div className="avatar-large">
              <span>{child.nombre?.charAt(0)}{child.apellidoPaterno?.charAt(0)}</span>
            </div>
            <h4>{child.nombre} {child.apellidoPaterno}</h4>
          </div>

          <div className="info-grid">
            <div className="info-section">
              <p><strong>Fecha de Nacimiento:</strong><br/>{child.fechaNacimiento || 'No especificada'}</p>
              <p><strong>Edad:</strong><br/>{child.edad || 'No especificada'}</p>
              <p><strong>DNI:</strong><br/>{child.dni || 'No especificado'}</p>
            </div>
            <div className="info-section">
              <p><strong>Sala:</strong><br/>{child.sala?.nombre || 'No asignada'}</p>
              <p><strong>Turno:</strong><br/>{child.turno || 'No especificado'}</p>
              <p><strong>Estado:</strong><br/>
                {child.estado ? (
                  <span className={`status-badge ${child.estado.toLowerCase()}`}>
                    {child.estado}
                  </span>
                ) : 'No especificado'}
              </p>
            </div>
          </div>
        </div>

        <div className="section-divider"></div>

        <div className="profile-details">
          <div className="medical-info">
            <h5>Información Médica</h5>
            <p><strong>Obra Social:</strong><br/>{child.obraSocial || 'No especificada'}</p>
            <p><strong>Grupo Sanguíneo:</strong><br/>{child.grupoSanguineo || 'No especificado'}</p>
            {child.alergias && (
              <p><strong>Alergias:</strong><br/>{child.alergias}</p>
            )}
            {child.medicacion && (
              <p><strong>Medicación:</strong><br/>{child.medicacion}</p>
            )}
          </div>

          <div className="emergency-contact">
            <h5>Contacto de Emergencia</h5>
            <p><strong>Nombre:</strong><br/>{child.nombreEmergencia || 'No especificado'}</p>
            <p><strong>Relación:</strong><br/>{child.relacionEmergencia || 'No especificada'}</p>
            <p><strong>Teléfono:</strong><br/>{child.telefonoEmergencia || 'No especificado'}</p>
          </div>
        </div>

        {child.observacionesMedicas && (
          <>
            <div className="section-divider"></div>
            <div className="medical-notes">
              <h5>Observaciones Médicas</h5>
              <p>{child.observacionesMedicas}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChildProfileCard;