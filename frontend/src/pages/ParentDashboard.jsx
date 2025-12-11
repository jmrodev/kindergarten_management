import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './ParentDashboard.css';
import ChildProfileCard from '../components/ChildProfileCard';
import AttendanceTracker from '../components/AttendanceTracker';
import GradesView from '../components/GradesView';
import CommunicationsBoard from '../components/CommunicationsBoard';
import CalendarView from '../components/CalendarView';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const ParentDashboard = () => {
  const { user } = useAuth();
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/api/parent-portal/auth/google`;
  };

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        setLoading(true);
        // Fetch children associated with the logged-in parent
        const response = await axios.get(`${API_URL}/api/parent-portal/children/parent/${user.id}`, {
          withCredentials: true,
        });

        if (response.data.success) {
          setChildren(response.data.children);
          if (response.data.children.length > 0) {
            setSelectedChild(response.data.children[0]);
          }
        } else {
          setError(response.data.message || 'Error al cargar la información de los hijos');
        }
      } catch (err) {
        console.error('Error fetching children:', err);
        setError('Error al cargar la información de los hijos');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchChildren();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="parent-dashboard-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando información...</p>
        </div>
      </div>
    );
  }

  if (error) {
    if (error.includes('Forbidden') || error.includes('401') || error.includes('Not authenticated')) {
      return (
        <div className="parent-dashboard-container">
          <div className="login-required-container">
            <h3>Acceso al Portal de Padres</h3>
            <p>Debe iniciar sesión con su cuenta de Google para acceder al portal de padres</p>
            <button
              className="google-login-button"
              onClick={handleGoogleLogin}
            >
              <span className="material-icons">login</span>
              Iniciar sesión con Google
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="parent-dashboard-container">
        <div className="error-container">
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return selectedChild ? <ChildProfileCard child={selectedChild} /> : null;
      case 'attendance':
        return selectedChild ? <AttendanceTracker childId={selectedChild.id} /> : null;
      case 'grades':
        return selectedChild ? <GradesView childId={selectedChild.id} /> : null;
      case 'communications':
        return selectedChild ? <CommunicationsBoard childId={selectedChild.id} /> : null;
      case 'calendar':
        return <CalendarView />;
      default:
        return selectedChild ? <ChildProfileCard child={selectedChild} /> : null;
    }
  };

  return (
    <div className="parent-dashboard-container">
      <div className="dashboard-header">
        <h2>Portal para Padres</h2>
        <p>
          Bienvenido/a {user?.name || user?.email}, aquí puede ver la información de sus hijos
        </p>
      </div>

      {children.length === 0 ? (
        <div className="no-children-container">
          <h3>No tiene hijos registrados</h3>
          <p>
            No se encontraron hijos asociados a su cuenta. Por favor contacte al administrador del jardín.
          </p>
        </div>
      ) : (
        <div className="dashboard-content">
          {/* Sidebar with children list */}
          <div className="children-sidebar">
            <div className="sidebar-header">
              <h3>Mis Hijos</h3>
            </div>
            <div className="children-list">
              {children.map((child) => (
                <div
                  key={child.id}
                  className={`child-item ${
                    selectedChild?.id === child.id ? 'selected' : ''
                  }`}
                  onClick={() => setSelectedChild(child)}
                >
                  <div className="child-avatar">
                    <div className="avatar-bg">
                      <span>{child.nombre?.charAt(0)}{child.apellidoPaterno?.charAt(0)}</span>
                    </div>
                  </div>
                  <div className="child-info">
                    <div className="child-name">{child.nombre} {child.apellidoPaterno}</div>
                    <div className="child-classroom">{child.sala?.nombre || 'Sin sala'}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main content area */}
          <div className="dashboard-main">
            <div className="tabs-container">
              <div className="tab-buttons">
                <button
                  className={activeTab === 'profile' ? 'tab-button active' : 'tab-button'}
                  onClick={() => setActiveTab('profile')}
                >
                  Perfil
                </button>
                <button
                  className={activeTab === 'attendance' ? 'tab-button active' : 'tab-button'}
                  onClick={() => setActiveTab('attendance')}
                >
                  Asistencia
                </button>
                <button
                  className={activeTab === 'grades' ? 'tab-button active' : 'tab-button'}
                  onClick={() => setActiveTab('grades')}
                >
                  Calificaciones
                </button>
                <button
                  className={activeTab === 'communications' ? 'tab-button active' : 'tab-button'}
                  onClick={() => setActiveTab('communications')}
                >
                  Comunicaciones
                </button>
                <button
                  className={activeTab === 'calendar' ? 'tab-button active' : 'tab-button'}
                  onClick={() => setActiveTab('calendar')}
                >
                  Calendario
                </button>
              </div>

              <div className="tab-content">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentDashboard;