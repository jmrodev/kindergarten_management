import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Save, People } from 'react-bootstrap-icons';
import classroomService from '../../api/classroomService';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { OfficeRibbonWithTitle } from '../../components/organisms';
import { Container, Row, Col, Card, Form, Input, Select, Button, Toggle, Spinner } from '../../components/atoms';

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
      [name]: type === 'checkbox' || type === 'switch' ? checked : value
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
            <Spinner role="status">
              <span className="visually-hidden">Cargando...</span>
            </Spinner>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container fluid className="office-form-container">
      <OfficeRibbonWithTitle
        title={isEdit ? 'Editar Sala' : 'Nueva Sala'}
        menuItems={[
          {
            label: "Volver",
            icon: <ArrowLeft size={16} />,
            onClick: () => navigate('/classrooms')
          },
          {
            label: isEdit ? 'Actualizar Sala' : 'Guardar Sala',
            icon: <Save size={16} />,
            onClick: handleSubmit,
            variant: "primary"
          }
        ]}
        onClose={() => navigate('/dashboard')}
        navigate={navigate}
      />

      {error && <div className="alert alert-danger office-alert">{error}</div>}

      <Card className="office-form-card">
        <Card.Body className="office-form-card-body">
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <div className="form-group">
                  <label className="input-label required">Nombre de la Sala *</label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Ej: Sala de 3 años A"
                    required
                  />
                </div>
              </Col>
              <Col md={6}>
                <div className="form-group">
                  <label className="input-label required">Capacidad *</label>
                  <Input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Cantidad máxima de alumnos"
                    required
                    min="1"
                    max="50"
                  />
                </div>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <div className="form-group">
                  <label className="input-label required">Turno *</label>
                  <Select
                    name="shift"
                    value={formData.shift}
                    onChange={handleChange}
                    className="select-field"
                    required
                  >
                    <option value="">Seleccione un turno</option>
                    <option value="Mañana">Mañana</option>
                    <option value="Tarde">Tarde</option>
                    <option value="Completo">Completo</option>
                  </Select>
                </div>
              </Col>
              <Col md={6}>
                <div className="form-group">
                  <label className="input-label required">Año Académico *</label>
                  <Input
                    type="number"
                    name="academic_year"
                    value={formData.academic_year}
                    onChange={handleChange}
                    className="input-field"
                    required
                    min="2000"
                    max="2100"
                  />
                </div>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <div className="form-group">
                  <label className="input-label required">Grupo de Edad *</label>
                  <Input
                    type="number"
                    name="age_group"
                    value={formData.age_group}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Edad promedio de los alumnos (en años)"
                    required
                    min="1"
                    max="10"
                  />
                </div>
              </Col>
              <Col md={6}>
                <div className="form-group">
                  <Toggle
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    label={formData.is_active ? 'Activa' : 'Inactiva'}
                  />
                </div>
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
                    <span className="spinner spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="me-2" />
                    {isEdit ? 'Actualizar' : 'Guardar'} Sala
                  </>
                )}
              </Button>

              <Button
                variant="outline-secondary"
                onClick={() => navigate('/classrooms')}
              >
                <ArrowLeft className="me-2" />
                Volver al listado
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ClassroomForm;