import React from 'react';

const TableHeaderCell = ({ children, className = "", sort = false, sortOrder = null, ...props }) => {
  return (
    <th 
      className={`office-table-header-cell ${sort ? 'sortable' : ''} ${sortOrder ? `sorted-${sortOrder}` : ''} ${className}`} 
      {...props}
    >
      {children}
      {sort && (
        <span className="sort-indicator">
          {sortOrder === 'asc' ? ' ▲' : sortOrder === 'desc' ? ' ▼' : ' ◆'}
        </span>
      )}
    </th>
  );
};

export default TableHeaderCell;