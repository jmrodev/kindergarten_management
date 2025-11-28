-- Agregar campo shift (turno) a la tabla classroom
-- Fecha: 2025-11-27

USE kindergarten_db;

-- Agregar columna shift después de capacity
ALTER TABLE classroom 
ADD COLUMN shift ENUM('Mañana', 'Tarde', 'Ambos') DEFAULT 'Mañana' AFTER capacity;

-- Ver estructura actualizada
DESCRIBE classroom;

-- Actualizar salas existentes con turno
-- Puedes ajustar según tus necesidades
UPDATE classroom SET shift = 'Mañana' WHERE id IN (1, 3);
UPDATE classroom SET shift = 'Tarde' WHERE id IN (2, 4, 5);

-- Ver salas actualizadas
SELECT id, name, capacity, shift FROM classroom ORDER BY name;

SELECT 'Campo shift agregado exitosamente a classroom' as Resultado;
