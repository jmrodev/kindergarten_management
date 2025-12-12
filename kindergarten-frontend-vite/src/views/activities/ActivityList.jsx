// views/activities/ActivityList.js - Updated to use atomic design
import React from 'react';
import { Activity, Plus } from 'react-bootstrap-icons';
import { OfficeRibbonWithTitle, OfficeTable } from '../../components/organisms';
import { IconEdit, IconView, IconDelete } from '../../components/icons';
import { TableCell, TableHeaderCell, Container, Row, Col, Card, Button } from '../../components/atoms';

const ActivityList = () => {
  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="h3 mb-0">
            <Activity className="me-2" />
            Actividades Especiales
          </h1>
          <p className="text-muted">Gestión de actividades especiales (arte, música, gimnasia, etc.)</p>
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
                Nueva Actividad
              </Button>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          <p>Filtros para actividades especiales...</p>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <h5 className="mb-0">Actividades Programadas</h5>
        </Card.Header>
        <Card.Body className="p-0">
          <div className="table-responsive">
            <OfficeTable
              headers={[
                { label: 'Nombre' },
                { label: 'Descripción' },
                { label: 'Docente' },
                { label: 'Sala' },
                { label: 'Horario' },
                { label: 'Acciones' }
              ]}
              data={[]}
              renderRow={(activity) => (
                <>
                  <TableCell>{activity.name}</TableCell>
                  <TableCell>{activity.description}</TableCell>
                  <TableCell>{activity.teacher}</TableCell>
                  <TableCell>{activity.classroom}</TableCell>
                  <TableCell>{activity.schedule}</TableCell>
                  <TableCell>
                    <div className="office-actions-container">
                      <span className="action-btn action-edit" title="Editar"><IconEdit /></span>
                      <span className="action-btn action-view" title="Ver"><IconView /></span>
                      <span className="action-btn action-delete" title="Eliminar"><IconDelete /></span>
                    </div>
                  </TableCell>
                </>
              )}
              emptyMessage="No se encontraron actividades especiales"
            />
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ActivityList;