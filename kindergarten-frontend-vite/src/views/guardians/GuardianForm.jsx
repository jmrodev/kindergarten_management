// views/guardians/GuardianForm.js - Updated to use atomic design
import React, { useState } from 'react';
import { ArrowLeft, PersonCircle } from 'react-bootstrap-icons';
import { useNavigate, useParams } from 'react-router-dom';
import OfficeRibbonWithTitle from '../../components/organisms/OfficeRibbonWithTitle';
import Container from '../../components/atoms/Container';
import { Row, Col } from '../../components/atoms/Grid';
import Card from '../../components/atoms/Card';
import Form from '../../components/atoms/Form';
import Input from '../../components/atoms/Input';
import Button from '../../components/atoms/Button';

const GuardianForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    first_name: '',
    paternal_surname: '',
    maternal_surname: '',
    dni: '',
    email: '',
    phone: '',
    address: '',
    relationship: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form data submitted:', formData);
    navigate('/guardians');
  };

  return (
    <Container fluid className="office-form-container">
      <OfficeRibbonWithTitle
        title={isEdit ? 'Editar Responsable' : 'Nuevo Responsable'}
        menuItems={[
          {
            label: "Volver",
            icon: <ArrowLeft size={16} />,
            onClick: () => navigate('/guardians')
          },
          {
            label: "Guardar",
            icon: <PersonCircle size={16} />,
            onClick: handleSubmit,
            variant: "primary"
          }
        ]}
        onClose={() => navigate('/dashboard')}
        navigate={navigate}
      />

      <Card className="office-form-card">
        <Card.Header className="office-form-card-header">
          <div className="office-form-card-title">
            <PersonCircle className="me-2" />
            {isEdit ? 'Editar información del responsable' : 'Información del nuevo responsable'}
          </div>
        </Card.Header>

        <Card.Body className="office-form-card-body">
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <div className="form-group">
                  <label className="input-label">Nombre(s)</label>
                  <Input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Ingrese nombre(s)"
                  />
                </div>
              </Col>
              <Col md={6}>
                <div className="form-group">
                  <label className="input-label">Apellido Paterno</label>
                  <Input
                    type="text"
                    name="paternal_surname"
                    value={formData.paternal_surname}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Ingrese apellido paterno"
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <div className="form-group">
                  <label className="input-label">Apellido Materno</label>
                  <Input
                    type="text"
                    name="maternal_surname"
                    value={formData.maternal_surname}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Ingrese apellido materno"
                  />
                </div>
              </Col>
              <Col md={6}>
                <div className="form-group">
                  <label className="input-label">DNI</label>
                  <Input
                    type="text"
                    name="dni"
                    value={formData.dni}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Ingrese DNI"
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <div className="form-group">
                  <label className="input-label">Email</label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Ingrese email"
                  />
                </div>
              </Col>
              <Col md={6}>
                <div className="form-group">
                  <label className="input-label">Teléfono</label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Ingrese teléfono"
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <div className="form-group">
                  <label className="input-label">Dirección</label>
                  <Input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Ingrese dirección"
                  />
                </div>
              </Col>
              <Col md={6}>
                <div className="form-group">
                  <label className="input-label">Relación con el alumno</label>
                  <Input
                    type="text"
                    name="relationship"
                    value={formData.relationship}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Ingrese relación con el alumno"
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
              onClick={() => navigate('/guardians')}
            >
              <ArrowLeft className="me-1" />
              Cancelar
            </Button>
            <Button
              variant="primary"
              type="submit"
              onClick={handleSubmit}
            >
              <PersonCircle className="me-1" />
              Guardar Responsable
            </Button>
          </div>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default GuardianForm;