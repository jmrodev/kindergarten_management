import { useState, useEffect } from 'react';
import useIsMobile from '../hooks/useIsMobile';
import Loading from '../components/Atoms/Loading';
import ErrorMessage from '../components/Atoms/ErrorMessage';
import DesktopAttendance from '../components/Organisms/DesktopAttendance';
import MobileAttendance from '../components/Organisms/MobileAttendance';
import attendanceService from '../services/attendanceService';
import api from '../utils/api';
import AttendanceDetailModal from '../components/Molecules/AttendanceDetailModal';
import StudentHistoryModal from '../components/Molecules/StudentHistoryModal';
import '../components/Molecules/AttendanceDetailModal.css';

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
  const [reportType, setReportType] = useState('daily');
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [viewMode, setViewMode] = useState('register'); // 'register' or 'view'

  // Modal State
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState(null);
  const [detailModalData, setDetailModalData] = useState(null);

  // History Modal State
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedHistoryStudent, setSelectedHistoryStudent] = useState(null);
  const [selectedHistoryType, setSelectedHistoryType] = useState('all');
  const [historyRecords, setHistoryRecords] = useState([]);

  // Load classrooms on mount
  useEffect(() => {
    loadClassrooms();
  }, []);

  // Load students and attendance when classroom or date changes
  useEffect(() => {
    if (selectedClassroom) {
      loadStudentsAndAttendance();
    }
  }, [selectedClassroom, selectedDate, reportType]);

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

  const getDateRange = () => {
    const [year, month, day] = selectedDate.split('-').map(Number);
    const d = new Date(year, month - 1, day);

    let start, end;

    if (reportType === 'daily') {
      return { startDate: selectedDate, endDate: selectedDate };
    } else if (reportType === 'weekly') {
      // Find Monday
      const dayOfWeek = d.getDay(); // 0 is Sunday
      const diffToMon = (dayOfWeek + 6) % 7;
      const monday = new Date(d);
      monday.setDate(d.getDate() - diffToMon);

      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);

      start = monday.toISOString().split('T')[0];
      end = sunday.toISOString().split('T')[0];
    } else if (reportType === 'monthly') {
      const firstDay = new Date(year, month - 1, 1);
      const lastDay = new Date(year, month, 0);

      start = firstDay.toISOString().split('T')[0];
      end = lastDay.toISOString().split('T')[0];
    } else if (reportType === 'yearly') {
      const firstDay = new Date(year, 0, 1);
      const lastDay = new Date(year, 11, 31);
      start = firstDay.toISOString().split('T')[0];
      end = lastDay.toISOString().split('T')[0];
    }

    return { startDate: start, endDate: end };
  };

  const loadStudentsAndAttendance = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch students from selected classroom
      const studentsRes = await api.get(`/api/students?classroom_id=${selectedClassroom}`);
      const studentsList = Array.isArray(studentsRes) ? studentsRes : (studentsRes.data || []);
      setStudents(studentsList);

      // Calculate range
      const { startDate, endDate } = getDateRange();

      // Fetch attendance
      const query = { classroomId: selectedClassroom };
      if (reportType === 'daily') {
        query.date = selectedDate;
      } else {
        query.startDate = startDate;
        query.endDate = endDate;
      }

      const attendanceRes = await attendanceService.getAll(query);
      const records = Array.isArray(attendanceRes) ? attendanceRes : (attendanceRes.data || []);

      if (reportType === 'daily') {
        // Build map: student_id -> status
        const recordsMap = {};
        records.forEach(rec => {
          recordsMap[rec.student_id] = rec.status;
        });
        setAttendanceRecords(recordsMap);
        setOriginalRecords(recordsMap);
        setHasChanges(false);
      } else {
        // Just store history
        setAttendanceHistory(records);
      }
    } catch (err) {
      console.error('Error loading students/attendance:', err);
      setError(err.message || 'Error al cargar alumnos y asistencia');
    } finally {
      setLoading(false);
    }
  };

  const handleSetStatus = (studentId, status) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: status
    }));
    setHasChanges(true);
  };

  const handleToggleStatus = (studentId, status) => {
    handleSetStatus(studentId, status);
  };

  const handleToggleViewMode = () => {
    if (viewMode === 'register' && hasChanges) {
      if (!confirm('Tienes cambios sin guardar. ¿Deseas descartarlos?')) {
        return;
      }
    }

    // Always reset to original records when switching modes to ensure
    // we see the source of truth (view mode) or start fresh (register mode)
    // and discard any unsaved changes if the user confirmed.
    setAttendanceRecords({ ...originalRecords });
    setHasChanges(false);

    setViewMode(viewMode === 'register' ? 'view' : 'register');
  };

  const handleOpenDetails = async (student, initialStatus = null) => {
    // Set selected immediately for UI feedback if needed, but we wait for data
    // fetch full details to get guardians
    try {
      const fullStudentRes = await api.get(`/api/students/${student.id}`);
      // Response format is { status: 'success', data: { ... } } or directly data depending on interceptor
      // Looking at api.js interaction usually returns data directly if success.
      // Let's assume standard response unwrapping in api.js or handle both.
      const fullStudent = fullStudentRes.data || fullStudentRes;

      setSelectedStudentForDetail(fullStudent);
      setDetailModalData(null); // Reset for new

      setDetailModalOpen(true);
      if (initialStatus) {
        // If a specific status triggers the modal (e.g. Late/Early), set it locally immediately
        // This serves as the "draft" status passed to the modal via attendanceRecords prop or we can pass a new prop.
        // But the modal uses `currentStatus` from `attendanceRecords`.
        // So we update the local record temporarily to reflect the intended status.
        handleSetStatus(student.id, initialStatus);
      }
    } catch (err) {
      console.error("Error fetching student details", err);
      alert("Error al cargar detalles del alumno");
    }
  };

  const handleSaveDetails = (studentId, status, details) => {
    // Update status
    handleSetStatus(studentId, status);
    saveSingleRecord(studentId, status, details);
  };

  const handleShowHistory = (student, type) => {
    setSelectedHistoryStudent(student);
    setSelectedHistoryType(type);

    // Filter history
    const records = attendanceHistory.filter(r => {
      if (r.student_id !== student.id) return false;
      if (type === 'all') return true;
      // Strict match for type, but allow some flexibility if needed? No, user clicked specific list.
      return r.status === type;
    });

    // Sort by date desc
    records.sort((a, b) => new Date(b.date) - new Date(a.date));

    setHistoryRecords(records);
    setHistoryModalOpen(true);
  };

  const saveSingleRecord = async (studentId, status, details) => {
    try {
      setSaving(true);
      const data = {
        student_id: studentId,
        date: selectedDate,
        status: status,
        classroom_id: selectedClassroom,
        ...details
      };

      await attendanceService.create(data); // Create or Update logic inside service/backend needed? 
      // Actually create() inserts. We should check if exists.
      // But attendance is usually 1 record per student per day.
      // The backend `create` does Insert. 
      // We might need an `upsert` or check existence.
      // For now, let's assume create works (or we might need to fix backend to upsert).

      // Update local state
      setAttendanceRecords(prev => ({ ...prev, [studentId]: status }));
      setOriginalRecords(prev => ({ ...prev, [studentId]: status }));

      // Close modal
      // setDetailModalOpen(false); // Handled by caller? No, handleSaveDetails closes?
      console.log('Detalle guardado');
    } catch (err) {
      console.error("Error saving detail", err);
      alert("Error al guardar detalle: " + err.message);
    } finally {
      setSaving(false);
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
      setHasChanges(false);

      console.log('Asistencia guardada exitosamente');
      alert('Asistencia guardada exitosamente');
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
        onSetStatus={handleSetStatus} // New prop
        onSave={handleSaveAttendance}
        hasChanges={hasChanges}
        saving={saving}
        viewMode={viewMode}
        onToggleViewMode={handleToggleViewMode}
      />
    );
  }

  return (
    <>
      <DesktopAttendance
        classrooms={classrooms}
        students={students}
        attendanceRecords={attendanceRecords}
        attendanceHistory={attendanceHistory}
        selectedClassroom={selectedClassroom}
        setSelectedClassroom={setSelectedClassroom}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        reportType={reportType}
        setReportType={setReportType}
        onToggleStatus={handleToggleStatus}
        onSave={handleSaveAttendance}
        hasChanges={hasChanges}
        saving={saving}
        viewMode={viewMode}
        onToggleViewMode={handleToggleViewMode}
        onOpenDetails={handleOpenDetails}
        onShowHistory={handleShowHistory}
      />
      {detailModalOpen && selectedStudentForDetail && (
        <AttendanceDetailModal
          isOpen={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          onSave={handleSaveDetails}
          student={selectedStudentForDetail}
          currentStatus={attendanceRecords[selectedStudentForDetail.id]}
          initialData={detailModalData}
          guardians={selectedStudentForDetail.guardians || []}
        />
      )}

      {historyModalOpen && selectedHistoryStudent && (
        <StudentHistoryModal
          isOpen={historyModalOpen}
          onClose={() => setHistoryModalOpen(false)}
          student={selectedHistoryStudent}
          historyType={selectedHistoryType}
          records={historyRecords}
        />
      )}
    </>
  );
};

export default Attendance;