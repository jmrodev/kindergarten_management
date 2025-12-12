import React, { useState, useEffect, useCallback } from 'react';
import { Plus, FileEarmarkPlus } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { OfficeTable } from '../../components/organisms';
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
import ConfirmationModal from '../../components/molecules/ConfirmationModal';
import { safeExtractData, getColorVariantById, normalizeName } from '../../utils/apiResponseHandler';
import classroomService from '../../api/classroomService';

const ClassroomList = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [classroomToDelete, setClassroomToDelete] = useState(null);
  const navigate = useNavigate();

  const fetchClassrooms = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);

      const response = await classroomService.getAll();
      setClassrooms(safeExtractData(response));
    } catch (err) {
      setError('Error al cargar las salas: ' + err.message);
      console.error('Error fetching classrooms:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClassrooms();
  }, [fetchClassrooms]);

  const handleDelete = async () => {
    if (!classroomToDelete) return;

    try {
      await classroomService.delete(classroomToDelete.id);
      setClassrooms(classrooms.filter(classroom => classroom.id !== classroomToDelete.id));
      setShowDeleteModal(false);
      setClassroomToDelete(null);
    } catch (err) {
      setError('Error al eliminar la sala: ' + err.message);
    }
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

      {error && <div className="alert alert-danger">{error}</div>}

      <Card className="border-0 m-0">
        <Card.Header className="card-header p-1">
          <h5 className="mb-0">Listado de Salas</h5>
        </Card.Header>
        <Card.Body className="p-0">
          <OfficeTable
            headers={[
              { label: 'Nombre' },
              { label: 'Capacidad' },
              { label: 'Turno' },
              { label: 'Año Académico' },
              { label: 'Grupo de Edad' },
              { label: 'Estado' },
              { label: 'Alumnos Asignados' },
              { label: 'Acciones' }
            ]}
            data={classrooms}
            renderRow={(classroom) => (
              <>
                <TableCell>
                  <strong>{normalizeName(classroom.name)}</strong>
                </TableCell>
                <TableCell>
                  {classroom.capacity} {classroom.capacity === 1 ? 'alumno' : 'alumnos'}
                </TableCell>
                <TableCell>
                  {classroom.shift ? (
                    <Badge type="classroom" variant={getColorVariantById(classroom.shift)} capitalize="uppercase">
                      {normalizeName(classroom.shift)}
                    </Badge>
                  ) : (
                    <Badge type="classroom" variant="default" capitalize="uppercase">
                      Sin turno
                    </Badge>
                  )}
                </TableCell>
                <TableCell>{classroom.academic_year}</TableCell>
                <TableCell>{classroom.age_group} años</TableCell>
                <TableCell>
                  <Badge type="status" variant={classroom.is_active ? 'success' : 'danger'} capitalize="uppercase">
                    {classroom.is_active ? 'Activa' : 'Inactiva'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {classroom.assigned_students_count || 0}/{classroom.capacity}
                </TableCell>
                <TableCell>
                  <div className="office-actions-container">
                    <a href={`/classrooms/edit/${classroom.id}`} title="Editar" className="no-text-decoration action-link-margin">
                      <Icon type="edit" size={18} title="Editar" />
                    </a>
                    <a href={`/classrooms/${classroom.id}`} title="Ver Detalles" className="no-text-decoration action-link-margin">
                      <Icon type="view" size={18} title="Ver Detalles" />
                    </a>
                    <span
                      onClick={() => {
                        setClassroomToDelete(classroom);
                        setShowDeleteModal(true);
                      }}
                      title="Eliminar"
                      className="action-link-margin cursor-pointer"
                    >
                      <Icon type="delete" size={18} title="Eliminar" />
                    </span>
                  </div>
                </TableCell>
              </>
            )}
            emptyMessage="No se encontraron salas"
          />
        </Card.Body>
      </Card>

      {/* Modal de confirmación de eliminación */}
      <ConfirmationModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Confirmar Eliminación"
        message={`¿Está seguro de que desea eliminar la sala ${classroomToDelete?.name && normalizeName(classroomToDelete.name)}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </Container>
  );
};

export default ClassroomList;