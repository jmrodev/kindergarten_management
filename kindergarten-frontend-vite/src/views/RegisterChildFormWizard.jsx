import React, { useState } from 'react';
import { ArrowLeft, Person, ShieldCheck } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { normalizeName } from '../utils/apiResponseHandler';
import api from '../api/api';
import parentService from '../api/parentService';
import Wizard from '../components/organisms/Wizard';
import ChildPersonalInfoStep from '../components/steps/ChildPersonalInfoStep';
import ChildAddressInfoStep from '../components/steps/ChildAddressInfoStep';
import ChildEmergencyContactStep from '../components/steps/ChildEmergencyContactStep';
import ChildMedicalInfoStep from '../components/steps/ChildMedicalInfoStep';
import ChildAuthorizationStep from '../components/steps/ChildAuthorizationStep';

const RegisterChildFormWizard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

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

    // Contacto de emergencia
    emergency_contact_full_name: '',
    emergency_contact_relationship: '',
    emergency_contact_priority: 1,
    emergency_contact_phone: '',
    emergency_contact_alternative_phone: '',
    emergency_contact_authorized_pickup: false,

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
    observations: '',

    // Estado predeterminado para inscripción
    status: 'preinscripto',
    enrollment_date: new Date().toISOString().split('T')[0]
  });

  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');

  // Cargar salas disponibles
  React.useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const response = await api.get('/classrooms');
        setClassrooms(response.data.data || []);
      } catch (err) {
        console.error('Error al cargar las salas:', err);
      }
    };

    fetchClassrooms();
  }, []);

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
        nickname_optional: normalizeName(formData.nickname_optional),
        emergency_contact: {
          full_name: formData.emergency_contact_full_name,
          relationship: formData.emergency_contact_relationship,
          priority: formData.emergency_contact_priority,
          phone: formData.emergency_contact_phone,
          alternative_phone: formData.emergency_contact_alternative_phone,
          is_authorized_pickup: formData.emergency_contact_authorized_pickup
        },
        // Información del padre responsable
        parent_id: currentUser.id
      };

      // Crear alumno
      const response = await api.post('/students', normalizedData);

      // Crear registro de presentación por parte del padre
      await parentService.submitRegistration({
        user_id: currentUser.id,
        student_id: response.data.data.id
      });

      // Borrar borrador si existe
      try {
        await parentService.deleteDraft(currentUser.id);
      } catch (deleteErr) {
        // Si falla al borrar el borrador, no es crítico
        console.warn('No se pudo borrar el borrador:', deleteErr);
      }

      // Redirigir después de éxito
      navigate('/parent-dashboard');
    } catch (err) {
      setError('Error al registrar al niño: ' + err.message);
      console.error('Error en el registro:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/parent-dashboard');
  };

  // Definir los pasos del asistente
  const steps = [
    {
      title: "Información Personal",
      component: ChildPersonalInfoStep
    },
    {
      title: "Dirección",
      component: ChildAddressInfoStep
    },
    {
      title: "Contacto de Emergencia",
      component: ChildEmergencyContactStep
    },
    {
      title: "Información Médica",
      component: ChildMedicalInfoStep
    },
    {
      title: "Autorizaciones",
      component: ChildAuthorizationStep
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
            Inscripción de Niño
          </h2>
          <p className="text-muted">
            Complete la información del niño para su inscripción
          </p>
        </div>
        <button 
          className="btn btn-outline-secondary" 
          onClick={() => navigate('/parent-dashboard')}
        >
          <ArrowLeft className="me-2" />
          Volver al panel
        </button>
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
        submitButtonText="Inscribir"
      />
    </div>
  );
};

export default RegisterChildFormWizard;