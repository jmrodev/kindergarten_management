import React from 'react';
import { Row, Col } from '../atoms/Grid';
import Input from '../atoms/Input';
import Select from '../atoms/Select';
import TextArea from '../atoms/TextArea';
import Toggle from '../atoms/Toggle';

const MedicalInfoStep = ({ data, onChange, errors }) => {
  return (
    <div>
      <h5>Información Médica</h5>
      <p className="text-muted">Detalles sobre la salud del alumno</p>
      
      <Row>
        <Col md={6}>
          <Input
            label="Obra Social"
            name="health_insurance"
            value={data.health_insurance || ''}
            onChange={onChange}
            normalize
          />
        </Col>
        <Col md={6}>
          <Input
            label="Número de Afiliado"
            name="affiliate_number"
            value={data.affiliate_number || ''}
            onChange={onChange}
          />
        </Col>
      </Row>
      
      <Row>
        <Col md={6}>
          <Input
            label="Tipo de Sangre"
            name="blood_type"
            value={data.blood_type || ''}
            onChange={onChange}
          />
        </Col>
        <Col md={6}>
          <Select
            label="Estado de Vacunación"
            name="vaccination_status"
            value={data.vaccination_status || 'no_informado'}
            onChange={onChange}
          >
            <option value="completo">Completo</option>
            <option value="incompleto">Incompleto</option>
            <option value="pendiente">Pendiente</option>
            <option value="no_informado">No informado</option>
          </Select>
        </Col>
      </Row>
      
      <Row>
        <Col md={6}>
          <Input
            label="Nombre del Pediatra"
            name="pediatrician_name"
            value={data.pediatrician_name || ''}
            onChange={onChange}
            normalize
          />
        </Col>
        <Col md={6}>
          <Input
            label="Teléfono del Pediatra"
            name="pediatrician_phone"
            value={data.pediatrician_phone || ''}
            onChange={onChange}
            type="tel"
          />
        </Col>
      </Row>
      
      <Row>
        <Col md={12}>
          <TextArea
            label="Alergias"
            name="allergies"
            value={data.allergies || ''}
            onChange={onChange}
            rows={2}
          />
        </Col>
      </Row>
      
      <Row>
        <Col md={12}>
          <TextArea
            label="Medicamentos"
            name="medications"
            value={data.medications || ''}
            onChange={onChange}
            rows={2}
          />
        </Col>
      </Row>
      
      <Row>
        <Col md={12}>
          <TextArea
            label="Observaciones Médicas"
            name="medical_observations"
            value={data.medical_observations || ''}
            onChange={onChange}
            rows={2}
          />
        </Col>
      </Row>
      
      <Row>
        <Col md={12}>
          <TextArea
            label="Necesidades Especiales"
            name="special_needs"
            value={data.special_needs || ''}
            onChange={onChange}
            rows={2}
          />
        </Col>
      </Row>
    </div>
  );
};

export default MedicalInfoStep;