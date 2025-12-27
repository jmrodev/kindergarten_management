import { useState, useEffect } from 'react';
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
import { classFields } from '../config/fields/classFields';
import classesService from '../services/classesService';
import usersService from '../services/usersService';
import Loading from '../components/Atoms/Loading';
import ErrorMessage from '../components/Atoms/ErrorMessage';
import Pagination from '../components/Atoms/Pagination';
import '../components/Organisms/organisms.css';

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [currentClass, setCurrentClass] = useState(null);
  const [detailClass, setDetailClass] = useState(null);
  const [formState, setFormState] = useState({
    name: '',
    capacity: '',
    shift: 'Mañana',
    academic_year: new Date().getFullYear(),
    age_group: '',
    maestroId: ''
  });

  useEffect(() => {
    loadClasses();
    loadTeachers();
  }, [page]);

  const loadClasses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await classesService.getAll({ page, limit });

      if (response.data && response.meta) {
        setClasses(response.data);
        setTotalPages(response.meta.totalPages);
      } else {
        setClasses(Array.isArray(response) ? response : (response.data || []));
      }
    } catch (err) {
      console.error('Error loading classes:', err);
      setError(err.message || 'Error al cargar clases');
    } finally {
      setLoading(false);
    }
  };

  const loadTeachers = async () => {
    try {
      // Fetch all staff and filtering client-side for now as we want specific roles
      // Improved: Could strictly filter by role ID if we knew it
      const response = await usersService.getAll({ limit: 100 });
      const allStaff = response.data || (Array.isArray(response) ? response : []);
      // Filter for Teachers or similar roles (adjust based on your exact role names)
      const teacherList = allStaff.filter(s =>
        s.role_name === 'Teacher' ||
        s.role_name === 'Docente' ||
        s.role_name === 'Maestro'
      );
      setTeachers(teacherList);
    } catch (err) {
      console.error('Error loading teachers:', err);
    }
  };

  // Función para normalizar texto (eliminar acentos y convertir a minúsculas)
  const normalizeText = (text) => {
    return text ? text.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u0386]/g, '') : '';
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
      academic_year: classItem.academic_year || classItem.academicYear, // handle both casing just in case
      age_group: classItem.age_group || classItem.ageGroup,
      maestroId: classItem.teacher_id || ''
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (currentClass) {
        await classesService.update(currentClass.id, formState);
      } else {
        await classesService.create(formState);
      }
      await loadClasses();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving class:', err);
      // Could add a toast or error state here
      alert('Error al guardar la clase');
    }
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState(null);

  const confirmDelete = (classItem) => {
    setClassToDelete(classItem);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!classToDelete) return;
    try {
      await classesService.delete(classToDelete.id);
      await loadClasses();
      setIsDeleteModalOpen(false);
      setClassToDelete(null);
    } catch (err) {
      console.error('Error deleting class:', err);
      alert(err.message || 'Error al eliminar la clase');
    }
  };

  const handleAdd = () => {
    setCurrentClass(null);
    setFormState({
      name: '',
      capacity: '',
      shift: 'Mañana',
      academic_year: new Date().getFullYear(),
      age_group: '',
      maestroId: ''
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
    const cardFields = classFields.filter(f => f.showInMobile);

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
            onDelete={confirmDelete}
            onAdd={handleAdd}
            onItemSelect={handleView}
            itemTitleKey="name"
          />
        </Card>

        <ClassDetailModal classItem={detailClass} isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} />

        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Confirmar Eliminación"
        >
          <div style={{ padding: '20px' }}>
            <p>¿Está seguro que desea eliminar la clase <strong>{classToDelete?.name}</strong>?</p>
            <p>Esta acción no se puede deshacer.</p>
            <div className="modal-footer">
              <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>Cancelar</Button>
              <Button variant="danger" onClick={handleDelete}>Eliminar</Button>
            </div>
          </div>
        </Modal>
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
            {classFields.filter(f => f.showInDesktop).map(field => (
              <TableCell as="th" key={field.key}>{field.label}</TableCell>
            ))}
            <TableCell as="th">Acciones</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredClasses.map(classItem => (
            <TableRow key={classItem.id}>
              {classFields.filter(f => f.showInDesktop).map(field => (
                <TableCell key={field.key}>
                  {field.render
                    ? field.render(field.valueFn ? field.valueFn(classItem) : classItem[field.key], classItem)
                    : (field.valueFn ? field.valueFn(classItem) : (classItem[field.key] || 'N/A'))
                  }
                </TableCell>
              ))}
              <TableCell>
                <div className="actions-cell">
                  <button
                    className="icon-action-btn view-btn"
                    onClick={() => handleView(classItem)}
                    title="Ver Detalle"
                  >
                    👁️
                  </button>
                  <button
                    className="icon-action-btn edit-btn"
                    onClick={() => handleEdit(classItem)}
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button
                    className="icon-action-btn delete-btn"
                    onClick={() => confirmDelete(classItem)}
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      {!loading && !error && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

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
          <label>Maestro Asignado</label>
          <select
            name="maestroId"
            value={formState.maestroId}
            onChange={handleChange}
            className="select-field"
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
          >
            <option value="">-- Seleccione un Maestro --</option>
            {teachers.map(teacher => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.first_name} {teacher.paternal_surname}
              </option>
            ))}
          </select>
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
            name="academic_year"
            type="number"
            value={formState.academic_year}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Input
            label="Grupo de Edad"
            name="age_group"
            type="number"
            value={formState.age_group}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <div className="modal-footer">
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleSave}>Guardar</Button>
        </div>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmar Eliminación"
      >
        <div style={{ padding: '20px' }}>
          <p>¿Está seguro que desea eliminar la clase <strong>{classToDelete?.name}</strong>?</p>
          <p>Esta acción no se puede deshacer.</p>
          <div className="modal-footer">
            <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>Cancelar</Button>
            <Button variant="danger" onClick={handleDelete}>Eliminar</Button>
          </div>
        </div>
      </Modal>

      <ClassDetailModal classItem={detailClass} isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} />
    </Card>
  );
};

export default Classes;