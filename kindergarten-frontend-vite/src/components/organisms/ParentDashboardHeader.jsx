import React from 'react';
import { PersonFill } from 'react-bootstrap-icons';
import { Row, Col } from '../atoms/Grid';
import Button from '../atoms/Button';

const ParentDashboardHeader = ({ currentUser, logout }) => {
  return (
    <Row className="mb-4">
      <Col>
        <h1 className="h3 mb-0">
          <PersonFill className="me-2" /> Portal de Padres
        </h1>
        <p className="text-muted">Bienvenido/a {currentUser.name || currentUser.email}</p>
      </Col>
      <Col xs="auto">
        <Button variant="outline-secondary" onClick={logout}>
          Cerrar Sesión
        </Button>
      </Col>
    </Row>
  );
};

export default ParentDashboardHeader;