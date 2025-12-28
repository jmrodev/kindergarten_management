// models/Address.js

class Address {
  constructor(data) {
    this.id = data.id;
    this.street = data.street;
    this.number = data.number;
    this.city = data.city;
    this.provincia = data.provincia;
    this.postal_code_optional = data.postal_code_optional;
  }

  static fromDbRow(row) {
    if (!row) return null;
    return new Address(row);
  }
}

module.exports = Address;