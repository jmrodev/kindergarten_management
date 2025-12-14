import './atoms.css';

const HamburgerMenu = ({ isOpen, onClick, className = '', ariaLabel = 'Toggle menu' }) => {
  const baseClasses = 'hamburger-menu';
  const customClasses = className;

  const hamburgerClasses = [
    baseClasses,
    customClasses
  ].filter(Boolean).join(' ');

  return (
    <button
      className={`hamburger-btn ${isOpen ? 'hamburger-btn-open' : ''}`}
      onClick={onClick}
      aria-label={ariaLabel}
      type="button"
    >
      <span className="hamburger-line"></span>
      <span className="hamburger-line"></span>
      <span className="hamburger-line"></span>
    </button>
  );
};

export default HamburgerMenu;