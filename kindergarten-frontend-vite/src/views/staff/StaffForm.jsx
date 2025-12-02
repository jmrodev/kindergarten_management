import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Breadcrumb, Tabs, Tab } from 'react-bootstrap';
import { ArrowLeft, Save, Shield, Phone, Envelope, House, PersonFill, Calendar } from 'react-bootstrap-icons';
import { Link, useNavigate, useParams } from 'react-router-dom';
import staffService from '../../api/staffService';

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
      setRoles(rolesResponse.data);

      // Cargar salas usando el API directamente con la configuración adecuada
      const apiResponse = await fetch('http://localhost:3000/api/classrooms', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (!apiResponse.ok) {
        throw new Error(`HTTP error! status: ${apiResponse.status}`);
      }
      const classroomsData = await apiResponse.json();
      setClassrooms(classroomsData);

      // Si es edición, cargar datos del personal
      if (isEdit) {
        const staffResponse = await staffService.getById(id);
        setFormData(staffResponse.data);
      }
    } catch (err) {
      setError('Error al cargar datos iniciales: ' + err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
    <Container fluid className="py-4 office-form-container">
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center mb-2">
            <h1 className="h3 mb-0 office-form-title">
              <PersonFill className="me-2 office-form-icon" />
              {isEdit ? 'Editar Personal' : 'Nuevo Personal'}
            </h1>
          </div>
          <Breadcrumb className="office-breadcrumb">
            <Breadcrumb.Item linkProps={{ to: "/dashboard" }} href="/dashboard">Inicio</Breadcrumb.Item>
            <Breadcrumb.Item linkProps={{ to: "/staff" }} href="/staff">Personal</Breadcrumb.Item>
            <Breadcrumb.Item active>{isEdit ? 'Editar' : 'Nuevo'}</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
      </Row>

      {error && <Alert variant="danger" className="office-alert">{error}</Alert>}
      {success && <Alert variant="success" className="office-alert">{success}</Alert>}

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
          <div className="office-form-card-actions">
            <Button 
              variant="outline-secondary" 
              size="sm" 
              className="me-2"
              onClick={() => navigate('/staff')}
            >
              <ArrowLeft className="me-1" />
              Volver
            </Button>
            <Button 
              variant="primary" 
              size="sm"
              onClick={handleSubmit}
              disabled={loading}
            >
              <Save className="me-1" />
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </Card.Header>
        
        <Card.Body className="office-form-card-body">
          <Tabs defaultActiveKey="personal" className="office-form-tabs">
            <Tab eventKey="personal" title="Información Personal" className="office-tab-content">
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group className="mb-3 office-form-group">
                    <Form.Label className="office-form-label">
                      <PersonFill className="me-1 office-form-label-icon" />
                      Nombre *
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      className="office-form-control"
                      placeholder="Ingrese el nombre"
                      required
                    />
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3 office-form-group">
                    <Form.Label className="office-form-label">
                      <PersonFill className="me-1 office-form-label-icon" />
                      Apellido Paterno *
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="paternal_surname"
                      value={formData.paternal_surname}
                      onChange={handleChange}
                      className="office-form-control"
                      placeholder="Ingrese el apellido paterno"
                      required
                    />
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3 office-form-group">
                    <Form.Label className="office-form-label">
                      <PersonFill className="me-1 office-form-label-icon" />
                      Apellido Materno
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="maternal_surname"
                      value={formData.maternal_surname}
                      onChange={handleChange}
                      className="office-form-control"
                      placeholder="Ingrese el apellido materno"
                    />
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3 office-form-group">
                    <Form.Label className="office-form-label">
                      <PersonFill className="me-1 office-form-label-icon" />
                      Nombre Preferido
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="preferred_surname"
                      value={formData.preferred_surname}
                      onChange={handleChange}
                      className="office-form-control"
                      placeholder="Ingrese nombre preferido"
                    />
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3 office-form-group">
                    <Form.Label className="office-form-label">
                      <Shield className="me-1 office-form-label-icon" />
                      DNI *
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="dni"
                      value={formData.dni}
                      onChange={handleChange}
                      className="office-form-control"
                      placeholder="Ingrese el DNI"
                      required
                    />
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3 office-form-group">
                    <Form.Label className="office-form-label">
                      <Phone className="me-1 office-form-label-icon" />
                      Teléfono
                    </Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="office-form-control"
                      placeholder="Ingrese el teléfono"
                    />
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3 office-form-group">
                    <Form.Label className="office-form-label">
                      <Envelope className="me-1 office-form-label-icon" />
                      Email Principal
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="office-form-control"
                      placeholder="Ingrese el email principal"
                    />
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3 office-form-group">
                    <Form.Label className="office-form-label">
                      <Envelope className="me-1 office-form-label-icon" />
                      Email Alternativo
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email_optional"
                      value={formData.email_optional}
                      onChange={handleChange}
                      className="office-form-control"
                      placeholder="Ingrese un email alternativo"
                    />
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3 office-form-group">
                    <Form.Label className="office-form-label">
                      <Shield className="me-1 office-form-label-icon" />
                      Rol *
                    </Form.Label>
                    <Form.Select
                      name="role_id"
                      value={formData.role_id}
                      onChange={handleChange}
                      className="office-form-control"
                      required
                    >
                      <option value="">Seleccione un rol</option>
                      {roles.map(role => (
                        <option key={role.id} value={role.id}>
                          {role.role_name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3 office-form-group">
                    <Form.Label className="office-form-label">
                      <House className="me-1 office-form-label-icon" />
                      Sala Asignada
                    </Form.Label>
                    <Form.Select
                      name="classroom_id"
                      value={formData.classroom_id}
                      onChange={handleChange}
                      className="office-form-control"
                    >
                      <option value="">No asignado</option>
                      {classrooms.map(classroom => (
                        <option key={classroom.id} value={classroom.id}>
                          {classroom.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3 office-form-group">
                    <Form.Check
                      type="switch"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleChange}
                      className="office-form-switch"
                      label="Activo"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Tab>
            
            <Tab eventKey="additional" title="Información Adicional" className="office-tab-content">
              <Row className="g-3">
                <Col md={12}>
                  <Form.Group className="mb-3 office-form-group">
                    <Form.Label className="office-form-label">
                      <Shield className="me-1 office-form-label-icon" />
                      ID de Dirección
                    </Form.Label>
                    <Form.Control
                      type="number"
                      name="address_id"
                      value={formData.address_id || ''}
                      onChange={handleChange}
                      className="office-form-control"
                      placeholder="Ingrese el ID de dirección"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Tab>
          </Tabs>
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