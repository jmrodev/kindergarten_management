// views/staff/StaffForm.js - Placeholder
import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { ArrowLeft } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

const StaffForm = () => {
  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="h3 mb-0">
            <span role="img" aria-label="employee">👨‍💼</span> Nuevo Personal
          </h1>
          <p className="text-muted">Agregar un nuevo miembro al personal del jardín</p>
        </Col>
      </Row>

      <Card>
        <Card.Header>
          <Link to="/staff" className="btn btn-outline-secondary btn-sm me-2">
            <ArrowLeft className="me-1" />
            Volver
          </Link>
          <Button variant="primary" disabled>
            Guardar Personal
          </Button>
        </Card.Header>
        <Card.Body>
          <p>Formulario para crear/editar personal...</p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default StaffForm;