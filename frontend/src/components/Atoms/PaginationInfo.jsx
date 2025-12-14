import './atoms.css';

const PaginationInfo = ({ 
  currentPage, 
  itemsPerPage, 
  totalItems, 
  itemName = 'elemento', 
  className = '', 
  ...props 
}) => {
  const baseClasses = 'pagination-info';
  const customClasses = className;

  const infoClasses = [
    baseClasses,
    customClasses
  ].filter(Boolean).join(' ');

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={infoClasses} {...props}>
      Mostrando {startIndex}-{endIndex} de {totalItems} {itemName}{totalItems !== 1 ? 's' : ''}
    </div>
  );
};

export default PaginationInfo;