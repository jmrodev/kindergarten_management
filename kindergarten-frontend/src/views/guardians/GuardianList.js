// views/guardians/GuardianList.js - Placeholder
import React from 'react';
import { Container, Row, Col, Card, Button, Table } from 'react-bootstrap';
import { PersonCircle, Plus } from 'react-bootstrap-icons';

const GuardianList = () => {
  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="h3 mb-0">
            <PersonCircle className="me-2" />
            Gestión de Responsables
          </h1>
          <p className="text-muted">Administrar la información de los responsables de los alumnos</p>
        </Col>
      </Row>

      <Card className="mb-4">
        <Card.Header>
          <Row className="align-items-center">
            <Col>
              <h5 className="mb-0">Filtros de Búsqueda</h5>
            </Col>
            <Col xs="auto">
              <Button variant="primary" href="/guardians/new">
                <Plus className="me-2" />
                Nuevo Responsable
              </Button>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          <p>Filtros de búsqueda...</p>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <h5 className="mb-0">Listado de Responsables</h5>
        </Card.Header>
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table className="mb-0" striped hover>
              <thead className="table-light">
                <tr>
                  <th>Nombre</th>
                  <th>DNI</th>
                  <th>Teléfono</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    Listado de responsables...
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

export default GuardianList;