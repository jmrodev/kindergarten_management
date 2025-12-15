import { useState } from 'react';
import Card from '../Atoms/Card';
import Text from '../Atoms/Text';
import Button from '../Atoms/Button';
import Input from '../Atoms/Input';
import DataCardList from '../Organisms/DataCardList';

const MobileTeachers = ({ teachers, onEdit, onDelete, onAdd, searchTerm, setSearchTerm }) => {
  // Campos para la vista de cards en móvil
  const cardFields = [
    { key: 'id', label: 'ID' },
    { key: 'dni', label: 'DNI' },
    { key: 'email', label: 'Email' },
    { key: 'classroom', label: 'Salón Asignado' },
    { key: 'specialty', label: 'Especialidad' }
  ];

  return (
    <Card>
      <Text variant="h1">Profesores - Móvil</Text>

      <div className="teachers-header">
        <Button variant="primary" onClick={onAdd}>Agregar Profesor</Button>
        <Input
          type="text"
          placeholder="Buscar profesores..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <DataCardList
        items={teachers}
        title="Profesores"
        fields={cardFields}
        onEdit={onEdit}
        onDelete={onDelete}
        onAdd={onAdd}
        itemTitleKey="name"
      />
    </Card>
  );
};

export default MobileTeachers;