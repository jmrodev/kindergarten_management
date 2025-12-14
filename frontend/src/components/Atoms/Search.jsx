import './atoms.css';

const Search = ({ placeholder = 'Buscar...', value, onChange, onSearch, className = '', ...props }) => {
  const baseClasses = 'search-input';
  const customClasses = className;

  const searchClasses = [
    baseClasses,
    customClasses
  ].filter(Boolean).join(' ');

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyPress={handleKeyPress}
        className={searchClasses}
        {...props}
      />
      <button 
        className="search-button"
        onClick={() => onSearch && onSearch(value)}
        aria-label="Buscar"
      >
        🔍
      </button>
    </div>
  );
};

export default Search;