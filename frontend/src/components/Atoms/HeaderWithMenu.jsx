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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <HamburgerMenu 
          isOpen={isMenuOpen} 
          onClick={onMenuToggle} 
          ariaLabel="Toggle navigation menu"
        />
        <div style={{ flex: 1, textAlign: 'center' }}>
          <h1 style={{ margin: 0, fontSize: 'var(--font-size-lg)', fontWeight: 500 }}>{title}</h1>
        </div>
        {/* Empty div to maintain spacing */}
        <div style={{ minWidth: '30px' }}></div>
      </div>
      {children}
    </header>
  );
};

export default HeaderWithMenu;