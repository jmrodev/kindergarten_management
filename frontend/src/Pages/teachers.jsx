import { useState } from 'react';
import Card from '../components/Atoms/Card';
import Text from '../components/Atoms/Text';
import Button from '../components/Atoms/Button';
import Input from '../components/Atoms/Input';
import Table from '../components/Atoms/Table';
import TableRow from '../components/Atoms/TableRow';
import TableCell from '../components/Atoms/TableCell';
import TableHeader from '../components/Atoms/TableHeader';
import TableBody from '../components/Atoms/TableBody';
import Modal from '../components/Atoms/Modal';
import FormGroup from '../components/Molecules/FormGroup';

const Teachers = () => {
  const [teachers, setTeachers] = useState([
    { id: 1, name: 'Ana Rodríguez', dni: '23456789', email: 'ana@jardin.com', classroom: 'Maternal A', specialty: 'Educación Inicial' },
    { id: 2, name: 'Carlos Martínez', dni: '34567890', email: 'carlos@jardin.com', classroom: 'Jardín B', specialty: 'Educación Física' },
    { id: 3, name: 'Laura Sánchez', dni: '45678901', email: 'laura@jardin.com', classroom: 'Preescolar C', specialty: 'Música' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState(null);
  const [formState, setFormState] = useState({
    name: '',
    dni: '',
    email: '',
    classroom: '',
    specialty: ''
  });

  // Función para normalizar texto (eliminar acentos y convertir a minúsculas)
  const normalizeText = (text) => {
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u0386]/g, '');
  };

  const filteredTeachers = teachers.filter(teacher =>
    normalizeText(teacher.name).includes(normalizeText(searchTerm)) ||
    teacher.dni.includes(searchTerm) ||
    normalizeText(teacher.email).includes(normalizeText(searchTerm))
  );

  const handleEdit = (teacher) => {
    setCurrentTeacher(teacher);
    setFormState({
      name: teacher.name,
      dni: teacher.dni,
      email: teacher.email,
      classroom: teacher.classroom,
      specialty: teacher.specialty
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    // Actualizar el maestro en la lista
    const updatedTeachers = teachers.map(teacher =>
      teacher.id === currentTeacher.id
        ? { ...teacher, ...formState }
        : teacher
    );
    setTeachers(updatedTeachers);
    setIsModalOpen(false);
  };

  const handleAdd = () => {
    setCurrentTeacher(null);
    setFormState({
      name: '',
      dni: '',
      email: '',
      classroom: '',
      specialty: ''
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
      <Text variant="h1">Maestros</Text>

      <div className="teachers-header">
        <Button variant="primary" onClick={handleAdd}>Agregar Maestro</Button>
        <Input
          type="text"
          placeholder="Buscar maestros..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <Table striped bordered responsive>
        <TableHeader>
          <TableRow>
            <TableCell as="th">ID</TableCell>
            <TableCell as="th">Nombre</TableCell>
            <TableCell as="th">DNI</TableCell>
            <TableCell as="th">Email</TableCell>
            <TableCell as="th">Salón Asignado</TableCell>
            <TableCell as="th">Especialidad</TableCell>
            <TableCell as="th">Acciones</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTeachers.map(teacher => (
            <TableRow key={teacher.id}>
              <TableCell>{teacher.id}</TableCell>
              <TableCell>{teacher.name}</TableCell>
              <TableCell>{teacher.dni}</TableCell>
              <TableCell>{teacher.email}</TableCell>
              <TableCell>{teacher.classroom}</TableCell>
              <TableCell>{teacher.specialty}</TableCell>
              <TableCell>
                <div className="actions-cell">
                  <Button
                    variant="secondary"
                    size="small"
                    className="action-btn"
                    onClick={() => handleEdit(teacher)}
                  >
                    Editar
                  </Button>
                  <Button variant="danger" size="small" className="action-btn">Eliminar</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentTeacher ? "Editar Maestro" : "Agregar Maestro"}
      >
        <FormGroup>
          <Input
            label="Nombre"
            name="name"
            value={formState.name}
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
            label="Email"
            name="email"
            type="email"
            value={formState.email}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Input
            label="Salón Asignado"
            name="classroom"
            value={formState.classroom}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Input
            label="Especialidad"
            name="specialty"
            value={formState.specialty}
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

export default Teachers;