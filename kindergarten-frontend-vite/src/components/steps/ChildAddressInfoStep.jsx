import React from 'react';
import { Row, Col } from '../atoms/Grid';
import Input from '../atoms/Input';
import Select from '../atoms/Select';
import TextArea from '../atoms/TextArea';
import Toggle from '../atoms/Toggle';

const ChildAddressInfoStep = ({ data, onChange, errors }) => {
  return (
    <div>
      <h5>Dirección del Niño</h5>
      <p className="text-muted">Información de la dirección del niño/a</p>
      
      <Row>
        <Col md={6}>
          <Input
            label="Calle"
            name="street"
            value={data.street || ''}
            onChange={onChange}
            normalize
          />
        </Col>
        <Col md={6}>
          <Input
            label="Número"
            name="number"
            value={data.number || ''}
            onChange={onChange}
          />
        </Col>
      </Row>
      
      <Row>
        <Col md={6}>
          <Input
            label="Ciudad"
            name="city"
            value={data.city || ''}
            onChange={onChange}
            normalize
          />
        </Col>
        <Col md={6}>
          <Input
            label="Provincia"
            name="provincia"
            value={data.provincia || ''}
            onChange={onChange}
            normalize
          />
        </Col>
      </Row>
      
      <Row>
        <Col md={6}>
          <Input
            label="Código Postal (Opcional)"
            name="postal_code_optional"
            value={data.postal_code_optional || ''}
            onChange={onChange}
          />
        </Col>
      </Row>
    </div>
  );
};

export default ChildAddressInfoStep;