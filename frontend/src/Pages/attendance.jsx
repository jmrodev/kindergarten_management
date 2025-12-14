import { useState } from 'react';
import Card from '../components/Atoms/Card';
import Text from '../components/Atoms/Text';
import Button from '../components/Atoms/Button';
import Select from '../components/Atoms/Select';
import Input from '../components/Atoms/Input';
import Table from '../components/Atoms/Table';
import TableRow from '../components/Atoms/TableRow';
import TableCell from '../components/Atoms/TableCell';
import TableHeader from '../components/Atoms/TableHeader';
import TableBody from '../components/Atoms/TableBody';
import Modal from '../components/Atoms/Modal';
import FormGroup from '../components/Molecules/FormGroup';

const Attendance = () => {
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
    // Actualizar el registro de asistencia en la lista
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

  const filteredAttendance = attendanceData.filter(record => {
    const matchesClass = selectedClass === 'Todos' || record.classroom === selectedClass;
    return matchesClass && record.date === selectedDate;
  });

  return (
    <Card>
      <Text variant="h1">Asistencia</Text>

      <div className="attendance-header">
        <div className="attendance-filters">
          <Select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="class-select"
          >
            <option value="Todos">Todos los salones</option>
            <option value="Maternal A">Maternal A</option>
            <option value="Maternal B">Maternal B</option>
            <option value="Jardín A">Jardín A</option>
            <option value="Jardín B">Jardín B</option>
            <option value="Preescolar A">Preescolar A</option>
          </Select>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-input"
          />
        </div>
        <Button variant="primary">Registrar Asistencia</Button>
      </div>

      <Table striped bordered responsive>
        <TableHeader>
          <TableRow>
            <TableCell as="th">ID</TableCell>
            <TableCell as="th">Estudiante</TableCell>
            <TableCell as="th">Salón</TableCell>
            <TableCell as="th">Fecha</TableCell>
            <TableCell as="th">Estado</TableCell>
            <TableCell as="th">Acciones</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAttendance.map(record => (
            <TableRow key={record.id}>
              <TableCell>{record.id}</TableCell>
              <TableCell>{record.studentName}</TableCell>
              <TableCell>{record.classroom}</TableCell>
              <TableCell>{record.date}</TableCell>
              <TableCell>
                <span className={`status-badge ${record.status === 'presente' ? 'status-presente' : record.status === 'ausente' ? 'status-ausente' : 'status-tarde'}`}>
                  {record.status === 'presente' ? 'Presente' :
                   record.status === 'ausente' ? 'Ausente' : 'Tarde'}
                </span>
              </TableCell>
              <TableCell>
                <div className="actions-cell">
                  <Button
                    variant="secondary"
                    size="small"
                    className="action-btn"
                    onClick={() => handleEdit(record)}
                  >
                    Editar
                  </Button>
                  <Button variant="primary" size="small" className="action-btn">Justificar</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentAttendance ? "Editar Asistencia" : "Registrar Asistencia"}
      >
        <FormGroup>
          <Input
            label="Estudiante"
            name="studentName"
            value={formState.studentName}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <select
            name="classroom"
            value={formState.classroom}
            onChange={handleChange}
            className="select-field"
          >
            <option value="">Seleccione un salón</option>
            <option value="Maternal A">Maternal A</option>
            <option value="Maternal B">Maternal B</option>
            <option value="Jardín A">Jardín A</option>
            <option value="Jardín B">Jardín B</option>
            <option value="Preescolar A">Preescolar A</option>
          </select>
        </FormGroup>
        <FormGroup>
          <Input
            label="Fecha"
            name="date"
            type="date"
            value={formState.date}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <select
            name="status"
            value={formState.status}
            onChange={handleChange}
            className="select-field"
          >
            <option value="presente">Presente</option>
            <option value="ausente">Ausente</option>
            <option value="tarde">Tarde</option>
          </select>
        </FormGroup>
        <div className="modal-footer">
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleSave}>Guardar</Button>
        </div>
      </Modal>
    </Card>
  );
};

export default Attendance;