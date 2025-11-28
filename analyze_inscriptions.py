#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Análisis de inscripciones 2026 y comparación con la estructura de la BD
"""

import re
from collections import defaultdict

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
        "Mena Etcheverry Francisco",
        "Montero Candela",
        "Otranto Munarriz Catarina",
        "Pecchiar Tadeo Rubino",
        "Ramos Ignacio",
        "Rodriguez Vera",
        "Saraceno Lende Afra",
        "Sosa Sofia",
        "Toledo Martina",
        "Claudel Etchevarne Derek",
        "Rusconi Tiziano",
        "Rodrigo Dominguez Anahi",
        "Guzmán Gaiada"
    ],
    "Sala de 4 Turno Tarde": [
        "Arias Catalina Eugenia",
        "Aybar Fermín",
        "Beltrán Lola",
        "Delgado Vito",
        "Ferraro Manuel",
        "Fuentes Roman",
        "Genson Rodrigo",
        "Jano Felipe",
        "Loustau Andina",
        "Lozano Pedro",
        "Maschi Simón",
        "Oliverio Camila",
        "Terille Giovanna",
        "Padellini Paloma",
        "Martinez Franco Alfonso"
    ],
    "Sala de 5 Turno Mañana": [
        "Achaval Julia",
        "Avila Felipe",
        "Bazoberri Vicente",
        "Bayerque Goñi Santiago",
        "Castronovo Zuasnabar Renzo",
        "De Vincenti Lista Alondra",
        "Gonzalez Albizo Axel Fernando",
        "López Gómez Simón Gabriel",
        "Laportilla Martina",
        "Ledesma Benicio",
        "Ribas Irazabal Mateo",
        "Ripodas Antonia",
        "Sforza Salvoch Bianca",
        "Sorbi Indiana",
        "Tafernaberry Estanislao",
        "Teppaz Emilia",
        "Turchetti Roma",
        "Yapezzutti Julián",
        "Molina Tiziano",
        "Kwiek Gonzalez Pauline",
        "Dhasia"
    ],
    "Sala de 5 Turno Tarde": [
        "Bugarin Valentini Franchesca",
        "Damasco Nuñez León",
        "Fernández Pua Santino",
        "Ginestel Juana",
        "Matitti Rodrigo",
        "Nuñez Boris",
        "Politano Fiorella",
        "Peñalva Julieta",
        "Rizzo Francisca",
        "Scarpello Isabella",
        "Telesco Stéfano Osvaldo",
        "Zampieri Helena",
        "Videla Salvador"
    ]
}

def parse_nombre(nombre_completo):
    """Intenta separar nombre y apellido(s)"""
    partes = nombre_completo.strip().split()
    if len(partes) == 1:
        return {"nombre": partes[0], "apellidoPaterno": "", "apellidoMaterno": ""}
    elif len(partes) == 2:
        return {"nombre": partes[1], "apellidoPaterno": partes[0], "apellidoMaterno": ""}
    elif len(partes) == 3:
        return {"nombre": partes[2], "apellidoPaterno": partes[0], "apellidoMaterno": partes[1]}
    else:
        # Más de 3 partes - asumimos que los últimos son nombres
        return {
            "nombre": " ".join(partes[2:]),
            "apellidoPaterno": partes[0],
            "apellidoMaterno": partes[1]
        }

# Análisis
print("=" * 80)
print("ANÁLISIS DE INSCRIPCIONES 2026")
print("=" * 80)
print()

total_alumnos = 0
por_sala = {}
por_turno = {"Mañana": 0, "Tarde": 0}

for sala, alumnos in inscripciones.items():
    total_alumnos += len(alumnos)
    por_sala[sala] = len(alumnos)
    
    if "Mañana" in sala:
        por_turno["Mañana"] += len(alumnos)
    else:
        por_turno["Tarde"] += len(alumnos)

print(f"📊 RESUMEN GENERAL")
print(f"   Total de alumnos: {total_alumnos}")
print(f"   Turno Mañana: {por_turno['Mañana']} alumnos")
print(f"   Turno Tarde: {por_turno['Tarde']} alumnos")
print()

print(f"📚 POR SALA:")
for sala, cantidad in sorted(por_sala.items()):
    print(f"   {sala}: {cantidad} alumnos")
print()

# Análisis de campos
print("=" * 80)
print("COMPARACIÓN CON ESTRUCTURA DE BASE DE DATOS")
print("=" * 80)
print()

campos_bd = {
    "Campos básicos presentes": [
        "✅ nombre (extraído)",
        "✅ apellidoPaterno (extraído)", 
        "✅ apellidoMaterno (extraído)",
        "✅ sala (presente en PDF)",
        "✅ turno (presente en PDF)"
    ],
    "Campos FALTANTES en inscripciones": [
        "❌ fechaNacimiento - CRÍTICO para validar edad",
        "❌ dni/documento - IMPORTANTE para identificación única",
        "❌ domicilio - necesario para contacto",
        "❌ telefonoContacto - necesario para emergencias",
        "❌ emailContacto - importante para comunicación",
        "❌ nombreMadre/nombrePadre - datos de responsables",
        "❌ dniMadre/dniPadre - identificación de responsables",
        "❌ telefonoMadre/telefonoPadre - contacto con responsables",
        "❌ nombreTutor/dniTutor (si aplica)",
        "❌ obraSocial - importante para salud",
        "❌ alergias - CRÍTICO para seguridad",
        "❌ medicacion - CRÍTICO para salud",
        "❌ observacionesMedicas - importante",
        "❌ autorizacionSalida - para permisos",
        "❌ autorizacionImagen - consentimiento",
        "❌ estado (activo/inactivo)"
    ],
    "Campos EXTRA que podrían agregarse": [
        "➕ hermanos en el jardín",
        "➕ contacto de emergencia adicional",
        "➕ pediatra de cabecera",
        "➕ grupo sanguíneo",
        "➕ vacunas al día (sí/no)",
        "➕ necesidades especiales",
        "➕ autorizaciones específicas"
    ]
}

for categoria, items in campos_bd.items():
    print(f"\n{categoria}:")
    for item in items:
        print(f"  {item}")

print()
print("=" * 80)
print("RECOMENDACIONES")
print("=" * 80)
print()
print("1. 🔴 URGENTE: Crear formulario de inscripción completo que capture:")
print("   - Datos personales del alumno (nombre, DNI, fecha nacimiento)")
print("   - Datos de responsables (madre, padre, tutor)")
print("   - Información médica (alergias, medicación, obra social)")
print("   - Contactos de emergencia")
print("   - Autorizaciones (salida, imagen, etc.)")
print()
print("2. 📋 Agregar a la app:")
print("   - Módulo de 'Inscripciones' separado del de 'Alumnos'")
print("   - Workflow: Inscripción → Revisión → Aprobación → Alumno Activo")
print("   - Validaciones de edad según sala")
print("   - Carga masiva desde planillas")
print()
print("3. 📄 Generar desde el sistema:")
print("   - Listas por sala/turno (como los PDFs)")
print("   - Ficha completa del alumno")
print("   - Planilla de asistencia")
print("   - Contactos de emergencia por sala")
print()
print("4. 🔄 Proceso sugerido para 2026:")
print("   - Completar datos faltantes de cada alumno")
print("   - Validar fechas de nacimiento vs sala asignada")
print("   - Recopilar información médica")
print("   - Registrar datos de responsables")
print()

# Generar archivo de ejemplo para importación
print("=" * 80)
print("GENERANDO ARCHIVO SQL DE EJEMPLO...")
print("=" * 80)
print()

sql_output = []
sql_output.append("-- Script de importación de alumnos 2026")
sql_output.append("-- NOTA: Este script requiere completar los campos faltantes")
sql_output.append("")

for sala, alumnos in inscripciones.items():
    turno = "Mañana" if "Mañana" in sala else "Tarde"
    sala_numero = "3" if "de 3" in sala or "Sala de 3" in sala else ("4" if "4" in sala else "5")
    
    sql_output.append(f"-- {sala} ({len(alumnos)} alumnos)")
    
    for i, nombre_completo in enumerate(alumnos, 1):
        parsed = parse_nombre(nombre_completo)
        sql_output.append(f"""
