import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dashboardService from '../services/dashboardService';
import './dashboard.css';
import './birthdays.css';

function Dashboard() {
  const [stats, setStats] = useState({
    activeStudents: 0,
    classroomStats: [],
    totalStaff: 0,
    pendingEnrollments: 0,
    pendingReviews: 0,
    birthdays: { today: [], week: [], month: [] }
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
        <div className="stat-card blue" style={{ gridRow: 'span 2' }}>
          <div className="stat-icon">🎓</div>
          <div className="stat-info" style={{ width: '100%' }}>
            <h3>Alumnos por Sala</h3>

            {stats.classroomStats && stats.classroomStats.length > 0 ? (
              <div className="classroom-stats-list">
                {stats.classroomStats.map(c => (
                  <div key={c.id} className="classroom-stat-row">
                    <span className="classroom-name">{c.name}</span>
                    <div className="classroom-values">
                      <span title="Total">Total: <strong>{c.total}</strong></span>
                      <span className="gender-stat male" title="Varones">👦 {c.M}</span>
                      <span className="gender-stat female" title="Mujeres">👧 {c.F}</span>
                      {c.U > 0 && <span className="gender-stat unknown" title="Sin especificar">❓ {c.U}</span>}
                    </div>
                  </div>
                ))}
                <div className="classroom-stat-total">
                  <span>Total General: <strong>{stats.activeStudents}</strong></span>
                </div>
              </div>
            ) : (
              <p className="stat-value">{stats.activeStudents}</p>
            )}
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
            <p className="stat-value">{(stats.pendingReviews || 0) + (stats.studentsWithPendingDocs || 0)}</p>
          </div>
        </div>
      </section>

      {/* Birthday Section */}
      <section className="birthday-section">
        <h2>🎉 Cumpleaños</h2>
        <div className="birthday-grid">
          {/* Today */}
          <div className="birthday-card today">
            <h3>Hoy 🎂</h3>
            {stats.birthdays?.today && stats.birthdays.today.length > 0 ? (
              <ul className="birthday-list">
                {stats.birthdays.today.map((s, idx) => (
                  <li key={idx} className="birthday-item">
                    <span className="birthday-name">{s.first_name} {s.paternal_surname}</span>
                    <span className="birthday-date">¡Hoy!</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty-state">No hay cumpleaños hoy</p>
            )}
          </div>

          {/* This Week */}
          <div className="birthday-card">
            <h3>Esta Semana 📅</h3>
            {stats.birthdays?.week && stats.birthdays.week.length > 0 ? (
              <ul className="birthday-list">
                {stats.birthdays.week.map((s, idx) => (
                  <li key={idx} className="birthday-item">
                    <div>
                      <span className="birthday-name">{s.first_name} {s.paternal_surname}</span>
                      {s.isWeekend && <span className="weekend-badge" title="Fin de semana (Sin clases)">Finde 🏖️</span>}
                    </div>
                    <span className="birthday-date">
                      {new Date(s.birth_date).getDate()}/{new Date(s.birth_date).getMonth() + 1}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty-state">No hay más cumpleaños esta semana</p>
            )}
          </div>

          {/* This Month */}
          <div className="birthday-card">
            <h3>Este Mes 🗓️</h3>
            {stats.birthdays?.month && stats.birthdays.month.length > 0 ? (
              <p className="stat-value" style={{ fontSize: '1.5rem', textAlign: 'center' }}>
                {stats.birthdays.month.length} <span style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>cumpleañeros</span>
              </p>
            ) : (
              <p className="empty-state">Sin cumpleaños este mes</p>
            )}
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
