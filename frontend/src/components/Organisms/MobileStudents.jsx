import Card from '../Atoms/Card';
// header removed for mobile (read-only view)
import Input from '../Atoms/Input';
import DataCardList from '../Organisms/DataCardList';

const MobileStudents = ({ students, onEdit, onDelete, searchTerm, setSearchTerm }) => {
  // Campos para la vista de cards en móvil
  const cardFields = [
    { key: 'id', label: 'ID' },
    { key: 'dni', label: 'DNI' },
    { key: 'classroom', label: 'Salón' },
    { key: 'status', label: 'Estado' }
  ];

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
        items={students}
        title="Estudiantes"
        fields={cardFields}
        onEdit={onEdit}
        onDelete={onDelete}
        itemTitleKey="name"
        showHeader={false}
      />
    </Card>
  );
};

export default MobileStudents;
