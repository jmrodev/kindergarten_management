import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Save, Person, Pencil } from 'react-bootstrap-icons';
import { useParams, useNavigate, Link } from 'react-router-dom';
import studentService from '../../api/studentService';
import classroomService from '../../api/classroomService';
import { normalizeName } from '../../utils/apiResponseHandler';
import { StudentFormValidator } from '../../utils/formValidation';

// Componentes atómicos
import Container from '../../components/atoms/Container';
import { Row, Col } from '../../components/atoms/Grid';
import Card from '../../components/atoms/Card';
import Button from '../../components/atoms/Button';
import Input from '../../components/atoms/Input';
import Select from '../../components/atoms/Select';
import TextArea from '../../components/atoms/TextArea';
import Toggle from '../../components/atoms/Toggle';
import FormSection from '../../components/atoms/FormSection';

const StudentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    // Datos personales
    first_name: '',
    middle_name_optional: '',
    third_name_optional: '',
    paternal_surname: '',
    maternal_surname: '',
    nickname_optional: '',
    dni: '',
    birth_date: '',

    // Dirección
    street: '',
    number: '',
    city: '',
    provincia: '',
    postal_code_optional: '',
    address_id: null,

    // Contacto de emergencia
    emergency_contact_full_name: '',
    emergency_contact_relationship: '',
    emergency_contact_priority: 1,
    emergency_contact_phone: '',
    emergency_contact_alternative_phone: '',
    emergency_contact_authorized_pickup: false,
    emergency_contact_id: null,

    // Información escolar
    classroom_id: '',
    shift: '',
    status: 'preinscripto',
    enrollment_date: '',
    withdrawal_date: '',

    // Información médica
    health_insurance: '',
    affiliate_number: '',
    allergies: '',
    medications: '',
    medical_observations: '',
    blood_type: '',
    pediatrician_name: '',
    pediatrician_phone: '',

    // Autorizaciones
    photo_authorization: false,
    trip_authorization: false,
    medical_attention_authorization: false,

    // Información adicional
    has_siblings_in_school: false,
    special_needs: '',
    vaccination_status: 'no_informado',
    observations: ''
  });

  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('personal');

  const fetchClassrooms = useCallback(async () => {
    try {
      const response = await classroomService.getAll();
      setClassrooms(response.data.data || []);
    } catch (err) {
      setError('Error al cargar las salas: ' + err.message);
    }
  }, []);

  const fetchStudentData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await studentService.getById(id);
      const student = response.data.data;

      setFormData(prev => ({
        ...prev,
        first_name: student.first_name || '',
        middle_name_optional: student.middle_name_optional || '',
        third_name_optional: student.third_name_optional || '',
        paternal_surname: student.paternal_surname || '',
        maternal_surname: student.maternal_surname || '',
        nickname_optional: student.nickname_optional || '',
        dni: student.dni || '',
        birth_date: student.birth_date || '',

        street: student.street || '',
        number: student.number || '',
        city: student.city || '',
        provincia: student.provincia || '',
        postal_code_optional: student.postal_code_optional || '',

        classroom_id: student.classroom_id || '',
        shift: student.shift || '',
        status: student.status || 'preinscripto',

        health_insurance: student.health_insurance || '',
        affiliate_number: student.affiliate_number || '',
        allergies: student.allergies || '',
        medications: student.medications || '',
        medical_observations: student.medical_observations || '',
        blood_type: student.blood_type || '',
        pediatrician_name: student.pediatrician_name || '',
        pediatrician_phone: student.pediatrician_phone || '',

        photo_authorization: student.photo_authorization || false,
        trip_authorization: student.trip_authorization || false,
        medical_attention_authorization: student.medical_attention_authorization || false,

        has_siblings_in_school: student.has_siblings_in_school || false,
        special_needs: student.special_needs || '',
        vaccination_status: student.vaccination_status || 'no_informado',
        observations: student.observations || '',

        emergency_contact_full_name: student.emergency_contact?.full_name || '',
        emergency_contact_relationship: student.emergency_contact?.relationship || '',
        emergency_contact_priority: student.emergency_contact?.priority || 1,
        emergency_contact_phone: student.emergency_contact?.phone || '',
        emergency_contact_alternative_phone: student.emergency_contact?.alternative_phone || '',
        emergency_contact_authorized_pickup: student.emergency_contact?.is_authorized_pickup || false
      }));
    } catch (err) {
      setError('Error al cargar los datos del alumno: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchClassrooms();
    if (isEdit) {
      fetchStudentData();
    }
  }, [isEdit, fetchClassrooms, fetchStudentData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Limpiar error cuando se cambia el campo
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const validationErrors = StudentFormValidator.validateStudent(formData);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const studentData = {
        ...formData,
        emergency_contact: {
          full_name: formData.emergency_contact_full_name,
          relationship: formData.emergency_contact_relationship,
          priority: formData.emergency_contact_priority,
          phone: formData.emergency_contact_phone,
          alternative_phone: formData.emergency_contact_alternative_phone,
          is_authorized_pickup: formData.emergency_contact_authorized_pickup
        }
      };

      let response;
      if (isEdit) {
        response = await studentService.update(id, studentData);
        navigate(`/students/${id}`);
      } else {
        response = await studentService.create(studentData);
        navigate(`/students/edit/${response.data.data.id}`);
      }
    } catch (err) {
      setError('Error al guardar el alumno: ' + err.message);
      console.error('Error saving student:', err);
    } finally {
      setLoading(false);
    }
  };

  // Opciones para selects
  const shiftOptions = [
    { value: 'mañana', label: 'Mañana' },
    { value: 'tarde', label: 'Tarde' },
    { value: 'mañana y tarde', label: 'Mañana y Tarde' }
  ];

  const statusOptions = [
    { value: 'preinscripto', label: 'Preinscripto' },
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'approved', label: 'Aprobado' },
    { value: 'sorteo', label: 'Sorteo' },
    { value: 'inscripto', label: 'Inscripto' },
    { value: 'activo', label: 'Activo' },
    { value: 'inactivo', label: 'Inactivo' },
    { value: 'egresado', label: 'Egresado' },
    { value: 'rechazado', label: 'Rechazado' }
  ];

  const bloodTypeOptions = [
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' }
  ];

  const vaccinationStatusOptions = [
    { value: 'completo', label: 'Completo' },
    { value: 'incompleto', label: 'Incompleto' },
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'no_informado', label: 'No Informado' }
  ];

  if (loading && isEdit) {
    return (
      <Container fluid className="py-4">
        <Row className="justify-content-center">
          <Col xs="auto">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
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
            {isEdit ? (
              <><Pencil className="me-2" /> Editar Alumno</>
            ) : (
              <><Person className="me-2" /> Nuevo Alumno</>
            )}
          </h1>
          <p className="text-muted">
            {isEdit
              ? 'Modificar la información del alumno'
              : 'Agregar un nuevo alumno al sistema'
            }
          </p>
        </Col>
      </Row>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <Card>
        <Card.Header>
          <Link to="/students" className="btn btn-outline-secondary btn-sm me-2">
            <ArrowLeft className="me-1" />
            Volver
          </Link>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Guardando...
              </>
            ) : (
              <>
                <Save className="me-2" />
                {isEdit ? 'Actualizar' : 'Guardar'} Alumno
              </>
            )}
          </Button>
        </Card.Header>
        <Card.Body>
          <div className="tabs-container">
            <div className="tab-nav">
              <button 
                className={`tab-button ${activeTab === 'personal' ? 'active' : ''}`}
                onClick={() => setActiveTab('personal')}
              >
                Datos Personales
              </button>
              <button 
                className={`tab-button ${activeTab === 'medical' ? 'active' : ''}`}
                onClick={() => setActiveTab('medical')}
              >
                Información Médica
              </button>
              <button 
                className={`tab-button ${activeTab === 'authorizations' ? 'active' : ''}`}
                onClick={() => setActiveTab('authorizations')}
              >
                Autorizaciones
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'personal' && (
                <FormSection title="Datos Personales" subtitle="Información básica del alumno">
                  <Row>
                    <Col md={6}>
                      <Input
                        label="Nombre(s) *"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        error={errors.first_name?.[0]}
                        normalize
                        required
                      />
                    </Col>
                    <Col md={6}>
                      <Input
                        label="Segundo Nombre (Opcional)"
                        name="middle_name_optional"
                        value={formData.middle_name_optional}
                        onChange={handleChange}
                        normalize
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Input
                        label="Apellido Paterno *"
                        name="paternal_surname"
                        value={formData.paternal_surname}
                        onChange={handleChange}
                        error={errors.paternal_surname?.[0]}
                        normalize
                        required
                      />
                    </Col>
                    <Col md={6}>
                      <Input
                        label="Apellido Materno"
                        name="maternal_surname"
                        value={formData.maternal_surname}
                        onChange={handleChange}
                        normalize
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Input
                        label="Alias/Nickname"
                        name="nickname_optional"
                        value={formData.nickname_optional}
                        onChange={handleChange}
                        normalize
                      />
                    </Col>
                    <Col md={6}>
                      <Input
                        label="DNI *"
                        name="dni"
                        value={formData.dni}
                        onChange={handleChange}
                        error={errors.dni?.[0]}
                        type="text"
                        required
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Input
                        label="Fecha de Nacimiento *"
                        name="birth_date"
                        value={formData.birth_date}
                        onChange={handleChange}
                        error={errors.birth_date?.[0]}
                        type="date"
                        required
                      />
                    </Col>
                    <Col md={6}>
                      <Select
                        label="Sala"
                        name="classroom_id"
                        value={formData.classroom_id}
                        onChange={handleChange}
                        options={classrooms.map(classroom => ({
                          value: classroom.id,
                          label: classroom.name
                        }))}
                        placeholder="Seleccione una sala"
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Select
                        label="Turno"
                        name="shift"
                        value={formData.shift}
                        onChange={handleChange}
                        options={shiftOptions}
                        placeholder="Seleccione un turno"
                      />
                    </Col>
                    <Col md={6}>
                      <Select
                        label="Estado"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        options={statusOptions}
                        placeholder="Seleccione un estado"
                      />
                    </Col>
                  </Row>

                  {/* Información de contacto de emergencia */}
                  <FormSection title="Contacto de Emergencia" subtitle="Información para contacto en caso de emergencia">
                    <Row>
                      <Col md={6}>
                        <Input
                          label="Nombre Completo"
                          name="emergency_contact_full_name"
                          value={formData.emergency_contact_full_name}
                          onChange={handleChange}
                          normalize
                        />
                      </Col>
                      <Col md={6}>
                        <Input
                          label="Relación"
                          name="emergency_contact_relationship"
                          value={formData.emergency_contact_relationship}
                          onChange={handleChange}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <Input
                          label="Teléfono"
                          name="emergency_contact_phone"
                          value={formData.emergency_contact_phone}
                          onChange={handleChange}
                          error={errors.emergency_contact_phone?.[0]}
                          type="tel"
                        />
                      </Col>
                      <Col md={6}>
                        <Input
                          label="Teléfono Alternativo"
                          name="emergency_contact_alternative_phone"
                          value={formData.emergency_contact_alternative_phone}
                          onChange={handleChange}
                          type="tel"
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col md={12}>
                        <Toggle
                          label="Autorizado para retirar"
                          name="emergency_contact_authorized_pickup"
                          checked={formData.emergency_contact_authorized_pickup}
                          onChange={handleChange}
                        />
                      </Col>
                    </Row>
                  {/* Información de dirección */}
                  <FormSection title="Dirección" subtitle="Información de la dirección del alumno">
                    <Row>
                      <Col md={6}>
                        <Input
                          label="Calle"
                          name="street"
                          value={formData.street}
                          onChange={handleChange}
                        />
                      </Col>
                      <Col md={6}>
                        <Input
                          label="Número"
                          name="number"
                          value={formData.number}
                          onChange={handleChange}
                          type="number"
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <Input
                          label="Ciudad"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          normalize
                        />
                      </Col>
                      <Col md={6}>
                        <Input
                          label="Provincia"
                          name="provincia"
                          value={formData.provincia}
                          onChange={handleChange}
                          normalize
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <Input
                          label="Código Postal"
                          name="postal_code_optional"
                          value={formData.postal_code_optional}
                          onChange={handleChange}
                        />
                      </Col>
                    </Row>
                  </FormSection>
                </FormSection>
              )}

              {activeTab === 'medical' && (
                <FormSection title="Información Médica" subtitle="Datos médicos importantes del alumno">
                  <Row>
                    <Col md={6}>
                      <Input
                        label="Obra Social"
                        name="health_insurance"
                        value={formData.health_insurance}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col md={6}>
                      <Input
                        label="Número de Afiliado"
                        name="affiliate_number"
                        value={formData.affiliate_number}
                        onChange={handleChange}
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col md={12}>
                      <TextArea
                        label="Alergias"
                        name="allergies"
                        value={formData.allergies}
                        onChange={handleChange}
                        rows={2}
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col md={12}>
                      <TextArea
                        label="Medicamentos"
                        name="medications"
                        value={formData.medications}
                        onChange={handleChange}
                        rows={2}
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Select
                        label="Tipo de Sangre"
                        name="blood_type"
                        value={formData.blood_type}
                        onChange={handleChange}
                        options={bloodTypeOptions}
                        placeholder="Seleccione tipo de sangre"
                      />
                    </Col>
                    <Col md={6}>
                      <Input
                        label="Nombre del Pediatra"
                        name="pediatrician_name"
                        value={formData.pediatrician_name}
                        onChange={handleChange}
                        normalize
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Input
                        label="Teléfono del Pediatra"
                        name="pediatrician_phone"
                        value={formData.pediatrician_phone}
                        onChange={handleChange}
                        error={errors.pediatrician_phone?.[0]}
                        type="tel"
                      />
                    </Col>
                    <Col md={6}>
                      <Select
                        label="Estado de Vacunación"
                        name="vaccination_status"
                        value={formData.vaccination_status}
                        onChange={handleChange}
                        options={vaccinationStatusOptions}
                        placeholder="Seleccione estado de vacunación"
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col md={12}>
                      <TextArea
                        label="Observaciones Médicas"
                        name="medical_observations"
                        value={formData.medical_observations}
                        onChange={handleChange}
                        rows={3}
                      />
                    </Col>
                  </Row>
                </FormSection>
              )}

              {activeTab === 'authorizations' && (
                <FormSection title="Autorizaciones" subtitle="Autorizaciones y permisos especiales">
                  <Row className="mb-3">
                    <Col md={12}>
                      <Toggle
                        label="Autorización para fotografía"
                        name="photo_authorization"
                        checked={formData.photo_authorization}
                        onChange={handleChange}
                      />
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col md={12}>
                      <Toggle
                        label="Autorización para excursiones"
                        name="trip_authorization"
                        checked={formData.trip_authorization}
                        onChange={handleChange}
                      />
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col md={12}>
                      <Toggle
                        label="Autorización para atención médica de emergencia"
                        name="medical_attention_authorization"
                        checked={formData.medical_attention_authorization}
                        onChange={handleChange}
                      />
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col md={12}>
                      <Toggle
                        label="Tiene hermanos en el jardín"
                        name="has_siblings_in_school"
                        checked={formData.has_siblings_in_school}
                        onChange={handleChange}
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col md={12}>
                      <TextArea
                        label="Necesidades Especiales"
                        name="special_needs"
                        value={formData.special_needs}
                        onChange={handleChange}
                        rows={3}
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col md={12}>
                      <TextArea
                        label="Observaciones Generales"
                        name="observations"
                        value={formData.observations}
                        onChange={handleChange}
                        rows={3}
                      />
                    </Col>
                  </Row>
                </FormSection>
              )}
            </div>
          </div>
        </Card.Body>
      </Card>

      <style jsx>{`
        .tabs-container {
          width: 100%;
        }
        
        .tab-nav {
          display: flex;
          border-bottom: 1px solid var(--pastel-border);
          margin-bottom: 1rem;
        }
        
        .tab-button {
          padding: 0.75rem 1.5rem;
          border: none;
          background: none;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          color: var(--pastel-text);
        }
        
        .tab-button.active {
          border-bottom: 2px solid var(--primary-color);
          color: var(--primary-color);
          font-weight: 500;
        }
        
        .tab-content {
          min-height: 400px;
        }
        
        .alert {
          padding: 0.75rem 1.25rem;
          margin-bottom: 1rem;
          border: 1px solid transparent;
          border-radius: 0.375rem;
        }
        
        .alert-danger {
          color: #721c24;
          background-color: #f8d7da;
          border-color: #f5c6cb;
        }
      `}</style>
    </Container>
  );
};

export default StudentForm;