INSERT INTO alumnos (
    nombre, apellidoPaterno, apellidoMaterno, 
    fechaNacimiento, dni, domicilio, 
    telefonoContacto, emailContacto,
    nombreMadre, dniMadre, telefonoMadre,
    nombrePadre, dniPadre, telefonoPadre,
    obraSocial, alergias, medicacion,
    sala, turno, estado
) VALUES (
    '{parsed["nombre"]}',
    '{parsed["apellidoPaterno"]}',
    '{parsed["apellidoMaterno"]}',
    NULL, -- TODO: completar fecha de nacimiento
    NULL, -- TODO: completar DNI
    NULL, -- TODO: completar domicilio
    NULL, -- TODO: completar teléfono
    NULL, -- TODO: completar email
    NULL, -- TODO: completar nombre madre
    NULL, -- TODO: completar DNI madre
    NULL, -- TODO: completar teléfono madre
    NULL, -- TODO: completar nombre padre
    NULL, -- TODO: completar DNI padre
    NULL, -- TODO: completar teléfono padre
    NULL, -- TODO: completar obra social
    NULL, -- TODO: completar alergias
    NULL, -- TODO: completar medicación
    'Sala {sala_numero}',
    '{turno}',
    'activo'
);""")

with open("/home/jmro/Escritorio/kindergarten_project_guide/inscripciones_2026_template.sql", "w", encoding="utf-8") as f:
    f.write("\n".join(sql_output))

print("✅ Archivo generado: inscripciones_2026_template.sql")
print("   Este archivo contiene los nombres extraídos pero requiere completar")
print("   los campos faltantes antes de importar a la base de datos.")
print()
print("=" * 80)
