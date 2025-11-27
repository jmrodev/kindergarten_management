// backend/models/Classroom.js

class Classroom {
    constructor(id, name, capacity) {
        this.id = id;
        this.name = name;
        this.capacity = capacity;
    }

    // Optional: Add validation methods
    isValid() {
        return this.name && this.capacity > 0;
    }

    static fromDbRow(row) {
        if (!row) return null;
        return new Classroom(
            row.id,
            row.name,
            row.capacity
        );
    }

    toDbRow() {
        return {
            name: this.name,
            capacity: this.capacity
        };
    }

    // Serializar para el frontend (español)
    toJSON() {
        return {
            id: this.id,
            nombre: this.name,
            capacidad: this.capacity
        };
    }
}

module.exports = Classroom;
