import React from 'react';
import { Row, Col } from '../atoms/Grid';
import Input from '../atoms/Input';
import Select from '../atoms/Select';
import TextArea from '../atoms/TextArea';

const PersonalInfoStep = ({ data, onChange, errors }) => {
  return (
    <div>
      <h5>Datos Personales</h5>
      <p className="text-muted">Información básica del alumno</p>
      
      <Row>
        <Col md={6}>
          <Input
            label="Nombre"
            name="first_name"
            value={data.first_name || ''}
            onChange={onChange}
            normalize
          />
        </Col>
        <Col md={6}>
          <Input
            label="Segundo Nombre (Opcional)"
            name="middle_name_optional"
            value={data.middle_name_optional || ''}
            onChange={onChange}
            normalize
          />
        </Col>
      </Row>
      
      <Row>
        <Col md={6}>
          <Input
            label="Tercer Nombre (Opcional)"
            name="third_name_optional"
            value={data.third_name_optional || ''}
            onChange={onChange}
            normalize
          />
        </Col>
        <Col md={6}>
          <Input
            label="Apellido Paterno"
            name="paternal_surname"
            value={data.paternal_surname || ''}
            onChange={onChange}
            normalize
          />
        </Col>
      </Row>
      
      <Row>
        <Col md={6}>
          <Input
            label="Apellido Materno (Opcional)"
            name="maternal_surname"
            value={data.maternal_surname || ''}
            onChange={onChange}
            normalize
          />
        </Col>
        <Col md={6}>
          <Input
            label="Apodo (Opcional)"
            name="nickname_optional"
            value={data.nickname_optional || ''}
            onChange={onChange}
            normalize
          />
        </Col>
      </Row>
      
      <Row>
        <Col md={6}>
          <Input
            label="DNI"
            name="dni"
            value={data.dni || ''}
            onChange={onChange}
          />
        </Col>
        <Col md={6}>
          <Input
            label="Fecha de Nacimiento"
            name="birth_date"
            type="date"
            value={data.birth_date || ''}
            onChange={onChange}
          />
        </Col>
      </Row>
      
      <Row>
        <Col md={12}>
          <TextArea
            label="Observaciones"
            name="observations"
            value={data.observations || ''}
            onChange={onChange}
            rows={3}
          />
        </Col>
      </Row>
    </div>
  );
};

export default PersonalInfoStep;