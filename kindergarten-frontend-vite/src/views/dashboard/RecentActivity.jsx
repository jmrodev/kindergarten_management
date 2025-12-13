import React from 'react';

export default function RecentActivity() {
  return (
    <div className="flex-gap-1-wrap-mt-1-5">
      <div className="activity-card activity-card-flex">
        <div className="card-header">
          <h5>Últimos Alumnos Registrados</h5>
        </div>
        <div className="card-body">
          <p>No hay alumnos recientes registrados.</p>
        </div>
      </div>
      <div className="activity-card activity-card-flex">
        <div className="card-header">
          <h5>Próximos Eventos</h5>
        </div>
        <div className="card-body">
          <p>No hay eventos programados próximamente.</p>
        </div>
      </div>
    </div>
  );
}
