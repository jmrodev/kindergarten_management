import './atoms.css';

const TableCell = ({ children, header = false, align = 'left', className = '', ...props }) => {
  const baseClasses = 'table-cell';
  const alignClass = `table-cell-${align}`;
  const customClasses = className;

  const cellClasses = [
    baseClasses,
    alignClass,
    customClasses
  ].filter(Boolean).join(' ');

  if (header) {
    return (
      <th className={cellClasses} {...props}>
        {children}
      </th>
    );
  }

  return (
    <td className={cellClasses} {...props}>
      {children}
    </td>
  );
};

export default TableCell;