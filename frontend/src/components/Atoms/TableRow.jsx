import './atoms.css';

const TableRow = ({ children, active = false, className = '', ...props }) => {
  const baseClasses = 'table-row';
  const activeClass = active ? 'table-row-active' : '';
  const customClasses = className;

  const rowClasses = [
    baseClasses,
    activeClass,
    customClasses
  ].filter(Boolean).join(' ');

  return (
    <tr className={rowClasses} {...props}>
      {children}
    </tr>
  );
};

export default TableRow;