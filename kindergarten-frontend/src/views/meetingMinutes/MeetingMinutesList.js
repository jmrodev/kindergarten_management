// views/meetingMinutes/MeetingMinutesList.js - Placeholder
import React from 'react';
import { Container, Row, Col, Card, Button, Table } from 'react-bootstrap';
import { JournalText, Plus } from 'react-bootstrap-icons';

const MeetingMinutesList = () => {
  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="h3 mb-0">
            <JournalText className="me-2" />
            Actas de Reuniones
          </h1>
          <p className="text-muted">Gestión de actas de reuniones con familias y personal</p>
        </Col>
      </Row>

      <Card className="mb-4">
        <Card.Header>
          <Row className="align-items-center">
            <Col>
              <h5 className="mb-0">Filtros de Búsqueda</h5>
            </Col>
            <Col xs="auto">
              <Button variant="primary">
                <Plus className="me-2" />
                Nueva Acta
              </Button>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          <p>Filtros para actas de reuniones...</p>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <h5 className="mb-0">Actas de Reuniones</h5>
        </Card.Header>
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table className="mb-0" striped hover>
              <thead className="table-light">
                <tr>
                  <th>Tipo de Reunión</th>
                  <th>Fecha</th>
                  <th>Participantes</th>
                  <th>Responsable</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    Actas de reuniones registradas...
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default MeetingMinutesList;