import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import useCurrentPath from '../../hooks/useCurrentPath'; // Path from components/organisms to hooks
import * as ImportedIcons from '../icons';

/**
 * =============================================================================
 * DOCUMENTACIÓN DE ARQUITECTURA: IMPLEMENTACIÓN DRY (Don't Repeat Yourself)
 * =============================================================================
 * * CONTEXTO GENERAL:
 * Este componente maneja la navegación contextual tipo "Ribbon" (Cinta de opciones).
 * El objetivo es que el menú se adapte automáticamente a la sección actual (Alumnos, 
 * Personal, etc.) sin repetir código HTML ni lógica condicional dispersa.
 * * ESTRATEGIA APLICADA: "Configuration over Code" (Configuración sobre Código)
 * * 1. CENTRALIZACIÓN (The Source of Truth):
 * En lugar de usar múltiples bloques `if (ruta === '/students')` dentro del JSX,
 * toda la lógica de qué mostrar se define en el objeto `sectionActions`.
 * Este objeto actúa como un mapa maestro que dicta el comportamiento.
 * * 2. RENDERIZADO AGNÓSTICO:
 * El JSX de este componente es "tonto" (dumb). No sabe de negocios, solo sabe
 * cómo pintar una lista. Itera sobre los datos que le entrega la configuración.
 * - Si mañana agregas una sección "Biblioteca", solo añades la clave al objeto
 * `sectionActions` y la interfaz se dibujará sola sin tocar el HTML.
 * * 3. REUTILIZACIÓN DE MANEJADORES:
 * La función `handleAction` actúa como un dispatcher central. En lugar de crear
 * una función para cada botón, usamos un identificador único (actionCode) para 
 * enrutar la acción correspondiente.
 * =============================================================================
 */

// Icons are provided by src/components/icons and imported as ImportedIcons above

