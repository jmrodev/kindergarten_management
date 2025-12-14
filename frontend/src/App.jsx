import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import AppLayout from './components/Organisms/AppLayout';
import SidebarMenu from './components/Organisms/SidebarMenu';
import HeaderWithMenu from './components/Atoms/HeaderWithMenu';
import Dashboard from './Pages/dashboard';
import Login from './Pages/Login';
import Students from './Pages/students';
import Teachers from './Pages/teachers';
import Classes from './Pages/classes';
import Attendance from './Pages/attendance';
import Enrollments from './Pages/enrollments';

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // Estados para el sidebar inteligente en escritorio
  const [sidebarHidden, setSidebarHidden] = useState(false); // Si está completamente oculto
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // Si está colapsado (solo iconos)

  // Datos de ejemplo para el menú - estos se cargarán según el rol del usuario
  const [menuItems, setMenuItems] = useState([]);

  // Use location from react-router-dom
  const location = useLocation();

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        // Set up default menu items based on role
        updateMenuItems(parsedUser.role);
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        // Clear invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }

    setLoading(false);

    const handleResize = () => {
      const mobileView = window.innerWidth <= 768;
      setIsMobileView(mobileView);

      // Close menu when switching to desktop view
      if (!mobileView && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }

      // No colapsar el sidebar en móvil
      if (mobileView) {
        setSidebarHidden(false);
        setSidebarCollapsed(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Temporizador para ocultar completamente el sidebar después de 2 segundos en escritorio
  useEffect(() => {
    let timer;

    if (!isMobileView && user && !sidebarHidden) {
      timer = setTimeout(() => {
        setSidebarCollapsed(true); // Colapsar antes de ocultar
        setSidebarHidden(true); // Ocultar completamente
      }, 2000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isMobileView, user, sidebarHidden]);

  const updateMenuItems = (role) => {
    // Menu items based on user role
    const baseItems = [
      { path: '/', label: 'Dashboard', icon: '/src/assets/svg/dashboard.svg' },
    ];

    // Add role-specific items
    if (role === 'Administrator' || role === 'Director') {
      baseItems.push(
        { path: '/students', label: 'Estudiantes', icon: '/src/assets/svg/students.svg' },
        { path: '/teachers', label: 'Maestros', icon: '/src/assets/svg/user.svg' },
        { path: '/classes', label: 'Clases', icon: '/src/assets/svg/menu.svg' },
        { path: '/attendance', label: 'Asistencia', icon: '/src/assets/svg/notification.svg' }
      );
    } else if (role === 'Teacher') {
      baseItems.push(
        { path: '/students', label: 'Mis Estudiantes', icon: '/src/assets/svg/students.svg' },
        { path: '/attendance', label: 'Asistencia', icon: '/src/assets/svg/notification.svg' }
      );
    } else if (role === 'Secretary') {
      baseItems.push(
        { path: '/students', label: 'Estudiantes', icon: '/src/assets/svg/students.svg' },
        { path: '/enrollments', label: 'Inscripciones', icon: '/src/assets/svg/menu.svg' }
      );
    }

    setMenuItems(baseItems);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    updateMenuItems(userData.role);
  };

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleBackdropClick = () => {
    if (isMobileView && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  // Funciones para controlar el sidebar inteligente
  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
    setSidebarHidden(false); // Si se está colapsando/expadiendo, mostrar el sidebar
  };

  const showSidebar = () => {
    setSidebarHidden(false);
    setSidebarCollapsed(false); // Mostrar sidebar completo al aparecer
  };

  // If still loading, show loading state
  if (loading) {
    return <div className="app-loading">Cargando...</div>;
  }

  // If no user, show login
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  // Protected App component for logged-in users
  return (
    <AppLayout
      sidebar={isMobileView ? null : (
        <SidebarMenu
          items={menuItems}
          collapsed={sidebarCollapsed}
          hidden={sidebarHidden}
          onToggleCollapse={toggleSidebarCollapse}
          onExpand={showSidebar}
          title={`Sistema de Gestión - ${user.firstName} ${user.lastName}`}
          currentPath={location.pathname}
        />
      )}
      sidebarHidden={sidebarHidden}
      headerContent={
        <HeaderWithMenu
          onMenuToggle={toggleMobileMenu}
          isMenuOpen={isMobileMenuOpen}
          title={`Sistema de Gestión - ${user.firstName} ${user.lastName}`}
        />
      }
      isMobileMenuOpen={isMobileMenuOpen && isMobileView}
      onBackdropClick={handleBackdropClick}
    >
      <div className={isMobileView ? "mobile-content-wrapper" : ""}>
        {isMobileMenuOpen && isMobileView && (
          <div className="mobile-sidebar-overlay">
            <SidebarMenu
              items={menuItems}
              collapsed={false}
              hidden={false}
              onToggleCollapse={null}
              onExpand={null}
              title={`Sistema de Gestión - ${user.firstName} ${user.lastName}`}
              currentPath={location.pathname}
            />
          </div>
        )}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/enrollments" element={<Enrollments />} />
          {/* Redirect any unmatched routes to dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </AppLayout>
  );
}

export default App;
