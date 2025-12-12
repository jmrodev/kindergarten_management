// views/documentReviews/DocumentReviewList.js - Updated to use atomic design
import React from 'react';
import { FileEarmarkCheck, Plus } from 'react-bootstrap-icons';
import { OfficeRibbonWithTitle, OfficeTable } from '../../components/organisms';
import { IconEdit, IconView, IconDelete } from '../../components/icons';
import { TableCell, TableHeaderCell, Container, Row, Col, Card, Button } from '../../components/atoms';

const DocumentReviewList = () => {
  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="h3 mb-0">
            <FileEarmarkCheck className="me-2" />
            Revisión de Documentos
          </h1>
          <p className="text-muted">Control de revisión y entrega de documentos</p>
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
                Nueva Revisión
              </Button>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          <p>Filtros para revisión de documentos...</p>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <h5 className="mb-0">Documentos por Revisar</h5>
        </Card.Header>
        <Card.Body className="p-0">
          <div className="table-responsive">
            <OfficeTable
              headers={[
                { label: 'Tipo de Documento' },
                { label: 'Referencia' },
                { label: 'Revisor' },
                { label: 'Estado' },
                { label: 'Fecha de Revisión' },
                { label: 'Acciones' }
              ]}
              data={[]}
              renderRow={(document) => (
                <>
                  <TableCell>{document.type}</TableCell>
                  <TableCell>{document.reference}</TableCell>
                  <TableCell>{document.reviewer}</TableCell>
                  <TableCell>{document.status}</TableCell>
                  <TableCell>{document.reviewDate}</TableCell>
                  <TableCell>
                    <div className="office-actions-container">
                      <span className="action-btn action-edit" title="Editar"><IconEdit /></span>
                      <span className="action-btn action-view" title="Ver"><IconView /></span>
                      <span className="action-btn action-delete" title="Eliminar"><IconDelete /></span>
                    </div>
                  </TableCell>
                </>
              )}
              emptyMessage="No se encontraron documentos pendientes de revisión"
            />
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DocumentReviewList;