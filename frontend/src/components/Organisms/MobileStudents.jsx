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
    { key: 'status', label: 'Estado' },
    // Datos de contacto útiles en detalle
    { key: 'pediatrician_name', label: 'Pediatra' },
    { key: 'pediatrician_phone', label: 'Tel. Pediatra', type: 'phone' },
    { key: 'guardian_email', label: 'Email Tutor', type: 'email', valueFn: (s) => s.guardian_email || s.emergency_contact?.email_optional },
    { key: 'guardian_phone', label: 'Tel. Tutor', type: 'phone', valueFn: (s) => s.guardian_phone || s.emergency_contact?.phone }
  ];

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
