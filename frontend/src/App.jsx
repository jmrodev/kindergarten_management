import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import PermissionsContext from './context/PermissionsContext';
import permissionsService from './services/permissionsService';
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
import Permissions from './Pages/permissions';

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarHidden, setSidebarHidden] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [userPermissions, setUserPermissions] = useState({});
  const location = useLocation();

  // Define updateMenuItems before using it
  const normalizeRole = (r) => {
    if (!r) return '';
    const lower = r.toLowerCase();
    const map = {
      'admin': 'administrator',
      'administrator': 'administrator',
      'director': 'director',
      'directivo': 'director',
      'teacher': 'teacher',
      'docente': 'teacher',
      'secretary': 'secretary',
      'secretaria': 'secretary'
    };
    return map[lower] || lower;
  };

  const updateMenuItems = (role, permissions = {}) => {
    const canonicalRole = normalizeRole(role);
    const baseItems = [
      { path: '/', label: 'Dashboard', icon: '/src/assets/svg/dashboard.svg' },
    ];

    // Helper to check permission fallback to role-based if permission undefined
    const can = (permKey, fallback = false) => {
      if (permissions[permKey] !== undefined) return permissions[permKey];
      return fallback;
    };

    // Students
    if (can('students:view', canonicalRole === 'administrator' || canonicalRole === 'director' || canonicalRole === 'teacher' || canonicalRole === 'secretary')) {
      baseItems.push({ path: '/students', label: canonicalRole === 'teacher' ? 'Mis Estudiantes' : 'Estudiantes', icon: '/src/assets/svg/students.svg' });
    }

    // Teachers (configurable)
    if (can('teachers:view', canonicalRole === 'administrator' || canonicalRole === 'director')) {
      baseItems.push({ path: '/teachers', label: 'Maestros', icon: '/src/assets/svg/user.svg' });
    }

    // Classes
    if (can('classes:view', canonicalRole === 'administrator' || canonicalRole === 'director')) {
      baseItems.push({ path: '/classes', label: 'Clases', icon: '/src/assets/svg/menu.svg' });
    }

    // Attendance
    if (can('attendance:view', canonicalRole === 'administrator' || canonicalRole === 'director' || canonicalRole === 'teacher')) {
      baseItems.push({ path: '/attendance', label: 'Asistencia', icon: '/src/assets/svg/notification.svg' });
    }

    // Enrollments (secretary)
    if (can('enrollments:view', canonicalRole === 'secretary' || canonicalRole === 'administrator')) {
      baseItems.push({ path: '/enrollments', label: 'Inscripciones', icon: '/src/assets/svg/menu.svg' });
    }

    // Permissions management - admin/director only
    if (canonicalRole === 'administrator' || canonicalRole === 'director') {
      baseItems.push({ path: '/permissions', label: 'Permisos', icon: '/src/assets/svg/lock.svg' });
    }

    setMenuItems(baseItems);
  };

  const refreshPermissions = async () => {
    if (!user || !user.role) return;
    try {
      const roleForCheck = user.role || '';
      const pairs = [
        { module: 'students', action: 'view', key: 'students:view' },
        { module: 'students', action: 'create', key: 'students:create' },
        { module: 'students', action: 'edit', key: 'students:edit' },
        { module: 'students', action: 'delete', key: 'students:delete' },
        { module: 'attendance', action: 'view', key: 'attendance:view' },
        { module: 'attendance', action: 'create', key: 'attendance:create' },
        { module: 'attendance', action: 'edit', key: 'attendance:edit' },
        { module: 'attendance', action: 'delete', key: 'attendance:delete' },
        { module: 'teachers', action: 'view', key: 'teachers:view' },
        { module: 'classes', action: 'view', key: 'classes:view' },
        { module: 'enrollments', action: 'view', key: 'enrollments:view' }
      ];

      const perms = await permissionsService.bulkCheck(roleForCheck, pairs);
      setUserPermissions(perms);
      updateMenuItems(user.role, perms);
    } catch (err) {
      console.warn('Error refreshing permissions', err);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const authService = await import('./services/authService');
        const me = await authService.default.me();

        // API returns different shapes for parent portal users vs staff
        const normalized = {
          id: me.id,
          email: me.email,
          firstName: me.firstName || me.name || '',
          lastName: me.paternalSurname || me.lastName || '',
          role: me.role || (me.parentPortalUser ? 'Parent' : undefined)
        };

        setUser(normalized);

        // Consultar permisos dinámicos para el rol
        try {
          const roleForCheck = normalized.role || '';
          const pairs = [
            { module: 'students', action: 'view', key: 'students:view' },
            { module: 'students', action: 'create', key: 'students:create' },
            { module: 'students', action: 'edit', key: 'students:edit' },
            { module: 'students', action: 'delete', key: 'students:delete' },
            { module: 'attendance', action: 'view', key: 'attendance:view' },
            { module: 'attendance', action: 'create', key: 'attendance:create' },
            { module: 'attendance', action: 'edit', key: 'attendance:edit' },
            { module: 'attendance', action: 'delete', key: 'attendance:delete' },
            { module: 'teachers', action: 'view', key: 'teachers:view' },
            { module: 'classes', action: 'view', key: 'classes:view' },
            { module: 'enrollments', action: 'view', key: 'enrollments:view' }
          ];

          const perms = await permissionsService.bulkCheck(roleForCheck, pairs);
          setUserPermissions(perms);
          updateMenuItems(normalized.role, perms);
        } catch (permErr) {
          console.warn('Error fetching permissions', permErr);
          updateMenuItems(normalized.role);
        }
      } catch (err) {
        console.warn('Autenticación inválida o token expirado, limpiando credenciales', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const handleResize = () => {
      const mobileView = window.innerWidth <= 768;
      setIsMobileView(mobileView);

      if (!mobileView && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }

      if (mobileView) {
        setSidebarHidden(false);
        setSidebarCollapsed(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let timer;

    if (!isMobileView && user && !sidebarHidden) {
      timer = setTimeout(() => {
        setSidebarCollapsed(true);
        setSidebarHidden(true);
      }, 2000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isMobileView, user, sidebarHidden]);

  const handleLogin = (userData) => {
    // After login the Login page already saved token and user in localStorage
    setUser(userData);
    updateMenuItems(userData.role);
  };

  const handleLogout = () => {
    // Use authService to centralize logout behaviour
    import('./services/authService').then(s => s.default.logout());
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

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
    setSidebarHidden(false);
  };

  const showSidebar = () => {
    setSidebarHidden(false);
    setSidebarCollapsed(false);
  };

  if (loading) {
    return <div className="app-loading">Cargando...</div>;
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <PermissionsContext.Provider value={{ permissions: userPermissions, refreshPermissions }}>
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
        {isMobileMenuOpen && isMobileView && (() => {
          // build mobile menu based on permissions
          const allowedPaths = [];
          if (userPermissions['students:view']) allowedPaths.push('/students');
          if (userPermissions['attendance:view']) allowedPaths.push('/attendance');
          const mobileMenuItems = menuItems.filter(i => allowedPaths.includes(i.path));
          return (
            <div className="mobile-sidebar-overlay">
              <SidebarMenu
                items={mobileMenuItems}
                collapsed={false}
                hidden={false}
                onToggleCollapse={null}
                onExpand={null}
                title={`Sistema de Gestión - ${user.firstName} ${user.lastName}`}
                currentPath={location.pathname}
              />
            </div>
          );
        })()}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/enrollments" element={<Enrollments />} />
          <Route path="/permissions" element={<Permissions />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
    </PermissionsContext.Provider>
  );
}

export default App;