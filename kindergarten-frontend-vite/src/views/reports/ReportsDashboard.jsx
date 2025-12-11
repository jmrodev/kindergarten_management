// views/reports/ReportsDashboard.js - Placeholder
import React from 'react';
import Container from '../../components/atoms/Container';
import { Row, Col } from '../../components/atoms/Grid';
import Card from '../../components/atoms/Card';
import Button from '../../components/atoms/Button';
import { BarChart, PieChart, FileBarGraph, Calendar } from 'react-bootstrap-icons';

const ReportsDashboard = () => {
  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="h3 mb-0">
            <FileBarGraph className="me-2" />
            Reportes y Estadísticas
          </h1>
          <p className="text-muted">Visualización de datos y reportes del jardín de infantes</p>
        </Col>
      </Row>

      {/* Estadísticas rápidas */}
      <Row className="mb-4">
        <Col md={3} sm={6} className="mb-3">
          <Card className="text-center stat-card">
            <Card.Body>
              <div className="number">156</div>
              <div className="label text-primary">
                <BarChart className="me-1" />
                Alumnos Activos
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="text-center stat-card">
            <Card.Body>
              <div className="number">94%</div>
              <div className="label text-success">
                <BarChart className="me-1" />
                Asistencia Promedio
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="text-center stat-card">
            <Card.Body>
              <div className="number">87%</div>
              <div className="label text-success">
                <PieChart className="me-1" />
                Vacunas Completas
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="text-center stat-card">
            <Card.Body>
              <div className="number">24</div>
              <div className="label text-info">
                <Calendar className="me-1" />
                Eventos este mes
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={8}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Gráfica de Asistencia</h5>
            </Card.Header>
            <Card.Body>
              <div className="text-center py-5">
                <BarChart size={100} className="text-muted" />
                <p className="mt-3">Visualización de asistencia de alumnos</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Estado de Vacunas</h5>
            </Card.Header>
            <Card.Body>
              <div className="text-center py-5">
                <PieChart size={80} className="text-muted" />
                <p className="mt-3">Distribución de vacunas completas vs incompletas</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Reporte de Asistencia Reciente</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <table className="table mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Fecha</th>
                    <th>Presente</th>
                    <th>Ausente</th>
                    <th>Tarde</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      Datos de asistencia reciente...
                    </td>
                  </tr>
                </tbody>
              </table>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Documentos Pendientes</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <table className="table mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Tipo</th>
                    <th>Cantidad</th>
                    <th>Prioridad</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="3" className="text-center py-4">
                      Documentos pendientes de revisión...
                    </td>
                  </tr>
                </tbody>
              </table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col className="text-center">
          <Button variant="primary" size="lg" className="me-3">
            <FileBarGraph className="me-2" />
            Exportar Reporte General
          </Button>
          <Button variant="outline-primary" size="lg">
            <BarChart className="me-2" />
            Generar Reporte Personalizado
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default ReportsDashboard;