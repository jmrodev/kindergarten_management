import React, { useState, useEffect } from 'react';
import './GradesView.css';

const GradesView = ({ childId }) => {
  const [gradesData, setGradesData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    // In a real app, this would fetch from the API
    setTimeout(() => {
      setGradesData([
        { subject: 'Lenguaje', grade: 'A', period: '1er Trimestre', date: '2025-04-15', comments: 'Excelente progreso en lectura' },
        { subject: 'Matemáticas', grade: 'B+', period: '1er Trimestre', date: '2025-04-15', comments: 'Buen desempeño, necesita práctica adicional' },
        { subject: 'Arte', grade: 'A-', period: '1er Trimestre', date: '2025-04-15', comments: 'Muy creativo e interesado' },
        { subject: 'Ciencias Sociales', grade: 'B', period: '1er Trimestre', date: '2025-04-15', comments: 'Buen entendimiento de los temas' },
      ]);
      setLoading(false);
    }, 500);
  }, [childId]);

  if (loading) {
    return (
      <div className="grades-view">
        <div className="loading">Cargando calificaciones...</div>
      </div>
    );
  }

  const averageGrade = gradesData.length > 0 
    ? (gradesData.reduce((sum, grade) => sum + (grade.grade === 'A' ? 4 : grade.grade === 'A-' ? 3.7 : grade.grade === 'B+' ? 3.3 : grade.grade === 'B' ? 3 : 2), 0) / gradesData.length).toFixed(1)
    : 0;

  return (
    <div className="grades-view">
      <h3>Calificaciones</h3>
      
      <div className="grades-summary">
        <div className="summary-card">
          <h4>{averageGrade}</h4>
          <p>Promedio General</p>
        </div>
        <div className="summary-card">
          <h4>{gradesData.length}</h4>
          <p>Asignaturas</p>
        </div>
      </div>

      <div className="grades-list">
        <h4>Calificaciones Recientes</h4>
        <table className="grades-table">
          <thead>
            <tr>
              <th>Asignatura</th>
              <th>Calificación</th>
              <th>Período</th>
              <th>Fecha</th>
              <th>Comentarios</th>
            </tr>
          </thead>
          <tbody>
            {gradesData.map((record, index) => (
              <tr key={index}>
                <td>{record.subject}</td>
                <td>
                  <span className="grade-badge">{record.grade}</span>
                </td>
                <td>{record.period}</td>
                <td>{new Date(record.date).toLocaleDateString('es-ES')}</td>
                <td>{record.comments}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GradesView;