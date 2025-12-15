import { useState, useEffect } from 'react';
import Modal from '../components/Atoms/Modal';
import FormGroup from '../components/Molecules/FormGroup';
import Input from '../components/Atoms/Input';
import Button from '../components/Atoms/Button';
import Loading from '../components/Atoms/Loading';
import ErrorMessage from '../components/Atoms/ErrorMessage';
import useIsMobile from '../hooks/useIsMobile';
import DesktopUsers from '../components/Organisms/DesktopUsers';
import MobileUsers from '../components/Organisms/MobileUsers';
import usersService from '../services/usersService';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [formState, setFormState] = useState({
        first_name: '',
        paternal_surname: '',
        maternal_surname: '',
        dni: '',
        email: '',
        role_id: '',
        phone: '',
        is_active: true
    });

    // Cargar usuarios y roles al montar el componente
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            const [usersResponse, rolesResponse] = await Promise.all([
                usersService.getAll(),
                usersService.getRoles()
            ]);
            // Backend returns { status: 'success', data: [...] } or plain array
            setUsers(Array.isArray(usersResponse) ? usersResponse : (usersResponse.data || []));
            setRoles(Array.isArray(rolesResponse) ? rolesResponse : (rolesResponse.data || []));
        } catch (err) {
            console.error('Error loading users:', err);
            setError(err.message || 'Error al cargar usuarios');
        } finally {
            setLoading(false);
        }
    };

    const normalizeText = (text) => {
        return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u0386]/g, '');
    };

    const filteredUsers = users.filter(user => {
        const fullName = `${user.first_name} ${user.paternal_surname || ''} ${user.maternal_surname || ''}`.toLowerCase();
        return normalizeText(fullName).includes(normalizeText(searchTerm)) ||
            (user.dni && user.dni.includes(searchTerm)) ||
            (user.email && normalizeText(user.email).includes(normalizeText(searchTerm)));
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEdit = (user) => {
        setCurrentUser(user);
        setFormState({
            first_name: user.first_name || '',
            paternal_surname: user.paternal_surname || '',
            maternal_surname: user.maternal_surname || '',
            dni: user.dni || '',
            email: user.email || '',
            role_id: user.role_id || '',
            phone: user.phone || '',
            is_active: user.is_active !== undefined ? user.is_active : true
        });
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        try {
            if (currentUser) {
                // Actualizar usuario existente
                await usersService.update(currentUser.id, formState);
            } else {
                // Crear nuevo usuario
                await usersService.create(formState);
            }
            // Recargar lista
            await loadData();
            setIsModalOpen(false);
        } catch (err) {
            console.error('Error saving user:', err);
            setError(err.message || 'Error al guardar usuario');
        }
    };

    const handleAdd = () => {
        setCurrentUser(null);
        setFormState({
            first_name: '',
            paternal_surname: '',
            maternal_surname: '',
            dni: '',
            email: '',
            role_id: roles.length > 0 ? roles[0].id : '',
            phone: '',
            is_active: true
        });
        setIsModalOpen(true);
    };

    const isMobile = useIsMobile();

    const handleDelete = async (userId) => {
        if (!window.confirm('¿Está seguro de eliminar este usuario?')) return;

        try {
            await usersService.delete(userId);
            // Recargar lista
            await loadData();
        } catch (err) {
            console.error('Error deleting user:', err);
            setError(err.message || 'Error al eliminar usuario');
        }
    };

    if (loading) return <Loading message="Cargando usuarios..." />;
    if (error) return <ErrorMessage message={error} onRetry={loadData} />;

    return (
        <>
            {isMobile ? (
                <MobileUsers
                    users={filteredUsers}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                />
            ) : (
                <DesktopUsers
                    users={filteredUsers}
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
                title={currentUser ? "Editar Usuario" : "Agregar Usuario"}
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
                        label="Apellido Paterno"
                        name="paternal_surname"
                        value={formState.paternal_surname}
                        onChange={handleChange}
                        required
                    />
                </FormGroup>
                <FormGroup>
                    <Input
                        label="Apellido Materno"
                        name="maternal_surname"
                        value={formState.maternal_surname}
                        onChange={handleChange}
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
                        required
                    >
                        <option value="">Seleccionar rol</option>
                        {roles.map(role => (
                            <option key={role.id} value={role.id}>{role.role_name}</option>
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
        </>
    );
};

export default Users;
