import { useState } from 'react';
import Card from '../Atoms/Card';
import Text from '../Atoms/Text';
import Button from '../Atoms/Button';
import Input from '../Atoms/Input';
import DataCardList from '../Organisms/DataCardList';

const MobileClasses = ({ classes, onEdit, onDelete, onAdd, searchTerm, setSearchTerm }) => {
  // Campos para la vista de cards en móvil
  const cardFields = [
    { key: 'id', label: 'ID' },
    { key: 'capacity', label: 'Capacidad' },
    { key: 'shift', label: 'Turno' },
    { key: 'academicYear', label: 'Año Académico' },
    { key: 'ageGroup', label: 'Grupo de Edad' }
  ];

  return (
    <Card>
      <Text variant="h1">Clases - Móvil</Text>

      <div className="classes-header">
        <Button variant="primary" onClick={onAdd}>Agregar Clase</Button>
        <Input
          type="text"
          placeholder="Buscar clases..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <DataCardList
        items={classes}
        title="Clases"
        fields={cardFields}
        onEdit={onEdit}
        onDelete={onDelete}
        onAdd={onAdd}
        itemTitleKey="name"
      />
    </Card>
  );
};

export default MobileClasses;