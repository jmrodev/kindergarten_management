import React from 'react';
import Card from '../atoms/Card';

const ParentInfoCard = ({ parentInfo, currentUser }) => {
  return (
    <Card>
      <Card.Header>
        <h5 className="mb-0">Información del Padre</h5>
      </Card.Header>
      <Card.Body>
        <p><strong>Nombre:</strong> {parentInfo?.name || currentUser.name}</p>
        <p><strong>Email:</strong> {parentInfo?.email || currentUser.email}</p>
        <p><strong>Registrado desde:</strong> {parentInfo?.created_at ? new Date(parentInfo.created_at).toLocaleDateString() : 'N/A'}</p>
      </Card.Body>
    </Card>
  );
};

export default ParentInfoCard;
