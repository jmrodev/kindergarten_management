import React, { useState, useEffect } from 'react';
import { People, PersonCheck, Calendar, FileEarmarkMedical, JournalText, FileEarmarkCheck, PersonPlus } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { usePermissions } from '../contexts/PermissionsContext.jsx';
import vaccinationService from '../api/vaccinationService';
import documentReviewService from '../api/documentReviewService';
import calendarService from '../api/calendarService';
import WeatherReport from '../components/WeatherReport';
import AllStats from './dashboard/AllStats';
import QuickActions from './dashboard/QuickActions';
import RecentActivity from './dashboard/RecentActivity';

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
            <AllStats stats={stats} navigate={navigate} />
          </div>

          <QuickActions currentUser={currentUser} />

          <RecentActivity />
        </>
      )}
    </div>
  );
};

export default Dashboard;