import './atoms.css';

const TableHeader = ({ children, className = '', ...props }) => {
  const baseClasses = 'table-header';
  const customClasses = className;

  const headerClasses = [
    baseClasses,
    customClasses
  ].filter(Boolean).join(' ');

  return (
    <thead className={headerClasses} {...props}>
      {children}
    </thead>
  );
};

export default TableHeader;