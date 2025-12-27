import Card from '../Atoms/Card';
// header removed for mobile (read-only view)
import Input from '../Atoms/Input';
import DataCardList from '../Organisms/DataCardList';
import { usePermissions } from '../../context/PermissionsContext';

import { studentFields } from '../../config/fields/studentFields.jsx';

const MobileStudents = ({ students, onEdit, onDelete, searchTerm, setSearchTerm, onView, statusFilter, onStatusFilterChange }) => {
  const { permissions: perms = {} } = usePermissions();
  const canView = perms['alumnos:ver'] !== undefined ? perms['alumnos:ver'] : true;
  const canEdit = perms['students:edit'] !== undefined ? perms['students:edit'] : true;
  const canDelete = perms['students:delete'] !== undefined ? perms['students:delete'] : true;

  // Filter fields for mobile view
  const cardFields = studentFields.filter(field => field.showInMobile);

  // Función para combinar nombre completo
  const studentsWithFullName = students.map(s => ({
    ...s,
    full_name: `${s.first_name} ${s.paternal_surname || ''} ${s.maternal_surname || ''}`.trim()
  }));

  return (
    <Card>
      <div className="students-header">
        {/* No mostrar botón de CRUD en móvil: vista únicamente lectura */}
        <Input
          type="text"
          placeholder="Buscar estudiantes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          className="select-field"
          style={{ width: '100%', marginTop: '10px' }}
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
        >
          <option value="">Todos los Estados</option>
          <option value="activo">Activo</option>
          <option value="preinscripto">Preinscripto</option>
          <option value="pendiente">Pendiente</option>
          <option value="inscripto">Inscripto</option>
          <option value="egresado">Egresado</option>
          <option value="sorteo">Sorteo</option>
          <option value="inactivo">Inactivo</option>
          <option value="rechazado">Rechazado</option>
        </select>

      </div>

      <DataCardList
        items={studentsWithFullName}
        title="Estudiantes"
        fields={cardFields}
        onEdit={canEdit ? onEdit : null}
        onItemSelect={canView ? onView : null}
        onDelete={canDelete ? onDelete : null}
        itemTitleKey="full_name"
        showHeader={false}
      />
    </Card>
  );
};

export default MobileStudents;
