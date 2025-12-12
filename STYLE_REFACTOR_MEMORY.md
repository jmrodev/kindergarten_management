Timestamp: 2025-12-11T15:32:30.501Z

Resumen breve:
- Objetivo: Eliminar estilos inline y que el CSS maneje la presentación en kindergarten-frontend-vite.
- Estado: Se movieron estilos estáticos a index.css, se añadieron utilidades CSS y se refactorizaron varios componentes para eliminar style inline o prop-style usage.

Qué se hizo (principales cambios):
- index.css: Añadidas utilidades y soporte para badges dinámicos (--badge-bg / --badge-color).
- Badge.jsx: Eliminado color inline; ahora establece variables CSS (--badge-bg / --badge-color) en style para permitir colores dinámicos sin estilos directos en JSX.
- Reemplazado estilos inline en vistas/componetes: StaffList.jsx, VaccinationList.jsx, VaccinationForm.jsx, ClassroomList.jsx, StudentForm.jsx, StudentList.jsx, StudentDetailsView.jsx, ReportsDashboard.jsx, Dashboard.jsx, ConfiguracionPage.jsx.
- Reemplazado uso de react-bootstrap en ReportsDashboard por componentes locales (Container/Row/Col/Card/Button).
- Creado utilidades CSS: .min-h-200, .no-text-decoration, .action-link-margin, .cursor-pointer, .icon-middle, .icon-block-mb, .flex-gap-1-5-wrap, .flex-1-min400, .flex-2-min600, .flex-gap-1-wrap-mt-1-5, .activity-card-flex, .loading-height-60.
- Table components: TableCell, TableHeaderCell, TableRow y OfficeTable actualizados para quitar el prop "style" y confiar en className (API ahora sin style prop).

Notas sobre estilos dinámicos que quedarán en JSX (intencional):
- OfficeRibbonWithTitle dropdown necesita posicionamiento dinámico (top/left); esos estilos inline se mantienen porque dependen de getBoundingClientRect en tiempo de ejecución.
- Badge.jsx sigue aplicando variables CSS vía style prop para colores dinámicos calculados (esto es aceptable: solo se usan variables CSS, no estilos completos en línea).

TODOs (siguientes pasos recomendados):
1. Hacer una pasada por componentes que aún aceptan `style` en su API (Container, Button, Card, Grid, FormSection, Spinner) y decidir si se elimina la prop `style` o se documenta su uso para casos dinámicos.
2. Ejecutar linter y build local para detectar errores introducidos por estos cambios (especialmente imports y nombres de clases).
3. Revisar OfficeRibbonWithTitle para abstraer posicionamiento dinámico a una pequeña utilidad si se desea reducir inline styles aún más.
4. Revisión visual (QA) de las vistas afectadas para corregir diferencias de espaciado o alineación.

Archivos modificados (resumen parcial):
- src/index.css
- src/components/atoms/Badge.jsx
- src/components/atoms/TableCell.jsx
- src/components/atoms/TableHeaderCell.jsx
- src/components/molecules/TableRow.jsx
- src/components/organisms/OfficeTable.jsx
- src/views/staff/StaffList.jsx
- src/views/vaccinations/VaccinationList.jsx
- src/views/vaccinations/VaccinationForm.jsx
- src/views/classrooms/ClassroomList.jsx
- src/components/organisms/StudentForm.jsx
- src/views/students/StudentList.jsx
- src/views/students/StudentDetailsView.jsx
- src/views/Dashboard.jsx
- src/views/reports/ReportsDashboard.jsx
- src/views/ConfiguracionPage.jsx

Comentarios finales:
- Se priorizó mantener comportamiento y accesibilidad; los cambios son mínimos y reversibles.
- Si querés, se puede continuar automáticamente con los pasos del TODO (ejecutar linter/build y/o eliminar props `style` restantes).
