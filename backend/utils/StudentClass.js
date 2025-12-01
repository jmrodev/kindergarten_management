// utils/StudentClass.js (Modelo para el controlador de estudiantes)
const { getConnection } = require('../db');

class Address {
  constructor(id, street, number, city, provincia, postalCode) {
    this.id = id;
    this.street = street;
    this.number = number;
    this.city = city;
    this.provincia = provincia;
    this.postalCode = postalCode;
  }
}

class EmergencyContact {
  constructor(id, fullName, relationship, phone) {
    this.id = id;
    this.fullName = fullName;
    this.relationship = relationship;
    this.phone = phone;
  }
}

class Classroom {
  constructor(id, name, capacity) {
    this.id = id;
    this.name = name;
    this.capacity = capacity;
  }
}

class Student {
  constructor(
    id, firstName, middleName, thirdName, nickname,
    paternalSurname, maternalSurname, birthDate,
    address, emergencyContact, classroom, shift
  ) {
    this.id = id;
    this.firstName = firstName;
    this.middleName = middleName;
    this.thirdName = thirdName;
    this.nickname = nickname;
    this.paternalSurname = paternalSurname;
    this.maternalSurname = maternalSurname;
    this.birthDate = birthDate;
    this.address = address;
    this.emergencyContact = emergencyContact;
    this.classroom = classroom;
    this.shift = shift;
  }

  isValid() {
    // Validar campos requeridos
    if (!this.firstName || !this.paternalSurname || !this.birthDate) {
      return false;
    }

    // Validar formato de fecha
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(this.birthDate)) {
      return false;
    }

    // Validar que exista la dirección
    if (!this.address) {
      return false;
    }

    return true;
  }
}

module.exports = {
  Address,
  EmergencyContact,
  Classroom,
  Student
};