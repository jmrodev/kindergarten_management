import React from 'react';

const AccessDeniedMessage = () => {
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
};

export default AccessDeniedMessage;