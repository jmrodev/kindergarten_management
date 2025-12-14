import './molecules.css';
import Search from '../Atoms/Search';
import Select from '../Atoms/Select';

const SearchFilter = ({
  placeholder = 'Buscar...',
  value,
  onChange,
  onSearch,
  filters = [],
  onFilterChange,
  selectedFilter = '',
  className = '',
  ...props
}) => {
  const baseClasses = 'search-filter';
  const customClasses = className;

  const containerClasses = [
    baseClasses,
    customClasses
  ].filter(Boolean).join(' ');

  // Transformar formato de filtro para trabajar con átomo Select
  const options = [
    { value: '', label: 'Todos' },
    ...filters.map((filter, index) => ({
      value: filter.value,
      label: filter.label
    }))
  ];

  return (
    <div className={containerClasses}>
      <div className="search-container">
        <Search
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onSearch={onSearch}
          {...props}
        />
      </div>

      {filters.length > 0 && (
        <Select
          value={selectedFilter}
          onChange={onFilterChange}
          options={options}
          className="filter-select"
        />
      )}
    </div>
  );
};

export default SearchFilter;