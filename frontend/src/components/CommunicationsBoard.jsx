import React, { useState, useEffect } from 'react';
import './CommunicationsBoard.css';

const CommunicationsBoard = ({ childId }) => {
  const [communications, setCommunications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    // In a real app, this would fetch from the API
    setTimeout(() => {
      setCommunications([
        { id: 1, date: '2025-01-15', title: 'Recordatorio de reunión de padres', message: 'La reunión de padres se llevará a cabo el próximo viernes a las 18:00 hs.', type: 'evento' },
        { id: 2, date: '2025-01-12', title: 'Cambio de horario', message: 'El horario de entrada se modificará temporalmente debido a las bajas temperaturas.', type: 'aviso' },
        { id: 3, date: '2025-01-10', title: 'Informe de progreso', message: 'Se ha actualizado el informe de progreso de su hijo/a en el portal.', type: 'progreso' },
        { id: 4, date: '2025-01-08', title: 'Día sin carpetas', message: 'Mañana es día sin carpetas. No es necesario traer carpetas ni cuadernos.', type: 'evento' },
      ]);
      setLoading(false);
    }, 500);
  }, [childId]);

  if (loading) {
    return (
      <div className="communications-board">
        <div className="loading">Cargando comunicaciones...</div>
      </div>
    );
  }

  return (
    <div className="communications-board">
      <h3>Comunicaciones</h3>
      
      <div className="communications-list">
        {communications.map((comm) => (
          <div key={comm.id} className={`communication-item ${comm.type}`}>
            <div className="communication-header">
              <h4>{comm.title}</h4>
              <span className="date">{new Date(comm.date).toLocaleDateString('es-ES')}</span>
            </div>
            <p className="message">{comm.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunicationsBoard;