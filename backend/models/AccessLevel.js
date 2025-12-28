// models/AccessLevel.js

class AccessLevel {
  constructor(data) {
    this.id = data.id;
    this.access_name = data.access_name;
    this.description = data.description;
  }

  static fromDbRow(row) {
    if (!row) return null;
    return new AccessLevel(row);
  }
}

module.exports = AccessLevel;