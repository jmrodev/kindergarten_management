import { useState, useEffect } from 'react';
import useIsMobile from '../hooks/useIsMobile';
import Loading from '../components/Atoms/Loading';
import ErrorMessage from '../components/Atoms/ErrorMessage';
import DesktopAttendance from '../components/Organisms/DesktopAttendance';
import MobileAttendance from '../components/Organisms/MobileAttendance';
import attendanceService from '../services/attendanceService';
import api from '../utils/api';

const Attendance = () => {
  const isMobile = useIsMobile();

  const [classrooms, setClassrooms] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [originalRecords, setOriginalRecords] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState('register'); // 'register' or 'view'

  // Load classrooms on mount
  useEffect(() => {
    loadClassrooms();
  }, []);

  // Load students and attendance when classroom or date changes
  useEffect(() => {
    if (selectedClassroom) {
      loadStudentsAndAttendance();
    }
  }, [selectedClassroom, selectedDate]);

  const loadClassrooms = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/classrooms');
      const rooms = Array.isArray(response) ? response : (response.data || []);
      setClassrooms(rooms);
      if (rooms.length > 0) {
        setSelectedClassroom(rooms[0].id);
      }
    } catch (err) {
      console.error('Error loading classrooms:', err);
      setError(err.message || 'Error al cargar salas');
    } finally {
      setLoading(false);
    }
  };

  const loadStudentsAndAttendance = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch students from selected classroom
      const studentsRes = await api.get(`/api/students?classroom_id=${selectedClassroom}`);
      const studentsList = Array.isArray(studentsRes) ? studentsRes : (studentsRes.data || []);
      setStudents(studentsList);

      // Fetch attendance for selected date and classroom
      const attendanceRes = await attendanceService.getAll({ classroomId: selectedClassroom, date: selectedDate });
      const records = Array.isArray(attendanceRes) ? attendanceRes : (attendanceRes.data || []);

      // Build map: student_id -> status
      const recordsMap = {};
      records.forEach(rec => {
        recordsMap[rec.student_id] = rec.status;
      });
      setAttendanceRecords(recordsMap);
      setOriginalRecords(recordsMap);
      setHasChanges(false);
    } catch (err) {
      console.error('Error loading students/attendance:', err);
      setError(err.message || 'Error al cargar alumnos y asistencia');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = (studentId) => {
    const currentStatus = attendanceRecords[studentId] || 'ausente';
    const newStatus = currentStatus === 'presente' ? 'ausente' : 'presente';

    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: newStatus
    }));
    setHasChanges(true);
  };

  const handleToggleViewMode = () => {
    if (viewMode === 'register' && hasChanges) {
      if (!confirm('Tienes cambios sin guardar. ¿Deseas descartarlos?')) {
        return;
      }
    }
    setViewMode(viewMode === 'register' ? 'view' : 'register');
    if (viewMode === 'view') {
      // Reset changes when going back to register mode
      setAttendanceRecords({ ...originalRecords });
      setHasChanges(false);
    }
  };

  const handleSaveAttendance = async () => {
    try {
      setSaving(true);
      setError(null);

      // Prepare batch of attendance records to save
      const promises = students.map(student => {
        const status = attendanceRecords[student.id] || 'ausente';
        return attendanceService.create({
          student_id: student.id,
          date: selectedDate,
          status: status,
          classroom_id: selectedClassroom
        });
      });

      await Promise.all(promises);

      // Update original records and reset changes flag
      setOriginalRecords({ ...attendanceRecords });
      setHasChanges(false);

      console.log('Asistencia guardada exitosamente');
    } catch (err) {
      console.error('Error saving attendance:', err);
      setError(err.message || 'Error al guardar asistencia');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading message="Cargando asistencias..." />;
  if (error) return <ErrorMessage message={error} onRetry={loadStudentsAndAttendance} />;

  if (isMobile) {
    return (
      <MobileAttendance
        classrooms={classrooms}
        students={students}
        attendanceRecords={attendanceRecords}
        selectedClassroom={selectedClassroom}
        setSelectedClassroom={setSelectedClassroom}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        onToggleStatus={handleToggleStatus}
        onSave={handleSaveAttendance}
        hasChanges={hasChanges}
        saving={saving}
        viewMode={viewMode}
        onToggleViewMode={handleToggleViewMode}
      />
    );
  }

  return (
    <DesktopAttendance
      classrooms={classrooms}
      students={students}
      attendanceRecords={attendanceRecords}
      selectedClassroom={selectedClassroom}
      setSelectedClassroom={setSelectedClassroom}
      selectedDate={selectedDate}
      setSelectedDate={setSelectedDate}
      onToggleStatus={handleToggleStatus}
      onSave={handleSaveAttendance}
      hasChanges={hasChanges}
      saving={saving}
      viewMode={viewMode}
      onToggleViewMode={handleToggleViewMode}
    />
  );
};

export default Attendance;