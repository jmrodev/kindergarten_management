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

const Students = () => {
  const [students, setStudents] = useState([
    { id: 1, name: 'Juan Pérez', dni: '12345678', classroom: 'Maternal A', status: 'activo' },
    { id: 2, name: 'María García', dni: '87654321', classroom: 'Jardín B', status: 'activo' },
    { id: 3, name: 'Pedro López', dni: '11223344', classroom: 'Preescolar C', status: 'inactivo' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [formState, setFormState] = useState({
    name: '',
    dni: '',
    classroom: '',
    status: 'activo'
  });

  // Función para normalizar texto (eliminar acentos y convertir a minúsculas)
  const normalizeText = (text) => {
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u0386]/g, '');
  };

  const filteredStudents = students.filter(student =>
    normalizeText(student.name).includes(normalizeText(searchTerm)) ||
    student.dni.includes(searchTerm)
  );

  const handleEdit = (student) => {
    setCurrentStudent(student);
    setFormState({
      name: student.name,
      dni: student.dni,
      classroom: student.classroom,
      status: student.status
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    // Actualizar el estudiante en la lista
    const updatedStudents = students.map(student =>
      student.id === currentStudent.id
        ? { ...student, ...formState }
        : student
    );
    setStudents(updatedStudents);
    setIsModalOpen(false);
  };

  const handleAdd = () => {
    setCurrentStudent(null);
    setFormState({
      name: '',
      dni: '',
      classroom: '',
      status: 'activo'
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
      <Text variant="h1">Estudiantes</Text>

      <div className="students-header">
        <Button variant="primary" onClick={handleAdd}>Agregar Estudiante</Button>
        <Input
          type="text"
          placeholder="Buscar estudiantes..."
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
            <TableCell as="th">Salón</TableCell>
            <TableCell as="th">Estado</TableCell>
            <TableCell as="th">Acciones</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredStudents.map(student => (
            <TableRow key={student.id}>
              <TableCell>{student.id}</TableCell>
              <TableCell>{student.name}</TableCell>
              <TableCell>{student.dni}</TableCell>
              <TableCell>{student.classroom}</TableCell>
              <TableCell>
                <span className={`status-badge ${student.status === 'activo' ? 'status-active' : 'status-inactive'}`}>
                  {student.status}
                </span>
              </TableCell>
              <TableCell>
                <div className="actions-cell">
                  <Button
                    variant="secondary"
                    size="small"
                    className="action-btn"
                    onClick={() => handleEdit(student)}
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
        title={currentStudent ? "Editar Estudiante" : "Agregar Estudiante"}
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
            label="Salón"
            name="classroom"
            value={formState.classroom}
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
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
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

export default Students;