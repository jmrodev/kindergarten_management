import './atoms.css';

const Table = ({
  children,
  striped = false,
  bordered = false,
  hover = false,
  responsive = false,
  responsiveStack = false, // For stacked view on mobile
  className = '',
  ...props
}) => {
  const baseClasses = 'table';
  const stripedClass = striped ? 'table-striped' : '';
  const borderedClass = bordered ? 'table-bordered' : '';
  const hoverClass = hover ? 'table-hover' : '';
  const customClasses = className;

  const tableClasses = [
    baseClasses,
    stripedClass,
    borderedClass,
    hoverClass,
    customClasses
  ].filter(Boolean).join(' ');

  const tableElement = <table className={tableClasses} {...props}>{children}</table>;

  if (responsive) {
    const responsiveClass = responsiveStack ? 'table-responsive-stack' : 'table-responsive';
    return (
      <div className={responsiveClass}>
        {tableElement}
      </div>
    );
  }

  return tableElement;
};

export default Table;