import './atoms.css';
import HamburgerMenu from './HamburgerMenu';

const HeaderWithMenu = ({ children, onMenuToggle, isMenuOpen, className = '', title = 'Sistema de Gestión', onLogout, ...props }) => {
  const baseClasses = 'header';
  const customClasses = className;

  const headerClasses = [
    baseClasses,
    customClasses
  ].filter(Boolean).join(' ');

  return (
    <header className={headerClasses} {...props}>
      <div className="header-content">
        <HamburgerMenu
          isOpen={isMenuOpen}
          onClick={onMenuToggle}
          ariaLabel="Toggle navigation menu"
        />
        <div className="header-title-container">
          <h1 className="header-title">{title}</h1>
        </div>
        <div className="header-actions">
          {onLogout && (
            <button className="btn btn-secondary" onClick={onLogout} aria-label="Salir de sesión">
              Salir
            </button>
          )}
        </div>
      </div>
      {children}
    </header>
  );
};

export default HeaderWithMenu;