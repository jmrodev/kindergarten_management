import './atoms.css';

const ErrorMessage = ({ message = 'Ha ocurrido un error', onRetry }) => {
  return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <p className="error-message">{message}</p>
      {onRetry && (
        <button className="error-retry-btn" onClick={onRetry}>
          Reintentar
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
