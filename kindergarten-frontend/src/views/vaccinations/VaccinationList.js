// views/vaccinations/VaccinationList.js - Placeholder
import React from 'react';
import { Container, Row, Col, Card, Button, Table } from 'react-bootstrap';
import { FileMedical, Plus } from 'react-bootstrap-icons';

const VaccinationList = () => {
  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="h3 mb-0">
            <FileMedical className="me-2" />
            Control de Vacunas
          </h1>
          <p className="text-muted">Gestión del estado de vacunación de los alumnos</p>
        </Col>
      </Row>

      <Card className="mb-4">
        <Card.Header>
          <Row className="align-items-center">
            <Col>
              <h5 className="mb-0">Filtros de Búsqueda</h5>
            </Col>
            <Col xs="auto">
              <Button variant="primary" href="/students">
                <Plus className="me-2" />
                Registrar Vacuna
              </Button>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          <p>Filtros para control de vacunas...</p>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <h5 className="mb-0">Estado de Vacunación</h5>
        </Card.Header>
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table className="mb-0" striped hover>
              <thead className="table-light">
                <tr>
                  <th>Alumno</th>
                  <th>Estado General</th>
                  <th>Vacunas Completas</th>
                  <th>Vacunas Pendientes</th>
                  <th>Última Actualización</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    Estado de vacunación de los alumnos...
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

export default VaccinationList;