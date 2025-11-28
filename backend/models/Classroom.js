// backend/models/Classroom.js

class Classroom {
    constructor(id, name, capacity, shift = 'Mañana') {
        this.id = id;
        this.name = name;
        this.capacity = capacity;
        this.shift = shift;
    }

    // Optional: Add validation methods
    isValid() {
        return this.name && this.capacity > 0 && ['Mañana', 'Tarde', 'Ambos'].includes(this.shift);
    }

    static fromDbRow(row) {
        if (!row) return null;
        return new Classroom(
            row.id,
            row.name,
            row.capacity,
            row.shift
        );
    }

    toDbRow() {
        return {
            name: this.name,
            capacity: this.capacity,
            shift: this.shift
        };
    }

    // Serializar para el frontend (español)
    toJSON() {
        return {
            id: this.id,
            nombre: this.name,
            capacidad: this.capacity,
            turno: this.shift,
            asignados: this.assignedStudents || 0,
            maestros: this.teachers || null,
            cantidadMaestros: this.teachersCount || 0,
            maestroId: this.teacherId || this.teacherIds || ''
        };
    }
}

module.exports = Classroom;
