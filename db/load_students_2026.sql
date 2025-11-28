-- ============================================================================
-- CARGA INICIAL DE ALUMNOS 2026
-- Fecha: 2025-11-28
-- Descripción: 96 alumnos inscritos para el ciclo 2026
-- ============================================================================

-- IMPORTANTE: Primero deben existir las salas en la tabla classroom
-- Verificar que existan las salas 3, 4 y 5

-- Crear salas si no existen
INSERT INTO classroom (id, name, capacity, academic_year, age_group, is_active) 
VALUES 
    (3, 'Sala 3', 25, 2026, 3, TRUE),
    (4, 'Sala 4', 25, 2026, 4, TRUE),
    (5, 'Sala 5', 25, 2026, 5, TRUE)
ON DUPLICATE KEY UPDATE 
    academic_year = 2026, 
    is_active = TRUE;

-- Insertar alumnos

-- Sala de 3 Turno Mañana (15 alumnos)

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Francisca',
    'Pecci',
    NULL,
    3,
    'Mañana',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Sotuyo',
    'Leo',
    'Croci',
    3,
    'Mañana',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Julián',
    'Milani',
    NULL,
    3,
    'Mañana',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Leon',
    'Popovich',
    NULL,
    3,
    'Mañana',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Lorenzo',
    'Del',
    'Bianco',
    3,
    'Mañana',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Nicolas',
    'Neira',
    'Bruno',
    3,
    'Mañana',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Joaquin',
    'Morales',
    NULL,
    3,
    'Mañana',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Ze Teo',
    'Liang',
    'Ren',
    3,
    'Mañana',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Bruno',
    'Sacacca',
    NULL,
    3,
    'Mañana',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Noah',
    'Omisi',
    'Regio',
    3,
    'Mañana',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Justina',
    'Heizua',
    'Heins',
    3,
    'Mañana',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Camila',
    'Rago',
    'Urra',
    3,
    'Mañana',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Vera',
    'Zampatti',
    NULL,
    3,
    'Mañana',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Simon',
    'Dailof',
    NULL,
    3,
    'Mañana',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Gonzalo',
    'Paez',
    NULL,
    3,
    'Mañana',
    'inscripto',
    '2026-01-01'
);

-- Sala de 3 Turno Tarde (9 alumnos)

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Rafael',
    'Rossi',
    'Mariano',
    3,
    'Tarde',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Moretti',
    'Calabro',
    NULL,
    3,
    'Tarde',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Faustina',
    'More',
    NULL,
    3,
    'Tarde',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Rufina',
    'Sanchez',
    'Acuña',
    3,
    'Tarde',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Violeta',
    'Cesar',
    NULL,
    3,
    'Tarde',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Nahiara',
    'Larricq',
    NULL,
    3,
    'Tarde',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Luca',
    'Gonzalez',
    NULL,
    3,
    'Tarde',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Martina',
    'Caballero',
    NULL,
    3,
    'Tarde',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Alison',
    'Oviedo',
    NULL,
    3,
    'Tarde',
    'inscripto',
    '2026-01-01'
);

-- Sala de 4 Turno Mañana (23 alumnos)

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Justina',
    'Cajal',
    'Martinelli',
    4,
    'Mañana',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Belisario',
    'Carceles',
    'Huinca',
    4,
    'Mañana',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Manuel',
    'Conti',
    NULL,
    4,
    'Mañana',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Agustín',
    'Fernández',
    NULL,
    4,
    'Mañana',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Emilia',
    'Galavert',
    NULL,
    4,
    'Mañana',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Clara',
    'Gomes',
    'Priano',
    4,
    'Mañana',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Lisandro',
    'Gonzalez',
    'Menna',
    4,
    'Mañana',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Alfredo',
    'Idiart',
    'Ignacio',
    4,
    'Mañana',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Manuel',
    'Kaufmann',
    NULL,
    4,
    'Mañana',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Felipe',
    'Luengo',
    NULL,
    4,
    'Mañana',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Lucio',
    'Molinuevo',
    NULL,
    4,
    'Mañana',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Martín',
    'Palacio',
    'Juan',
    4,
    'Mañana',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Facundo',
    'Rizzi',
    NULL,
    4,
    'Mañana',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Augusto',
    'Salinas',
    'Gaitán',
    4,
    'Mañana',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Ignacio',
    'Santos',
    NULL,
    4,
    'Mañana',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Bautista',
    'Torres',
    NULL,
    4,
    'Mañana',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Thiago',
    'Tommasino',
    NULL,
    4,
    'Mañana',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Benjamin',
    'Acosta',
    NULL,
    4,
    'Mañana',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Bruno',
    'Balbo',
    NULL,
    4,
    'Mañana',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Luz',
    'Mazzeo',
    NULL,
    4,
    'Mañana',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Emma',
    'Paredes',
    NULL,
    4,
    'Mañana',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Sebastián',
    'Chas',
    NULL,
    4,
    'Mañana',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Julieta',
    'Martinez',
    NULL,
    4,
    'Mañana',
    'inscripto',
    '2026-01-01'
);

-- Sala de 4 Turno Tarde (15 alumnos)

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Francisco',
    'Acosta',
    NULL,
    4,
    'Tarde',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Giuliana',
    'Fernandez',
    NULL,
    4,
    'Tarde',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Benicio',
    'Giribaldi',
    NULL,
    4,
    'Tarde',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Bautista',
    'Gonzalez',
    NULL,
    4,
    'Tarde',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Josefina',
    'Iriarte',
    'Ruffolo',
    4,
    'Tarde',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Julia',
    'Lauandos',
    NULL,
    4,
    'Tarde',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Delfina',
    'Lozano',
    'Rojas',
    4,
    'Tarde',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Valentina',
    'Maidana',
    NULL,
    4,
    'Tarde',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Mateo',
    'Romano',
    NULL,
    4,
    'Tarde',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Sarita',
    'Santillan',
    NULL,
    4,
    'Tarde',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Mora',
    'Vivone',
    NULL,
    4,
    'Tarde',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Bautista',
    'Zucarelli',
    NULL,
    4,
    'Tarde',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Luna',
    'Soria',
    NULL,
    4,
    'Tarde',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Serena',
    'Paz',
    NULL,
    4,
    'Tarde',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Tiziana',
    'Ramirez',
    NULL,
    4,
    'Tarde',
    'inscripto',
    '2026-01-01'
);

-- Sala de 5 Turno Mañana (21 alumnos)

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Malvina',
    'Becerra',
    NULL,
    5,
    'Mañana',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Bautista',
    'Bendek',
    NULL,
    5,
    'Mañana',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Gerónimo',
    'Calvimonte',
    NULL,
    5,
    'Mañana',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Santino',
    'Coscarelli',
    NULL,
    5,
    'Mañana',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Marcos',
    'Delfrate',
    NULL,
    5,
    'Mañana',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Joaquin',
    'Etchegaray',
    NULL,
    5,
    'Mañana',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Lara',
    'Fadda',
    NULL,
    5,
    'Mañana',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Pedro',
    'Freire',
    NULL,
    5,
    'Mañana',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Dante',
    'Fregossi',
    NULL,
    5,
    'Mañana',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Franco',
    'Gutierrez',
    NULL,
    5,
    'Mañana',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Francesca',
    'Mangiaterra',
    NULL,
    5,
    'Mañana',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Milo',
    'Montalini',
    NULL,
    5,
    'Mañana',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Rene',
    'Navarro',
    'Galo',
    5,
    'Mañana',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Zacarías',
    'Ramirez',
    NULL,
    5,
    'Mañana',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Mateo',
    'Sandleris',
    'Francisco',
    5,
    'Mañana',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Ciro',
    'Saraceno',
    NULL,
    5,
    'Mañana',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Mateo',
    'Thwaites',
    NULL,
    5,
    'Mañana',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Martiniano',
    'Villar',
    NULL,
    5,
    'Mañana',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Joaquín',
    'Villar',
    'Serantes',
    5,
    'Mañana',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Bautista',
    'Zitta',
    NULL,
    5,
    'Mañana',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Lucca',
    'Olmos',
    NULL,
    5,
    'Mañana',
    'inscripto',
    '2026-01-01'
);

-- Sala de 5 Turno Tarde (13 alumnos)

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Serena',
    'Albinati',
    NULL,
    5,
    'Tarde',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Lucia',
    'Almuna',
    'Ciampagna',
    5,
    'Tarde',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Isidro',
    'Curuciaga',
    NULL,
    5,
    'Tarde',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Magdalena',
    'Fernandez',
    NULL,
    5,
    'Tarde',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Caterina',
    'Gauna',
    NULL,
    5,
    'Tarde',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Valentino',
    'Insua',
    NULL,
    5,
    'Tarde',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Mateo',
    'Juarez',
    'Conti',
    5,
    'Tarde',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Lucio',
    'Mattarucco',
    NULL,
    5,
    'Tarde',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Ignacio',
    'Peralta',
    NULL,
    5,
    'Tarde',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Moira',
    'Sciaini',
    NULL,
    5,
    'Tarde',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Thiago',
    'Skvarca',
    NULL,
    5,
    'Tarde',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Azul',
    'Zapata',
    NULL,
    5,
    'Tarde',
    'inscripto',
    '2026-01-01'
);

INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    'Martina',
    'Laspina',
    NULL,
    5,
    'Tarde',
    'inscripto',
    '2026-01-01'
);

-- ============================================================================
-- VERIFICACIÓN
-- ============================================================================

SELECT 
    '✅ Se insertaron 96 alumnos para el ciclo 2026' as status;

SELECT 
    c.name as sala,
    COUNT(s.id) as total_alumnos,
    SUM(CASE WHEN s.shift = 'Mañana' THEN 1 ELSE 0 END) as turno_manana,
    SUM(CASE WHEN s.shift = 'Tarde' THEN 1 ELSE 0 END) as turno_tarde
FROM classroom c
LEFT JOIN student s ON c.id = s.classroom_id AND YEAR(s.enrollment_date) = 2026
WHERE c.academic_year = 2026
GROUP BY c.id, c.name
ORDER BY c.name;

-- ============================================================================
-- SIGUIENTE PASO
-- ============================================================================

/*
PRÓXIMOS PASOS:

1. Los alumnos están cargados con estado 'inscripto'
2. Faltan completar los siguientes datos CRÍTICOS:
   - DNI del alumno
   - Fecha de nacimiento
   - Dirección
   - Contacto de emergencia
   - Obra social
   - Información médica (alergias, medicación)
   - Datos de los responsables

3. Opciones para completar la información:
   
   a) Portal web para padres:
      - Enviar link único a cada padre
      - Formulario de completado de datos
      - Guardado automático
      
   b) Carga manual por secretaría:
      - Usar el módulo de inscripciones del sistema
      - Buscar alumno por nombre
      - Completar formulario extendido
      
   c) Importación desde Excel/CSV:
      - Preparar template
      - Recopilar datos
      - Importación masiva

4. Para activar un alumno:
   UPDATE student SET status = 'activo' WHERE id = ?;

5. Para generar reportes de información faltante:
   SELECT id, first_name, paternal_surname,
          dni IS NULL as falta_dni,
          birth_date IS NULL as falta_fecha_nac,
          health_insurance IS NULL as falta_obra_social,
          emergency_contact_id IS NULL as falta_contacto_emergencia
   FROM student 
   WHERE status = 'inscripto' AND YEAR(enrollment_date) = 2026;
*/
