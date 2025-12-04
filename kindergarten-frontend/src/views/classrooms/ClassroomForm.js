import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { ArrowLeft, Save, People } from 'react-bootstrap-icons';
import classroomService from '../../api/classroomService';
import { useParams, useNavigate, Link } from 'react-router-dom';

const ClassroomForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    shift: '',
    academic_year: new Date().getFullYear(),
    age_group: '',
    is_active: true
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchClassroomData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await classroomService.getById(id);
      const classroom = response.data.data;

      setFormData({
        name: classroom.name || '',
        capacity: classroom.capacity || '',
        shift: classroom.shift || '',
        academic_year: classroom.academic_year || new Date().getFullYear(),
        age_group: classroom.age_group || '',
        is_active: classroom.is_active !== undefined ? classroom.is_active : true
      });
    } catch (err) {
      setError('Error al cargar los datos de la sala: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (isEdit) {
      fetchClassroomData();
    }
  }, [isEdit, fetchClassroomData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const classroomData = {
        name: formData.name,
        capacity: parseInt(formData.capacity),
        shift: formData.shift,
        academic_year: parseInt(formData.academic_year),
        age_group: parseInt(formData.age_group),
        is_active: formData.is_active
      };

      if (isEdit) {
        await classroomService.update(id, classroomData);
        navigate(`/classrooms/${id}`);
      } else {
        await classroomService.create(classroomData);
        navigate('/classrooms');
      }
    } catch (err) {
      setError('Error al guardar la sala: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <Container fluid className="py-4">
        <Row className="justify-content-center">
          <Col xs="auto">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
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
            {isEdit ? (
              <><People className="me-2" /> Editar Sala</>
            ) : (
              <><People className="me-2" /> Nueva Sala</>
            )}
          </h1>
          <p className="text-muted">
            {isEdit 
              ? 'Modificar la información de la sala' 
              : 'Agregar una nueva sala al jardín'
            }
          </p>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="form-container">
        <Card.Header className="form-header">
          <Link to="/classrooms" className="btn btn-outline-secondary btn-sm me-2">
            <ArrowLeft className="me-1" />
            Volver
          </Link>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Guardando...
              </>
            ) : (
              <>
                <Save className="me-2" />
                {isEdit ? 'Actualizar' : 'Guardar'} Sala
              </>
            )}
          </Button>
        </Card.Header>
        <Card.Body className="form-body">
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="form-group mb-3">
                  <Form.Label className="form-label">Nombre de la Sala *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Ej: Sala de 3 años A"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="form-group mb-3">
                  <Form.Label className="form-label">Capacidad *</Form.Label>
                  <Form.Control
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    required
                    min="1"
                    max="50"
                    placeholder="Cantidad máxima de alumnos"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="form-group mb-3">
                  <Form.Label className="form-label">Turno *</Form.Label>
                  <Form.Select
                    name="shift"
                    value={formData.shift}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccione un turno</option>
                    <option value="Mañana">Mañana</option>
                    <option value="Tarde">Tarde</option>
                    <option value="Completo">Completo</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="form-group mb-3">
                  <Form.Label className="form-label">Año Académico *</Form.Label>
                  <Form.Control
                    type="number"
                    name="academic_year"
                    value={formData.academic_year}
                    onChange={handleChange}
                    required
                    min="2000"
                    max="2100"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="form-group mb-3">
                  <Form.Label className="form-label">Grupo de Edad *</Form.Label>
                  <Form.Control
                    type="number"
                    name="age_group"
                    value={formData.age_group}
                    onChange={handleChange}
                    required
                    min="1"
                    max="10"
                    placeholder="Edad promedio de los alumnos (en años)"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="form-group mb-3">
                  <Form.Label className="form-label d-block">Estado</Form.Label>
                  <Form.Check
                    type="switch"
                    id="is_active"
                    label={formData.is_active ? 'Activa' : 'Inactiva'}
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="mt-4">
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={loading}
                className="me-2"
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="me-2" />
                    {isEdit ? 'Actualizar' : 'Guardar'} Sala
                  </>
                )}
              </Button>

              <Link to="/classrooms" className="btn btn-outline-secondary">
                <ArrowLeft className="me-2" />
                Volver al listado
              </Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ClassroomForm;