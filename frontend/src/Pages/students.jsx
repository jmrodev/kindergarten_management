import { useState, useEffect } from 'react';
import Modal from '../components/Atoms/Modal';
import FormGroup from '../components/Molecules/FormGroup';
import Input from '../components/Atoms/Input';
import Button from '../components/Atoms/Button';
import Loading from '../components/Atoms/Loading';
import ErrorMessage from '../components/Atoms/ErrorMessage';
import useIsMobile from '../hooks/useIsMobile';
import DesktopStudents from '../components/Organisms/DesktopStudents';
import MobileStudents from '../components/Organisms/MobileStudents';
import studentsService from '../services/studentsService';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [formState, setFormState] = useState({
    first_name: '',
    last_name: '',
    dni: '',
    birth_date: '',
    enrollment_status: 'activo'
  });

  // Cargar estudiantes al montar el componente
  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await studentsService.getAll();
      // Backend returns { status: 'success', data: [...] }
      setStudents(Array.isArray(response) ? response : (response.data || []));
    } catch (err) {
      console.error('Error loading students:', err);
      setError(err.message || 'Error al cargar estudiantes');
    } finally {
      setLoading(false);
    }
  };

  const normalizeText = (text) => {
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u0386]/g, '');
  };

  const filteredStudents = students.filter(student => {
    const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
    return normalizeText(fullName).includes(normalizeText(searchTerm)) ||
      (student.dni && student.dni.includes(searchTerm));
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = (student) => {
    setCurrentStudent(student);
    setFormState({
      first_name: student.first_name || '',
      last_name: student.last_name || '',
      dni: student.dni || '',
      birth_date: student.birth_date || '',
      enrollment_status: student.enrollment_status || 'activo'
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (currentStudent) {
        // Actualizar estudiante existente
        await studentsService.update(currentStudent.id, formState);
      } else {
        // Crear nuevo estudiante
        await studentsService.create(formState);
      }
      // Recargar lista
      await loadStudents();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving student:', err);
      setError(err.message || 'Error al guardar estudiante');
    }
  };

  const handleAdd = () => {
    setCurrentStudent(null);
    setFormState({
      first_name: '',
      last_name: '',
      dni: '',
      birth_date: '',
      enrollment_status: 'activo'
    });
    setIsModalOpen(true);
  };

  const isMobile = useIsMobile();

  const handleDelete = async (studentId) => {
    if (!window.confirm('¿Está seguro de eliminar este estudiante?')) return;

    try {
      await studentsService.delete(studentId);
      // Recargar lista
      await loadStudents();
    } catch (err) {
      console.error('Error deleting student:', err);
      setError(err.message || 'Error al eliminar estudiante');
    }
  };

  if (loading) return <Loading message="Cargando estudiantes..." />;
  if (error) return <ErrorMessage message={error} onRetry={loadStudents} />;



  return (
    <>
      {isMobile ? (
        <MobileStudents
          students={filteredStudents}
          onEdit={handleEdit}
          onDelete={handleDelete}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      ) : (
        <DesktopStudents
          students={filteredStudents}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAdd={handleAdd}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentStudent ? "Editar Estudiante" : "Agregar Estudiante"}
      >
        <FormGroup>
          <Input
            label="Nombre"
            name="first_name"
            value={formState.first_name}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Input
            label="Apellido"
            name="last_name"
            value={formState.last_name}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Input
            label="DNI"
            name="dni"
            value={formState.dni}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Input
            label="Fecha de Nacimiento"
            name="birth_date"
            type="date"
            value={formState.birth_date}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <select
            name="enrollment_status"
            value={formState.enrollment_status}
            onChange={handleChange}
            className="select-field"
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
            <option value="pendiente">Pendiente</option>
            <option value="egresado">Egresado</option>
          </select>
        </FormGroup>
        <div className="modal-footer">
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleSave}>Guardar</Button>
        </div>
      </Modal>
    </>
  );
};

export default Students;
