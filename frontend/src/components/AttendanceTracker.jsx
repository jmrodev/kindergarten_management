import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AttendanceTracker.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const AttendanceTracker = ({ childId }) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/parent-portal/attendance/child/${childId}`, {
          withCredentials: true,
        });

        if (response.data.success) {
          setAttendanceData(response.data.attendance);
        } else {
          setError(response.data.message || 'Error al cargar la asistencia');
        }
      } catch (err) {
        console.error('Error fetching attendance:', err);
        setError('Error al cargar la asistencia');
      } finally {
        setLoading(false);
      }
    };

    if (childId) {
      fetchAttendance();
    }
  }, [childId]);

  if (loading) {
    return (
      <div className="attendance-tracker">
        <div className="loading">Cargando asistencia...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="attendance-tracker">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  const presentCount = attendanceData.filter(record => record.status === 'presente').length;
  const absentCount = attendanceData.filter(record => record.status === 'ausente').length;
  const totalDays = attendanceData.length;
  const attendancePercentage = totalDays > 0 ? Math.round((presentCount / totalDays) * 100) : 0;

  return (
    <div className="attendance-tracker">
      <h3>Asistencia</h3>
      
      <div className="attendance-summary">
        <div className="summary-card">
          <h4>{attendancePercentage}%</h4>
          <p>Asistencia General</p>
        </div>
        <div className="summary-card">
          <h4>{presentCount}</h4>
          <p>Días Presentes</p>
        </div>
        <div className="summary-card">
          <h4>{absentCount}</h4>
          <p>Días Ausente</p>
        </div>
      </div>

      <div className="attendance-list">
        <h4>Registro Reciente</h4>
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Observación</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((record, index) => (
              <tr key={index}>
                <td>{new Date(record.date).toLocaleDateString('es-ES')}</td>
                <td>
                  <span className={`status-badge ${record.status}`}>
                    {record.status === 'presente' ? 'Presente' : 'Ausente'}
                  </span>
                </td>
                <td>{record.observation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceTracker;