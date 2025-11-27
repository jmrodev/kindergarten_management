-- ============================================================================
-- DATOS DE EJEMPLO PARA SISTEMA DE GESTIÓN - JARDÍN DE INFANTES
-- ============================================================================
-- Este archivo contiene datos realistas de ejemplo para poblar la base de datos
-- Incluye: salas, direcciones, contactos de emergencia y alumnos
-- ============================================================================

USE kindergarten_db;

-- Limpiar datos existentes (en orden inverso por foreign keys)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE student;
TRUNCATE TABLE emergency_contact;
TRUNCATE TABLE address;
TRUNCATE TABLE classroom;
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- 1. SALAS (CLASSROOMS)
-- ============================================================================

INSERT INTO classroom (name, capacity) VALUES
('Sala Roja', 20),
('Sala Azul', 18),
('Sala Verde', 22),
('Sala Amarilla', 20),
('Sala Naranja', 19);

-- ============================================================================
-- 2. DIRECCIONES (ADDRESSES)
-- ============================================================================

-- Direcciones familiares (algunas compartidas por hermanos)
INSERT INTO address (street, number, city, provincia, postal_code_optional) VALUES
-- Familia Pérez (hermanos)
('Avenida San Martín', '1523', 'Tandil', 'Buenos Aires', 'B7000'),
-- Familia González
('Calle Mitre', '892', 'Tandil', 'Buenos Aires', 'B7000'),
-- Familia Rodríguez (hermanos)
('Calle 9 de Julio', '456', 'Tandil', 'Buenos Aires', 'B7001'),
-- Familia Fernández
('Avenida Colón', '2341', 'Tandil', 'Buenos Aires', 'B7000'),
-- Familia López
('Calle Salta', '1961', 'Tandil', 'Buenos Aires', 'B7000'),
-- Familia Martínez
('Calle Pinto', '567', 'Tandil', 'Buenos Aires', 'B7001'),
-- Familia García (hermanos)
('Calle Rivadavia', '1234', 'Tandil', 'Buenos Aires', 'B7000'),
-- Familia Sánchez
('Avenida Avellaneda', '3456', 'Tandil', 'Buenos Aires', 'B7002'),
-- Familia Díaz
('Calle Chacabuco', '789', 'Tandil', 'Buenos Aires', 'B7000'),
-- Familia Torres
('Calle Belgrano', '2100', 'Tandil', 'Buenos Aires', 'B7001'),
-- Familia Romero
('Avenida Santamarina', '1800', 'Tandil', 'Buenos Aires', 'B7000'),
-- Familia Castro
('Calle Yrigoyen', '950', 'Tandil', 'Buenos Aires', 'B7000'),
-- Familia Morales
('Calle Güemes', '1450', 'Tandil', 'Buenos Aires', 'B7001'),
-- Familia Ruiz
('Avenida España', '2890', 'Tandil', 'Buenos Aires', 'B7002'),
-- Familia Suárez
('Calle San Lorenzo', '678', 'Tandil', 'Buenos Aires', 'B7000');

-- ============================================================================
-- 3. CONTACTOS DE EMERGENCIA (EMERGENCY CONTACTS)
-- ============================================================================

INSERT INTO emergency_contact (full_name, relationship, phone) VALUES
-- Familia Pérez (compartido por hermanos)
('Claudia Pérez', 'Madre', '02494-523129'),
-- Familia González
('Roberto González', 'Padre', '02494-445678'),
-- Familia Rodríguez (compartido por hermanos)
('Patricia Rodríguez', 'Madre', '02494-334455'),
-- Familia Fernández
('Miguel Fernández', 'Padre', '02494-556677'),
-- Familia López
('Andrea López', 'Madre', '02494-667788'),
-- Familia Martínez
('Carlos Martínez', 'Padre', '02494-778899'),
-- Familia García (compartido por hermanos)
('Silvia García', 'Madre', '02494-889900'),
-- Familia Sánchez
('Juan Sánchez', 'Padre', '02494-990011'),
-- Familia Díaz
('Mónica Díaz', 'Madre', '02494-112233'),
-- Familia Torres
('Fernando Torres', 'Padre', '02494-223344'),
-- Familia Romero
('Valeria Romero', 'Madre', '02494-334466'),
-- Familia Castro
('Diego Castro', 'Padre', '02494-445577'),
-- Familia Morales
('Cecilia Morales', 'Madre', '02494-556688'),
-- Familia Ruiz
('Pablo Ruiz', 'Padre', '02494-667799'),
-- Familia Suárez
('Natalia Suárez', 'Madre', '02494-778800');

