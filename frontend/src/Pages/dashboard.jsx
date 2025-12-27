import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dashboardService from '../services/dashboardService';
import './dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState({
    activeStudents: 0,
    totalStaff: 0,
    pendingEnrollments: 0,
    pendingReviews: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardService.getStats();
        setStats(data);
        setLoading(false);
      } catch (err) {
        console.error('Error loading stats:', err);
        setError('No se pudieron cargar las estadísticas.');
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  if (loading) return <div className="dashboard-loading">Cargando panel...</div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>{getGreeting()}, {user?.firstName || 'Usuario'}</h1>
        <p className="dashboard-subtitle">Bienvenido al panel de control del Jardín de Infantes.</p>
      </header>

      {error && <div className="dashboard-error">{error}</div>}

      <section className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon">🎓</div>
          <div className="stat-info">
            <h3>Alumnos Activos</h3>
            <p className="stat-value">{stats.activeStudents}</p>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>Personal</h3>
            <p className="stat-value">{stats.totalStaff}</p>
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-icon">📝</div>
          <div className="stat-info">
            <h3>Inscripciones Pendientes</h3>
            <p className="stat-value">{stats.pendingEnrollments}</p>
          </div>
        </div>

        <div className="stat-card purple">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <h3>Revisiones Pendientes</h3>
            <p className="stat-value">{stats.pendingReviews + stats.studentsWithPendingDocs}</p>
          </div>
        </div>
      </section>

      <div className="dashboard-content-split">
        <section className="quick-actions">
          <h2>Acciones Rápidas</h2>
          <div className="action-buttons">
            <button onClick={() => navigate('/students')} className="action-btn">
              👤 Ver Estudiantes
            </button>
            <button onClick={() => navigate('/enrollments')} className="action-btn">
              📄 Gestionar Inscripciones
            </button>
            <button onClick={() => navigate('/attendance')} className="action-btn">
              📅 Tomar Asistencia
            </button>
          </div>
        </section>

        <section className="system-info">
          <h2>Estado del Sistema</h2>
          <div className="info-card">
            <p><strong>Última actualización:</strong> {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
            <p><strong>Versión:</strong> 1.0.0</p>
            <p><strong>Conexión:</strong> <span className="status-ok">● Estable</span></p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
