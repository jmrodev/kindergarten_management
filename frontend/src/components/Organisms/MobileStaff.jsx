import { useState } from 'react';
import Card from '../Atoms/Card';
import Text from '../Atoms/Text';
import Button from '../Atoms/Button';
import Input from '../Atoms/Input';
import DataCardList from '../Organisms/DataCardList';

const MobileStaff = ({ staff, onEdit, onDelete, onAdd, searchTerm, setSearchTerm, onView }) => {
  // Campos para la vista de cards en móvil
  const cardFields = [];

  return (
    <Card>
      <Text variant="h1">Personal</Text>

      <div className="teachers-header">
        <Button variant="primary" onClick={onAdd}>Agregar Personal</Button>
        <Input
          type="text"
          placeholder="Buscar personal..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <DataCardList
        items={staff}
        title="Personal"
        fields={cardFields}
        onEdit={onEdit}
        onDelete={onDelete}
        onAdd={onAdd}
        onItemSelect={onView}
        itemTitleKey="name"
      />
    </Card>
  );
};

export default MobileStaff;