// views/calendar/CalendarView.js - Updated to use atomic design
import React from 'react';
import { Calendar } from 'react-bootstrap-icons';
import { Link, useNavigate } from 'react-router-dom';
import OfficeRibbonWithTitle from '../../components/organisms/OfficeRibbonWithTitle';
import Container from '../../components/atoms/Container';
import { Row, Col } from '../../components/atoms/Grid';
import Card from '../../components/atoms/Card';
import Button from '../../components/atoms/Button';

const CalendarView = () => {
  const navigate = useNavigate();

  return (
    <Container fluid className="office-form-container">
      <OfficeRibbonWithTitle
        title="Calendario Escolar"
        menuItems={[
          {
            label: "Volver",
            icon: <Calendar size={16} />,
            onClick: () => navigate('/dashboard')
          },
          {
            label: "Nuevo Evento",
            icon: <Calendar size={16} />,
            onClick: () => {},
            variant: "primary"
          }
        ]}
        onClose={() => navigate('/dashboard')}
        navigate={navigate}
      />

      <Card className="office-form-card">
        <Card.Body className="office-form-card-body">
          <p>Visualización del calendario escolar...</p>
          <div className="text-center py-5">
            <Calendar size={100} className="text-muted" />
            <p className="mt-3">Calendario interactivo para eventos escolares</p>
          </div>
        </Card.Body>
        <Card.Footer className="office-form-card-footer">
          <div className="d-flex justify-content-end gap-2">
            <Button
              variant="outline-secondary"
              onClick={() => navigate('/dashboard')}
            >
              <Calendar className="me-1" />
              Volver al Dashboard
            </Button>
          </div>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default CalendarView;