import React from 'react';
import Card from '../atoms/Card';
import ChildrenTable from '../../views/parent/ChildrenTable'; // Note: Adjust path as needed

const EnrolledChildrenCard = ({ children }) => {
  return (
    <Card>
      <Card.Header>
        <h5 className="mb-0">Hijos Inscritos</h5>
      </Card.Header>
      <Card.Body>
        {children && children.length > 0 ? (
          <ChildrenTable children={children} />
        ) : (
          <p className="text-center text-muted">Aún no tiene hijos registrados en el sistema. Para iniciar el proceso de inscripción, contacte al jardín.</p>
        )}
      </Card.Body>
    </Card>
  );
};

export default EnrolledChildrenCard;
