// frontend/src/utils/classroomStatus.js

export const getClassroomStatus = (asignados, capacidad) => {
    if (asignados === 0) {
        return {
            estado: 'Vacía',
            variant: 'secondary',
            icon: 'block'
        };
    }
    
    if (asignados >= capacidad) {
        if (asignados > capacidad) {
            return {
                estado: 'Sobrepasada',
                variant: 'danger',
                icon: 'warning'
            };
        }
        return {
            estado: 'Completa',
            variant: 'warning',
            icon: 'groups'
        };
    }
    
    return {
        estado: 'Banca Disponible',
        variant: 'success',
        icon: 'check_circle'
    };
};

export const getAvailableSpaces = (asignados, capacidad) => {
    const disponibles = capacidad - asignados;
    return disponibles > 0 ? disponibles : 0;
};
