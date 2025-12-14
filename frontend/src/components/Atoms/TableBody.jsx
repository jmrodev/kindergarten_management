import './atoms.css';

const TableBody = ({ children, className = '', ...props }) => {
  const baseClasses = 'table-body';
  const customClasses = className;

  const bodyClasses = [
    baseClasses,
    customClasses
  ].filter(Boolean).join(' ');

  return (
    <tbody className={bodyClasses} {...props}>
      {children}
    </tbody>
  );
};

export default TableBody;