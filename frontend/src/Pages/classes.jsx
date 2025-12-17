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
import useIsMobile from '../hooks/useIsMobile';
import DataCardList from '../components/Organisms/DataCardList';
import ClassDetailModal from '../components/Organisms/ClassDetailModal';

const Classes = () => {
  const [classes, setClasses] = useState([
    { id: 1, name: 'Maternal A', capacity: 20, shift: 'Mañana', academicYear: 2024, ageGroup: 3 },
    { id: 2, name: 'Maternal B', capacity: 18, shift: 'Tarde', academicYear: 2024, ageGroup: 3 },
    { id: 3, name: 'Jardín A', capacity: 22, shift: 'Mañana', academicYear: 2024, ageGroup: 4 },
    { id: 4, name: 'Jardín B', capacity: 20, shift: 'Tarde', academicYear: 2024, ageGroup: 4 },
    { id: 5, name: 'Preescolar A', capacity: 25, shift: 'Completo', academicYear: 2024, ageGroup: 5 },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [currentClass, setCurrentClass] = useState(null);
  const [detailClass, setDetailClass] = useState(null);
  const [formState, setFormState] = useState({
    name: '',
    capacity: '',
    shift: 'Mañana',
    academicYear: new Date().getFullYear(),
    ageGroup: ''
  });

  // Función para normalizar texto (eliminar acentos y convertir a minúsculas)
  const normalizeText = (text) => {
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u0386]/g, '');
  };

  const filteredClasses = classes.filter(classItem =>
    normalizeText(classItem.name).includes(normalizeText(searchTerm)) ||
    normalizeText(classItem.shift).includes(normalizeText(searchTerm))
  );

  const handleEdit = (classItem) => {
    setCurrentClass(classItem);
    setFormState({
      name: classItem.name,
      capacity: classItem.capacity,
      shift: classItem.shift,
      academicYear: classItem.academicYear,
      ageGroup: classItem.ageGroup
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    // Actualizar la clase en la lista
    const updatedClasses = classes.map(classItem =>
      classItem.id === currentClass.id
        ? { ...classItem, ...formState }
        : classItem
    );
    setClasses(updatedClasses);
    setIsModalOpen(false);
  };

  const handleAdd = () => {
    setCurrentClass(null);
    setFormState({
      name: '',
      capacity: '',
      shift: 'Mañana',
      academicYear: new Date().getFullYear(),
      ageGroup: ''
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

  const handleView = (classItem) => {
    setDetailClass(classItem);
    setIsDetailOpen(true);
  };

  const isMobile = useIsMobile();

  if (isMobile) {
    const cardFields = [
      { key: 'capacity', label: 'Capacidad' },
      { key: 'shift', label: 'Turno' },
      { key: 'academicYear', label: 'Año Académico' },
      { key: 'ageGroup', label: 'Grupo de Edad' },
    ];

    return (
      <>
        <Card>
          <Text variant="h1">Clases</Text>

          <div className="classes-header">
            <Button variant="primary" onClick={handleAdd}>Agregar Clase</Button>
            <Input
              type="text"
              placeholder="Buscar clases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <DataCardList
            items={filteredClasses}
            title="Clases"
            fields={cardFields}
            onEdit={handleEdit}
            onDelete={() => { }}
            onAdd={handleAdd}
            onItemSelect={handleView}
            itemTitleKey="name"
          />
        </Card>

        <ClassDetailModal classItem={detailClass} isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} />
      </>
    );
  }

  return (
    <Card>
      <Text variant="h1">Clases</Text>

      <div className="classes-header">
        <Button variant="primary" onClick={handleAdd}>Agregar Clase</Button>
        <Input
          type="text"
          placeholder="Buscar clases..."
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
            <TableCell as="th">Capacidad</TableCell>
            <TableCell as="th">Turno</TableCell>
            <TableCell as="th">Año Académico</TableCell>
            <TableCell as="th">Grupo de Edad</TableCell>
            <TableCell as="th">Acciones</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredClasses.map(classItem => (
            <TableRow key={classItem.id}>
              <TableCell>{classItem.id}</TableCell>
              <TableCell>{classItem.name}</TableCell>
              <TableCell>{classItem.capacity}</TableCell>
              <TableCell>{classItem.shift}</TableCell>
              <TableCell>{classItem.academicYear}</TableCell>
              <TableCell>{classItem.ageGroup} años</TableCell>
              <TableCell>
                <div className="actions-cell">
                  <Button
                    variant="primary"
                    size="small"
                    className="action-btn"
                    onClick={() => handleView(classItem)}
                  >
                    Ver Detalle
                  </Button>
                  <Button
                    variant="secondary"
                    size="small"
                    className="action-btn"
                    onClick={() => handleEdit(classItem)}
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
        title={currentClass ? "Editar Clase" : "Agregar Clase"}
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
            label="Capacidad"
            name="capacity"
            type="number"
            value={formState.capacity}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <select
            name="shift"
            value={formState.shift}
            onChange={handleChange}
            className="select-field"
          >
            <option value="Mañana">Mañana</option>
            <option value="Tarde">Tarde</option>
            <option value="Completo">Completo</option>
          </select>
        </FormGroup>
        <FormGroup>
          <Input
            label="Año Académico"
            name="academicYear"
            type="number"
            value={formState.academicYear}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Input
            label="Grupo de Edad"
            name="ageGroup"
            type="number"
            value={formState.ageGroup}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <div className="modal-footer">
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleSave}>Guardar</Button>
        </div>
      </Modal>

      <ClassDetailModal classItem={detailClass} isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} />
    </Card>
  );
};

export default Classes;