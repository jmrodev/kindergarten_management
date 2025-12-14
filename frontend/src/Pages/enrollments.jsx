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

const Enrollments = () => {
  const [enrollments, setEnrollments] = useState([
    { id: 1, studentName: 'Carlos Ruiz', dni: '56789012', classroom: 'Maternal A', status: 'pendiente', enrollmentDate: '2024-01-10' },
    { id: 2, studentName: 'Sofía Fernández', dni: '67890123', classroom: 'Jardín A', status: 'aprobado', enrollmentDate: '2024-01-12' },
    { id: 3, studentName: 'Valentina Díaz', dni: '78901234', classroom: 'Preescolar A', status: 'inscrito', enrollmentDate: '2024-01-15' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEnrollment, setCurrentEnrollment] = useState(null);
  const [formState, setFormState] = useState({
    studentName: '',
    dni: '',
    classroom: '',
    status: 'pendiente',
    enrollmentDate: new Date().toISOString().split('T')[0]
  });

  // Función para normalizar texto (eliminar acentos y convertir a minúsculas)
  const normalizeText = (text) => {
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u0386]/g, '');
  };

  const filteredEnrollments = enrollments.filter(enrollment => {
    const matchesSearch = normalizeText(enrollment.studentName).includes(normalizeText(searchTerm)) ||
                          enrollment.dni.includes(searchTerm);
    const matchesStatus = selectedStatus === 'Todos' || enrollment.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (enrollment) => {
    setCurrentEnrollment(enrollment);
    setFormState({
      studentName: enrollment.studentName,
      dni: enrollment.dni,
      classroom: enrollment.classroom,
      status: enrollment.status,
      enrollmentDate: enrollment.enrollmentDate
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    // Actualizar la inscripción en la lista
    const updatedEnrollments = enrollments.map(enrollment =>
      enrollment.id === currentEnrollment.id
        ? { ...enrollment, ...formState }
        : enrollment
    );
    setEnrollments(updatedEnrollments);
    setIsModalOpen(false);
  };

  const handleAdd = () => {
    setCurrentEnrollment(null);
    setFormState({
      studentName: '',
      dni: '',
      classroom: '',
      status: 'pendiente',
      enrollmentDate: new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Card>
      <Text variant="h1">Inscripciones</Text>

      <div className="enrollments-header">
        <Button variant="primary" onClick={handleAdd}>Nueva Inscripción</Button>
        <div className="enrollments-filters">
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="status-select"
          >
            <option value="Todos">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="aprobado">Aprobado</option>
            <option value="inscrito">Inscrito</option>
            <option value="rechazado">Rechazado</option>
          </Select>
          <Input
            type="text"
            placeholder="Buscar inscripciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <Table striped bordered responsive>
        <TableHeader>
          <TableRow>
            <TableCell as="th">ID</TableCell>
            <TableCell as="th">Nombre del Estudiante</TableCell>
            <TableCell as="th">DNI</TableCell>
            <TableCell as="th">Salón</TableCell>
            <TableCell as="th">Estado</TableCell>
            <TableCell as="th">Fecha de Inscripción</TableCell>
            <TableCell as="th">Acciones</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredEnrollments.map(enrollment => (
            <TableRow key={enrollment.id}>
              <TableCell>{enrollment.id}</TableCell>
              <TableCell>{enrollment.studentName}</TableCell>
              <TableCell>{enrollment.dni}</TableCell>
              <TableCell>{enrollment.classroom}</TableCell>
              <TableCell>
                <span className={`status-badge ${enrollment.status === 'pendiente' ? 'status-pendiente' : enrollment.status === 'aprobado' ? 'status-aprobado' : enrollment.status === 'inscrito' ? 'status-inscrito' : 'status-rechazado'}`}>
                  {enrollment.status === 'pendiente' ? 'Pendiente' :
                   enrollment.status === 'aprobado' ? 'Aprobado' :
                   enrollment.status === 'inscrito' ? 'Inscrito' :
                   'Rechazado'}
                </span>
              </TableCell>
              <TableCell>{enrollment.enrollmentDate}</TableCell>
              <TableCell>
                <div className="actions-cell">
                  <Button
                    variant="secondary"
                    size="small"
                    className="action-btn"
                    onClick={() => handleEdit(enrollment)}
                  >
                    Editar
                  </Button>
                  <Button variant="success" size="small" className="action-btn">Aprobar</Button>
                  <Button variant="danger" size="small" className="action-btn">Rechazar</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentEnrollment ? "Editar Inscripción" : "Agregar Inscripción"}
      >
        <FormGroup>
          <Input
            label="Nombre del Estudiante"
            name="studentName"
            value={formState.studentName}
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
          <select
            name="status"
            value={formState.status}
            onChange={handleChange}
            className="select-field"
          >
            <option value="pendiente">Pendiente</option>
            <option value="aprobado">Aprobado</option>
            <option value="inscrito">Inscrito</option>
            <option value="rechazado">Rechazado</option>
          </select>
        </FormGroup>
        <FormGroup>
          <Input
            label="Fecha de Inscripción"
            name="enrollmentDate"
            type="date"
            value={formState.enrollmentDate}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <div className="modal-footer">
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleSave}>Guardar</Button>
        </div>
      </Modal>
    </Card>
  );
};

export default Enrollments;