import React from 'react';
import TableRow from '../molecules/TableRow';
import TableCell from '../atoms/TableCell';

const OfficeTable = ({ 
  headers, 
  data, 
  renderRow, 
  emptyMessage = "No hay datos para mostrar", 
  className = "",
  ...props 
}) => {
  return (
    <div className="office-table-wrapper">
      <div className="office-table-responsive">
        <table className={`office-table ${className}`} {...props}>
          <thead className="office-table-thead">
            <tr>
              {headers.map((header, index) => (
                <th key={index} className="office-table-header-cell">
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="office-table-tbody">
            {!data || data.length === 0 ? (
              <tr className="office-table-row">
                <td colSpan={headers.length} className="office-table-empty-cell">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, rowIndex) => (
                <TableRow key={item.id || rowIndex} isOdd={rowIndex % 2 === 1}>
                  {renderRow(item, rowIndex)}
                </TableRow>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OfficeTable;