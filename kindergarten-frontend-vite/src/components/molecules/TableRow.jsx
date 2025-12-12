import React from 'react';

const TableRow = ({ children, className = "", status = null, isOdd = false, ...props }) => {
  const getStatusClass = () => {
    switch (status) {
      case 'active':
        return 'office-row-active';
      case 'inactive':
        return 'office-row-inactive';
      case 'warning':
        return 'office-row-warning';
      case 'danger':
        return 'office-row-danger';
      case 'success':
        return 'office-row-success';
      default:
        return '';
    }
  };

  const getEvenOddClass = () => {
    return isOdd ? 'office-row-odd' : 'office-row-even';
  };

  return (
    <tr
      className={`office-table-row ${getStatusClass()} ${getEvenOddClass()} ${className}`}
      {...props}
    >
      {children}
    </tr>
  );
};

export default TableRow;