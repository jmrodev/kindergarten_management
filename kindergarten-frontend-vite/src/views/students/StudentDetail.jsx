// views/students/StudentDetail.js - Placeholder
import React from 'react';
import { Container, Row, Col, Card, Button, Badge, Table } from 'react-bootstrap';
import { ArrowLeft, Pencil, FileMedical, Calendar, FileEarmarkCheck } from 'react-bootstrap-icons';

const StudentDetail = () => {
  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <Button variant="outline-secondary" className="me-3">
            <ArrowLeft className="me-2" />
            Volver
          </Button>
          <Button variant="primary" className="me-2">
            <Pencil className="me-2" />
            Editar Alumno
          </Button>
          <Button variant="outline-primary">
            <FileEarmarkCheck className="me-2" />
            Registrar Asistencia
          </Button>
        </Col>
      </Row>

      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body className="text-center">
              <div className="mb-3">
                <div className="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto" 
                     style={{ width: '120px', height: '120px' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="currentColor" className="bi bi-person-circle text-muted" viewBox="0 0 16 16">
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                    <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                  </svg>
                </div>
              </div>
              <h4>María Eugenia López García</h4>
              <p className="text-muted">DNI: 12.345.678</p>
              <div className="mb-3">
                <Badge bg="success" className="me-2">Activo</Badge>
                <Badge bg="warning" text="dark">Vacunas Incompletas</Badge>
              </div>
              <p className="mb-0">Fecha de Nacimiento: 05/03/2020</p>
              <p className="mb-0">Edad: 4 años</p>
              <p className="mb-0">Sala: 4 años A</p>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <FileMedical className="me-2" />
                Información Médica
              </h5>
            </Card.Header>
            <Card.Body>
              <p><strong>Obra Social:</strong> OSDE</p>
              <p><strong>Número de Afiliado:</strong> 12345678</p>
              <p><strong>Tipo de Sangre:</strong> A+</p>
              <p><strong>Nombre del Pediatra:</strong> Dr. Juan Pérez</p>
              <p><strong>Teléfono del Pediatra:</strong> (011) 1234-5678</p>
              <p><strong>Alergias:</strong> No registra</p>
              <p><strong>Medicamentos:</strong> No aplica</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">
                <Calendar className="me-2" />
                Asistencia Reciente
              </h5>
            </Card.Header>
            <Card.Body>
              <Table striped hover>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Sala</th>
                    <th>Observaciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>15/11/2023</td>
                    <td><Badge bg="success">Presente</Badge></td>
                    <td>4 años A</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>14/11/2023</td>
                    <td><Badge bg="warning" text="dark">Tarde</Badge></td>
                    <td>4 años A</td>
                    <td>Llegada 10:15 AM</td>
                  </tr>
                  <tr>
                    <td>13/11/2023</td>
                    <td><Badge bg="success">Presente</Badge></td>
                    <td>4 años A</td>
                    <td></td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">
                <FileEarmarkCheck className="me-2" />
                Documentación
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <h6>Documentos Presentados</h6>
                  <ul className="list-unstyled">
                    <li><Badge bg="success" className="me-2">✓</Badge> DNI</li>
                    <li><Badge bg="success" className="me-2">✓</Badge> Certificado de Nacimiento</li>
                    <li><Badge bg="success" className="me-2">✓</Badge> Libreta de Vacunas</li>
                  </ul>
                </Col>
                <Col md={6}>
                  <h6>Documentos Pendientes</h6>
                  <ul className="list-unstyled">
                    <li><Badge bg="warning" text="dark" className="me-2">!</Badge> Autorización de Excursión</li>
                    <li><Badge bg="warning" text="dark" className="me-2">!</Badge> Foto 4x4</li>
                  </ul>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <Calendar className="me-2" />
                Calendario Escolar
              </h5>
            </Card.Header>
            <Card.Body>
              <p>Próximos eventos para este alumno:</p>
              <ul>
                <li>• Festival de Fin de Año - 18/11/2023</li>
                <li>• Evaluación Trimestral - 20/11/2023</li>
                <li>• Día del Niño - 25/11/2023</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default StudentDetail;