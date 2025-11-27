# 📊 DATOS DE EJEMPLO - SISTEMA DE GESTIÓN JARDÍN DE INFANTES

## 📁 Archivos Creados

```
/db/
├── schema.sql            # Estructura de la base de datos
├── sample_data.sql       # Datos de ejemplo (NUEVO)
└── load_sample_data.sh   # Script para cargar datos (NUEVO)
```

---

## 🚀 Cómo Cargar los Datos

### Opción 1: Script automático (Recomendado)
```bash
cd /home/jmro/Escritorio/kindergarten_project_guide/db
./load_sample_data.sh
```

### Opción 2: Comando directo
```bash
sudo mariadb < /home/jmro/Escritorio/kindergarten_project_guide/db/sample_data.sql
```

### Opción 3: MySQL/MariaDB CLI
```bash
sudo mariadb
> source /home/jmro/Escritorio/kindergarten_project_guide/db/sample_data.sql
> exit
```

---

## 📊 Datos Incluidos

### 🏫 5 SALAS (Classrooms)

| Sala | Capacidad | Alumnos |
|------|-----------|---------|
| **Sala Roja** | 20 | 20 |
| **Sala Azul** | 18 | 18 |
| **Sala Verde** | 22 | 22 |
| **Sala Amarilla** | 20 | 20 |
| **Sala Naranja** | 19 | 19 |

**Total: 99 alumnos**

---

### 📍 15 DIRECCIONES (Addresses)

Direcciones reales de Tandil, Buenos Aires:
- Avenida San Martín 1523
- Calle Mitre 892
- Calle 9 de Julio 456
- Avenida Colón 2341
- Calle Salta 1961
- Calle Pinto 567
- Calle Rivadavia 1234
- Avenida Avellaneda 3456
- Calle Chacabuco 789
- Calle Belgrano 2100
- Avenida Santamarina 1800
- Calle Yrigoyen 950
- Calle Güemes 1450
- Avenida España 2890
- Calle San Lorenzo 678

**Nota:** Algunas direcciones son compartidas por hermanos

---

### 📞 15 CONTACTOS DE EMERGENCIA (Emergency Contacts)

Contactos con nombres realistas argentinos:
- Claudia Pérez (Madre) - 02494-523129
- Roberto González (Padre) - 02494-445678
- Patricia Rodríguez (Madre) - 02494-334455
- Miguel Fernández (Padre) - 02494-556677
- Andrea López (Madre) - 02494-667788
- Carlos Martínez (Padre) - 02494-778899
- Silvia García (Madre) - 02494-889900
- Juan Sánchez (Padre) - 02494-990011
- Mónica Díaz (Madre) - 02494-112233
- Fernando Torres (Padre) - 02494-223344
- Valeria Romero (Madre) - 02494-334466
- Diego Castro (Padre) - 02494-445577
- Cecilia Morales (Madre) - 02494-556688
- Pablo Ruiz (Padre) - 02494-667799
- Natalia Suárez (Madre) - 02494-778800

**Nota:** Algunos contactos son compartidos por hermanos

---

### 👶 99 ALUMNOS (Students)

#### Características de los datos:

✅ **Nombres realistas argentinos**
- Primer nombre, segundo nombre (opcional), tercer nombre (opcional)
- Apellidos paterno y materno
- Apodos cariñosos típicos de Argentina

✅ **Edades apropiadas**
- Nacidos entre 2019-2021 (3-5 años)
- Fechas de nacimiento distribuidas a lo largo del año

✅ **Distribución por turnos**
- **Turno Mañana:** 8:00 - 12:00
- **Turno Tarde:** 13:00 - 17:00
- Aproximadamente 50% cada turno

✅ **Hermanos**
- Varios pares de hermanos comparten:
  - Misma dirección
  - Mismo contacto de emergencia
  - Diferentes salas (por edad)

#### Ejemplos de hermanos en el dataset:

1. **Familia Pérez:**
   - Juan Martín Pérez González (Sala Roja)
   - María Sol Pérez González (Sala Roja)
   - Victoria Constanza Pérez González (Sala Azul)
   - Marcos Alejandro Pérez González (Sala Verde)
   - Natalia Soledad Pérez González (Sala Amarilla)
   - Emilio Santiago Pérez González (Sala Amarilla)
   - Tadeo Mateo Pérez González (Sala Naranja)

2. **Familia Rodríguez:**
   - Lucas Ezequiel Rodríguez López (Sala Roja)
   - Martina Agustina Rodríguez López (Sala Roja)
   - Renata Guadalupe Rodríguez López (Sala Azul)
   - Adrián Felipe Rodríguez López (Sala Verde)
   - Paloma Luciana Rodríguez López (Sala Amarilla)
   - Vanesa Estela Rodríguez López (Sala Naranja)

3. **Familia García:**
   - Emma Isabella García Morales (Sala Roja)
   - Mateo Santiago García Morales (Sala Roja)
   - Jazmín Belén García Morales (Sala Azul)
   - Elías Samuel García Morales (Sala Verde)
   - Úrsula Victoria García Morales (Sala Amarilla)
   - Kiara Milagros García Morales (Sala Naranja)
   - Zaira Mabel García Morales (Sala Naranja)

---

## 📈 Estadísticas de los Datos

