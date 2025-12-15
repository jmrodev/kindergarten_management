import Card from '../Atoms/Card';
// header removed for mobile (read-only view)
import Input from '../Atoms/Input';
import DataCardList from '../Organisms/DataCardList';

const MobileStudents = ({ students, onEdit, onDelete, searchTerm, setSearchTerm }) => {
  // Campos para la vista de cards en móvil
  const cardFields = [
    { key: 'id', label: 'ID' },
    { key: 'dni', label: 'DNI' },
    { key: 'classroom_name', label: 'Salón' },
    { key: 'enrollment_status', label: 'Estado' }
  ];

  // Función para combinar nombre completo
  const studentsWithFullName = students.map(s => ({
    ...s,
    full_name: `${s.first_name} ${s.last_name}`
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
      </div>

      <DataCardList
        items={studentsWithFullName}
        title="Estudiantes"
        fields={cardFields}
        onEdit={onEdit}
        onDelete={onDelete}
        itemTitleKey="full_name"
        showHeader={false}
      />
    </Card>
  );
};

export default MobileStudents;
