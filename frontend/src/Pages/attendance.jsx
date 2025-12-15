import { useState } from 'react';
import useIsMobile from '../hooks/useIsMobile';
import DesktopAttendance from '../components/Organisms/DesktopAttendance';
import MobileAttendance from '../components/Organisms/MobileAttendance';

const Attendance = () => {
  const isMobile = useIsMobile();

  const [attendanceData, setAttendanceData] = useState([
    { id: 1, studentName: 'Juan Pérez', classroom: 'Maternal A', date: '2024-01-15', status: 'presente' },
    { id: 2, studentName: 'María García', classroom: 'Jardín B', date: '2024-01-15', status: 'ausente' },
    { id: 3, studentName: 'Pedro López', classroom: 'Preescolar C', date: '2024-01-15', status: 'presente' },
    { id: 4, studentName: 'Ana Martínez', classroom: 'Maternal A', date: '2024-01-15', status: 'tarde' },
  ]);

  const [selectedClass, setSelectedClass] = useState('Todos');
  const [selectedDate, setSelectedDate] = useState('2024-01-15');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAttendance, setCurrentAttendance] = useState(null);
  const [formState, setFormState] = useState({
    studentName: '',
    classroom: '',
    date: new Date().toISOString().split('T')[0],
    status: 'presente'
  });

  const handleEdit = (record) => {
    setCurrentAttendance(record);
    setFormState({
      studentName: record.studentName,
      classroom: record.classroom,
      date: record.date,
      status: record.status
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    const updatedAttendance = attendanceData.map(record =>
      record.id === currentAttendance.id
        ? { ...record, ...formState }
        : record
    );
    setAttendanceData(updatedAttendance);
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

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