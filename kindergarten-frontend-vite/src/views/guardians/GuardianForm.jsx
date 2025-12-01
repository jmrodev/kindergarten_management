// views/guardians/GuardianForm.js - Placeholder
import React from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { ArrowLeft, PersonCircle } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

const GuardianForm = () => {
  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="h3 mb-0">
            <PersonCircle className="me-2" />
            Nuevo Responsable
          </h1>
          <p className="text-muted">Agregar un nuevo responsable al sistema</p>
        </Col>
      </Row>

      <Card>
        <Card.Header>
          <Link to="/guardians" className="btn btn-outline-secondary btn-sm me-2">
            <ArrowLeft className="me-1" />
            Volver
          </Link>
          <Button variant="primary" disabled>
            Guardar Responsable
          </Button>
        </Card.Header>
        <Card.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre(s)</Form.Label>
                  <Form.Control type="text" placeholder="Ingrese nombre(s)" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Apellido Paterno</Form.Label>
                  <Form.Control type="text" placeholder="Ingrese apellido paterno" />
                </Form.Group>
              </Col>
            </Row>
            <p>Formulario completo para responsable...</p>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default GuardianForm;