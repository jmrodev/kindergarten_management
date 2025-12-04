import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Save, Person, Pencil } from 'react-bootstrap-icons';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import studentService from '../../api/studentService';
import classroomService from '../../api/classroomService';
import { normalizeName } from '../../utils/apiResponseHandler';
import Wizard from '../../components/organisms/Wizard';
import PersonalInfoStep from '../../components/steps/PersonalInfoStep';
import AddressInfoStep from '../../components/steps/AddressInfoStep';
import EmergencyContactStep from '../../components/steps/EmergencyContactStep';
import SchoolInfoStep from '../../components/steps/SchoolInfoStep';
import MedicalInfoStep from '../../components/steps/MedicalInfoStep';
import AuthorizationStep from '../../components/steps/AuthorizationStep';

const StudentFormWizard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const isEdit = !!id;

  const [initialData, setInitialData] = useState({
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
      
      setInitialData({
        // Datos personales
        first_name: student.first_name || '',
        middle_name_optional: student.middle_name_optional || '',
        third_name_optional: student.third_name_optional || '',
        paternal_surname: student.paternal_surname || '',
        maternal_surname: student.maternal_surname || '',
        nickname_optional: student.nickname_optional || '',
        dni: student.dni || '',
        birth_date: student.birth_date || '',

        // Dirección
        street: student.address?.street || '',
        number: student.address?.number || '',
        city: student.address?.city || '',
        provincia: student.address?.provincia || '',
        postal_code_optional: student.address?.postal_code_optional || '',
        address_id: student.address_id || null,

        // Contacto de emergencia
        emergency_contact_full_name: student.emergency_contact?.full_name || '',
        emergency_contact_relationship: student.emergency_contact?.relationship || '',
        emergency_contact_priority: student.emergency_contact?.priority || 1,
        emergency_contact_phone: student.emergency_contact?.phone || '',
        emergency_contact_alternative_phone: student.emergency_contact?.alternative_phone || '',
        emergency_contact_authorized_pickup: student.emergency_contact?.is_authorized_pickup || false,
        emergency_contact_id: student.emergency_contact_id || null,

        // Información escolar
        classroom_id: student.classroom_id || '',
        shift: student.shift || '',
        status: student.status || 'preinscripto',
        enrollment_date: student.enrollment_date || '',
        withdrawal_date: student.withdrawal_date || '',

        // Información médica
        health_insurance: student.health_insurance || '',
        affiliate_number: student.affiliate_number || '',
        allergies: student.allergies || '',
        medications: student.medications || '',
        medical_observations: student.medical_observations || '',
        blood_type: student.blood_type || '',
        pediatrician_name: student.pediatrician_name || '',
        pediatrician_phone: student.pediatrician_phone || '',

        // Autorizaciones
        photo_authorization: student.photo_authorization || false,
        trip_authorization: student.trip_authorization || false,
        medical_attention_authorization: student.medical_attention_authorization || false,

        // Información adicional
        has_siblings_in_school: student.has_siblings_in_school || false,
        special_needs: student.special_needs || '',
        vaccination_status: student.vaccination_status || 'no_informado',
        observations: student.observations || ''
      });
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
  }, [isEdit, fetchStudentData, fetchClassrooms]);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      
      // Normalizamos los nombres
      const normalizedData = {
        ...formData,
        first_name: normalizeName(formData.first_name),
        middle_name_optional: normalizeName(formData.middle_name_optional),
        third_name_optional: normalizeName(formData.third_name_optional),
        paternal_surname: normalizeName(formData.paternal_surname),
        maternal_surname: normalizeName(formData.maternal_surname),
        nickname_optional: normalizeName(formData.nickname_optional)
      };

      if (isEdit) {
        await studentService.update(id, normalizedData);
      } else {
        await studentService.create(normalizedData);
      }
      
      navigate('/students');
    } catch (err) {
      setError('Error al guardar los datos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/students');
  };

  // Definir los pasos del asistente
  const steps = [
    {
      title: "Información Personal",
      component: PersonalInfoStep
    },
    {
      title: "Dirección",
      component: AddressInfoStep
    },
    // Mostrar contacto de emergencia solo si el usuario no es administrador
    ...(currentUser?.role !== 'Administrator' ? [{
      title: "Contacto de Emergencia",
      component: EmergencyContactStep
    }] : []),
    {
      title: "Información Escolar",
      component: SchoolInfoStep
    },
    {
      title: "Información Médica",
      component: MedicalInfoStep
    },
    {
      title: "Autorizaciones",
      component: AuthorizationStep
    }
  ];

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>
            <Person className="me-2" />
            {isEdit ? 'Editar Alumno' : 'Nuevo Alumno'}
          </h2>
          <p className="text-muted">
            {isEdit ? 'Modifique los datos del alumno' : 'Complete la información del nuevo alumno'}
          </p>
        </div>
        <Link to="/students" className="btn btn-outline-secondary">
          <ArrowLeft className="me-2" />
          Volver a la lista
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <Wizard
        steps={steps}
        initialValues={initialData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitButtonText={isEdit ? "Actualizar" : "Crear"}
      />
    </div>
  );
};

export default StudentFormWizard;