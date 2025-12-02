import React from 'react';

const TableHeaderCell = ({ children, className = "", style = {}, sort = false, sortOrder = null, ...props }) => {
  return (
    <th 
      className={`office-table-header-cell ${sort ? 'sortable' : ''} ${sortOrder ? `sorted-${sortOrder}` : ''} ${className}`} 
      style={style}
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