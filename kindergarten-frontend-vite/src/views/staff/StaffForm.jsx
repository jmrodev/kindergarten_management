import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Shield, Phone, Envelope, House, PersonFill, Calendar } from 'react-bootstrap-icons';
import { Link, useNavigate, useParams } from 'react-router-dom';
import staffService from '../../api/staffService';
import { OfficeRibbonWithTitle } from '../../components/organisms';
import { Container, Row, Col, Card, Form, Input, Select, Button, Toggle } from '../../components/atoms';
import { safeExtractData } from '../../utils/apiResponseHandler';

const StaffForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    first_name: '',
    paternal_surname: '',
    maternal_surname: '',
    preferred_surname: '',
    dni: '',
    email: '',
    email_optional: '',
    phone: '',
    role_id: '',
    classroom_id: '',
    is_active: true,
    address_id: null
  });

  const [roles, setRoles] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      // Cargar roles usando el servicio de staff
      const rolesResponse = await staffService.getRoles();
      setRoles(safeExtractData(rolesResponse) || []);

      // Cargar salas usando el servicio de salas
      const classroomsResponse = await fetch('http://localhost:3000/api/classrooms', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (!classroomsResponse.ok) {
        throw new Error(`HTTP error! status: ${classroomsResponse.status}`);
      }
      const classroomsData = await classroomsResponse.json();
      setClassrooms(safeExtractData(classroomsData) || []);

      // Si es edición, cargar datos del personal
      if (isEdit) {
        const staffResponse = await staffService.getById(id);
        setFormData(safeExtractData(staffResponse) || {});
      }
    } catch (err) {
      setError('Error al cargar datos iniciales: ' + err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' || type === 'switch' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isEdit) {
        await staffService.update(id, formData);
        setSuccess('Personal actualizado correctamente');
        setTimeout(() => navigate('/staff'), 1500);
      } else {
        await staffService.create(formData);
        setSuccess('Personal creado correctamente');
        setTimeout(() => navigate('/staff'), 1500);
      }
    } catch (err) {
      setError('Error al guardar el personal: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="office-form-container">
      <OfficeRibbonWithTitle
        title={isEdit ? 'Editar Personal' : 'Nuevo Personal'}
        menuItems={[
          {
            label: "Volver",
            icon: <ArrowLeft size={16} />,
            onClick: () => navigate('/staff')
          },
          {
            label: "Guardar",
            icon: <Save size={16} />,
            onClick: handleSubmit,
            variant: "primary"
          }
        ]}
        onClose={() => navigate('/dashboard')}
        navigate={navigate}
      />

      {error && <div className="alert alert-danger office-alert">{error}</div>}
      {success && <div className="alert alert-success office-alert">{success}</div>}

      <Card className="office-form-card">
        <Card.Header className="office-form-card-header d-flex justify-content-between align-items-center">
          <div className="office-form-card-title">
            {isEdit ? (
              <>
                <Shield className="me-2" />
                Editar información del personal
              </>
            ) : (
              <>
                <PersonFill className="me-2" />
                Información del nuevo personal
              </>
            )}
          </div>
        </Card.Header>

        <Card.Body className="office-form-card-body">
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={6}>
                <div className="form-group">
                  <label className="input-label">
                    <PersonFill className="me-1 office-form-label-icon" />
                    Nombre *
                  </label>
                  <Input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Ingrese el nombre"
                    required
                  />
                </div>
              </Col>

              <Col md={6}>
                <div className="form-group">
                  <label className="input-label">
                    <PersonFill className="me-1 office-form-label-icon" />
                    Apellido Paterno *
                  </label>
                  <Input
                    type="text"
                    name="paternal_surname"
                    value={formData.paternal_surname}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Ingrese el apellido paterno"
                    required
                  />
                </div>
              </Col>

              <Col md={6}>
                <div className="form-group">
                  <label className="input-label">
                    <PersonFill className="me-1 office-form-label-icon" />
                    Apellido Materno
                  </label>
                  <Input
                    type="text"
                    name="maternal_surname"
                    value={formData.maternal_surname}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Ingrese el apellido materno"
                  />
                </div>
              </Col>

              <Col md={6}>
                <div className="form-group">
                  <label className="input-label">
                    <PersonFill className="me-1 office-form-label-icon" />
                    Nombre Preferido
                  </label>
                  <Input
                    type="text"
                    name="preferred_surname"
                    value={formData.preferred_surname}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Ingrese nombre preferido"
                  />
                </div>
              </Col>

              <Col md={6}>
                <div className="form-group">
                  <label className="input-label">
                    <Shield className="me-1 office-form-label-icon" />
                    DNI *
                  </label>
                  <Input
                    type="text"
                    name="dni"
                    value={formData.dni}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Ingrese el DNI"
                    required
                  />
                </div>
              </Col>

              <Col md={6}>
                <div className="form-group">
                  <label className="input-label">
                    <Phone className="me-1 office-form-label-icon" />
                    Teléfono
                  </label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Ingrese el teléfono"
                  />
                </div>
              </Col>

              <Col md={6}>
                <div className="form-group">
                  <label className="input-label">
                    <Envelope className="me-1 office-form-label-icon" />
                    Email Principal
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Ingrese el email principal"
                  />
                </div>
              </Col>

              <Col md={6}>
                <div className="form-group">
                  <label className="input-label">
                    <Envelope className="me-1 office-form-label-icon" />
                    Email Alternativo
                  </label>
                  <Input
                    type="email"
                    name="email_optional"
                    value={formData.email_optional}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Ingrese un email alternativo"
                  />
                </div>
              </Col>

              <Col md={6}>
                <div className="form-group">
                  <label className="input-label">
                    <Shield className="me-1 office-form-label-icon" />
                    Rol *
                  </label>
                  <Select
                    name="role_id"
                    value={formData.role_id}
                    onChange={handleChange}
                    className="select-field"
                    required
                  >
                    <option value="">Seleccione un rol</option>
                    {roles.map(role => (
                      <option key={role.id} value={role.id}>
                        {role.role_name}
                      </option>
                    ))}
                  </Select>
                </div>
              </Col>

              <Col md={6}>
                <div className="form-group">
                  <label className="input-label">
                    <House className="me-1 office-form-label-icon" />
                    Sala Asignada
                  </label>
                  <Select
                    name="classroom_id"
                    value={formData.classroom_id}
                    onChange={handleChange}
                    className="select-field"
                  >
                    <option value="">No asignado</option>
                    {classrooms.map(classroom => (
                      <option key={classroom.id} value={classroom.id}>
                        {classroom.name}
                      </option>
                    ))}
                  </Select>
                </div>
              </Col>

              <Col md={6}>
                <div className="form-group">
                  <Toggle
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    label="Activo"
                    className="office-form-switch"
                  />
                </div>
              </Col>
            </Row>
          </Form>
        </Card.Body>

        <Card.Footer className="office-form-card-footer">
          <div className="d-flex justify-content-end gap-2">
            <Button
              variant="outline-secondary"
              onClick={() => navigate('/staff')}
            >
              <ArrowLeft className="me-1" />
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              <Save className="me-1" />
              {loading ? 'Guardando...' : 'Guardar Personal'}
            </Button>
          </div>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default StaffForm;