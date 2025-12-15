import Card from '../Atoms/Card';
import Input from '../Atoms/Input';
import DataCardList from '../Organisms/DataCardList';

const MobileUsers = ({ users, onEdit, onDelete, searchTerm, setSearchTerm }) => {
    // Campos para la vista de cards en móvil
    const cardFields = [
        { key: 'id', label: 'ID' },
        { key: 'dni', label: 'DNI' },
        { key: 'email', label: 'Email' },
        { key: 'role_name', label: 'Rol' },
        { key: 'status_display', label: 'Estado' }
    ];  // Función para combinar nombre completo
    const usersWithFullName = users.map(u => ({
        ...u,
        full_name: `${u.first_name} ${u.paternal_surname || ''} ${u.maternal_surname || ''}`.trim(),
        status_display: u.is_active ? 'Activo' : 'Inactivo'
    })); return (
        <Card>
            <div className="students-header">
                {/* No mostrar botón de CRUD en móvil: vista únicamente lectura */}
                <Input
                    type="text"
                    placeholder="Buscar usuarios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            <DataCardList
                items={usersWithFullName}
                title="Usuarios"
                fields={cardFields}
                onEdit={onEdit}
                onDelete={onDelete}
                itemTitleKey="full_name"
                showHeader={false}
            />
        </Card>
    );
};

export default MobileUsers;
