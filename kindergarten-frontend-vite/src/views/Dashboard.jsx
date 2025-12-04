import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Button } from 'react-bootstrap';
import { People, PersonCheck, Calendar, FileEarmarkMedical, JournalText, FileEarmarkCheck, PersonPlus } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import studentService from '../api/studentService';
import vaccinationService from '../api/vaccinationService';
import documentReviewService from '../api/documentReviewService';
import calendarService from '../api/calendarService';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setError(null);
        setLoading(true);

        // Fetch student stats
        const studentsResponse = await studentService.getAll();
        const students = studentsResponse.data.data || [];

        // Fetch vaccination summary
        const vaccinationResponse = await vaccinationService.getSummary();
        const vaccinationStats = vaccinationResponse.data.data || {};

        // Fetch pending document reviews
        const pendingReviewsResponse = await documentReviewService.getPending();
        const pendingReviews = pendingReviewsResponse.data.data || [];

        // Fetch today's calendar events
        const today = new Date().toISOString().split('T')[0];
        const calendarResponse = await calendarService.getAll({ date: today });
        const todayEvents = calendarResponse.data.data || [];

        // Calculate statistics
        const studentStatusCounts = students.reduce((acc, student) => {
          acc[student.status] = (acc[student.status] || 0) + 1;
          return acc;
        }, {});

        // Prepare dashboard stats
        const dashboardStats = {
          totalStudents: students.length,
          activeStudents: studentStatusCounts.activo || 0,
          preinscriptoStudents: studentStatusCounts.preinscripto || 0,
          inscriptoStudents: studentStatusCounts.inscripto || 0,
          vaccinationComplete: vaccinationStats.studentsWithCompleteVaccination || 0,
          vaccinationIncomplete: vaccinationStats.studentsWithIncompleteVaccination || 0,
          pendingDocuments: pendingReviews.length,
          todayEvents: todayEvents.length
        };

        setStats(dashboardStats);
      } catch (err) {
        setError('Error al cargar los datos del dashboard: ' + err.message);
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Container fluid className="py-4">
        <Row className="justify-content-center">
          <Col xs="auto">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </Spinner>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>
          <People style={{verticalAlign: 'middle'}} />
          Dashboard - Jardín de Infantes
        </h1>
        <p>Resumen del sistema y estadísticas generales</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {stats && (
        <>
          {/* Summary Cards */}
          <div className="cards-row">
            <div className="card-col">
              <div
                className="stat-card clickable-card"
                onClick={() => navigate('/students')}
                style={{ cursor: 'pointer' }}
              >
                <div className="card-content">
                  <div className="number">{stats.totalStudents}</div>
                  <div className="label">
                    <PersonCheck style={{verticalAlign: 'middle'}} />
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
                    <PersonCheck style={{verticalAlign: 'middle'}} />
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
                    <FileEarmarkMedical style={{verticalAlign: 'middle'}} />
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
                    <FileEarmarkCheck style={{verticalAlign: 'middle'}} />
                    Documentos Pendientes
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
                    <JournalText style={{verticalAlign: 'middle'}} />
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
                    <JournalText style={{verticalAlign: 'middle'}} />
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
                    <FileEarmarkMedical style={{verticalAlign: 'middle'}} />
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
                    <Calendar style={{verticalAlign: 'middle'}} />
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
              <a href="/students/new" className="quick-action-btn">
                <PersonPlus size={32} style={{display: 'block', marginBottom: '0.75rem'}} />
                Nuevo Alumno
              </a>
              <a href="/attendance" className="quick-action-btn">
                <FileEarmarkMedical size={32} style={{display: 'block', marginBottom: '0.75rem'}} />
                Registrar Asistencia
              </a>
              <a href="/calendar" className="quick-action-btn">
                <Calendar size={32} style={{display: 'block', marginBottom: '0.75rem'}} />
                Calendario
              </a>
              <a href="/document-reviews" className="quick-action-btn">
                <FileEarmarkCheck size={32} style={{display: 'block', marginBottom: '0.75rem'}} />
                Revisar Documentos
              </a>
            </div>
          </div>

          {/* Recent Activity */}
          <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1.5rem'}}>
            <div className="activity-card" style={{flex: '1', minWidth: '300px', marginBottom: '1rem'}}>
              <div className="card-header">
                <h5>Últimos Alumnos Registrados</h5>
              </div>
              <div className="card-body">
                <p>No hay alumnos recientes registrados.</p>
              </div>
            </div>
            <div className="activity-card" style={{flex: '1', minWidth: '300px', marginBottom: '1rem'}}>
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