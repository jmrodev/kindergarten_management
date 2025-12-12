import React from 'react';

const TableCell = ({ children, className = "", ...props }) => {
  return (
    <td 
      className={`office-table-cell ${className}`} 
      {...props}
    >
      {children}
    </td>
  );
};

export default TableCell;