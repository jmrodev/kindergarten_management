// backend/models/ContactoEmergencia.js

class ContactoEmergencia {
    constructor(id, nombreCompleto, relacion, telefono) {
        this.id = id;
        this.nombreCompleto = nombreCompleto;
        this.relacion = relacion;
        this.telefono = telefono;
    }

    // Optional: Add validation methods
    isValid() {
        return this.nombreCompleto && this.relacion && this.telefono;
    }

    static fromDbRow(row) {
        if (!row) return null;
        return new ContactoEmergencia(
            row.id,
            row.nombre_completo,
            row.relacion,
            row.telefono
        );
    }

    toDbRow() {
        return {
            nombre_completo: this.nombreCompleto,
            relacion: this.relacion,
            telefono: this.telefono
        };
    }
}

module.exports = ContactoEmergencia;
