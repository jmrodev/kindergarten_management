export const userFields = [
    { key: 'id', label: 'ID', showInMobile: true, showInDesktop: true },
    {
        key: 'full_name',
        label: 'Nombre',
        showInMobile: false, // Mobile uses as title
        showInDesktop: true,
        valueFn: (u) => `${u.first_name} ${u.paternal_surname || ''} ${u.maternal_surname || ''}`
    },
    { key: 'dni', label: 'DNI', showInMobile: true, showInDesktop: true },
    { key: 'email', label: 'Email', showInMobile: true, showInDesktop: true },
    {
        key: 'role_name',
        label: 'Rol',
        showInMobile: true,
        showInDesktop: true,
        render: (value) => <span className="role-badge">{value || 'Sin rol'}</span>
    },
    {
        key: 'is_active',
        label: 'Estado',
        showInMobile: true,
        showInDesktop: true,
        valueFn: (u) => u.is_active ? 'Activo' : 'Inactivo', // For simple text display
        render: (value, item) => (
            <span className={`status-badge ${item.is_active ? 'status-active' : 'status-inactive'}`}>
                {item.is_active ? 'Activo' : 'Inactivo'}
            </span>
        )
    }
];
