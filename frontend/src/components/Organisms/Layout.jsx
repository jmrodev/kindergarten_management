import '../Atoms/atoms.css';

const Layout = ({ children, sidebar, header, className = '', isMobileMenuOpen = false, ...props }) => {
  const baseClasses = 'layout';
  const customClasses = className;

  const layoutClasses = [
    baseClasses,
    customClasses
  ].filter(Boolean).join(' ');

  // Determinar clases para el main content basado en estado del sidebar
  let mainContentClasses = sidebar ? "layout-main" : "layout-main-full";

  return (
    <>
      {isMobileMenuOpen && (
        <div className="mobile-menu-backdrop" onClick={props.onBackdropClick}></div>
      )}
      <div className={layoutClasses}>
        {/* Sidebar on the left */}
        {sidebar && <div className="layout-sidebar">{sidebar}</div>}

        {/* content on the right (header + main) */}
        <div className="app-content">
          {header && <header className="layout-header">{header}</header>}
          <div className="layout-body">
            <main className={mainContentClasses}>{children}</main>
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;