const OfficeRibbon = () => {
  const [activeTab, setActiveTab] = useState('Inicio');
  const { currentUser, logout } = useAuth();

  // Hook personalizado para detectar en qué sección estamos
  const { currentSection } = useCurrentPath();

  const menuRef = useRef(null);
  const navigate = useNavigate();

  // --- CONFIGURACIÓN ESTRICTA DE ACCIONES POR SECCIÓN ---
  // Aquí definimos EXACTAMENTE qué se puede hacer en cada pantalla.
  const sectionActions = useMemo(() => ({
    classrooms: {
      tabName: 'Inicio',
      primary: { action: 'newClassroom', label: 'Nueva Sala', icon: ImportedIcons.PeopleIcon },
      secondaries: [
        { action: 'assignTeacher', label: 'Asignar Docente', icon: ImportedIcons.PersonFillIcon },
        { action: 'listClassrooms', label: 'Ver Salas', icon: ImportedIcons.PeopleFillIcon }
      ],
      exportActions: [
        { action: 'exportExcel', label: 'Exportar a Excel', icon: ImportedIcons.FileEarmarkExcelIcon },
        { action: 'exportPdf', label: 'Exportar a PDF', icon: ImportedIcons.FileEarmarkPdfIcon },
        { action: 'printReport', label: 'Imprimir', icon: ImportedIcons.PrinterIcon }
      ]
    },
    staff: {
      tabName: 'Personal',
      primary: { action: 'newStaff', label: 'Nuevo Personal', icon: ImportedIcons.PeopleFillIcon },
      secondaries: [
        { action: 'manageRoles', label: 'Gestionar Roles', icon: ImportedIcons.PersonBadgeIcon },
        { action: 'listStaff', label: 'Directorio', icon: ImportedIcons.PersonLinesFillIcon }
      ],
      exportActions: [
        { action: 'exportExcel', label: 'Exportar a Excel', icon: ImportedIcons.FileEarmarkExcelIcon },
        { action: 'exportPdf', label: 'Exportar a PDF', icon: ImportedIcons.FileEarmarkPdfIcon },
        { action: 'printReport', label: 'Imprimir', icon: ImportedIcons.PrinterIcon }
      ]
    },
    guardians: {
      tabName: 'Alumnos',
      primary: { action: 'newGuardian', label: 'Nuevo Responsable', icon: ImportedIcons.ShieldIcon },
      secondaries: [
        { action: 'linkStudent', label: 'Vincular Alumno', icon: ImportedIcons.Link45degIcon }
      ],
      exportActions: [
        { action: 'exportExcel', label: 'Exportar a Excel', icon: ImportedIcons.FileEarmarkExcelIcon },
        { action: 'exportPdf', label: 'Exportar a PDF', icon: ImportedIcons.FileEarmarkPdfIcon },
        { action: 'printReport', label: 'Imprimir', icon: ImportedIcons.PrinterIcon }
      ]
    },
    vaccinations: {
      tabName: 'Alumnos',
      primary: { action: 'newVaccination', label: 'Nueva Vacuna', icon: ImportedIcons.FileMedicalIcon },
      secondaries: [
        { action: 'checkSchedule', label: 'Calendario Vacunación', icon: ImportedIcons.CalendarCheckIcon }
      ],
      exportActions: [
        { action: 'exportExcel', label: 'Exportar a Excel', icon: ImportedIcons.FileEarmarkExcelIcon },
        { action: 'exportPdf', label: 'Exportar a PDF', icon: ImportedIcons.FileEarmarkPdfIcon },
        { action: 'printReport', label: 'Imprimir', icon: ImportedIcons.PrinterIcon }
      ]
    },
    activities: {
      tabName: 'Inicio',
      primary: { action: 'newActivity', label: 'Nueva Actividad', icon: ImportedIcons.CalendarPlusIcon },
      secondaries: [],
      exportActions: [
        { action: 'exportExcel', label: 'Exportar a Excel', icon: ImportedIcons.FileEarmarkExcelIcon },
        { action: 'exportPdf', label: 'Exportar a PDF', icon: ImportedIcons.FileEarmarkPdfIcon },
        { action: 'printReport', label: 'Imprimir', icon: ImportedIcons.PrinterIcon }
      ]
    },
    // Configuración por defecto (Dashboard o rutas no específicas)
    general: {
      tabName: 'Inicio',
      primary: { action: 'newStudent', label: 'Acción Rápida', icon: ImportedIcons.LightningChargeIcon },
      secondaries: [
        { action: 'newStudent', label: 'Nuevo Alumno', icon: ImportedIcons.PersonPlusIcon },
        { action: 'newClassroom', label: 'Nueva Sala', icon: ImportedIcons.PeopleIcon }
      ],
      exportActions: [
        { action: 'exportExcel', label: 'Exportar a Excel', icon: ImportedIcons.FileEarmarkExcelIcon },
        { action: 'exportPdf', label: 'Exportar a PDF', icon: ImportedIcons.FileEarmarkPdfIcon },
        { action: 'printReport', label: 'Imprimir', icon: ImportedIcons.PrinterIcon }
      ]
    }
  }), []);

  // Seleccionamos la configuración actual o la general si no existe
  const currentContext = sectionActions[currentSection] || sectionActions.general;

  // Sincronizar pestaña activa automáticamente cuando cambia el contexto
  useEffect(() => {
    if (currentContext.tabName) {
      setActiveTab(currentContext.tabName);
    }
  }, [currentContext]);

  const handleNavigation = (path) => navigate(path);

  // Gestor centralizado de acciones (Dispatcher)
  const handleAction = (actionCode) => {
    const actionsMap = {
      'newStudent': () => navigate('/students/new'),
      'listStudents': () => navigate('/students'),
      'newGuardian': () => navigate('/guardians/new'),
      'newVaccination': () => navigate('/vaccinations'),
      'newClassroom': () => navigate('/classrooms/new'),
      'listClassrooms': () => navigate('/classrooms'),
      'newStaff': () => navigate('/staff/new'),
      'listStaff': () => navigate('/staff'),
      'newActivity': () => navigate('/activities'),
      'printReport': () => alert('Imprimir Reporte'),
      'exportExcel': () => alert('Exportando Excel...'),
      'exportPdf': () => alert('Exportando PDF...'),
      // Aquí puedes agregar más lógica para acciones que no sean solo navegación
    };

    if (actionsMap[actionCode]) {
      actionsMap[actionCode]();
    } else {
      // Action not implemented yet
    }
  };

  return (
    <>
      {/* CSS INCRUSTADO: Estilos visuales del Ribbon */}
      <style>{`
        :root {
          --office-primary: #2b579a;
          --office-hover: #3e6db5;
          --office-ribbon-bg: #f3f2f1;
          --office-border: #d2d2d2;
          --office-text: #444;
          --office-file-tab: #2b579a;
        }
        .office-menu-container {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: var(--office-ribbon-bg);
          border-bottom: 1px solid var(--office-border);
          position: relative;
          z-index: 100;
        }
        .top-bar {
          background-color: var(--office-primary);
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .tabs {
          list-style: none; margin: 0; padding: 0; display: flex;
        }
        .tab {
          padding: 8px 15px; color: white; cursor: pointer; font-size: 13px;
          border: 1px solid transparent; transition: all 0.2s ease; user-select: none;
        }
        .tab:hover { background-color: var(--office-hover); }
        .tab.file-trigger { background-color: var(--office-file-tab); font-weight: 600; }
        .tab.file-trigger:hover {
          background-color: #3e6db5; /* Softer hover color */
          transition: all 0.2s ease;
        }
        .tab.file-trigger.active {
          background-color: #1e3e70;
          color: white;
          border: none;
          top: 0;
        }
        .tab.file-trigger {
          background-color: var(--office-file-tab);
          font-weight: 600;
          transition: all 0.2s ease;
        }
        .tab.active {
          background-color: var(--office-ribbon-bg); color: var(--office-primary);
          border: 1px solid var(--office-border); border-bottom: 1px solid var(--office-ribbon-bg);
          position: relative; top: 1px;
        }
        .user-email {
          color: white;
          font-size: 13px;
          opacity: 0.8;
        }
        .logout-button {
          background-color: #f44336; /* Red color for logout */
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 13px;
          transition: background-color 0.2s ease;
        }
        .logout-button:hover {
          background-color: #d32f2f; /* Darker red on hover */
        }
      `}</style>

      {/* COMPONENTE VISUAL */}
      <div className="office-menu-container" ref={menuRef}>
        
        {/* 1. TABS (PESTAÑAS) */}
        <div className="top-bar">
          <ul className="tabs">
            {/* Pestañas de navegación estándar */}
            <li className={`tab ${activeTab === 'Inicio' ? 'active' : ''}`} onClick={() => handleNavigation('/dashboard')}>Inicio</li>
            <li className={`tab ${activeTab === 'Personal' ? 'active' : ''}`} onClick={() => handleNavigation('/staff')}>Personal</li>
            <li className="tab" onClick={() => handleNavigation('/configuracion')}>Configuración</li>
          </ul>

          {currentUser && (
            <div className="user-info-section">
              <span className="user-email">{currentUser.email}</span>
              <button className="logout-button" onClick={() => {
                logout(); // Call logout function from useAuth
                navigate('/login'); // Redirect to login after logout
              }}>
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>

        {/* 2. RIBBON (CINTA DE OPCIONES) */}
        <div className="ribbon">
          {/* Botón Principal Contextual */}
          <div
            className="ribbon-btn-large"
            onClick={() => handleAction(currentContext.primary.action)}
            title={currentContext.primary.label}
          >
            {(() => { const IconComp = currentContext.primary.icon || ImportedIcons[currentContext.primary.icon?.name]; return React.createElement(IconComp, { size: 24 }); })()}
            <span>{currentContext.primary.label}</span>
          </div>

          <div className="ribbon-group-separator"></div>

          {/* Acciones Secundarias en el Ribbon (Lista Pequeña) */}
          <div className="ribbon-small-actions">
            {currentContext.secondaries.slice(0, 3).map((sec, idx) => (
               <div key={idx} className="ribbon-btn-small" onClick={() => handleAction(sec.action)}>
                 {(() => { const IconComp = sec.icon || ImportedIcons[sec.icon?.name]; return React.createElement(IconComp, { size: 14 }); })()}
                 {sec.label}
               </div>
            ))}
            {currentContext.secondaries.length === 0 && (
               <div className="ribbon-no-options">Opciones generales</div>
            )}
          </div>

          <div className="ribbon-group-separator"></div>

          {/* Grupo de Exportación/Impresión */}
          <div className="ribbon-small-actions">
            {currentContext.exportActions && currentContext.exportActions.map((action, idx) => (
               <div key={idx} className="ribbon-btn-small" onClick={() => handleAction(action.action)}>
                 {(() => { const IconComp = action.icon || ImportedIcons[action.icon?.name]; return React.createElement(IconComp, { size: 14 }); })()}
                 {action.label}
               </div>
            ))}
          </div>

          <div className="ribbon-group-separator"></div>

          {/* Grupo Global (Siempre visible) - Fuente ficticia para look & feel */}
          <div className="ribbon-global-group">
            <div className="ribbon-font-selector">Segoe UI</div>
            <div className="ribbon-formatting-tools">
              <b className="ribbon-tool-btn">B</b>
              <i className="ribbon-tool-btn">I</i>
              <u className="ribbon-tool-btn">S</u>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default OfficeRibbon;
