import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Table, Button, Spinner, Alert, Modal, Form } from 'react-bootstrap';
import { PersonFill, Pencil, Trash, Plus, Eye } from 'react-bootstrap-icons';
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
      setStaff(response.data.data || []);
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
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="h3 mb-0">
            <PersonFill className="me-2" />
            Gestión de Personal
          </h1>
          <p className="text-muted">Administrar la información del personal del jardín</p>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="mb-4">
        <Card.Header>
          <Row className="align-items-center">
            <Col>
              <h5 className="mb-0">Filtros de Búsqueda</h5>
            </Col>
            <Col xs="auto">
              <Button variant="primary" href="/staff/new">
                <Plus className="me-2" />
                Nuevo Personal
              </Button>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          <Form>
            <Row>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Buscar</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nombre, apellido o DNI..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Rol</Form.Label>
                  <Form.Select
                    value={filters.role}
                    onChange={(e) => handleFilterChange('role', e.target.value)}
                  >
                    <option value="">Todos los roles</option>
                    <option value="Administrator">Administrador</option>
                    <option value="Director">Director</option>
                    <option value="Teacher">Docente</option>
                    <option value="Secretary">Secretario</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Estado</Form.Label>
                  <Form.Select
                    value={filters.isActive}
                    onChange={(e) => handleFilterChange('isActive', e.target.value)}
                  >
                    <option value="">Todos</option>
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <h5 className="mb-0">Listado de Personal</h5>
        </Card.Header>
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table className="mb-0" striped hover>
              <thead className="table-light">
                <tr>
                  <th>Nombre</th>
                  <th>DNI</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Sala Asignada</th>
                  <th>Estado</th>
                  <th>Último Login</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {staff.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      No se encontró personal
                    </td>
                  </tr>
                ) : (
                  staff.map((staffMember) => (
                    <tr key={staffMember.id}>
                      <td>
                        {staffMember.first_name} {staffMember.paternal_surname} {staffMember.maternal_surname}
                      </td>
                      <td>{staffMember.dni}</td>
                      <td>{staffMember.email}</td>
                      <td>
                        <span className="badge bg-secondary">
                          {staffMember.role_name}
                        </span>
                      </td>
                      <td>{staffMember.classroom_name || 'No asignado'}</td>
                      <td>
                        <span className={`badge ${staffMember.is_active ? 'bg-success' : 'bg-secondary'}`}>
                          {staffMember.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td>
                        {staffMember.last_login 
                          ? new Date(staffMember.last_login).toLocaleDateString() 
                          : 'Nunca'
                        }
                      </td>
                      <td>
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          className="me-2"
                          href={`/staff/edit/${staffMember.id}`}
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button 
                          variant="outline-info" 
                          size="sm" 
                          className="me-2"
                          href={`/staff/${staffMember.id}`}
                        >
                          <Eye size={16} />
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => {
                            setStaffToDelete(staffMember);
                            setShowDeleteModal(true);
                          }}
                        >
                          <Trash size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Modal de confirmación de eliminación */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro de que desea eliminar al personal <strong>
            {staffToDelete?.first_name} {staffToDelete?.paternal_surname}
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