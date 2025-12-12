import React, { useState, useEffect, useCallback } from 'react';
import { PersonFill, Plus } from 'react-bootstrap-icons';
import { OfficeTable } from '../../components/organisms';
import { TableRow, ConfirmationModal } from '../../components/molecules';
import { TableCell, TableHeaderCell, Badge, Icon, Container, Row, Col, Card, Button, Spinner } from '../../components/atoms';
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
            <Spinner role="status">
              <span className="visually-hidden">Cargando...</span>
            </Spinner>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container fluid className="p-0 m-0">

      <Card className="border-0 m-0">
        <Card.Header className="card-header p-1">
          <h5 className="mb-0">Listado de Personal</h5>
        </Card.Header>
        <Card.Body className="p-0">
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
                  <div className="actions-container">
                    <a href={`/staff/edit/${staffMember.id}`} title="Editar" className="action-btn action-edit">
                      <Icon type="edit" size={18} title="Editar" />
                    </a>
                    <a href={`/staff/${staffMember.id}`} title="Ver Detalles" className="action-btn action-view">
                      <Icon type="view" size={18} title="Ver Detalles" />
                    </a>
                    <span
                      onClick={() => {
                        setStaffToDelete(staffMember);
                        setShowDeleteModal(true);
                      }}
                      title="Eliminar"
                      className="action-btn action-delete"
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
      <ConfirmationModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Confirmar Eliminación"
        message={`¿Está seguro de que desea eliminar al personal ${staffToDelete?.first_name && normalizeName(staffToDelete.first_name)} ${staffToDelete?.paternal_surname && normalizeName(staffToDelete.paternal_surname)}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </Container>
  );
};

export default StaffList;