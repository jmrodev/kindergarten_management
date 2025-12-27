export const classFields = [
    { key: 'id', label: 'ID', showInMobile: false, showInDesktop: true },
    { key: 'name', label: 'Nombre', showInMobile: false, showInDesktop: true }, // Mobile uses title
    { key: 'capacity', label: 'Capacidad', showInMobile: true, showInDesktop: true },
    { key: 'shift', label: 'Turno', showInMobile: true, showInDesktop: true },
    { key: 'academic_year', label: 'Año Académico', showInMobile: true, showInDesktop: true },
    { key: 'age_group', label: 'Grupo de Edad', showInMobile: true, showInDesktop: true, valueFn: (c) => c.age_group ? `${c.age_group} años` : 'N/A' },
    {
        key: 'teacher',
        label: 'Maestro',
        showInMobile: true,
        showInDesktop: true,
        valueFn: (c) => (c.teacher_first_name && c.teacher_surname) ? `${c.teacher_first_name} ${c.teacher_surname}` : 'Sin asignar'
    }
];
