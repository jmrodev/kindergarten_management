// frontend/src/pages/DashboardPage.jsx
import React from 'react';
import Dashboard from '../components/Dashboard';

const DashboardPage = ({ alumnos, salas, onNavigate, onShowOcupacion }) => {
    return <Dashboard alumnos={alumnos} salas={salas} onNavigate={onNavigate} onShowOcupacion={onShowOcupacion} />;
};

export default DashboardPage;
