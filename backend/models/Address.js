// backend/models/Direccion.js

class Direccion {
    constructor(id, calle, numero, ciudad, provincia, codigoPostal) {
        this.id = id;
        this.calle = calle;
        this.numero = numero;
        this.ciudad = ciudad;
        this.provincia = provincia;
        this.codigoPostal = codigoPostal;
    }

    // Optional: Add validation methods
    isValid() {
        return this.calle && this.numero && this.ciudad && this.provincia;
    }

    static fromDbRow(row) {
        if (!row) return null;
        return new Direccion(
            row.id,
            row.calle,
            row.numero,
            row.ciudad,
            row.provincia,
            row.codigo_postal
        );
    }

    toDbRow() {
        return {
            calle: this.calle,
            numero: this.numero,
            ciudad: this.ciudad,
            provincia: this.provincia,
            codigo_postal: this.codigoPostal
        };
    }
}

module.exports = Direccion;
