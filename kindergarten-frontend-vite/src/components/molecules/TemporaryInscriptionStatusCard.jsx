import React from 'react';
import { Pencil } from 'react-bootstrap-icons';
import Card from '../atoms/Card';
import Button from '../atoms/Button';

const TemporaryInscriptionStatusCard = () => {
  return (
    <Card className="h-100">
      <Card.Body className="d-flex flex-column justify-content-center align-items-center">
        <Button variant="outline-secondary" className="w-100" disabled>
          <Pencil className="me-2" />
          Inscripciones Temporalmente Cerradas
        </Button>
        <small className="text-muted mt-2">
          Contactar al jardín para iniciar proceso de inscripción
        </small>
      </Card.Body>
    </Card>
  );
};

export default TemporaryInscriptionStatusCard;