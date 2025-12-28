// models/Classroom.js


class Classroom {
  constructor(id, name, capacity, shift) {
    this.id = id;
    this.name = name;
    this.capacity = capacity;
    this.shift = shift;
  }

  isValid() {
    // Validar campos requeridos
    if (!this.name || !this.capacity) {
      return false;
    }

    // Validar que la capacidad sea un número positivo
    if (typeof this.capacity === 'number' && this.capacity <= 0) {
      return false;
    }

    // Validar que la capacidad sea un número si es string
    if (typeof this.capacity === 'string') {
      const capacityNum = parseInt(this.capacity);
      if (isNaN(capacityNum) || capacityNum <= 0) {
        return false;
      }
    }

    // Validar turno
    const validShifts = ['Mañana', 'Tarde', 'Completo'];
    if (this.shift && !validShifts.includes(this.shift)) {
      return false;
    }

    return true;
  }

  static fromDbRow(row) {
    return new Classroom(
      row.id,
      row.name,
      row.capacity,
      row.shift
    );
  }

  toDbRow() {
    return {
      id: this.id,
      name: this.name,
      capacity: this.capacity,
      shift: this.shift
    };
  }


}

module.exports = Classroom;