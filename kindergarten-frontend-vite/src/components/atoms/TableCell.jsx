import React from 'react';

const TableCell = ({ children, className = "", style = {}, ...props }) => {
  return (
    <td 
      className={`office-table-cell ${className}`} 
      style={style}
      {...props}
    >
      {children}
    </td>
  );
};

export default TableCell;