import React from 'react';
import { Row, Col } from '../atoms/Grid';
import Input from '../atoms/Input';
import Select from '../atoms/Select';
import TextArea from '../atoms/TextArea';
import Toggle from '../atoms/Toggle';

const EmergencyContactStep = ({ data, onChange, errors }) => {
  return (
    <div>
      <h5>Contacto de Emergencia</h5>
      <p className="text-muted">Información para contacto en caso de emergencia</p>
      
      <Row>
        <Col md={6}>
          <Input
            label="Nombre Completo"
            name="emergency_contact_full_name"
            value={data.emergency_contact_full_name || ''}
            onChange={onChange}
            normalize
          />
        </Col>
        <Col md={6}>
          <Input
            label="Relación"
            name="emergency_contact_relationship"
            value={data.emergency_contact_relationship || ''}
            onChange={onChange}
            normalize
          />
        </Col>
      </Row>
      
      <Row>
        <Col md={6}>
          <Input
            label="Teléfono"
            name="emergency_contact_phone"
            value={data.emergency_contact_phone || ''}
            onChange={onChange}
            type="tel"
          />
        </Col>
        <Col md={6}>
          <Input
            label="Teléfono Alternativo"
            name="emergency_contact_alternative_phone"
            value={data.emergency_contact_alternative_phone || ''}
            onChange={onChange}
            type="tel"
          />
        </Col>
      </Row>
      
      <Row>
        <Col md={6}>
          <Input
            label="Prioridad"
            name="emergency_contact_priority"
            value={data.emergency_contact_priority || 1}
            onChange={onChange}
            type="number"
          />
        </Col>
        <Col md={6}>
          <Toggle
            label="Autorizado para retirar"
            name="emergency_contact_authorized_pickup"
            checked={data.emergency_contact_authorized_pickup || false}
            onChange={onChange}
          />
        </Col>
      </Row>
      
      <Row>
        <Col md={6}>
          <Input
            label="ID de Contacto de Emergencia"
            name="emergency_contact_id"
            value={data.emergency_contact_id || ''}
            onChange={onChange}
            type="number"
            disabled // Este campo generalmente se genera automáticamente
          />
        </Col>
      </Row>
    </div>
  );
};

export default EmergencyContactStep;