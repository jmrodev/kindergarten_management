import { useState } from 'react';
import Card from '../Atoms/Card';
import Text from '../Atoms/Text';
import Button from '../Atoms/Button';
import Input from '../Atoms/Input';
import Select from '../Atoms/Select';
import DataCardList from '../Organisms/DataCardList';

const MobileAttendance = ({ attendance, onEdit, searchTerm, setSearchTerm, selectedClass, setSelectedClass, selectedDate, setSelectedDate }) => {
  // Campos para la vista de cards en móvil
  const cardFields = [
    { key: 'id', label: 'ID' },
    { key: 'date', label: 'Fecha' },
    { key: 'classroom', label: 'Salón' },
    { key: 'status', label: 'Estado' }
  ];

  return (
    <Card>
      {/* Encabezado móvil: ocultamos el título grande para dejar la UI limpia */}

      <div className="attendance-header">
        <div className="attendance-filters">
          <Select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="class-select"
          >
            <option value="Todos">Todos los salones</option>
            <option value="Maternal A">Maternal A</option>
            <option value="Maternal B">Maternal B</option>
            <option value="Jardín A">Jardín A</option>
            <option value="Jardín B">Jardín B</option>
            <option value="Preescolar A">Preescolar A</option>
          </Select>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-input"
          />
        </div>
      </div>

      <DataCardList
        items={attendance}
        title="Asistencia"
        fields={cardFields}
        onEdit={onEdit}
        itemTitleKey="studentName"
        showHeader={false}
      />
    </Card>
  );
};

export default MobileAttendance;