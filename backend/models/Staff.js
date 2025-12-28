// models/Staff.js

class Staff {
  constructor(data) {
    this.id = data.id;
    this.first_name = data.first_name;
    this.middle_name_optional = data.middle_name_optional;
    this.third_name_optional = data.third_name_optional;
    this.paternal_surname = data.paternal_surname;
    this.maternal_surname = data.maternal_surname;
    this.preferred_surname = data.preferred_surname;
    this.dni = data.dni;
    this.email = data.email;
    this.email_optional = data.email_optional;
    this.phone = data.phone;
    this.address_id = data.address_id;
    this.classroom_id = data.classroom_id;
    this.role_id = data.role_id;
    this.is_active = data.is_active;
    this.last_login = data.last_login;
    this.created_at = data.created_at;
    this.password_hash = data.password_hash;
  }

  static fromDbRow(row) {
    if (!row) return null;
    // Handle manual BigInt conversion if not already done by repository
    const data = { ...row };
    for (const key in data) {
      if (typeof data[key] === 'bigint') {
        data[key] = Number(data[key]);
      }
    }
    return new Staff(data);
  }
}

module.exports = Staff;