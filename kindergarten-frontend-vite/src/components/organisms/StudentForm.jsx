import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Row, Col } from '../atoms/Grid';
import Card from '../atoms/Card';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import Select from '../atoms/Select';
import TextArea from '../atoms/TextArea';
import Toggle from '../atoms/Toggle';
import FormSection from '../atoms/FormSection';
import Spinner from '../atoms/Spinner';
import OfficeRibbonWithTitle from './OfficeRibbonWithTitle';
import { normalizeName } from '../../utils/apiResponseHandler';
import { studentService } from '../../api/studentService';
import { ArrowLeft } from 'react-bootstrap-icons';
import './StudentForm.css';

const StudentForm = () => {
  const navigate = useNavigate();
  const { id: studentId } = useParams();

  // Estados para opciones dinámicas
  const [bloodTypes, setBloodTypes] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [emergencyContactTypes, setEmergencyContactTypes] = useState([]);
  const [initialData, setInitialData] = useState({});
  const [loadingForm, setLoadingForm] = useState(true);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sections, setSections] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  // Cargar opciones y datos iniciales al montar el componente
  useEffect(() => {
    // Cargar opciones estáticas
    const loadStaticOptions = () => {
      setBloodTypes([
        { value: '', label: 'Seleccione tipo de sangre' },
        { value: 'A+', label: 'A+' },
        { value: 'A-', label: 'A-' },
        { value: 'B+', label: 'B+' },
        { value: 'B-', label: 'B-' },
        { value: 'AB+', label: 'AB+' },
        { value: 'AB-', label: 'AB-' },
        { value: 'O+', label: 'O+' },
        { value: 'O-', label: 'O-' }
      ]);

      setShifts([
        { value: '', label: 'Seleccione un turno' },
        { value: 'Mañana', label: 'Mañana' },
        { value: 'Tarde', label: 'Tarde' },
        { value: 'Completo', label: 'Completo' },
        { value: 'Mañana y Tarde', label: 'Mañana y Tarde' }
      ]);

      setClassrooms([
        { value: '', label: 'Seleccione una sala' },
        { value: '1', label: 'Sala de 2 años' },
        { value: '2', label: 'Sala de 3 años' },
        { value: '3', label: 'Sala de 4 años' },
        { value: '4', label: 'Sala de 5 años' }
      ]);

      setEmergencyContactTypes([
        { value: '', label: 'Seleccione relación' },
        { value: 'Padre', label: 'Padre' },
        { value: 'Madre', label: 'Madre' },
        { value: 'Tutor', label: 'Tutor Legal' },
        { value: 'Abuelo/Abuela', label: 'Abuelo/Abuela' },
        { value: 'Otro Familiar', label: 'Otro Familiar' },
        { value: 'Vecino', label: 'Vecino' }
      ]);
    };

    loadStaticOptions();

    // Si es edición, cargar los datos del alumno
    if (studentId) {
      loadStudentData();
    } else {
      // Si es nuevo, iniciar con datos vacíos
      setFormData({});
      setInitialData({});
      initializeSections([]);
      setLoadingForm(false);
    }
  }, [studentId]);

  // Inicializar las secciones del formulario
  const initializeSections = (emergencyContactTypes = []) => {
    const newSections = [
      {
        id: 'personal',
        title: 'Información Personal',
        subtitle: 'Información básica del alumno',
        fields: [
          { name: 'first_name', label: 'Nombre(s) *', type: 'text', required: true, normalize: true },
          { name: 'middle_name_optional', label: 'Segundo Nombre (Opcional)', type: 'text', normalize: true },
          { name: 'third_name_optional', label: 'Tercer Nombre (Opcional)', type: 'text', normalize: true },
          { name: 'paternal_surname', label: 'Apellido Paterno *', type: 'text', required: true, normalize: true },
          { name: 'maternal_surname', label: 'Apellido Materno', type: 'text', normalize: true },
          { name: 'nickname_optional', label: 'Alias/Nickname', type: 'text', normalize: true },
          { name: 'dni', label: 'DNI *', type: 'text', required: true },
          { name: 'birth_date', label: 'Fecha de Nacimiento *', type: 'date', required: true }
        ]
      },
      {
        id: 'address',
        title: 'Dirección',
        subtitle: 'Información de la dirección del alumno',
        fields: [
          { name: 'street', label: 'Calle', type: 'text' },
          { name: 'number', label: 'Número', type: 'text' },
          { name: 'city', label: 'Ciudad', type: 'text' },
          { name: 'provincia', label: 'Provincia', type: 'text' },
          { name: 'postal_code_optional', label: 'Código Postal', type: 'text' }
        ]
      },
      {
        id: 'emergency',
        title: 'Contacto de Emergencia',
        subtitle: 'Información para contacto en caso de emergencia',
        fields: [
          { name: 'emergency_contact_full_name', label: 'Nombre Completo', type: 'text', required: true },
          { name: 'emergency_contact_relationship', label: 'Relación', type: 'select', options: emergencyContactTypes, required: true },
          { name: 'emergency_contact_priority', label: 'Prioridad', type: 'number', default: 1 },
          { name: 'emergency_contact_phone', label: 'Teléfono', type: 'tel' },
          { name: 'emergency_contact_alternative_phone', label: 'Teléfono Alternativo', type: 'tel' },
          { name: 'emergency_contact_authorized_pickup', label: 'Autorizado para retirar', type: 'checkbox' }
        ]
      },
      {
        id: 'school',
        title: 'Información Escolar',
        subtitle: 'Detalles sobre la inscripción y sala',
        fields: [
          { name: 'shift', label: 'Turno', type: 'select', options: shifts },
          { name: 'classroom_id', label: 'Sala', type: 'select', options: classrooms },
          { name: 'status', label: 'Estado', type: 'select', options: [
            { value: '', label: 'Seleccione un estado' },
            { value: 'preinscripto', label: 'Preinscripto' },
            { value: 'inscripto', label: 'Inscripto' },
            { value: 'activo', label: 'Activo' },
            { value: 'inactivo', label: 'Inactivo' },
            { value: 'egresado', label: 'Egresado' }
          ]},
          { name: 'enrollment_date', label: 'Fecha de Inscripción', type: 'date' },
          { name: 'withdrawal_date', label: 'Fecha de Retiro', type: 'date' }
        ]
      },
      {
        id: 'medical',
        title: 'Información Médica',
        subtitle: 'Datos médicos importantes del alumno',
        fields: [
          { name: 'health_insurance', label: 'Obra Social', type: 'text' },
          { name: 'affiliate_number', label: 'Número de Afiliado', type: 'text' },
          { name: 'allergies', label: 'Alergias', type: 'textarea' },
          { name: 'medications', label: 'Medicamentos', type: 'textarea' },
          { name: 'medical_observations', label: 'Observaciones Médicas', type: 'textarea' },
          { name: 'blood_type', label: 'Tipo de Sangre', type: 'select', options: bloodTypes },
          { name: 'pediatrician_name', label: 'Nombre del Pediatra', type: 'text' },
          { name: 'pediatrician_phone', label: 'Teléfono del Pediatra', type: 'tel' }
        ]
      },
      {
        id: 'authorizations',
        title: 'Autorizaciones',
        subtitle: 'Autorizaciones y permisos especiales',
        fields: [
          { name: 'photo_authorization', label: 'Autorización para fotografía', type: 'checkbox' },
          { name: 'trip_authorization', label: 'Autorización para excursiones', type: 'checkbox' },
          { name: 'medical_attention_authorization', label: 'Autorización para atención médica de emergencia', type: 'checkbox' },
          { name: 'has_siblings_in_school', label: 'Tiene hermanos en el jardín', type: 'checkbox' },
          { name: 'special_needs', label: 'Necesidades Especiales', type: 'textarea' },
          { name: 'vaccination_status', label: 'Estado de Vacunación', type: 'select', options: [
            { value: '', label: 'Seleccione estado de vacunación' },
            { value: 'completo', label: 'Completo' },
            { value: 'incompleto', label: 'Incompleto' },
            { value: 'pendiente', label: 'Pendiente' },
            { value: 'no_informado', label: 'No Informado' }
          ]},
          { name: 'observations', label: 'Observaciones Generales', type: 'textarea' }
        ]
      }
    ];

    setSections(newSections);
  };

  const loadStudentData = async () => {
    try {
      setLoadingForm(true);
      const data = await studentService.getById(studentId);
      setInitialData(data);
      setFormData(data);
      initializeSections(emergencyContactTypes);
    } catch (err) {
      setError('Error al cargar los datos del alumno');
      console.error('Error loading student data:', err);
    } finally {
      setLoadingForm(false);
    }
  };

  // Manejar cambio en campos
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;

    let processedValue = type === 'checkbox' ? checked : value;

    // Normalizar nombres si es necesario
    const currentSection = sections.find(s =>
      s.fields.some(f => f.name === name)
    );

    if (currentSection?.fields.some(f => f.normalize && f.name === name)) {
      processedValue = normalizeName(processedValue);
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    // Limpiar error cuando se cambia el campo
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors, sections]);

  // Validar sección actual
  const validateCurrentSection = () => {
    const currentSection = sections[currentPage];
    const newErrors = {};

    currentSection.fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = 'Este campo es requerido';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navegar a la siguiente sección
  const goToNextSection = () => {
    if (validateCurrentSection()) {
      if (currentPage < sections.length - 1) {
        setCurrentPage(prev => prev + 1);
      }
    }
  };

  // Navegar a la sección anterior
  const goToPreviousSection = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateCurrentSection()) {
      try {
        setLoading(true);
        setError(null);

        if (studentId) {
          // Actualizar alumno existente
          await studentService.update(studentId, formData);
        } else {
          // Crear nuevo alumno
          await studentService.create(formData);
        }

        // Redirigir a la lista de alumnos
        navigate('/students');
      } catch (err) {
        setError('Error al guardar los datos del alumno');
        console.error('Error saving student data:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    navigate('/students');
  };

  if (loadingForm) {
    return (
      <div className="d-flex justify-content-center align-items-center min-h-200">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  const menuItems = [
    {
      label: 'Volver a la Lista',
      icon: <ArrowLeft size={16} />,
      onClick: () => navigate('/students')
    }
  ];

  const currentSection = sections[currentPage];
  const isLastPage = currentPage === sections.length - 1;
  const isFirstPage = currentPage === 0;

  return (
    <div className="student-form-container">
      <OfficeRibbonWithTitle
        title={studentId ? `Editar Alumno: ${normalizeName(formData.first_name)} ${normalizeName(formData.paternal_surname)}` : 'Nuevo Alumno'}
        menuItems={menuItems}
        backPath="/students"
      />

      <div className="main-content-with-ribbon">
        <Card className="student-form-card">
          <Card.Body>
            <div className="form-header">
              <h3 className="form-title">{currentSection?.title}</h3>
              <div className="form-progress">
                <span className="form-progress-text">
                  Página {currentPage + 1} de {sections.length}
                </span>
              </div>
            </div>

            <p className="form-subtitle">{currentSection?.subtitle}</p>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="student-form">
              <Row className="form-row">
                {currentSection?.fields.map((field) => (
                  <Col key={field.name} className={field.type === 'textarea' ? 'col-12' : 'col-md-6'}>
                    {field.type === 'checkbox' ? (
                      <Toggle
                        label={field.label}
                        name={field.name}
                        checked={formData[field.name] || false}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    ) : field.type === 'textarea' ? (
                      <TextArea
                        label={field.label}
                        name={field.name}
                        value={formData[field.name] || ''}
                        onChange={handleChange}
                        error={errors[field.name]}
                        disabled={loading}
                        rows={3}
                      />
                    ) : field.type === 'select' ? (
                      <Select
                        label={field.label}
                        name={field.name}
                        value={formData[field.name] || ''}
                        onChange={handleChange}
                        options={field.options || []}
                        error={errors[field.name]}
                        disabled={loading}
                      />
                    ) : (
                      <Input
                        label={field.label}
                        name={field.name}
                        value={formData[field.name] || ''}
                        onChange={handleChange}
                        error={errors[field.name]}
                        type={field.type}
                        disabled={loading}
                        required={field.required}
                      />
                    )}
                  </Col>
                ))}
              </Row>

              <div className="form-navigation">
                <Button
                  variant="secondary"
                  onClick={isFirstPage ? handleCancel : goToPreviousSection}
                  disabled={loading}
                  className="nav-button prev-button"
                >
                  {isFirstPage ? 'Cancelar' : 'Anterior'}
                </Button>

                {isLastPage ? (
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={loading}
                    className="nav-button submit-button"
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" />
                        <span className="button-text">Guardando...</span>
                      </>
                    ) : (
                      <span className="button-text">Guardar</span>
                    )}
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    onClick={goToNextSection}
                    disabled={loading}
                    className="nav-button next-button"
                  >
                    <span className="button-text">Siguiente</span>
                  </Button>
                )}
              </div>
            </form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default StudentForm;