### Por Sala:
```
Sala Roja:     20 alumnos (100% ocupación)
Sala Azul:     18 alumnos (100% ocupación)
Sala Verde:    22 alumnos (100% ocupación)
Sala Amarilla: 20 alumnos (100% ocupación)
Sala Naranja:  19 alumnos (100% ocupación)
```

### Por Turno:
```
Mañana: ~50 alumnos
Tarde:  ~49 alumnos
```

### Por Edad:
```
5 años (2019): ~40 alumnos
4 años (2020): ~40 alumnos
3 años (2021): ~19 alumnos
```

---

## 🔍 Consultas Útiles

### Ver todos los alumnos de una sala:
```sql
SELECT 
    CONCAT(s.first_name, ' ', s.paternal_surname) as Alumno,
    s.shift as Turno,
    YEAR(CURDATE()) - YEAR(s.birth_date) as Edad
FROM student s
INNER JOIN classroom c ON s.classroom_id = c.id
WHERE c.name = 'Sala Roja'
ORDER BY s.first_name;
```

### Ver hermanos (mismo contacto de emergencia):
```sql
SELECT 
    ec.full_name as Contacto,
    GROUP_CONCAT(
        CONCAT(s.first_name, ' ', s.paternal_surname) 
        ORDER BY s.birth_date 
        SEPARATOR ', '
    ) as Hermanos,
    COUNT(s.id) as Cantidad
FROM emergency_contact ec
INNER JOIN student s ON ec.id = s.emergency_contact_id
GROUP BY ec.id, ec.full_name
HAVING COUNT(s.id) > 1
ORDER BY COUNT(s.id) DESC;
```

### Ver ocupación de salas:
```sql
SELECT 
    c.name as Sala,
    COUNT(s.id) as Alumnos,
    c.capacity as Capacidad,
    CONCAT(ROUND((COUNT(s.id) / c.capacity) * 100, 1), '%') as Ocupación
FROM classroom c
LEFT JOIN student s ON c.id = s.classroom_id
GROUP BY c.id
ORDER BY c.name;
```

### Ver alumnos por turno y sala:
```sql
SELECT 
    c.name as Sala,
    SUM(CASE WHEN s.shift = 'Mañana' THEN 1 ELSE 0 END) as Mañana,
    SUM(CASE WHEN s.shift = 'Tarde' THEN 1 ELSE 0 END) as Tarde,
    COUNT(s.id) as Total
FROM classroom c
LEFT JOIN student s ON c.id = s.classroom_id
GROUP BY c.id
ORDER BY c.name;
```

### Ver alumnos con la misma dirección:
```sql
SELECT 
    CONCAT(a.street, ' ', a.number) as Direccion,
    GROUP_CONCAT(
        CONCAT(s.first_name, ' ', s.paternal_surname) 
        SEPARATOR ', '
    ) as Alumnos,
    COUNT(s.id) as Cantidad
FROM address a
INNER JOIN student s ON a.id = s.address_id
GROUP BY a.id
HAVING COUNT(s.id) > 1
ORDER BY COUNT(s.id) DESC;
```

---

## ✅ Ventajas de estos Datos

1. ✅ **Realistas:** Nombres, direcciones y teléfonos típicos argentinos
2. ✅ **Completos:** Todos los campos están llenos
3. ✅ **Diversos:** Variedad de nombres, edades y situaciones
4. ✅ **Relaciones:** Hermanos que comparten datos
5. ✅ **Volumen:** Suficientes datos para probar funcionalidades
6. ✅ **Distribución:** Balanceado entre salas y turnos
7. ✅ **Casos de prueba:** Incluye casos especiales (hermanos, mismas direcciones)

---

## 🧪 Casos de Prueba Incluidos

### 1. Eliminar alumno sin hermanos
- Debería eliminar también dirección y contacto

### 2. Eliminar alumno con hermanos
- Debería mantener dirección y contacto (usados por otros)

### 3. Buscar por nombre
- Varios alumnos con nombres comunes (María, Juan, etc.)

### 4. Filtrar por sala
- Cada sala tiene su conjunto de alumnos

### 5. Filtrar por turno
- Balance 50/50 entre mañana y tarde

### 6. Editar alumno
- Datos completos para modificar

### 7. Capacidad de salas
- Todas las salas están al 100% de ocupación

---

## 🔄 Resetear los Datos

Si necesitas volver a cargar los datos limpios:

```bash
# Opción 1: Re-ejecutar el script
./load_sample_data.sh

# Opción 2: Recrear todo desde cero
sudo mariadb < schema.sql
sudo mariadb < sample_data.sql
```

---

## 📝 Notas Importantes

⚠️ **Antes de cargar en producción:**
- Estos son datos de EJEMPLO/PRUEBA
- NO usar en entornos de producción real
- Los teléfonos y direcciones son ficticios

✅ **Perfecto para:**
- Desarrollo local
- Testing de funcionalidades
- Demos del sistema
- Capacitación de usuarios
- Pruebas de rendimiento

---

## 🎯 Próximos Pasos

Después de cargar los datos:

1. ✅ Reiniciar el backend
2. ✅ Recargar el frontend
3. ✅ Ver la lista de alumnos poblada
4. ✅ Probar búsquedas y filtros
5. ✅ Probar edición de datos
6. ✅ Probar eliminación (con y sin hermanos)
7. ✅ Ver estadísticas de las salas

---

¡Disfruta explorando el sistema con datos realistas! 🎉
