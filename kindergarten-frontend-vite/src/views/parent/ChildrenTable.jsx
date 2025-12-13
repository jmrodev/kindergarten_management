import React from 'react';
import Button from '../../components/atoms/Button';

function formatName(child) {
  const parts = [];
  if (child.nombre) parts.push(child.nombre);
  if (child.apellidoPaterno) parts.push(child.apellidoPaterno);
  if (child.apellidoMaterno) parts.push(child.apellidoMaterno);
  return parts.join(' ') || child.name || '—';
}

function formatDate(d) {
  if (!d) return 'N/A';
  try { return new Date(d).toLocaleDateString(); } catch (e) { return d; }
}

export default function ChildrenTable({ children }) {
  return (
    <div className="table-responsive" role="region" aria-label="Hijos inscritos">
      <table className="table table-striped" aria-describedby="childrenHelp">
        <caption id="childrenHelp" className="visually-hidden">Lista de hijos asociados al usuario</caption>
        <thead>
          <tr>
            <th scope="col">Nombre</th>
            <th scope="col">DNI</th>
            <th scope="col">Fecha de Nacimiento</th>
            <th scope="col">Estado</th>
            <th scope="col">Sala</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {children.map((child) => (
            <tr key={child.id || child.id_alumno || Math.random()}>
              <td>{formatName(child)}</td>
              <td>{child.dni || child.documento || '—'}</td>
              <td>{formatDate(child.fechaNacimiento || child.fecha_nacimiento)}</td>
              <td>
                <span className="badge" aria-label={`Estado: ${child.estado || 'Desconocido'}`}>
                  {child.estado || 'Desconocido'}
                </span>
              </td>
              <td>{child['sala.nombre'] || child.sala?.nombre || 'No asignado'}</td>
              <td>
                <Button variant="outline-primary" size="sm" disabled title="Detalles no disponibles aún" aria-disabled="true">
                  Ver detalles
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
