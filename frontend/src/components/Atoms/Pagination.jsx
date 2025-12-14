import './atoms.css';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  showPrevNext = true,
  className = '',
  ...props
}) => {
  const baseClasses = 'pagination';
  const customClasses = className;

  const paginationClasses = [
    baseClasses,
    customClasses
  ].filter(Boolean).join(' ');

  // Generar números de página a mostrar
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Si estamos cerca del inicio
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } 
      // Si estamos cerca del final
      else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } 
      // Si estamos en el medio
      else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className={paginationClasses} {...props}>
      <ul className="pagination-list">
        {showFirstLast && currentPage > 1 && (
          <li className="pagination-item">
            <button 
              className="pagination-link"
              onClick={() => onPageChange(1)}
              aria-label="Primera página"
            >
              &laquo;
            </button>
          </li>
        )}
        
        {showPrevNext && currentPage > 1 && (
          <li className="pagination-item">
            <button 
              className="pagination-link"
              onClick={() => onPageChange(currentPage - 1)}
              aria-label="Página anterior"
            >
              &lsaquo;
            </button>
          </li>
        )}
        
        {pageNumbers.map((page, index) => (
          <li key={index} className="pagination-item">
            {page === '...' ? (
              <span className="pagination-ellipsis">...</span>
            ) : (
              <button
                className={`pagination-link ${currentPage === page ? 'pagination-link-active' : ''}`}
                onClick={() => onPageChange(page)}
                aria-label={`Página ${page}, ${currentPage === page ? 'actual' : 'ir a'}`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            )}
          </li>
        ))}
        
        {showPrevNext && currentPage < totalPages && (
          <li className="pagination-item">
            <button 
              className="pagination-link"
              onClick={() => onPageChange(currentPage + 1)}
              aria-label="Página siguiente"
            >
              &rsaquo;
            </button>
          </li>
        )}
        
        {showFirstLast && currentPage < totalPages && (
          <li className="pagination-item">
            <button 
              className="pagination-link"
              onClick={() => onPageChange(totalPages)}
              aria-label="Última página"
            >
              &raquo;
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Pagination;