-- ============================================================================
-- 4. ALUMNOS (STUDENTS)
-- ============================================================================

-- Notas sobre los datos:
-- - Fechas de nacimiento: niños de 3-5 años (2019-2021)
-- - Algunos hermanos comparten dirección y contacto de emergencia
-- - Turnos: Mañana (8:00-12:00) o Tarde (13:00-17:00)
-- - Nombres y apellidos comunes en Argentina

INSERT INTO student 
(first_name, middle_name_optional, third_name_optional, paternal_surname, maternal_surname, nickname_optional, birth_date, address_id, emergency_contact_id, classroom_id, shift) 
VALUES

-- SALA ROJA (20 alumnos)
('Juan', 'Martín', NULL, 'Pérez', 'González', 'Juanchi', '2019-03-15', 1, 1, 1, 'Mañana'),
('María', 'Sol', NULL, 'Pérez', 'González', 'Marita', '2020-08-22', 1, 1, 1, 'Mañana'),
('Sofía', 'Valentina', NULL, 'González', 'Ruiz', 'Sofi', '2019-06-10', 2, 2, 1, 'Mañana'),
('Lucas', 'Ezequiel', NULL, 'Rodríguez', 'López', 'Luqui', '2020-01-30', 3, 3, 1, 'Mañana'),
('Martina', 'Agustina', NULL, 'Rodríguez', 'López', 'Marti', '2019-09-14', 3, 3, 1, 'Mañana'),
('Benjamín', 'Mateo', NULL, 'Fernández', 'Castro', 'Benja', '2020-04-18', 4, 4, 1, 'Mañana'),
('Catalina', 'Abril', NULL, 'López', 'Romero', 'Cata', '2019-11-25', 5, 5, 1, 'Mañana'),
('Tomás', 'Ignacio', NULL, 'Martínez', 'Díaz', 'Tomi', '2020-02-07', 6, 6, 1, 'Tarde'),
('Emma', 'Isabella', NULL, 'García', 'Morales', 'Emmi', '2019-07-19', 7, 7, 1, 'Tarde'),
('Mateo', 'Santiago', NULL, 'García', 'Morales', 'Mate', '2020-10-03', 7, 7, 1, 'Tarde'),
('Valentina', 'Lucía', NULL, 'Sánchez', 'Torres', 'Vale', '2019-05-28', 8, 8, 1, 'Tarde'),
('Felipe', 'Nicolás', NULL, 'Díaz', 'Suárez', 'Pipe', '2020-12-11', 9, 9, 1, 'Tarde'),
('Camila', 'Milagros', NULL, 'Torres', 'García', 'Cami', '2019-08-16', 10, 10, 1, 'Tarde'),
('Santino', 'Bautista', NULL, 'Romero', 'Fernández', 'Santi', '2020-03-24', 11, 11, 1, 'Tarde'),
('Lola', 'Victoria', NULL, 'Castro', 'Pérez', 'Loli', '2019-12-05', 12, 12, 1, 'Tarde'),
('Thiago', 'Emanuel', NULL, 'Morales', 'González', 'Thia', '2020-06-13', 13, 13, 1, 'Tarde'),
('Nina', 'Abril', NULL, 'Ruiz', 'Martínez', 'Nini', '2019-10-21', 14, 14, 1, 'Tarde'),
('Lorenzo', 'Joaquín', NULL, 'Suárez', 'Rodríguez', 'Loren', '2020-05-09', 15, 15, 1, 'Tarde'),
('Olivia', 'Emilia', NULL, 'González', 'Ruiz', 'Oli', '2019-04-17', 2, 2, 1, 'Mañana'),
('Dante', 'Leonel', NULL, 'López', 'Romero', 'Dan', '2020-09-28', 5, 5, 1, 'Mañana'),

