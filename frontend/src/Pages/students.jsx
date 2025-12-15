import { useState } from 'react';
import Modal from '../components/Atoms/Modal';
import FormGroup from '../components/Molecules/FormGroup';
import Input from '../components/Atoms/Input';
import Button from '../components/Atoms/Button';
import useIsMobile from '../hooks/useIsMobile';
import DesktopStudents from '../components/Organisms/DesktopStudents';
import MobileStudents from '../components/Organisms/MobileStudents';

const Students = () => {
  const [students, setStudents] = useState([
    { id: 1, name: 'Juan Pérez', dni: '12345678', classroom: 'Maternal A', status: 'activo' },
    { id: 2, name: 'María García', dni: '87654321', classroom: 'Jardín B', status: 'activo' },
    { id: 3, name: 'Pedro López', dni: '11223344', classroom: 'Preescolar C', status: 'inactivo' },
    { id: 4, name: 'Ana Martínez', dni: '44332211', classroom: 'Maternal A', status: 'activo' },
    { id: 5, name: 'Luis Rodríguez', dni: '55667788', classroom: 'Jardín B', status: 'inactivo' },
    { id: 6, name: 'Carmen Sánchez', dni: '99887766', classroom: 'Preescolar C', status: 'activo' },
    { id: 7, name: 'Jorge Fernández', dni: '66778899', classroom: 'Maternal A', status: 'activo' },
    { id: 8, name: 'Lucía Gómez', dni: '33445566', classroom: 'Jardín B', status: 'inactivo' },
    { id: 9, name: 'Diego Díaz', dni: '22113344', classroom: 'Preescolar C', status: 'activo' },
    { id: 10, name: 'Sofía Torres', dni: '77889900', classroom: 'Maternal A', status: 'activo' },
    { id: 11, name: 'Miguel Ramírez', dni: '44556677', classroom: 'Jardín B', status: 'inactivo' },
    { id: 12, name: 'Valentina Flores', dni: '88990011', classroom: 'Preescolar C', status: 'activo' },
    { id: 13, name: 'Andrés Morales', dni: '11224455', classroom: 'Maternal A', status: 'activo' },
    { id: 14, name: 'Isabella Jiménez', dni: '66775544', classroom: 'Jardín B', status: 'inactivo' },
    { id: 15, name: 'Santiago Ruiz', dni: '33447788', classroom: 'Preescolar C', status: 'activo' },
    { id: 16, name: 'Camila Hernández', dni: '99001122', classroom: 'Maternal A', status: 'activo' },
    { id: 17, name: 'Matías Castro', dni: '55664433', classroom: 'Jardín B', status: 'inactivo' },
    { id: 18, name: 'Emma Vega', dni: '22334455', classroom: 'Preescolar C', status: 'activo' },
    { id: 19, name: 'Lucas Ortiz', dni: '77881100', classroom: 'Maternal A', status: 'activo' },
    { id: 20, name: 'Mía Silva', dni: '44557788', classroom: 'Jardín B', status: 'inactivo' }
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

  const normalizeText = (text) => {
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u0386]/g, '');
  };

  const filteredStudents = students.filter(student =>
    normalizeText(student.name).includes(normalizeText(searchTerm)) ||
    student.dni.includes(searchTerm)
  );

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
      name: student.name,
      dni: student.dni,
      classroom: student.classroom,
      status: student.status
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (currentStudent) {
      // Actualizar estudiante existente
      const updatedStudents = students.map(student =>
        student.id === currentStudent.id
          ? { ...student, ...formState }
          : student
      );
      setStudents(updatedStudents);
    } else {
      // Agregar nuevo estudiante
      const newStudent = {
        id: Math.max(...students.map(s => s.id), 0) + 1,
        ...formState
      };
      setStudents([...students, newStudent]);
    }
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

  const isMobile = useIsMobile();

  const handleDelete = (studentId) => {
    setStudents(prev => prev.filter(s => s.id !== studentId));
  };



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
    </>
  );
};

export default Students;
