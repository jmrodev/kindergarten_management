import React from 'react';
import { Row, Col } from '../atoms/Grid';
import Toggle from '../atoms/Toggle';

const ChildAuthorizationStep = ({ data, onChange, errors }) => {
  return (
    <div>
      <h5>Autorizaciones</h5>
      <p className="text-muted">Condiciones especiales y autorizaciones</p>
      
      <Row>
        <Col md={12}>
          <Toggle
            label="Autorización para fotografías"
            name="photo_authorization"
            checked={data.photo_authorization || false}
            onChange={onChange}
          />
        </Col>
      </Row>
      
      <Row>
        <Col md={12}>
          <Toggle
            label="Autorización para excursiones"
            name="trip_authorization"
            checked={data.trip_authorization || false}
            onChange={onChange}
          />
        </Col>
      </Row>
      
      <Row>
        <Col md={12}>
          <Toggle
            label="Autorización para atención médica de emergencia"
            name="medical_attention_authorization"
            checked={data.medical_attention_authorization || false}
            onChange={onChange}
          />
        </Col>
      </Row>
    </div>
  );
};

export default ChildAuthorizationStep;