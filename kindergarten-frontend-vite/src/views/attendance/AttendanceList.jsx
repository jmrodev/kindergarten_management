// views/attendance/AttendanceList.js - Placeholder
import React from 'react';
import { Container, Row, Col, Card, Button, Table } from 'react-bootstrap';
import { FileEarmarkMedical, Plus } from 'react-bootstrap-icons';

const AttendanceList = () => {
  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="h3 mb-0">
            <FileEarmarkMedical className="me-2" />
            Gestión de Asistencia
          </h1>
          <p className="text-muted">Registrar y consultar la asistencia de alumnos y personal</p>
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
                Registrar Asistencia
              </Button>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          <p>Filtros de búsqueda para asistencia...</p>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <h5 className="mb-0">Registros de Asistencia</h5>
        </Card.Header>
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table className="mb-0" striped hover>
              <thead className="table-light">
                <tr>
                  <th>Fecha</th>
                  <th>Alumno/Personal</th>
                  <th>Tipo</th>
                  <th>Estado</th>
                  <th>Sala</th>
                  <th>Registrado por</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    Registros de asistencia...
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

export default AttendanceList;