-- SALA AZUL (18 alumnos)
('Isabella', 'Francesca', NULL, 'Fernández', 'Castro', 'Isa', '2019-02-14', 4, 4, 2, 'Mañana'),
('Bautista', 'Agustín', NULL, 'Martínez', 'Díaz', 'Bauti', '2020-07-23', 6, 6, 2, 'Mañana'),
('Josefina', 'María', NULL, 'Sánchez', 'Torres', 'Jose', '2019-11-08', 8, 8, 2, 'Mañana'),
('Lautaro', 'Maximiliano', NULL, 'Díaz', 'Suárez', 'Lauti', '2020-04-30', 9, 9, 2, 'Mañana'),
('Julieta', 'Celeste', NULL, 'Torres', 'García', 'Juli', '2019-09-19', 10, 10, 2, 'Mañana'),
('Francisco', 'Javier', NULL, 'Romero', 'Fernández', 'Fran', '2020-01-12', 11, 11, 2, 'Tarde'),
('Malena', 'Sofía', NULL, 'Castro', 'Pérez', 'Male', '2019-06-26', 12, 12, 2, 'Tarde'),
('Enzo', 'Gabriel', NULL, 'Morales', 'González', 'Enzi', '2020-11-15', 13, 13, 2, 'Tarde'),
('Alma', 'Pilar', NULL, 'Ruiz', 'Martínez', 'Almi', '2019-03-04', 14, 14, 2, 'Tarde'),
('Simón', 'Andrés', NULL, 'Suárez', 'Rodríguez', 'Simi', '2020-08-18', 15, 15, 2, 'Tarde'),
('Victoria', 'Constanza', NULL, 'Pérez', 'González', 'Vicky', '2019-12-22', 1, 1, 2, 'Tarde'),
('Facundo', 'Ezequiel', NULL, 'González', 'Ruiz', 'Facu', '2020-05-07', 2, 2, 2, 'Tarde'),
('Renata', 'Guadalupe', NULL, 'Rodríguez', 'López', 'Reni', '2019-10-29', 3, 3, 2, 'Tarde'),
('Ian', 'Sebastián', NULL, 'Fernández', 'Castro', 'Iani', '2020-02-16', 4, 4, 2, 'Mañana'),
('Delfina', 'Luz', NULL, 'López', 'Romero', 'Delfi', '2019-07-31', 5, 5, 2, 'Mañana'),
('Bruno', 'Martín', NULL, 'Martínez', 'Díaz', 'Bruni', '2020-12-04', 6, 6, 2, 'Mañana'),
('Jazmín', 'Belén', NULL, 'García', 'Morales', 'Jaz', '2019-04-11', 7, 7, 2, 'Mañana'),
('Gael', 'Matías', NULL, 'Sánchez', 'Torres', 'Gae', '2020-09-24', 8, 8, 2, 'Mañana'),

-- SALA VERDE (22 alumnos) - Continúa con más estudiantes
('Mora', 'Antonella', NULL, 'Díaz', 'Suárez', 'Mori', '2019-01-20', 9, 9, 3, 'Mañana'),
('Matías', 'Benjamín', NULL, 'Torres', 'García', 'Mati', '2020-06-08', 10, 10, 3, 'Mañana'),
('Clara', 'Juana', NULL, 'Romero', 'Fernández', 'Clari', '2019-11-13', 11, 11, 3, 'Mañana'),
('Augusto', 'Rafael', NULL, 'Castro', 'Pérez', 'Augus', '2020-03-27', 12, 12, 3, 'Mañana'),
('Elena', 'Rosa', NULL, 'Morales', 'González', 'Ele', '2019-08-05', 13, 13, 3, 'Mañana'),
('Pedro', 'Luis', NULL, 'Ruiz', 'Martínez', 'Pedri', '2020-10-19', 14, 14, 3, 'Tarde'),
('Amanda', 'Inés', NULL, 'Suárez', 'Rodríguez', 'Ami', '2019-05-02', 15, 15, 3, 'Tarde'),
('Marcos', 'Alejandro', NULL, 'Pérez', 'González', 'Marq', '2020-12-14', 1, 1, 3, 'Tarde'),
('Amparo', 'Martina', NULL, 'González', 'Ruiz', 'Ampi', '2019-02-25', 2, 2, 3, 'Tarde'),
('Adrián', 'Felipe', NULL, 'Rodríguez', 'López', 'Adri', '2020-07-09', 3, 3, 3, 'Tarde'),
('Bianca', 'Sofía', NULL, 'Fernández', 'Castro', 'Bianqui', '2019-12-18', 4, 4, 3, 'Tarde'),
('Dylan', 'Axel', NULL, 'López', 'Romero', 'Dyl', '2020-04-03', 5, 5, 3, 'Tarde'),
('Cecilia', 'Isabel', NULL, 'Martínez', 'Díaz', 'Ceci', '2019-09-11', 6, 6, 3, 'Tarde'),
('Elías', 'Samuel', NULL, 'García', 'Morales', 'Eli', '2020-01-26', 7, 7, 3, 'Mañana'),
('Florencia', 'María', NULL, 'Sánchez', 'Torres', 'Flor', '2019-06-15', 8, 8, 3, 'Mañana'),
('Gonzalo', 'Tomás', NULL, 'Díaz', 'Suárez', 'Gonza', '2020-11-29', 9, 9, 3, 'Mañana'),
('Helena', 'Carolina', NULL, 'Torres', 'García', 'Hele', '2019-03-08', 10, 10, 3, 'Mañana'),
('Ignacio', 'Pablo', NULL, 'Romero', 'Fernández', 'Nacho', '2020-08-22', 11, 11, 3, 'Mañana'),
('Julia', 'Magdalena', NULL, 'Castro', 'Pérez', 'Juli', '2019-10-06', 12, 12, 3, 'Mañana'),
('Kevin', 'Adriel', NULL, 'Morales', 'González', 'Kev', '2020-02-11', 13, 13, 3, 'Mañana'),
('Laura', 'Beatriz', NULL, 'Ruiz', 'Martínez', 'Lau', '2019-07-25', 14, 14, 3, 'Mañana'),
('Manuel', 'Esteban', NULL, 'Suárez', 'Rodríguez', 'Manu', '2020-12-09', 15, 15, 3, 'Mañana'),

