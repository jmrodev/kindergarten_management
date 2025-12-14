import './atoms.css';
import HamburgerMenu from './HamburgerMenu';

const HeaderWithMenu = ({ children, onMenuToggle, isMenuOpen, className = '', title = 'Sistema de Gestión', ...props }) => {
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
        {/* Empty div to maintain spacing */}
        <div className="header-spacer"></div>
      </div>
      {children}
    </header>
  );
};

export default HeaderWithMenu;