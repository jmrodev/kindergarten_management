import React, { useState, useEffect, useCallback } from 'react';
import { PersonFill, Plus } from 'react-bootstrap-icons';
import OfficeTable from '../../components/organisms/OfficeTable';
import TableCell from '../../components/atoms/TableCell';
import TableRow from '../../components/molecules/TableRow';
import TableHeaderCell from '../../components/atoms/TableHeaderCell';
import Badge from '../../components/atoms/Badge';
import Icon from '../../components/atoms/Icon';
import Container from '../../components/atoms/Container';
import { Row, Col } from '../../components/atoms/Grid';
import Card from '../../components/atoms/Card';
import Button from '../../components/atoms/Button';
import Spinner from '../../components/atoms/Spinner';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { safeExtractData, getColorVariantById, normalizeName } from '../../utils/apiResponseHandler';
import staffService from '../../api/staffService';

const StaffList = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    isActive: ''
  });

  const fetchStaff = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);

      const response = await staffService.getAll(filters);
      setStaff(safeExtractData(response));
    } catch (err) {
      setError('Error al cargar el personal: ' + err.message);
      console.error('Error fetching staff:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const handleDelete = async () => {
    if (!staffToDelete) return;

    try {
      await staffService.delete(staffToDelete.id);
      setStaff(staff.filter(st => st.id !== staffToDelete.id));
      setShowDeleteModal(false);
      setStaffToDelete(null);
    } catch (err) {
      setError('Error al eliminar el personal: ' + err.message);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <Container fluid className="py-4">
        <Row className="justify-content-center">
          <Col xs="auto">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </Spinner>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container fluid className="p-0 m-0" style={{padding: '0', margin: '0', marginTop: '0', paddingTop: '0'}}>

      <Card className="border-0 m-0" style={{marginTop: '0', paddingTop: '0', border: 'none'}}>
        <Card.Header className="p-1" style={{padding: '2px', borderBottom: '1px solid #dee2e6'}}>
          <h5 className="mb-0" style={{fontSize: '0.9rem', padding: '4px 8px'}}>Listado de Personal</h5>
        </Card.Header>
        <Card.Body className="p-0" style={{padding: '0'}}>
          <OfficeTable
            headers={[
              { label: 'Nombre' },
              { label: 'DNI' },
              { label: 'Email' },
              { label: 'Rol' },
              { label: 'Sala Asignada' },
              { label: 'Turno' },
              { label: 'Estado' },
              { label: 'Último Login' },
              { label: 'Acciones' }
            ]}
            data={staff}
            renderRow={(staffMember) => (
              <>
                <TableCell>
                  {normalizeName(staffMember.first_name)} {normalizeName(staffMember.paternal_surname)} {normalizeName(staffMember.maternal_surname)}
                </TableCell>
                <TableCell>{staffMember.dni}</TableCell>
                <TableCell>{staffMember.email}</TableCell>
                <TableCell>
                  <Badge type="role" variant={getColorVariantById(staffMember.role_id || staffMember.role_name)} capitalize="uppercase">
                    {staffMember.role_name}
                  </Badge>
                </TableCell>
                <TableCell>
                  {staffMember.classroom_name ? (
                    <Badge type="classroom" variant={getColorVariantById(staffMember.classroom_id || staffMember.classroom_name)} capitalize="uppercase">
                      {staffMember.classroom_name}
                    </Badge>
                  ) : (
                    <Badge type="classroom" variant="default" capitalize="uppercase">
                      No asignado
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {staffMember.shift ? (
                    <Badge type="classroom" variant={getColorVariantById(staffMember.shift_id || staffMember.shift)} capitalize="uppercase">
                      {staffMember.shift}
                    </Badge>
                  ) : (
                    <Badge type="classroom" variant="default" capitalize="uppercase">
                      Sin turno
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Badge type="status" variant={getColorVariantById(staffMember.is_active ? 'active' : 'inactive')} capitalize="uppercase">
                    {staffMember.is_active ? 'Activo' : 'Inactivo'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {staffMember.last_login
                    ? new Date(staffMember.last_login).toLocaleString('es-AR', {
                        dateStyle: 'short',
                        timeStyle: 'short'
                      })
                    : 'Nunca'
                  }
                </TableCell>
                <TableCell>
                  <div className="office-actions-container">
                    <a href={`/staff/edit/${staffMember.id}`} title="Editar" style={{ textDecoration: 'none', color: 'inherit', margin: '0.25rem' }}>
                      <Icon type="edit" size={18} title="Editar" />
                    </a>
                    <a href={`/staff/${staffMember.id}`} title="Ver Detalles" style={{ textDecoration: 'none', color: 'inherit', margin: '0.25rem' }}>
                      <Icon type="view" size={18} title="Ver Detalles" />
                    </a>
                    <span
                      onClick={() => {
                        setStaffToDelete(staffMember);
                        setShowDeleteModal(true);
                      }}
                      title="Eliminar"
                      style={{ cursor: 'pointer', margin: '0.25rem' }}
                    >
                      <Icon type="delete" size={18} title="Eliminar" />
                    </span>
                  </div>
                </TableCell>
              </>
            )}
            emptyMessage="No se encontró personal"
          />
        </Card.Body>
      </Card>

      {/* Modal de confirmación de eliminación */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro de que desea eliminar al personal <strong>
            {staffToDelete?.first_name && normalizeName(staffToDelete.first_name)} {staffToDelete?.paternal_surname && normalizeName(staffToDelete.paternal_surname)}
          </strong>? Esta acción no se puede deshacer.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default StaffList;