// backend/models/Guardian.js
class Guardian {
    constructor(
        id,
        firstName,
        middleName,
        paternalSurname,
        maternalSurname,
        preferredSurname,
        addressId,
        phone,
        email,
        authorizedPickup,
        authorizedChange
    ) {
        this.id = id;
        this.firstName = firstName;
        this.middleName = middleName;
        this.paternalSurname = paternalSurname;
        this.maternalSurname = maternalSurname;
        this.preferredSurname = preferredSurname;
        this.addressId = addressId;
        this.phone = phone;
        this.email = email;
        this.authorizedPickup = authorizedPickup;
        this.authorizedChange = authorizedChange;
    }

    isValid() {
        return (
            this.firstName &&
            this.paternalSurname &&
            this.maternalSurname &&
            this.phone
        );
    }

    static fromDbRow(row) {
        if (!row) return null;
        return new Guardian(
            row.id,
            row.first_name,
            row.middle_name_optional,
            row.paternal_surname,
            row.maternal_surname,
            row.preferred_surname,
            row.address_id,
            row.phone,
            row.email_optional,
            row.authorized_pickup,
            row.authorized_change
        );
    }

    toDbRow() {
        return {
            first_name: this.firstName,
            middle_name_optional: this.middleName,
            paternal_surname: this.paternalSurname,
            maternal_surname: this.maternalSurname,
            preferred_surname: this.preferredSurname,
            address_id: this.addressId,
            phone: this.phone,
            email_optional: this.email,
            authorized_pickup: this.authorizedPickup || false,
            authorized_change: this.authorizedChange || false
        };
    }

    toJSON() {
        return {
            id: this.id,
            nombre: this.firstName,
            segundoNombre: this.middleName,
            apellidoPaterno: this.paternalSurname,
            apellidoMaterno: this.maternalSurname,
            apellidoPreferido: this.preferredSurname,
            direccionId: this.addressId,
            telefono: this.phone,
            email: this.email,
            autorizadoRetiro: this.authorizedPickup,
            autorizadoCambio: this.authorizedChange
        };
    }
}

module.exports = Guardian;
