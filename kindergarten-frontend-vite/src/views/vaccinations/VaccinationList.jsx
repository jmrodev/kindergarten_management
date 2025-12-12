import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Plus, FileEarmarkMedical } from 'react-bootstrap-icons';
import { OfficeTable } from '../../components/organisms';
import TableRow from '../../components/molecules/TableRow';
import { TableCell, TableHeaderCell, Badge, Icon, Container, Row, Col, Card, Button, Spinner } from '../../components/atoms';
import ConfirmationModal from '../../components/molecules/ConfirmationModal';
import FormModal from '../../components/molecules/FormModal';
import { VaccinationDetails } from '../../components/organisms';
import VaccinationForm from './VaccinationForm'; // Assuming we have a form component
import { safeExtractData, getColorVariantById, normalizeName } from '../../utils/apiResponseHandler';
import vaccinationService from '../../api/vaccinationService';
import { OfficeRibbonWithTitle } from '../../components/organisms';

const VaccinationList = () => {
  const { id: studentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const fromPath = location.state?.from || null;
  const [vaccinations, setVaccinations] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [vaccinationToDelete, setVaccinationToDelete] = useState(null);
  const [vaccinationToView, setVaccinationToView] = useState(null);

  const fetchVaccinations = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);

      if (studentId) {
        // Fetch vaccinations for specific student
        const response = await vaccinationService.getByStudentId(studentId);
        setVaccinations(safeExtractData(response));

      } else {
        // Fetch all vaccinations (general view)
        const response = await vaccinationService.getAll();
        setVaccinations(safeExtractData(response));
      }
    } catch (err) {
      setError('Error al cargar las vacunas: ' + err.message);
      console.error('Error fetching vaccination data:', err);
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    fetchVaccinations();
  }, [fetchVaccinations]);

  const handleDelete = async () => {
    if (!vaccinationToDelete) return;

    try {
      await vaccinationService.delete(vaccinationToDelete.id);
      setVaccinations(vaccinations.filter(vaccination => vaccination.id !== vaccinationToDelete.id));
      setVaccinationToDelete(null);
    } catch (err) {
      setError('Error al eliminar la vacuna: ' + err.message);
    } finally {
      setShowDeleteConfirmation(false);
    }
  };

  const menuItems = [
    {
      label: studentId ? "Nueva Vacuna" : "Registrar Vacuna",
      icon: <Plus size={16} />,
      onClick: () => navigate("/vaccinations/new")
    }
  ];

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
    <Container fluid className="p-0 m-0">

      {error && <div className="alert alert-danger">{error}</div>}

      <Card className="border-0 m-0">
        <Card.Header className="card-header p-1 office-ribbon">
          <OfficeRibbonWithTitle
            title={studentId ?
              `Vacunas de ${student ? normalizeName(student.first_name) + ' ' + normalizeName(student.paternal_surname) : 'Alumno'}`
              : 'Control de Vacunas'
            }
            menuItems={menuItems}
            onClose={() => {
              if (studentId) {
                navigate('/dashboard'); // Go back to dashboard
              } else {
                navigate('/dashboard'); // Otherwise go back to dashboard
              }
            }}
            navigate={navigate}
            showTitle={false} // Hide the title as requested
            backPath={fromPath || '/dashboard'}
          />
        </Card.Header>
        <Card.Body className="p-0">
          <OfficeTable
            headers={studentId
              ? [
                  { label: 'Vacuna' },
                  { label: 'Fecha' },
                  { label: 'Lote' },
                  { label: 'Dosis' },
                  { label: 'Próxima Dosis' },
                  { label: 'Estado' },
                  { label: 'Registrado por' },
                  { label: 'Acciones' }
                ]
              : [
                  { label: 'Vacuna' },
                  { label: 'Fecha' },
                  { label: 'Lote' },
                  { label: 'Dosis' },
                  { label: 'Próxima Dosis' },
                  { label: 'Estado' },
                  { label: 'Registrado por' },
                  { label: 'Alumno' },
                  { label: 'Acciones' }
                ]
            }
            data={vaccinations}
            renderRow={(vaccination) => (
              <>
                <TableCell>{vaccination.vaccine_name}</TableCell>
                <TableCell>{vaccination.vaccine_date ? new Date(vaccination.vaccine_date).toLocaleDateString() : '-'}</TableCell>
                <TableCell>{vaccination.batch_number}</TableCell>
                <TableCell>{vaccination.dose_number}</TableCell>
                <TableCell>{vaccination.next_due_date ? new Date(vaccination.next_due_date).toLocaleDateString() : '-'}</TableCell>
                <TableCell>
                  <Badge
                    type="vaccine"
                    variant={getColorVariantById(vaccination.status_id || vaccination.status)}
                    capitalize="uppercase"
                  >
                    {vaccination.status}
                  </Badge>
                </TableCell>
                <TableCell>{vaccination.administered_by || '-'}</TableCell>
                {!studentId && (
                  <TableCell>
                    {vaccination.student_id ? (
                      <span
                        onClick={() => {
                          setVaccinationToView(vaccination);
                          setShowViewModal(true);
                        }}
                        title="Ver detalles"
                        className="no-text-decoration action-link-margin cursor-pointer"
                      >
                        <Icon type="view" size={18} title="Ver detalles" />
                      </span>
                    ) : '-'}
                  </TableCell>
                )}
                <TableCell>
                  <div className="office-actions-container">
                    <span
                      onClick={() => {
                        setVaccinationToView(vaccination);
                        setShowViewModal(true);
                      }}
                      title="Ver detalles"
                      className="no-text-decoration action-link-margin cursor-pointer"
                    >
                      <Icon type="view" size={18} title="Ver detalles" />
                    </span>
                    <span
                      onClick={() => {
                        setVaccinationToDelete(vaccination);
                        setShowDeleteConfirmation(true);
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
            emptyMessage={studentId
              ? 'No hay vacunas registradas para este alumno.'
              : 'No hay vacunas registradas.'
            }
          />
        </Card.Body>
      </Card>

      <ConfirmationModal
        show={showDeleteConfirmation}
        onHide={() => setShowDeleteConfirmation(false)}
        onConfirm={handleDelete}
        title="Confirmar Eliminación"
        message={`¿Está seguro de que desea eliminar la vacuna ${vaccinationToDelete?.vaccine_name}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />

      <FormModal
        show={showViewModal}
        onHide={() => {
          setShowViewModal(false);
          setVaccinationToView(null);
        }}
        title={`Detalle de Vacuna: ${vaccinationToView?.vaccine_name || ''}`}
        size="lg"
      >
        <VaccinationDetails vaccination={vaccinationToView} student={vaccinationToView?.student} />
      </FormModal>

    </Container>
  );
};

export default VaccinationList;