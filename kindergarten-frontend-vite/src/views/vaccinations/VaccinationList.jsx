import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Plus, FileEarmarkMedical } from 'react-bootstrap-icons';
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
import ConfirmationModal from '../../components/molecules/ConfirmationModal';
import FormModal from '../../components/molecules/FormModal';
import VaccinationDetails from '../../components/organisms/VaccinationDetails';
import VaccinationForm from './VaccinationForm'; // Assuming we have a form component
import Alert from 'react-bootstrap/Alert'; // Por ahora mantendremos Alert
import { safeExtractData, getColorVariantById, normalizeName } from '../../utils/apiResponseHandler';
import vaccinationService from '../../api/vaccinationService';
import studentService from '../../api/studentService';
import OfficeRibbonWithTitle from '../../components/atoms/OfficeRibbonWithTitle';

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

        // Also fetch student information
        try {
          const studentResponse = await studentService.getById(studentId);
          setStudent(studentResponse.data.data);
        } catch (err) {
          console.error('Error fetching student data:', err);
        }
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
      onClick: () => navigate(studentId ? `/students/${studentId}/vaccinations/new` : "/vaccinations/new")
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
    <Container fluid className="p-0 m-0" style={{padding: '0', margin: '0', marginTop: '0', paddingTop: '0'}}>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="border-0 m-0" style={{marginTop: '0', paddingTop: '0', border: 'none'}}>
        <Card.Header className="p-1 office-ribbon" style={{padding: '2px', borderBottom: '1px solid #dee2e6'}}>
          <OfficeRibbonWithTitle
            title={studentId ?
              `Vacunas de ${student ? normalizeName(student.first_name) + ' ' + normalizeName(student.paternal_surname) : 'Alumno'}`
              : 'Control de Vacunas'
            }
            menuItems={menuItems}
            onClose={() => {
              if (studentId) {
                navigate('/students'); // Go back to student list if we came from there
              } else {
                navigate('/dashboard'); // Otherwise go back to dashboard
              }
            }}
            navigate={navigate}
            showTitle={false} // Hide the title as requested
            backPath={fromPath || (studentId ? '/students' : '/dashboard')}
          />
        </Card.Header>
        <Card.Body className="p-0" style={{padding: '0'}}>
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
                        onClick={async () => {
                          try {
                            const studentResponse = await studentService.getById(vaccination.student_id);
                            setVaccinationToView({...vaccination, student: studentResponse.data.data});
                            setShowViewModal(true);
                          } catch (err) {
                            setError('Error al cargar los datos del alumno: ' + err.message);
                            console.error('Error loading student for vaccination view:', err);
                          }
                        }}
                        title="Ver detalles"
                        style={{ cursor: 'pointer', margin: '0.25rem', textDecoration: 'none', color: 'inherit' }}
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
                      style={{ cursor: 'pointer', margin: '0.25rem', textDecoration: 'none', color: 'inherit' }}
                    >
                      <Icon type="view" size={18} title="Ver detalles" />
                    </span>
                    <span
                      onClick={() => {
                        setVaccinationToDelete(vaccination);
                        setShowDeleteConfirmation(true);
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