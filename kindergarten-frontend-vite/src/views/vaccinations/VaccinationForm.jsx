import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Check, X, Plus, FileMedical } from 'react-bootstrap-icons';
import { OfficeRibbonWithTitle } from '../../components/organisms';
import { Input, Select, TextArea, Container, Row, Col, Card, Button, Spinner } from '../../components/atoms';
import { safeExtractData, normalizeName } from '../../utils/apiResponseHandler';
import vaccinationService from '../../api/vaccinationService';

const VaccinationForm = () => {
  const { id: vaccinationId, studentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const fromPath = location.state?.from || null;
  const [formData, setFormData] = useState({
    student_id: studentId || '',
    vaccine_name: '',
    vaccine_date: '',
    batch_number: '',
    dose_number: 1,
    next_due_date: '',
    status: 'activo',
    administered_by: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(!!vaccinationId);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [error, setError] = useState(null);
  const [student, setStudent] = useState(null);
  const [students, setStudents] = useState([]);

  // Load existing vaccination data for editing
  useEffect(() => {
    const loadVaccination = async () => {
      if (!vaccinationId) {
        setLoadingData(false);
        // If we're creating a new vaccination for a specific student, set the student id
        if (studentId) {
          setFormData(prev => ({ ...prev, student_id: studentId }));
        }
        return;
      }

      try {
        setLoadingData(true);
        const response = await vaccinationService.getById(vaccinationId);
        const vaccinationData = response.data.data;

        setFormData({
          student_id: vaccinationData.student_id || '',
          vaccine_name: vaccinationData.vaccine_name || '',
          vaccine_date: vaccinationData.vaccine_date || '',
          batch_number: vaccinationData.batch_number || '',
          dose_number: vaccinationData.dose_number || 1,
          next_due_date: vaccinationData.next_due_date || '',
          status: vaccinationData.status || 'activo',
          administered_by: vaccinationData.administered_by || '',
          notes: vaccinationData.notes || ''
        });
      } catch (err) {
        setError('Error al cargar los datos de la vacuna: ' + err.message);
        console.error('Error loading vaccination:', err);
      } finally {
        setLoadingData(false);
      }
    };

    loadVaccination();
  }, [vaccinationId, studentId]);

  // Eliminado el manejo de alumnos ya que la funcionalidad ha sido removida
  useEffect(() => {
    if (!studentId) {
      setStudents([]);
    }
  }, [studentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (vaccinationId) {
        // Update existing vaccination
        await vaccinationService.update(vaccinationId, formData);
        if (fromPath) {
          navigate(fromPath);
        } else {
          // Eliminado redirección a alumnos
          navigate('/vaccinations');
        }
      } else {
        // Create new vaccination
        await vaccinationService.create(formData);

        if (fromPath) {
          navigate(fromPath);
        } else if (studentId) {
          // Eliminado redirección a alumnos
          navigate('/vaccinations');
        } else {
          navigate('/vaccinations');
        }
      }
    } catch (err) {
      setError('Error al guardar la vacuna: ' + err.message);
      console.error('Error saving vaccination:', err);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCancel = () => {
    if (fromPath) {
      navigate(fromPath);
    } else if (studentId) {
      navigate(`/students/${studentId}/vaccinations`);
    } else {
      navigate('/vaccinations');
    }
  };

  const menuItems = [
    {
      label: vaccinationId ? "Guardar Cambios" : "Guardar Vacuna",
      icon: <Check size={16} />,
      onClick: handleSubmit
    }
  ];

  if (loadingData) {
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
      {error && (
        <Card className="mb-3">
          <Card.Body>
            <div className="alert alert-danger">{error}</div>
          </Card.Body>
        </Card>
      )}

      <Card className="border-0 m-0">
        <Card.Header className="card-header p-1 office-ribbon">
          <OfficeRibbonWithTitle
            title={vaccinationId ?
              `Editar Vacuna - ${student ? normalizeName(student.first_name) + ' ' + normalizeName(student.paternal_surname) : 'Alumno'}`
              : studentId ?
              `Nueva Vacuna - ${student ? normalizeName(student.first_name) + ' ' + normalizeName(student.paternal_surname) : 'Alumno'}`
              : 'Nueva Vacuna'
            }
            menuItems={menuItems}
            onClose={handleCancel}
            navigate={navigate}
            showTitle={false} // Hide the title as used in other forms
            backPath={fromPath || '/vaccinations'}
          />
        </Card.Header>
        <Card.Body className="p-0">
          <form onSubmit={handleSubmit} className="p-3">
            <Row>
              <Col md={6}>
                <Input
                  label="Nombre de la Vacuna"
                  name="vaccine_name"
                  value={formData.vaccine_name}
                  onChange={handleChange}
                  required
                />
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Input
                  label="Fecha de Vacunación"
                  name="vaccine_date"
                  type="date"
                  value={formData.vaccine_date}
                  onChange={handleChange}
                />
              </Col>
              <Col md={6}>
                <Input
                  label="Número de Lote"
                  name="batch_number"
                  value={formData.batch_number}
                  onChange={handleChange}
                />
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Input
                  label="Número de Dosis"
                  name="dose_number"
                  type="number"
                  value={formData.dose_number}
                  onChange={handleChange}
                  min="1"
                />
              </Col>
              <Col md={6}>
                <Input
                  label="Próxima Dosis (Fecha)"
                  name="next_due_date"
                  type="date"
                  value={formData.next_due_date}
                  onChange={handleChange}
                />
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Select
                  label="Estado"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  options={[
                    { value: 'activo', label: 'Activo' },
                    { value: 'completo', label: 'Completo' },
                    { value: 'faltante', label: 'Faltante' },
                    { value: 'exento', label: 'Exento' }
                  ]}
                />
              </Col>
              <Col md={6}>
                <Input
                  label="Administrado por"
                  name="administered_by"
                  value={formData.administered_by}
                  onChange={handleChange}
                />
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <TextArea
                  label="Notas"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                />
              </Col>
            </Row>

            <div className="d-flex gap-2 mt-3">
              <Button 
                type="button" 
                variant="secondary" 
                onClick={handleCancel}
                disabled={loading}
              >
                <X size={16} className="me-1" />
                Cancelar
              </Button>
              <Button 
                type="submit" 
                variant="primary" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner as="span" size="sm" role="status" className="me-2" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Check size={16} className="me-1" />
                    {vaccinationId ? 'Actualizar' : 'Guardar'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default VaccinationForm;