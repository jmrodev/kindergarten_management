export const studentFields = [
    {
        key: 'dni',
        label: 'DNI',
        showInMobile: true,
        showInDesktop: true
    },
    {
        key: 'full_name',
        label: 'Nombre Completo',
        showInMobile: false, // Mobile usually constructs this or uses it as title
        showInDesktop: true,
        valueFn: (student) => `${student.first_name} ${student.paternal_surname || ''} ${student.maternal_surname || ''}`
    },
    {
        key: 'classroom_name',
        label: 'Salón',
        showInMobile: true,
        showInDesktop: true
    },
    {
        key: 'address',
        label: 'Dirección',
        showInMobile: true,
        showInDesktop: true,
        valueFn: (student) => {
            if (!student.street && !student.number) return '—';
            return `${student.street || ''} ${student.number || ''} ${student.city ? '(' + student.city + ')' : ''}`.trim();
        }
    },
    {
        key: 'status',
        label: 'Estado',
        showInMobile: true,
        showInDesktop: true,
        render: (value) => (
            <span className={`status-badge status-${(value || 'pendiente').toLowerCase()}`}>
                {value || 'N/A'}
            </span>
        )
    },
    // Mobile specific extra fields
    {
        key: 'pediatrician_name',
        label: 'Pediatra',
        showInMobile: true,
        showInDesktop: false // Could be added if desired
    },
    {
        key: 'pediatrician_phone',
        label: 'Tel. Pediatra',
        type: 'phone',
        showInMobile: true,
        showInDesktop: false
    },
    {
        key: 'guardian_email',
        label: 'Email Tutor',
        type: 'email',
        showInMobile: true,
        showInDesktop: false,
        valueFn: (s) => s.guardian_email || s.emergency_contact?.email_optional
    },
    {
        key: 'guardian_phone',
        label: 'Tel. Tutor',
        type: 'phone',
        showInMobile: true,
        showInDesktop: false,
        valueFn: (s) => s.guardian_phone || s.emergency_contact?.phone
    }
];
