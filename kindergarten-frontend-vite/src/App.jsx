import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import { PermissionsProvider } from './contexts/PermissionsContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Dashboard from './views/Dashboard.jsx';
import Login from './views/auth/Login.jsx';
import GoogleAuth from './views/auth/GoogleAuth.jsx';
import ParentDashboard from './views/ParentDashboard.jsx';
import ClassroomList from './views/classrooms/ClassroomList.jsx';
import ClassroomForm from './views/classrooms/ClassroomForm.jsx';
import StaffList from './views/staff/StaffList.jsx';
import StaffForm from './views/staff/StaffForm.jsx';
import GuardianList from './views/guardians/GuardianList.jsx';
import GuardianForm from './views/guardians/GuardianForm.jsx';
import AttendanceList from './views/attendance/AttendanceList.jsx';
import CalendarView from './views/calendar/CalendarView.jsx';
import VaccinationList from './views/vaccinations/VaccinationList.jsx';
import VaccinationForm from './views/vaccinations/VaccinationForm.jsx';
import DocumentReviewList from './views/documentReviews/DocumentReviewList.jsx';
import MeetingMinutesList from './views/meetingMinutes/MeetingMinutesList.jsx';
import ActivityList from './views/activities/ActivityList.jsx';
import ConfiguracionPage from './views/ConfiguracionPage.jsx';
import StudentList from './views/students/StudentList.jsx';
import StudentForm from './components/organisms/StudentForm';
import StudentDetailsView from './views/students/StudentDetailsView.jsx';
import OfficeRibbon from './components/organisms/OfficeRibbon.jsx';

import RibbonLayout from './components/organisms/RibbonLayout.jsx';

// Componente para rutas protegidas
function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <div className="App">
          <AppContent />
        </div>
      </AuthProvider>
    </Router>
  );
}

import AppContent from './AppContent.jsx';

export default App;