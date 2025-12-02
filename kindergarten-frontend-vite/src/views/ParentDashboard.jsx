import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { PersonFill, Pencil, Calendar, FileMedical, PersonCheck } from 'react-bootstrap-icons';
import api from '../api/api.js';

const ParentDashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [parentInfo, setParentInfo] = useState(null);
  const [children, setChildren] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // Load parent and children info
    const loadParentData = async () => {
      try {
        setLoading(true);

        // Get parent info from parent portal users
        const parentResponse = await api.get(`/parents/portal-user/${currentUser.id}`);
        setParentInfo(parentResponse.data.data);

        // Get children associated with this parent
        const childrenResponse = await api.get(`/students/by-parent/${currentUser.id}`);
        setChildren(childrenResponse.data.data);
      } catch (err) {
        setError('Error al cargar la información: ' + err.message);
        console.error('Error loading parent data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadParentData();
  }, [currentUser, navigate]);

  const handleRegisterChild = () => {
    navigate('/register-child');
  };

  if (loading) {
    return (
      <Container fluid className="d-flex align-items-center justify-content-center min-vh-100">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="h3 mb-0">
            <PersonFill className="me-2" /> Portal de Padres
          </h1>
          <p className="text-muted">Bienvenido/a {currentUser.name || currentUser.email}</p>
        </Col>
        <Col xs="auto">
          <Button variant="outline-secondary" onClick={logout}>
            Cerrar Sesión
          </Button>
        </Col>
      </Row>

      {error && (
        <Row className="mb-4">
          <Col>
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      )}

      <Row className="mb-4">
        <Col md={8}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Información del Padre</h5>
            </Card.Header>
            <Card.Body>
              <p><strong>Nombre:</strong> {currentUser.name}</p>
              <p><strong>Email:</strong> {currentUser.email}</p>
              <p><strong>Registrado desde:</strong> {currentUser.created_at ? new Date(currentUser.created_at).toLocaleDateString() : 'N/A'}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100">
            <Card.Body className="d-flex flex-column justify-content-center align-items-center">
              <Button variant="primary" onClick={handleRegisterChild} className="w-100">
                <Pencil className="me-2" />
                Inscribir Nuevo Hijo
              </Button>
              <small className="text-muted mt-2">
                Iniciar proceso de inscripción para un nuevo alumno
              </small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Hijos Inscritos</h5>
            </Card.Header>
            <Card.Body>
              {children && children.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>DNI</th>
                        <th>Fecha de Nacimiento</th>
                        <th>Estado</th>
                        <th>Sala</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {children.map((child) => (
                        <tr key={child.id}>
                          <td>{child.first_name} {child.paternal_surname} {child.maternal_surname}</td>
                          <td>{child.dni}</td>
                          <td>{child.birth_date ? new Date(child.birth_date).toLocaleDateString() : 'N/A'}</td>
                          <td>
                            <span className={`badge ${
                              child.status === 'activo' ? 'bg-success' :
                              child.status === 'inscripto' ? 'bg-info' :
                              child.status === 'preinscripto' ? 'bg-warning' :
                              'bg-secondary'
                            }`}>
                              {child.status}
                            </span>
                          </td>
                          <td>{child.classroom_name || 'No asignado'}</td>
                          <td>
                            <Button variant="outline-primary" size="sm" onClick={() => navigate(`/children/${child.id}`)}>
                              Ver detalles
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-muted">Aún no tiene hijos registrados en el sistema. Puede inscribir uno usando el botón anterior.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col md={4}>
          <Card className="h-100">
            <Card.Body className="text-center">
              <Calendar className="text-primary mb-3" size={48} />
              <h5>Calendario Escolar</h5>
              <p className="text-muted">Consulte las fechas importantes del calendario escolar</p>
              <Button variant="outline-primary" disabled>
                Próximamente
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100">
            <Card.Body className="text-center">
              <FileMedical className="text-success mb-3" size={48} />
              <h5>Documentación</h5>
              <p className="text-muted">Suba y verifique la documentación requerida</p>
              <Button variant="outline-success" disabled>
                Próximamente
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100">
            <Card.Body className="text-center">
              <PersonCheck className="text-info mb-3" size={48} />
              <h5>Asistencia</h5>
              <p className="text-muted">Consulte la asistencia de sus hijos</p>
              <Button variant="outline-info" disabled>
                Próximamente
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ParentDashboard;