-- SALA AMARILLA (20 alumnos)
('Natalia', 'Soledad', NULL, 'Pérez', 'González', 'Nati', '2019-04-14', 1, 1, 4, 'Mañana'),
('Oscar', 'Damián', NULL, 'González', 'Ruiz', 'Osqui', '2020-09-28', 2, 2, 4, 'Mañana'),
('Paloma', 'Luciana', NULL, 'Rodríguez', 'López', 'Palo', '2019-01-07', 3, 3, 4, 'Mañana'),
('Ramiro', 'Ezequiel', NULL, 'Fernández', 'Castro', 'Rami', '2020-06-21', 4, 4, 4, 'Mañana'),
('Sabrina', 'Andrea', NULL, 'López', 'Romero', 'Sabri', '2019-11-04', 5, 5, 4, 'Mañana'),
('Tobías', 'Maximiliano', NULL, 'Martínez', 'Díaz', 'Tobi', '2020-03-19', 6, 6, 4, 'Tarde'),
('Úrsula', 'Victoria', NULL, 'García', 'Morales', 'Ursi', '2019-08-02', 7, 7, 4, 'Tarde'),
('Vicente', 'Augusto', NULL, 'Sánchez', 'Torres', 'Vichi', '2020-10-16', 8, 8, 4, 'Tarde'),
('Ximena', 'Florencia', NULL, 'Díaz', 'Suárez', 'Xime', '2019-05-30', 9, 9, 4, 'Tarde'),
('Yago', 'Nicolás', NULL, 'Torres', 'García', 'Yagui', '2020-12-23', 10, 10, 4, 'Tarde'),
('Zoe', 'Valentina', NULL, 'Romero', 'Fernández', 'Zoi', '2019-02-12', 11, 11, 4, 'Tarde'),
('Abel', 'Cristian', NULL, 'Castro', 'Pérez', 'Abe', '2020-07-27', 12, 12, 4, 'Tarde'),
('Brisa', 'Melody', NULL, 'Morales', 'González', 'Bri', '2019-12-10', 13, 13, 4, 'Tarde'),
('Cristóbal', 'Andrés', NULL, 'Ruiz', 'Martínez', 'Cris', '2020-04-25', 14, 14, 4, 'Tarde'),
('Diana', 'Gabriela', NULL, 'Suárez', 'Rodríguez', 'Diani', '2019-09-08', 15, 15, 4, 'Mañana'),
('Emilio', 'Santiago', NULL, 'Pérez', 'González', 'Emi', '2020-01-22', 1, 1, 4, 'Mañana'),
('Fernanda', 'Paola', NULL, 'González', 'Ruiz', 'Fer', '2019-06-06', 2, 2, 4, 'Mañana'),
('Germán', 'Alejandro', NULL, 'Rodríguez', 'López', 'Ger', '2020-11-20', 3, 3, 4, 'Mañana'),
('Hilaria', 'Luz', NULL, 'Fernández', 'Castro', 'Hila', '2019-03-16', 4, 4, 4, 'Mañana'),
('Ismael', 'David', NULL, 'López', 'Romero', 'Isma', '2020-08-30', 5, 5, 4, 'Mañana'),

