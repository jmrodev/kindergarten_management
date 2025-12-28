// models/Role.js

class Role {
  constructor(data) {
    this.id = data.id;
    this.role_name = data.role_name;
    this.access_level_id = data.access_level_id;
    this.access_name = data.access_name; // From JOIN
  }

  static fromDbRow(row) {
    if (!row) return null;
    return new Role(row);
  }
}

module.exports = Role;