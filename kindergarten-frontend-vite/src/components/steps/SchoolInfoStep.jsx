import React from 'react';
import { Row, Col } from '../atoms/Grid';
import Input from '../atoms/Input';
import Select from '../atoms/Select';
import TextArea from '../atoms/TextArea';
import Toggle from '../atoms/Toggle';

const SchoolInfoStep = ({ data, onChange, errors }) => {
  return (
    <div>
      <h5>Información Escolar</h5>
      <p className="text-muted">Detalles sobre la situación escolar del alumno</p>
      
      <Row>
        <Col md={6}>
          <Select
            label="Sala"
            name="classroom_id"
            value={data.classroom_id || ''}
            onChange={onChange}
          >
            <option value="">Seleccionar sala</option>
            <option value="1">Sala 3</option>
            <option value="2">Sala 4</option>
            <option value="3">Sala 5</option>
          </Select>
        </Col>
        <Col md={6}>
          <Select
            label="Turno"
            name="shift"
            value={data.shift || ''}
            onChange={onChange}
          >
            <option value="">Seleccionar turno</option>
            <option value="Mañana">Mañana</option>
            <option value="Tarde">Tarde</option>
          </Select>
        </Col>
      </Row>
      
      <Row>
        <Col md={6}>
          <Select
            label="Estado"
            name="status"
            value={data.status || 'preinscripto'}
            onChange={onChange}
          >
            <option value="preinscripto">Preinscripto</option>
            <option value="pendiente">Pendiente</option>
            <option value="approved">Aprobado</option>
            <option value="sorteo">Sorteo</option>
            <option value="inscripto">Inscripto</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
            <option value="egresado">Egresado</option>
            <option value="rechazado">Rechazado</option>
          </Select>
        </Col>
        <Col md={6}>
          <Input
            label="Fecha de Inscripción"
            name="enrollment_date"
            type="date"
            value={data.enrollment_date || ''}
            onChange={onChange}
          />
        </Col>
      </Row>
      
      <Row>
        <Col md={6}>
          <Input
            label="Fecha de Retiro"
            name="withdrawal_date"
            type="date"
            value={data.withdrawal_date || ''}
            onChange={onChange}
          />
        </Col>
        <Col md={6}>
          <Toggle
            label="Tiene hermanos en la escuela"
            name="has_siblings_in_school"
            checked={data.has_siblings_in_school || false}
            onChange={onChange}
          />
        </Col>
      </Row>
    </div>
  );
};

export default SchoolInfoStep;