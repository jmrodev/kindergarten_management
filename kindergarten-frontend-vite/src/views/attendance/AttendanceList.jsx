// views/attendance/AttendanceList.js - Updated to use atomic design
import React from 'react';
import { FileEarmarkMedical, Plus } from 'react-bootstrap-icons';
import { OfficeRibbonWithTitle, OfficeTable } from '../../components/organisms';
import { IconEdit, IconView, IconDelete } from '../../components/icons';
import { TableCell, TableHeaderCell, Container, Row, Col, Card, Button } from '../../components/atoms';

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
            <OfficeTable
              headers={[
                { label: 'Fecha' },
                { label: 'Alumno/Personal' },
                { label: 'Tipo' },
                { label: 'Estado' },
                { label: 'Sala' },
                { label: 'Registrado por' },
                { label: 'Acciones' }
              ]}
              data={[]}
              renderRow={(attendance) => (
                <>
                  <TableCell>{attendance.date}</TableCell>
                  <TableCell>{attendance.name}</TableCell>
                  <TableCell>{attendance.type}</TableCell>
                  <TableCell>{attendance.status}</TableCell>
                  <TableCell>{attendance.classroom}</TableCell>
                  <TableCell>{attendance.registered_by}</TableCell>
                  <TableCell>
                    <div className="office-actions-container">
                      <span className="action-btn action-edit" title="Editar"><IconEdit /></span>
                      <span className="action-btn action-view" title="Ver"><IconView /></span>
                      <span className="action-btn action-delete" title="Eliminar"><IconDelete /></span>
                    </div>
                  </TableCell>
                </>
              )}
              emptyMessage="No se encontraron registros de asistencia"
            />
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AttendanceList;