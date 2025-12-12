// views/guardians/GuardianList.js - Updated to use atomic design
import React from 'react';
import { PersonCircle, Plus } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { OfficeTable, OfficeRibbonWithTitle } from '../../components/organisms';
import { IconEdit, IconView, IconDelete } from '../../components/icons';
import { TableCell, TableHeaderCell, Container, Row, Col, Card, Button } from '../../components/atoms';

const GuardianList = () => {
  const navigate = useNavigate();

  return (
    <Container fluid className="office-form-container">
      <OfficeRibbonWithTitle
        title="Gestión de Responsables"
        menuItems={[
          {
            label: "Nuevo Responsable",
            icon: <Plus size={16} />,
            onClick: () => navigate('/guardians/new')
          }
        ]}
        onClose={() => navigate('/dashboard')}
        navigate={navigate}
        showTitle={false}
      />

      <Card className="mb-4">
        <Card.Header>
          <Row className="align-items-center">
            <Col>
              <h5 className="mb-0">Filtros de Búsqueda</h5>
            </Col>
            <Col xs="auto">
              <Button variant="primary" onClick={() => navigate('/guardians/new')}>
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
            <OfficeTable
              headers={[
                { label: 'Nombre' },
                { label: 'DNI' },
                { label: 'Teléfono' },
                { label: 'Email' },
                { label: 'Rol' },
                { label: 'Acciones' }
              ]}
              data={[]}
              renderRow={(guardian) => (
                <>
                  <TableCell>{guardian.name}</TableCell>
                  <TableCell>{guardian.dni}</TableCell>
                  <TableCell>{guardian.phone}</TableCell>
                  <TableCell>{guardian.email}</TableCell>
                  <TableCell>{guardian.role}</TableCell>
                  <TableCell>
                    <div className="office-actions-container">
                      <span className="action-btn action-edit" title="Editar"><IconEdit /></span>
                      <span className="action-btn action-view" title="Ver"><IconView /></span>
                      <span className="action-btn action-delete" title="Eliminar"><IconDelete /></span>
                    </div>
                  </TableCell>
                </>
              )}
              emptyMessage="No se encontraron responsables"
            />
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default GuardianList;