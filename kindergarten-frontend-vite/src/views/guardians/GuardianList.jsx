// views/guardians/GuardianList.js - Updated to use atomic design
import React from 'react';
import { PersonCircle, Plus } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { OfficeTable } from '../../components/organisms';
import TableCell from '../../components/atoms/TableCell';
import TableHeaderCell from '../../components/atoms/TableHeaderCell';
import Container from '../../components/atoms/Container';
import { Row, Col } from '../../components/atoms/Grid';
import Card from '../../components/atoms/Card';
import Button from '../../components/atoms/Button';

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
                      <span className="action-btn action-edit" title="Editar">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                        </svg>
                      </span>
                      <span className="action-btn action-view" title="Ver">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                          <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                        </svg>
                      </span>
                      <span className="action-btn action-delete" title="Eliminar">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                          <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3h11V2h-11v1z"/>
                        </svg>
                      </span>
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