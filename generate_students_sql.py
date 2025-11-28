#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Genera SQL para insertar los 96 alumnos de 2026 en la nueva estructura de BD
"""

import re

# Datos extraídos de los PDFs
inscripciones = {
    "Sala de 3 Turno Mañana": [
        "Pecci Francisca",
        "Leo Croci Sotuyo",
        "Milani Julián",
        "Popovich Leon",
        "Del Bianco Lorenzo",
        "Neira Bruno Nicolas",
        "Morales Joaquin",
        "Liang Ren Ze Teo",
        "Sacacca Bruno",
        "Omisi Regio Noah",
        "Heizua Heins Justina",
        "Rago Urra Camila",
        "Zampatti Vera",
        "Dailof Simon",
        "Paez Gonzalo"
    ],
    "Sala de 3 Turno Tarde": [
        "Rossi Mariano Rafael",
        "Calabro Moretti",
        "More Faustina",
        "Sanchez Acuña Rufina",
        "Cesar Violeta",
        "Larricq Nahiara",
        "Gonzalez Luca",
        "Caballero Martina",
        "Oviedo Alison"
    ],
    "Sala de 4 Turno Mañana": [
        "Cajal Martinelli Justina",
        "Carceles Huinca Belisario",
        "Conti Manuel",
        "Fernández Agustín",
        "Galavert Emilia",
        "Gomes Priano Clara",
        "Gonzalez Menna Lisandro",
        "Idiart Ignacio Alfredo",
        "Kaufmann Manuel",
        "Luengo Felipe",
        "Molinuevo Lucio",
        "Palacio Juan Martín",
        "Rizzi Facundo",
        "Salinas Gaitán Augusto",
        "Santos Ignacio",
        "Torres Bautista",
        "Tommasino Thiago",
        "Acosta Benjamin",
        "Balbo Bruno",
        "Mazzeo Luz",
        "Paredes Emma",
        "Chas Sebastián",
        "Martinez Julieta"
    ],
    "Sala de 4 Turno Tarde": [
        "Acosta Francisco",
        "Fernandez Giuliana",
        "Giribaldi Benicio",
        "Gonzalez Bautista",
        "Iriarte Ruffolo Josefina",
        "Lauandos Julia",
        "Lozano Rojas Delfina",
        "Maidana Valentina",
        "Romano Mateo",
        "Santillan Sarita",
        "Vivone Mora",
        "Zucarelli Bautista",
        "Soria Luna",
        "Paz Serena",
        "Ramirez Tiziana"
    ],
    "Sala de 5 Turno Mañana": [
        "Becerra Malvina",
        "Bendek Bautista",
        "Calvimonte Gerónimo",
        "Coscarelli Santino",
        "Delfrate Marcos",
        "Etchegaray Joaquin",
        "Fadda Lara",
        "Freire Pedro",
        "Fregossi Dante",
        "Gutierrez Franco",
        "Mangiaterra Francesca",
        "Montalini Milo",
        "Navarro Galo Rene",
        "Ramirez Zacarías",
        "Sandleris Francisco Mateo",
        "Saraceno Ciro",
        "Thwaites Mateo",
        "Villar Martiniano",
        "Villar Serantes Joaquín",
        "Zitta Bautista",
        "Olmos Lucca"
    ],
    "Sala de 5 Turno Tarde": [
        "Albinati Serena",
        "Almuna Ciampagna Lucia",
        "Curuciaga Isidro",
        "Fernandez Magdalena",
        "Gauna Caterina",
        "Insua Valentino",
        "Juarez Conti Mateo",
        "Mattarucco Lucio",
        "Peralta Ignacio",
        "Sciaini Moira",
        "Skvarca Thiago",
        "Zapata Azul",
        "Laspina Martina"
    ]
}

def parse_name(full_name):
    """
    Parsea un nombre completo intentando separar apellidos y nombres
    """
    parts = full_name.strip().split()
    
    # Casos especiales
    if len(parts) <= 1:
        return {
            'first_name': full_name,
            'paternal_surname': '',
            'maternal_surname': None
        }
    
    # Estrategia: Los apellidos suelen estar primero o en mayúsculas
    # Si hay 2 partes: Apellido Nombre
    if len(parts) == 2:
        return {
            'first_name': parts[1],
            'paternal_surname': parts[0],
            'maternal_surname': None
        }
    
    # Si hay 3 partes: Apellido1 Apellido2 Nombre o Apellido Nombre1 Nombre2
    # Asumimos que el último es nombre si tiene minúsculas
    if len(parts) == 3:
        # Caso: "Del Bianco Lorenzo" o "Leo Croci Sotuyo"
        # Asumimos que los dos primeros son apellidos si el primero es corto
        if len(parts[0]) <= 3 or parts[0].istitle():
            return {
                'first_name': parts[2],
                'paternal_surname': parts[0],
                'maternal_surname': parts[1]
            }
        else:
            return {
                'first_name': parts[1] + ' ' + parts[2],
                'paternal_surname': parts[0],
                'maternal_surname': None
            }
    
    # Si hay 4+ partes, asumimos que los primeros 2 son apellidos
    if len(parts) >= 4:
        return {
            'first_name': ' '.join(parts[2:]),
            'paternal_surname': parts[0],
            'maternal_surname': parts[1]
        }
    
    # Default
    return {
        'first_name': parts[-1],
        'paternal_surname': parts[0],
        'maternal_surname': parts[1] if len(parts) > 2 else None
    }

def get_classroom_id(sala_name):
    """
    Mapea nombre de sala a ID (deben existir en la BD)
    """
    if "Sala de 3" in sala_name or "Sala 3" in sala_name:
        return 3
    elif "Sala de 4" in sala_name or "Sala 4" in sala_name:
        return 4
    elif "Sala de 5" in sala_name or "Sala 5" in sala_name:
        return 5
    return None

def get_shift(sala_name):
    """
    Extrae el turno del nombre de sala
    """
    if "Mañana" in sala_name:
        return "Mañana"
    elif "Tarde" in sala_name:
        return "Tarde"
    return None

def generate_sql():
    """
    Genera el SQL para insertar todos los alumnos
    """
    sql = """-- ============================================================================
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
"""
    
    total_count = 0
    
    for sala_name, alumnos in inscripciones.items():
        classroom_id = get_classroom_id(sala_name)
        shift = get_shift(sala_name)
        
        sql += f"\n-- {sala_name} ({len(alumnos)} alumnos)\n"
        
        for alumno_name in alumnos:
            parsed = parse_name(alumno_name)
            
            # Escapar comillas simples
            first_name = parsed['first_name'].replace("'", "''")
            paternal_surname = parsed['paternal_surname'].replace("'", "''")
            maternal_surname = parsed['maternal_surname'].replace("'", "''") if parsed['maternal_surname'] else ''
            
            sql += f"""
INSERT INTO student (
    first_name, paternal_surname, maternal_surname,
    classroom_id, shift, status, enrollment_date
) VALUES (
    '{first_name}',
    '{paternal_surname}',
    {f"'{maternal_surname}'" if maternal_surname else 'NULL'},
    {classroom_id},
    '{shift}',
    'inscripto',
    '2026-01-01'
);
"""
            total_count += 1
    
    sql += f"""
-- ============================================================================
-- VERIFICACIÓN
-- ============================================================================

SELECT 
    '✅ Se insertaron {total_count} alumnos para el ciclo 2026' as status;

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
"""
    
    return sql

if __name__ == "__main__":
    sql = generate_sql()
    
    # Guardar en archivo
    with open('db/load_students_2026.sql', 'w', encoding='utf-8') as f:
        f.write(sql)
    
    print("✅ Script SQL generado: db/load_students_2026.sql")
    
    # Estadísticas
    total = sum(len(alumnos) for alumnos in inscripciones.values())
    print(f"\n📊 Estadísticas:")
    print(f"   Total de alumnos: {total}")
    for sala_name, alumnos in inscripciones.items():
        print(f"   {sala_name}: {len(alumnos)} alumnos")
