import React, { useState, useEffect } from 'react';
import { People, PersonCheck, Calendar, FileEarmarkMedical, JournalText, FileEarmarkCheck, PersonPlus } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { usePermissions } from '../contexts/PermissionsContext.jsx';
import vaccinationService from '../api/vaccinationService';
import documentReviewService from '../api/documentReviewService';
import calendarService from '../api/calendarService';
import WeatherReport from '../components/WeatherReport';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { can } = usePermissions();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setError(null);
        setLoading(true);

        let vaccinationStats = { studentsWithCompleteVaccination: 0, studentsWithIncompleteVaccination: 0 };
        let pendingReviews = [];
        let todayEvents = [];

        // Check if user has staff role (not parent portal user) before fetching restricted data
        if (!currentUser?.parentPortalUser) {
          // Fetch vaccination summary (solo para usuarios staff con permisos)
          try {
            const vaccinationResponse = await vaccinationService.getSummary();
            vaccinationStats = vaccinationResponse.data.data || {};
          } catch (vaccinationErr) {
            if (vaccinationErr.response?.status === 403) {
              // Usuario no tiene permiso para ver estadísticas de vacunas, usar valores por defecto
              vaccinationStats = { studentsWithCompleteVaccination: 0, studentsWithIncompleteVaccination: 0 };
            } else {
              console.error('Error fetching vaccination data:', vaccinationErr);
            }
          }

          // Fetch pending document reviews (solo para usuarios staff con permisos)
          try {
            const pendingReviewsResponse = await documentReviewService.getPending();
            pendingReviews = pendingReviewsResponse.data.data || [];
          } catch (docReviewErr) {
            if (docReviewErr.response?.status === 403) {
              // Usuario no tiene permiso para ver revisiones de documentos, usar array vacío
              pendingReviews = [];
            } else {
              console.error('Error fetching pending document reviews:', docReviewErr);
            }
          }

          // Fetch today's calendar events (solo para usuarios staff con permisos)
          const today = new Date().toISOString().split('T')[0];
          try {
            const calendarResponse = await calendarService.getAll({ date: today });
            todayEvents = calendarResponse.data.data || [];
          } catch (calendarErr) {
            if (calendarErr.response?.status === 403) {
              // Usuario no tiene permiso para ver eventos del calendario, usar array vacío
              todayEvents = [];
            } else {
              console.error('Error fetching calendar events:', calendarErr);
            }
          }
        } else {
          // For parent portal users, get their children's information instead
          // The userId should be the parent portal user ID which is already in currentUser.id
          try {
            const childrenResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/parent-portal/children/parent/${currentUser.id}`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
              }
            });

            if (childrenResponse.ok) {
              const childrenData = await childrenResponse.json();
              // Calculate statistics based on children data if needed
            }
          } catch (parentErr) {
            console.error('Error fetching parent data:', parentErr);
          }
        }

        // Prepare dashboard stats (sin datos de estudiantes para este caso)
        const dashboardStats = {
          totalStudents: 0,
          activeStudents: 0,
          preinscriptoStudents: 0,
          inscriptoStudents: 0,
          vaccinationComplete: vaccinationStats.studentsWithCompleteVaccination || 0,
          vaccinationIncomplete: vaccinationStats.studentsWithIncompleteVaccination || 0,
          pendingDocuments: pendingReviews.length,
          todayEvents: todayEvents.length
        };

        setStats(dashboardStats);
      } catch (err) {
        // Solo mostrar error si no es un error de permisos (403)
        if (err.response?.status !== 403) {
          setError('Error al cargar los datos del dashboard: ' + err.message);
        }
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="dashboard-container py-4">
        <div className="d-flex justify-content-center">
          <div className="spinner" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>
          <People className="icon-middle" />
          Dashboard - Jardín de Infantes
        </h1>
        <p>Resumen del sistema y estadísticas generales</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {stats && (
        <>
          {/* Weather Report and Summary Cards */}
          <div className="flex-gap-1-5-wrap">
            <div className="flex-1-min400">
              <WeatherReport />
            </div>
            <div className="flex-2-min600">
              {/* Summary Cards */}
              <div className="cards-row">
                <div className="card-col">
                  <div
                    className="stat-card clickable-card cursor-pointer"
                    onClick={() => navigate('/students')}
                  >
                    <div className="card-content">
                      <div className="number">{stats.totalStudents}</div>
                      <div className="label">
                        <PersonCheck className="icon-middle" />
                        Alumnos Totales
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-col">
                  <div className="stat-card active">
                    <div className="card-content">
                      <div className="number">{stats.activeStudents}</div>
                      <div className="label">
                        <PersonCheck className="icon-middle" />
                        Alumnos Activos
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-col">
                  <div className="stat-card active">
                    <div className="card-content">
                      <div className="number">{stats.vaccinationComplete}</div>
                      <div className="label">
                        <FileEarmarkMedical className="icon-middle" />
                        Vacunas Completas
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-col">
                  <div className="stat-card warning">
                    <div className="card-content">
                      <div className="number">{stats.pendingDocuments}</div>
                      <div className="label">
                        <FileEarmarkCheck className="icon-middle" />
                        Documentos Pendientes
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="cards-row">
            <div className="card-col">
              <div className="stat-card warning">
                <div className="card-content">
                  <div className="number">{stats.preinscriptoStudents}</div>
                  <div className="label">
                    <JournalText className="icon-middle" />
                    Preinscriptos
                  </div>
                </div>
              </div>
            </div>
            <div className="card-col">
              <div className="stat-card info">
                <div className="card-content">
                  <div className="number">{stats.inscriptoStudents}</div>
                  <div className="label">
                    <JournalText className="icon-middle" />
                    Inscriptos
                  </div>
                </div>
              </div>
            </div>
            <div className="card-col">
              <div className="stat-card danger">
                <div className="card-content">
                  <div className="number">{stats.vaccinationIncomplete}</div>
                  <div className="label">
                    <FileEarmarkMedical className="icon-middle" />
                    Vacunas Incompletas
                  </div>
                </div>
              </div>
            </div>
            <div className="card-col">
              <div className="stat-card info">
                <div className="card-content">
                  <div className="number">{stats.todayEvents}</div>
                  <div className="label">
                    <Calendar className="icon-middle" />
                    Eventos Hoy
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions-card">
            <div className="card-header">
              <h5>Acciones Rápidas</h5>
            </div>
            <div className="quick-actions-grid">
              {(currentUser?.role === 'Administrator' || currentUser?.role === 'Director' || currentUser?.role === 'Secretary' || currentUser?.role === 'Teacher') && (
                <a href="/attendance" className="quick-action-btn">
                  <FileEarmarkMedical size={32} className="icon-block-mb" />
                  Registrar Asistencia
                </a>
              )}
              <a href="/calendar" className="quick-action-btn">
                <Calendar size={32} className="icon-block-mb" />
                Calendario
              </a>
              {(currentUser?.role === 'Administrator' || currentUser?.role === 'Director' || currentUser?.role === 'Secretary') && (
                <a href="/document-reviews" className="quick-action-btn">
                  <FileEarmarkCheck size={32} className="icon-block-mb" />
                  Revisar Documentos
                </a>
              )}
              {currentUser?.parentPortalUser && (
                <a href="/parent-dashboard" className="quick-action-btn">
                  <PersonCheck size={32} className="icon-block-mb" />
                  Mi Panel
                </a>
              )}
            </div>
          </div>

          {/* Recent Activity */}
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
        </>
      )}
    </div>
  );
};

export default Dashboard;