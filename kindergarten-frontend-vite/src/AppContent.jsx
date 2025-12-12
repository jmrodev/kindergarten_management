import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext.jsx';
import { PermissionsProvider } from './contexts/PermissionsContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import RibbonLayout from './components/organisms/RibbonLayout.jsx';
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
import DocumentReviewList from './views/documentReviews/DocumentReviewList.jsx';
import MeetingMinutesList from './views/meetingMinutes/MeetingMinutesList.jsx';
import ActivityList from './views/activities/ActivityList.jsx';
import ConfiguracionPage from './views/ConfiguracionPage.jsx';
import StudentList from './views/students/StudentList.jsx';
import StudentForm from './components/organisms/StudentForm';
import StudentDetailsView from './views/students/StudentDetailsView.jsx';

function AppContent() {
  const { currentUser } = useAuth();

  return (
    <PermissionsProvider>
      <div className="app-container">
        <div className="main-content">
          <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={currentUser ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/auth/google" element={<GoogleAuth />} />

            {/* Rutas protegidas */}
            <Route path="/" element={<ProtectedRoute />}>
              <Route index element={<RibbonLayout><Navigate to="/dashboard" /></RibbonLayout>} />
              <Route path="dashboard" element={<RibbonLayout><Dashboard /></RibbonLayout>} />

              {/* Rutas de salas */}
              <Route path="classrooms" element={<RibbonLayout><ClassroomList /></RibbonLayout>} />
              <Route path="classrooms/new" element={<RibbonLayout><ClassroomForm /></RibbonLayout>} />
              <Route path="classrooms/edit/:id" element={<RibbonLayout><ClassroomForm /></RibbonLayout>} />

              {/* Rutas de personal */}
              <Route path="staff" element={<RibbonLayout><StaffList /></RibbonLayout>} />
              <Route path="staff/new" element={<RibbonLayout><StaffForm /></RibbonLayout>} />
              <Route path="staff/edit/:id" element={<RibbonLayout><StaffForm /></RibbonLayout>} />

              {/* Rutas de responsables */}
              <Route path="guardians" element={<RibbonLayout><GuardianList /></RibbonLayout>} />
              <Route path="guardians/new" element={<RibbonLayout><GuardianForm /></RibbonLayout>} />
              <Route path="guardians/edit/:id" element={<RibbonLayout><GuardianForm /></RibbonLayout>} />

              {/* Rutas de asistencia */}
              <Route path="attendance" element={<RibbonLayout><AttendanceList /></RibbonLayout>} />

              {/* Ruta de calendario */}
              <Route path="calendar" element={<RibbonLayout><CalendarView /></RibbonLayout>} />

              {/* Rutas de vacunas */}
              <Route path="vaccinations" element={<RibbonLayout><VaccinationList /></RibbonLayout>} />

              {/* Rutas de revisión de documentos */}
              <Route path="document-reviews" element={<RibbonLayout><DocumentReviewList /></RibbonLayout>} />

              {/* Rutas de actas de reuniones */}
              <Route path="meeting-minutes" element={<RibbonLayout><MeetingMinutesList /></RibbonLayout>} />

              {/* Rutas de actividades */}
              <Route path="activities" element={<RibbonLayout><ActivityList /></RibbonLayout>} />

              {/* Ruta de configuración */}
              <Route path="configuracion" element={<RibbonLayout><ConfiguracionPage /></RibbonLayout>} />

              {/* Rutas para alumnos */}
              <Route path="students" element={<RibbonLayout><StudentList /></RibbonLayout>} />
              <Route path="students/new" element={<RibbonLayout><StudentForm /></RibbonLayout>} />
              <Route path="students/:id/edit" element={<RibbonLayout><StudentForm /></RibbonLayout>} />
              <Route path="students/:id/view" element={<RibbonLayout><StudentDetailsView /></RibbonLayout>} />

              {/* Rutas para padres */}
              <Route path="parent-dashboard" element={<RibbonLayout><ParentDashboard /></RibbonLayout>} />
            </Route>

            {/* Redirección por defecto */}
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </div>
    </PermissionsProvider>
  );
}

export default AppContent;
