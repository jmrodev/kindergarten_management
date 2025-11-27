-- Drop tables in reverse order of dependency to avoid foreign key issues
DROP TABLE IF EXISTS guardian_message;
DROP TABLE IF EXISTS staff_message;
DROP TABLE IF EXISTS conversation_guardian;
DROP TABLE IF EXISTS conversation_staff;
DROP TABLE IF EXISTS conversation;
DROP TABLE IF EXISTS activity;
DROP TABLE IF EXISTS calendar;
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS student;
DROP TABLE IF EXISTS guardian;
DROP TABLE IF EXISTS staff;
DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS access_level;
DROP TABLE IF EXISTS classroom;
DROP TABLE IF EXISTS emergency_contact;
DROP TABLE IF EXISTS address;

-- Create tables
CREATE TABLE address (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  street TEXT,
  number TEXT,
  city TEXT,
  provincia TEXT,
  postal_code_optional TEXT
);

CREATE TABLE emergency_contact (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  full_name TEXT,
  relationship TEXT,
  phone TEXT
);

CREATE TABLE classroom (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name TEXT,
  capacity INT
);

CREATE TABLE access_level (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  access_name TEXT,
  description TEXT
);

CREATE TABLE role (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  role_name TEXT,
  access_level_id BIGINT,
  FOREIGN KEY (access_level_id) REFERENCES access_level (id)
);

CREATE TABLE staff (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  first_name TEXT,
  middle_name_optional TEXT,
  third_name_optional TEXT,
  paternal_surname TEXT,
  maternal_surname TEXT,
  address_id BIGINT,
  phone TEXT,
  email_optional TEXT,
  classroom_id BIGINT,
  role_id BIGINT,
  FOREIGN KEY (address_id) REFERENCES address (id),
  FOREIGN KEY (classroom_id) REFERENCES classroom (id),
  FOREIGN KEY (role_id) REFERENCES role (id)
);

CREATE TABLE student (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  first_name TEXT,
  middle_name_optional TEXT,
  third_name_optional TEXT,
  paternal_surname TEXT,
  maternal_surname TEXT,
  nickname_optional TEXT,
  birth_date DATE,
  address_id BIGINT,
  emergency_contact_id BIGINT,
  classroom_id BIGINT,
  shift TEXT,
  FOREIGN KEY (address_id) REFERENCES address (id),
  FOREIGN KEY (emergency_contact_id) REFERENCES emergency_contact (id),
  FOREIGN KEY (classroom_id) REFERENCES classroom (id)
);

CREATE TABLE guardian (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  first_name TEXT,
  middle_name_optional TEXT,
  paternal_surname TEXT,
  maternal_surname TEXT,
  preferred_surname TEXT,
  address_id BIGINT,
  phone TEXT,
  email_optional TEXT,
  authorized_pickup BOOLEAN,
  authorized_change BOOLEAN,
  FOREIGN KEY (address_id) REFERENCES address (id)
);

CREATE TABLE attendance (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  student_id BIGINT,
  date DATE,
  status TEXT,
  leave_type_optional TEXT,
  classroom_id BIGINT,
  FOREIGN KEY (student_id) REFERENCES student (id),
  FOREIGN KEY (classroom_id) REFERENCES classroom (id)
);

CREATE TABLE calendar (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  date DATE,
  description TEXT,
  event_type TEXT,
  classroom_id BIGINT,
  FOREIGN KEY (classroom_id) REFERENCES classroom (id)
);

CREATE TABLE activity (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name TEXT,
  description_optional TEXT,
  schedule_optional TEXT,
  teacher_id BIGINT,
  FOREIGN KEY (teacher_id) REFERENCES staff (id)
);

CREATE TABLE conversation (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  classroom_id BIGINT,
  creation_date TIMESTAMP,
  FOREIGN KEY (classroom_id) REFERENCES classroom (id)
);

-- Normalized conversation participants
CREATE TABLE conversation_guardian (
  conversation_id BIGINT,
  guardian_id BIGINT,
  PRIMARY KEY (conversation_id, guardian_id),
  FOREIGN KEY (conversation_id) REFERENCES conversation (id),
  FOREIGN KEY (guardian_id) REFERENCES guardian (id)
);

CREATE TABLE conversation_staff (
  conversation_id BIGINT,
  staff_id BIGINT,
  PRIMARY KEY (conversation_id, staff_id),
  FOREIGN KEY (conversation_id) REFERENCES conversation (id),
  FOREIGN KEY (staff_id) REFERENCES staff (id)
);

-- Normalized messages
CREATE TABLE guardian_message (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  conversation_id BIGINT,
  sender_guardian_id BIGINT,
  content TEXT,
  send_date TIMESTAMP,
  `read` BOOLEAN,
  FOREIGN KEY (conversation_id) REFERENCES conversation (id),
  FOREIGN KEY (sender_guardian_id) REFERENCES guardian (id)
);

CREATE TABLE staff_message (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  conversation_id BIGINT,
  sender_staff_id BIGINT,
  content TEXT,
  send_date TIMESTAMP,
  `read` BOOLEAN,
  FOREIGN KEY (conversation_id) REFERENCES conversation (id),
  FOREIGN KEY (sender_staff_id) REFERENCES staff (id)
);