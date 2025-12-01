// views/calendar/CalendarView.js - Placeholder
import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Calendar } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

const CalendarView = () => {
  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="h3 mb-0">
            <Calendar className="me-2" />
            Calendario Escolar
          </h1>
          <p className="text-muted">Calendario de eventos del jardín de infantes</p>
        </Col>
      </Row>

      <Card>
        <Card.Header>
          <Link to="/dashboard" className="btn btn-outline-secondary btn-sm me-2">
            <Calendar className="me-1" />
            Volver al Dashboard
          </Link>
          <Button variant="primary">
            Nuevo Evento
          </Button>
        </Card.Header>
        <Card.Body>
          <p>Visualización del calendario escolar...</p>
          <div className="text-center py-5">
            <Calendar size={100} className="text-muted" />
            <p className="mt-3">Calendario interactivo para eventos escolares</p>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CalendarView;