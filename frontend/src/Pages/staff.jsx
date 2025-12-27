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
import MobileStaff from '../components/Organisms/MobileStaff';
import StaffDetailModal from '../components/Organisms/StaffDetailModal';
import classesService from '../services/classesService';
import usersService from '../services/usersService';
import Pagination from '../components/Atoms/Pagination';
import '../components/Organisms/organisms.css';

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  const [roles, setRoles] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [currentStaff, setCurrentStaff] = useState(null);
  const [detailStaff, setDetailStaff] = useState(null);
  const [availableClassrooms, setAvailableClassrooms] = useState([]);

  const [formState, setFormState] = useState({
    first_name: '',
    paternal_surname: '',
    dni: '',
    email: '',
    classroom_id: '',
    phone: '',
    role_id: '',
    is_active: true
  });

  useEffect(() => {
    fetchRoles();
    loadStaff();
  }, [page]);

  const fetchRoles = async () => {
    try {
      const rolesData = await usersService.getRoles();
      // Ensure rolesData is an array
      setRoles(Array.isArray(rolesData) ? rolesData : (rolesData.data || []));
    } catch (err) {
      console.error("Error fetching roles", err);
    }
  };

  const loadStaff = async () => {
    try {
      setLoading(true);
      const response = await usersService.getAll({ page, limit });

      let allStaff = [];
      if (response.data) {
        allStaff = response.data;
        if (response.meta) setTotalPages(response.meta.totalPages);
      } else if (Array.isArray(response)) {
        allStaff = response;
      }

      setStaff(allStaff);
    } catch (err) {
      console.error("Error loading staff", err);
    } finally {
      setLoading(false);
    }
  };

  // To fetch available classrooms
  const loadAvailableClassrooms = async (currentClassroomId = null) => {
    try {
      const response = await classesService.getAll({ unassignedOnly: true, limit: 100 });
      let allOptions = response.data || [];

      // If we have a current classroom that is assigned to this staff, we must fetch it 
      if (currentClassroomId) {
        try {
          const currentClass = await classesService.getById(currentClassroomId);
          const classData = currentClass.data || currentClass;
          if (classData && !allOptions.find(c => c.id === classData.id)) {
            allOptions.push(classData);
          }
        } catch (e) {
          console.error("Error fetching current classroom for edit", e);
        }
      }
      setAvailableClassrooms(allOptions);
    } catch (err) {
      console.error("Error loading classrooms", err);
    }
  };

  const normalizeText = (text) => {
    return text ? text.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u0386]/g, '') : '';
  };

  const filteredStaff = staff.filter(person => {
    const fullName = `${person.first_name} ${person.paternal_surname}`;
    return normalizeText(fullName).includes(normalizeText(searchTerm)) ||
      (person.dni && person.dni.includes(searchTerm)) ||
      (person.email && normalizeText(person.email).includes(normalizeText(searchTerm)));
  });

  const handleEdit = async (person) => {
    setCurrentStaff(person);
    setFormState({
      first_name: person.first_name,
      paternal_surname: person.paternal_surname,
      dni: person.dni,
      email: person.email,
      classroom_id: person.classroom_id || '',
      phone: person.phone || '',
      role_id: person.role_id || '',
      is_active: person.is_active !== undefined ? person.is_active : true
    });

    await loadAvailableClassrooms(person.classroom_id);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...formState
      };

      // Default role if none selected? force selection
      if (!payload.role_id) {
        alert("Por favor seleccione un rol");
        return;
      }

      if (currentStaff) {
        await usersService.update(currentStaff.id, payload);

        // Update classroom assignment if changed
        if (payload.classroom_id && payload.classroom_id !== currentStaff.classroom_id) {
          await classesService.update(payload.classroom_id, { teacher_id: currentStaff.id });
        }
      } else {
        const newStaff = await usersService.create(payload);

        // If assignment to classroom is requested for new staff
        if (payload.classroom_id && newStaff && (newStaff.id || newStaff.data?.id)) {
          const newId = newStaff.id || newStaff.data?.id;
          await classesService.update(payload.classroom_id, { teacher_id: newId });
        }
      }

      setIsModalOpen(false);
      await loadStaff();
    } catch (e) {
      console.error("Error saving staff", e);
      alert("Error al guardar personal: " + (e.message || "Error desconocido"));
    }
  };

  const handleAdd = async () => {
    setCurrentStaff(null);
    setFormState({
      first_name: '',
      paternal_surname: '',
      dni: '',
      email: '',
      classroom_id: '',
      phone: '',
      role_id: '',
      is_active: true
    });

    await loadAvailableClassrooms();
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const confirmDelete = async (id) => {
    if (window.confirm("¿Está seguro que desea eliminar este miembro del personal?")) {
      try {
        await usersService.delete(id);
        loadStaff();
      } catch (e) {
        console.error(e);
        alert("Error al eliminar");
      }
    }
  };

  const handleView = (person) => {
    setDetailStaff(person);
    setIsDetailOpen(true);
  };

  const isMobile = useIsMobile();

  const displayStaff = filteredStaff.map(t => ({
    ...t,
    name: `${t.first_name} ${t.paternal_surname}`,
    classroom: t.classroom_name || 'Sin Asignar',
    specialty: t.phone
  }));

  if (isMobile) {
    return (
      <>
        <MobileStaff
          staff={displayStaff}
          onEdit={handleEdit}
          onDelete={(t) => confirmDelete(t.id)}
          onAdd={handleAdd}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onView={handleView}
        />
        <StaffDetailModal staff={detailStaff} isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} />
      </>
    );
  }

  return (
    <Card>
      <Text variant="h1">Personal</Text>

      <div className="teachers-header">
        <Button variant="primary" onClick={handleAdd}>Agregar Personal</Button>
        <Input
          type="text"
          placeholder="Buscar personal..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <Table striped bordered responsive responsiveStack>
        <TableHeader>
          <TableRow>
            <TableCell as="th">ID</TableCell>
            <TableCell as="th">Nombre</TableCell>
            <TableCell as="th">Rol</TableCell>
            <TableCell as="th">DNI</TableCell>
            <TableCell as="th">Email</TableCell>
            <TableCell as="th">Salón Asignado</TableCell>
            <TableCell as="th">Teléfono</TableCell>
            <TableCell as="th">Estado</TableCell>
            <TableCell as="th">Acciones</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredStaff.map(person => (
            <TableRow key={person.id}>
              <TableCell>{person.id}</TableCell>
              <TableCell>{person.first_name} {person.paternal_surname}</TableCell>
              <TableCell>{person.role_name}</TableCell>
              <TableCell>{person.dni}</TableCell>
              <TableCell>{person.email}</TableCell>
              <TableCell>{person.classroom_name || 'Sin Asignar'}</TableCell>
              <TableCell>{person.phone || 'N/A'}</TableCell>
              <TableCell>{person.is_active ? 'Activo' : 'Inactivo'}</TableCell>
              <TableCell>
                <div className="actions-cell">
                  <button
                    className="icon-action-btn view-btn"
                    onClick={() => handleView(person)}
                    title="Ver Detalle"
                  >
                    👁️
                  </button>
                  <button
                    className="icon-action-btn edit-btn"
                    onClick={() => handleEdit(person)}
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button
                    className="icon-action-btn delete-btn"
                    onClick={() => confirmDelete(person.id)}
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

      {!loading && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentStaff ? "Editar Personal" : "Agregar Personal"}
      >
        <FormGroup>
          <Input
            label="Nombre"
            name="first_name"
            value={formState.first_name}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Input
            label="Apellido"
            name="paternal_surname"
            value={formState.paternal_surname}
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
            label="Teléfono"
            name="phone"
            value={formState.phone}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <label>Rol</label>
          <select
            name="role_id"
            value={formState.role_id}
            onChange={handleChange}
            className="select-field"
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
            required
          >
            <option value="">-- Seleccionar Rol --</option>
            {roles.map(r => (
              <option key={r.id} value={r.id}>{r.role_name}</option>
            ))}
          </select>
        </FormGroup>
        <FormGroup>
          <label>Salón Asignado</label>
          <select
            name="classroom_id"
            value={formState.classroom_id}
            onChange={handleChange}
            className="select-field"
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
          >
            <option value="">-- Sin Asignar --</option>
            {availableClassrooms.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </FormGroup>
        <FormGroup>
          <label>Estado</label>
          <select
            name="is_active"
            value={formState.is_active ? '1' : '0'}
            onChange={(e) => setFormState(prev => ({ ...prev, is_active: e.target.value === '1' }))}
            className="select-field"
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
          >
            <option value="1">Activo</option>
            <option value="0">Inactivo</option>
          </select>
        </FormGroup>

        <div className="modal-footer">
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleSave}>Guardar</Button>
        </div>
      </Modal>

      <StaffDetailModal staff={detailStaff} isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} />
    </Card>
  );
};

export default Staff;