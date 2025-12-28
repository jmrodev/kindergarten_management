export const classFields = [
    { key: 'id', label: 'ID', showInMobile: false, showInDesktop: true },
    { key: 'name', label: 'Nombre', showInMobile: false, showInDesktop: true }, // Mobile uses title
    { key: 'capacity', label: 'Capacidad', showInMobile: true, showInDesktop: true },
    { key: 'shift', label: 'Turno', showInMobile: true, showInDesktop: true },
    { key: 'academic_year', label: 'Año Académico', showInMobile: true, showInDesktop: true },
    {
        key: 'age_group',
        label: 'Edad (Real/Ideal)',
        showInMobile: true,
        showInDesktop: true,
        valueFn: (c) => {
            if (c.min_age_years && c.max_age_years) {
                const formatAge = (decimalYears) => {
                    const years = Math.floor(decimalYears);
                    const months = Math.round((decimalYears - years) * 12);
                    if (months === 12) return `${years + 1}a`;
                    if (months === 0) return `${years}a`;
                    return `${years}a ${months}m`;
                };
                return `${formatAge(c.min_age_years)} - ${formatAge(c.max_age_years)}`;
            }
            return c.age_group ? c.age_group : 'Sin definir';
        }
    },
    {
        key: 'teacher',
        label: 'Maestro',
        showInMobile: true,
        showInDesktop: true,
        valueFn: (c) => (c.teacher_first_name && c.teacher_surname) ? `${c.teacher_first_name} ${c.teacher_surname}` : 'Sin asignar'
    }
];
