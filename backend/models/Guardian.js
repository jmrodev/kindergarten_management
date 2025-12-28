// models/Guardian.js


class Guardian {
  constructor(
    id,
    firstName,
    middleNameOptional,
    paternalSurname,
    maternalSurname,
    preferredSurname,
    dni,
    addressId,
    phone,
    emailOptional,
    workplace,
    workPhone,
    authorizedPickup,
    authorizedChange,
    parentPortalUserId,
    roleId
  ) {
    this.id = id;
    this.firstName = firstName;
    this.middleNameOptional = middleNameOptional;
    this.paternalSurname = paternalSurname;
    this.maternalSurname = maternalSurname;
    this.preferredSurname = preferredSurname;
    this.dni = dni;
    this.addressId = addressId;
    this.phone = phone;
    this.emailOptional = emailOptional;
    this.workplace = workplace;
    this.workPhone = workPhone;
    this.authorizedPickup = authorizedPickup;
    this.authorizedChange = authorizedChange;
    this.parentPortalUserId = parentPortalUserId;
    this.roleId = roleId;
  }

  static fromDbRow(row) {
    return new Guardian(
      row.id,
      row.first_name,
      row.middle_name_optional,
      row.paternal_surname,
      row.maternal_surname,
      row.preferred_surname,
      row.dni,
      row.address_id,
      row.phone,
      row.email_optional,
      row.workplace,
      row.work_phone,
      row.authorized_pickup,
      row.authorized_change,
      row.parent_portal_user_id,
      row.role_id
    );
  }

  isValid() {
    // Validar campos requeridos
    if (!this.firstName || !this.paternalSurname) {
      return false;
    }

    // Si tiene DNI, validar formato
    if (this.dni) {
      const dniRegex = /^\d{7,8}$/;
      if (!dniRegex.test(this.dni)) {
        return false;
      }
    }

    // Validar formato de teléfono si existe
    if (this.phone) {
      const phoneRegex = /^[\d\s\-\+\(\)]{7,15}$/;
      if (!phoneRegex.test(this.phone)) {
        return false;
      }
    }

    // Validar formato de email si existe
    if (this.emailOptional) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.emailOptional)) {
        return false;
      }
    }

    return true;
  }

  toDbRow() {
    return {
      id: this.id,
      first_name: this.firstName,
      middle_name_optional: this.middleNameOptional,
      paternal_surname: this.paternalSurname,
      maternal_surname: this.maternalSurname,
      preferred_surname: this.preferredSurname,
      dni: this.dni,
      address_id: this.addressId,
      phone: this.phone,
      email_optional: this.emailOptional,
      workplace: this.workplace,
      work_phone: this.workPhone,
      authorized_pickup: this.authorizedPickup,
      authorized_change: this.authorizedChange,
      parent_portal_user_id: this.parentPortalUserId,
      role_id: this.roleId
    };
  }
}

module.exports = Guardian;