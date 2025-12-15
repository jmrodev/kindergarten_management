import React from 'react';
import TableRow from '../Atoms/TableRow';
import TableCell from '../Atoms/TableCell';
import PermissionToggle from '../Atoms/PermissionToggle';

const PermissionRow = ({ module, actions, getPermValue, onToggle }) => {
  return (
    <TableRow>
      <TableCell>{module.module_name}</TableCell>
      {actions.map(action => (
        <TableCell key={action.id} className="permission-cell">
          <PermissionToggle
            checked={getPermValue(module.id, action.id)}
            onChange={(checked) => onToggle(module.id, action.id, checked)}
          />
        </TableCell>
      ))}
    </TableRow>
  );
};

export default PermissionRow;