-- SALA NARANJA (19 alumnos)
('Jaime', 'Miguel', NULL, 'Martínez', 'Díaz', 'Jai', '2019-10-13', 6, 6, 5, 'Mañana'),
('Kiara', 'Milagros', NULL, 'García', 'Morales', 'Kiki', '2020-05-28', 7, 7, 5, 'Mañana'),
('Leandro', 'Fabián', NULL, 'Sánchez', 'Torres', 'Lean', '2019-12-11', 8, 8, 5, 'Mañana'),
('Melisa', 'Rocío', NULL, 'Díaz', 'Suárez', 'Meli', '2020-02-24', 9, 9, 5, 'Mañana'),
('Nelson', 'Ricardo', NULL, 'Torres', 'García', 'Nel', '2019-07-09', 10, 10, 5, 'Mañana'),
('Ofelia', 'Carmen', NULL, 'Romero', 'Fernández', 'Ofe', '2020-09-15', 11, 11, 5, 'Tarde'),
('Pablo', 'Ernesto', NULL, 'Castro', 'Pérez', 'Pabli', '2019-04-29', 12, 12, 5, 'Tarde'),
('Quintina', 'Vera', NULL, 'Morales', 'González', 'Quinti', '2020-11-03', 13, 13, 5, 'Tarde'),
('Rodrigo', 'Ezequiel', NULL, 'Ruiz', 'Martínez', 'Rodri', '2019-01-18', 14, 14, 5, 'Tarde'),
('Sandra', 'Lorena', NULL, 'Suárez', 'Rodríguez', 'Sandri', '2020-06-02', 15, 15, 5, 'Tarde'),
('Tadeo', 'Mateo', NULL, 'Pérez', 'González', 'Tade', '2019-11-15', 1, 1, 5, 'Tarde'),
('Ulises', 'Fernando', NULL, 'González', 'Ruiz', 'Uli', '2020-03-30', 2, 2, 5, 'Tarde'),
('Vanesa', 'Estela', NULL, 'Rodríguez', 'López', 'Vane', '2019-08-13', 3, 3, 5, 'Tarde'),
('Walter', 'Hugo', NULL, 'Fernández', 'Castro', 'Wal', '2020-10-27', 4, 4, 5, 'Mañana'),
('Xiomara', 'Patricia', NULL, 'López', 'Romero', 'Xio', '2019-05-11', 5, 5, 5, 'Mañana'),
('Yamil', 'Alberto', NULL, 'Martínez', 'Díaz', 'Yami', '2020-12-25', 6, 6, 5, 'Mañana'),
('Zaira', 'Mabel', NULL, 'García', 'Morales', 'Zai', '2019-02-07', 7, 7, 5, 'Mañana'),
('Alejo', 'Patricio', NULL, 'Sánchez', 'Torres', 'Ale', '2020-07-22', 8, 8, 5, 'Mañana'),
('Brenda', 'Noelia', NULL, 'Díaz', 'Suárez', 'Bren', '2019-09-05', 9, 9, 5, 'Mañana');

-- ============================================================================
-- VERIFICACIÓN DE DATOS INSERTADOS
-- ============================================================================

SELECT 'Resumen de datos insertados:' as '';
SELECT COUNT(*) as 'Total Salas' FROM classroom;
SELECT COUNT(*) as 'Total Direcciones' FROM address;
SELECT COUNT(*) as 'Total Contactos Emergencia' FROM emergency_contact;
SELECT COUNT(*) as 'Total Alumnos' FROM student;

SELECT '' as '';
SELECT 'Distribución de alumnos por sala:' as '';
SELECT 
    c.name as 'Sala',
    COUNT(s.id) as 'Cantidad Alumnos',
    c.capacity as 'Capacidad',
    CONCAT(ROUND((COUNT(s.id) / c.capacity) * 100, 1), '%') as 'Ocupación'
FROM classroom c
LEFT JOIN student s ON c.id = s.classroom_id
GROUP BY c.id, c.name, c.capacity
ORDER BY c.name;

SELECT '' as '';
SELECT 'Alumnos por turno:' as '';
SELECT 
    shift as 'Turno',
    COUNT(*) as 'Cantidad'
FROM student
GROUP BY shift;

SELECT '' as '';
SELECT 'Edades de los alumnos:' as '';
SELECT 
    YEAR(CURDATE()) - YEAR(birth_date) as 'Edad',
    COUNT(*) as 'Cantidad'
FROM student
GROUP BY YEAR(CURDATE()) - YEAR(birth_date)
ORDER BY YEAR(CURDATE()) - YEAR(birth_date);

-- ============================================================================
-- FIN DEL SCRIPT
-- ============================================================================
