import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Button } from 'react-bootstrap';
import { People, PersonCheck, Calendar, FileEarmarkMedical, JournalText, FileEarmarkCheck, PersonPlus } from 'react-bootstrap-icons';
import studentService from '../api/studentService';
import vaccinationService from '../api/vaccinationService';
import documentReviewService from '../api/documentReviewService';
import calendarService from '../api/calendarService';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="h3 mb-0">
            <People className="me-2" />
            Dashboard - Jardín de Infantes
          </h1>
          <p className="text-muted">Resumen del sistema y estadísticas generales</p>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {stats && (
        <>
          {/* Summary Cards */}
          <Row className="mb-4">
            <Col md={3} sm={6} className="mb-3">
              <Card className="text-center stat-card">
                <Card.Body>
                  <div className="number">{stats.totalStudents}</div>
                  <div className="label">
                    <PersonCheck className="me-1" />
                    Alumnos Totales
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6} className="mb-3">
              <Card className="text-center stat-card">
                <Card.Body>
                  <div className="number">{stats.activeStudents}</div>
                  <div className="label text-success">
                    <PersonCheck className="me-1" />
                    Alumnos Activos
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6} className="mb-3">
              <Card className="text-center stat-card">
                <Card.Body>
                  <div className="number">{stats.vaccinationComplete}</div>
                  <div className="label text-success">
                    <FileEarmarkMedical className="me-1" />
                    Vacunas Completas
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6} className="mb-3">
              <Card className="text-center stat-card">
                <Card.Body>
                  <div className="number">{stats.pendingDocuments}</div>
                  <div className="label text-warning">
                    <FileEarmarkCheck className="me-1" />
                    Documentos Pendientes
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Additional Stats */}
          <Row className="mb-4">
            <Col md={3} sm={6} className="mb-3">
              <Card className="text-center stat-card">
                <Card.Body>
                  <div className="number">{stats.preinscriptoStudents}</div>
                  <div className="label text-warning">
                    <JournalText className="me-1" />
                    Preinscriptos
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6} className="mb-3">
              <Card className="text-center stat-card">
                <Card.Body>
                  <div className="number">{stats.inscriptoStudents}</div>
                  <div className="label text-primary">
                    <JournalText className="me-1" />
                    Inscriptos
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6} className="mb-3">
              <Card className="text-center stat-card">
                <Card.Body>
                  <div className="number">{stats.vaccinationIncomplete}</div>
                  <div className="label text-danger">
                    <FileEarmarkMedical className="me-1" />
                    Vacunas Incompletas
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6} className="mb-3">
              <Card className="text-center stat-card">
                <Card.Body>
                  <div className="number">{stats.todayEvents}</div>
                  <div className="label text-info">
                    <Calendar className="me-1" />
                    Eventos Hoy
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Quick Actions */}
          <Row className="mb-4">
            <Col>
              <Card>
                <Card.Header>
                  <h5 className="mb-0">Acciones Rápidas</h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={3} sm={6} className="mb-3">
                      <Button 
                        variant="outline-primary" 
                        className="w-100 h-100 d-flex flex-column align-items-center justify-content-center"
                        href="/students/new"
                      >
                        <PersonPlus className="mb-2" size={32} />
                        Nuevo Alumno
                      </Button>
                    </Col>
                    <Col md={3} sm={6} className="mb-3">
                      <Button 
                        variant="outline-success" 
                        className="w-100 h-100 d-flex flex-column align-items-center justify-content-center"
                        href="/attendance"
                      >
                        <FileEarmarkMedical className="mb-2" size={32} />
                        Registrar Asistencia
                      </Button>
                    </Col>
                    <Col md={3} sm={6} className="mb-3">
                      <Button 
                        variant="outline-info" 
                        className="w-100 h-100 d-flex flex-column align-items-center justify-content-center"
                        href="/calendar"
                      >
                        <Calendar className="mb-2" size={32} />
                        Calendario
                      </Button>
                    </Col>
                    <Col md={3} sm={6} className="mb-3">
                      <Button 
                        variant="outline-warning" 
                        className="w-100 h-100 d-flex flex-column align-items-center justify-content-center"
                        href="/document-reviews"
                      >
                        <FileEarmarkCheck className="mb-2" size={32} />
                        Revisar Documentos
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Recent Activity */}
          <Row>
            <Col md={6} className="mb-3">
              <Card>
                <Card.Header>
                  <h5 className="mb-0">Últimos Alumnos Registrados</h5>
                </Card.Header>
                <Card.Body>
                  <p className="text-muted">No hay alumnos recientes registrados.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} className="mb-3">
              <Card>
                <Card.Header>
                  <h5 className="mb-0">Próximos Eventos</h5>
                </Card.Header>
                <Card.Body>
                  <p className="text-muted">No hay eventos programados próximamente.</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default Dashboard;