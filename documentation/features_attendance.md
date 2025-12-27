# Documentación de Funcionalidad: Módulo de Asistencia

## Visión General
El módulo de asistencia ha sido actualizado para ofrecer visualizaciones detalladas (diaria, semanal, mensual, anual) y una experiencia optimizada para dispositivos móviles mediante un asistente tipo "wizard".

## Funcionalidades Principales

### 1. Vista de Escritorio (Desktop)
- **Selector de Reporte**: Permite cambiar entre visualización Diario, Semanal, Mensual y Anual.
- **Vista Diaria**:
  - **Dashboard de Estadísticas**: Tarjetas visuales mostrando conteo de Presentes, Ausentes, Sin Registro, y desglose por Género (Nenes/Nenas).
  - **Tabla de Registro**: Lista de alumnos con estado, DNI y acciones rápidas para marcar presente/ausente.
  - **Indicador de Género**: Nueva columna mostrando el género del alumno.
- **Vista Semanal**:
  - Grilla de Lunes a Viernes.
  - Indicadores claros: ✅ (Presente), ❌ (Ausente), ⚪ (Sin Registro).
- **Vistas Mensual/Anual**:
  - Resumen agregado por alumno.
  - Totales de asistencia y porcentaje de cumplimiento.
  - Alerta visual para asistencia baja (<75%).

### 2. Vista Móvil (Mobile Wizard)
Diseñada para que el docente tome asistencia en el aula con el celular.
- **Modo Mazo de Cartas**: Muestra un alumno a la vez en pantalla completa.
- **Información Detallada**: Muestra Nombre, DNI y **Dirección** del alumno para fácil referencia.
- **Navegación**:
  - Botones grandes para marcar PRESENTE o AUSENTE.
  - Avance automático al siguiente alumno.
  - Botones Anterior/Siguiente para correcciones.
- **Pantalla de Resumen**:
  - Antes de guardar, muestra contadores totales.
  - Lista detallada desplegada de alumnos presentes, ausentes y **pendientes** (sin marcar).
  - Alerta visual para alumnos sin marcar.

### 3. Base de Datos
- **Nuevo Campo**: Se agregó `gender` (ENUM 'M', 'F') a la tabla `student` para permitir estadísticas desagregadas.

## Flujo de Uso (Móvil)
1. Seleccionar Sala y Fecha.
2. Pulsar "Comenzar Toma de Asistencia".
3. Marcar estado para cada alumno (deslizar/tocar).
4. Al finalizar, revisar el Resumen Detallado.
5. Pulsar "Guardar Todo".

## Consideraciones Técnicas
- **Persistencia**: La asistencia se guarda por defecto como 'Ausente' si no se marca, pero la interfaz visual distingue claramente 'Sin Registro' antes del guardado para evitar confusiones.
- **Validación**: El sistema impide guardar si la red falla y muestra alertas claras.
