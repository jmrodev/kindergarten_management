import { useState, useEffect } from 'react';
import useIsMobile from '../hooks/useIsMobile';
import Loading from '../components/Atoms/Loading';
import ErrorMessage from '../components/Atoms/ErrorMessage';
import DesktopAttendance from '../components/Organisms/DesktopAttendance';
import MobileAttendance from '../components/Organisms/MobileAttendance';
import attendanceService from '../services/attendanceService';

const Attendance = () => {
  const isMobile = useIsMobile();

  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClass, setSelectedClass] = useState('Todos');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAttendance, setCurrentAttendance] = useState(null);
  const [formState, setFormState] = useState({
    student_id: '',
    date: new Date().toISOString().split('T')[0],
    status: 'presente',
    notes: ''
  });

  // Cargar asistencias al montar o cuando cambie la fecha
  useEffect(() => {
    loadAttendance();
  }, [selectedDate]);

  const loadAttendance = async () => {
    try {
      setLoading(true);
      setError(null);
      const filters = { date: selectedDate };
      if (selectedClass !== 'Todos') {
        filters.classroomId = selectedClass;
      }
      const response = await attendanceService.getAll(filters);
      // Backend returns { status: 'success', data: [...] }
      setAttendanceData(Array.isArray(response) ? response : (response.data || []));
    } catch (err) {
      console.error('Error loading attendance:', err);
      setError(err.message || 'Error al cargar asistencias');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record) => {
    setCurrentAttendance(record);
    setFormState({
      student_id: record.student_id,
      date: record.date,
      status: record.status || 'presente',
      notes: record.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (currentAttendance) {
        // Actualizar asistencia existente
        await attendanceService.update(currentAttendance.id, formState);
      } else {
        // Crear nueva asistencia
        await attendanceService.create(formState);
      }
      // Recargar datos
      await loadAttendance();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving attendance:', err);
      setError(err.message || 'Error al guardar asistencia');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) return <Loading message="Cargando asistencias..." />;
  if (error) return <ErrorMessage message={error} onRetry={loadAttendance} />;

  if (isMobile) {
    return (
      <MobileAttendance
        attendance={attendanceData}
        onEdit={handleEdit}
        searchTerm={null}
        setSearchTerm={() => { }}
        selectedClass={selectedClass}
        setSelectedClass={setSelectedClass}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
    );
  }

  return (
    <DesktopAttendance
      attendanceData={attendanceData}
      selectedClass={selectedClass}
      setSelectedClass={setSelectedClass}
      selectedDate={selectedDate}
      setSelectedDate={setSelectedDate}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      currentAttendance={currentAttendance}
      setCurrentAttendance={setCurrentAttendance}
      formState={formState}
      setFormState={setFormState}
      handleEdit={handleEdit}
      handleSave={handleSave}
      handleChange={handleChange}
    />
  );
};

export default Attendance;