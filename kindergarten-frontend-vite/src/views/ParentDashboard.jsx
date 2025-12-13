import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { PersonFill, Pencil, Calendar, FileMedical, PersonCheck } from 'react-bootstrap-icons';
import api from '../api/api.js';
import { Row, Col } from '../components/atoms/Grid';
import Card from '../components/atoms/Card';
import Button from '../components/atoms/Button';
import Spinner from '../components/atoms/Spinner';
import ChildrenTable from './parent/ChildrenTable';

const ParentDashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [parentInfo, setParentInfo] = useState(null);
  const [children, setChildren] = useState([]);
  const [error, setError] = useState('');

  const loadParentData = React.useCallback(async () => {
    if (!currentUser) return;
    try {
      setError('');
      setLoading(true);

      // Get parent info from parent portal users
      const parentResponse = await api.get(`/parent-portal/portal-user/${currentUser.id}`);
      setParentInfo(parentResponse.data.data);

      // Get children associated with this parent
      const childrenResponse = await api.get(`/parent-portal/children/parent/${currentUser.id}`);
      setChildren(childrenResponse.data.children || []);
    } catch (err) {
      setError('Error al cargar la información: ' + (err?.message || err));
      console.error('Error loading parent data:', err);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    loadParentData();
  }, [currentUser, navigate, loadParentData]);

  // Eliminado el manejo de registro de niños ya que el formulario ha sido eliminado

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100">
        <Spinner role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
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
            <div className="alert alert-danger d-flex justify-content-between align-items-center">
              <div>{error}</div>
              <div>
                <Button variant="outline-light" onClick={() => loadParentData()} className="me-2">Reintentar</Button>
                <Button variant="outline-secondary" onClick={() => { setError(''); }}>Cerrar</Button>
              </div>
            </div>
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
              <p><strong>Nombre:</strong> {parentInfo?.name || currentUser.name}</p>
              <p><strong>Email:</strong> {parentInfo?.email || currentUser.email}</p>
              <p><strong>Registrado desde:</strong> {parentInfo?.created_at ? new Date(parentInfo.created_at).toLocaleDateString() : 'N/A'}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100">
            <Card.Body className="d-flex flex-column justify-content-center align-items-center">
              <Button variant="outline-secondary" className="w-100" disabled>
                <Pencil className="me-2" />
                Inscripciones Temporalmente Cerradas
              </Button>
              <small className="text-muted mt-2">
                Contactar al jardín para iniciar proceso de inscripción
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
                <ChildrenTable children={children} />
              ) : (
                <p className="text-center text-muted">Aún no tiene hijos registrados en el sistema. Para iniciar el proceso de inscripción, contacte al jardín.</p>
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
    </div>
  );
};

export default ParentDashboard;