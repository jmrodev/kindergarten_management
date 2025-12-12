// views/meetingMinutes/MeetingMinutesList.js - Updated to use atomic design
import React from 'react';
import { JournalText, Plus } from 'react-bootstrap-icons';
import { OfficeRibbonWithTitle, OfficeTable } from '../../components/organisms';
import { IconEdit, IconView, IconDelete } from '../../components/icons';
import { TableCell, TableHeaderCell, Container, Row, Col, Card, Button } from '../../components/atoms';

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
            <OfficeTable
              headers={[
                { label: 'Tipo de Reunión' },
                { label: 'Fecha' },
                { label: 'Participantes' },
                { label: 'Responsable' },
                { label: 'Estado' },
                { label: 'Acciones' }
              ]}
              data={[]}
              renderRow={(minute) => (
                <>
                  <TableCell>{minute.type}</TableCell>
                  <TableCell>{minute.date}</TableCell>
                  <TableCell>{minute.participants}</TableCell>
                  <TableCell>{minute.responsible}</TableCell>
                  <TableCell>{minute.status}</TableCell>
                  <TableCell>
                    <div className="office-actions-container">
                      <span className="action-btn action-edit" title="Editar"><IconEdit /></span>
                      <span className="action-btn action-view" title="Ver"><IconView /></span>
                      <span className="action-btn action-delete" title="Eliminar"><IconDelete /></span>
                    </div>
                  </TableCell>
                </>
              )}
              emptyMessage="No se encontraron actas de reuniones"
            />
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default MeetingMinutesList;