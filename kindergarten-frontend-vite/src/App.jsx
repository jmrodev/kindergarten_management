import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Dashboard from './views/Dashboard.jsx';
import Login from './views/auth/Login.jsx';
import GoogleAuth from './views/auth/GoogleAuth.jsx';
import ParentDashboard from './views/ParentDashboard.jsx';
import RegisterChildForm from './views/RegisterChildForm.jsx';
import StudentList from './views/students/StudentList.jsx';
import StudentForm from './views/students/StudentForm.jsx';
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
import { Container } from 'react-bootstrap';

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

function AppContent() {
  const { currentUser } = useAuth();

  return (
    <div className="app-container">
      <Container fluid className="main-content">
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={currentUser ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/auth/google" element={<GoogleAuth />} />

          {/* Rutas protegidas */}
          <Route path="/" element={<ProtectedRoute />}>
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />

            {/* Rutas de alumnos */}
            <Route path="students" element={<StudentList />} />
            <Route path="students/new" element={<StudentForm />} />
            <Route path="students/edit/:id" element={<StudentForm />} />

            {/* Rutas de salas */}
            <Route path="classrooms" element={<ClassroomList />} />
            <Route path="classrooms/new" element={<ClassroomForm />} />
            <Route path="classrooms/edit/:id" element={<ClassroomForm />} />

            {/* Rutas de personal */}
            <Route path="staff" element={<StaffList />} />
            <Route path="staff/new" element={<StaffForm />} />
            <Route path="staff/edit/:id" element={<StaffForm />} />

            {/* Rutas de responsables */}
            <Route path="guardians" element={<GuardianList />} />
            <Route path="guardians/new" element={<GuardianForm />} />
            <Route path="guardians/edit/:id" element={<GuardianForm />} />

            {/* Rutas de asistencia */}
            <Route path="attendance" element={<AttendanceList />} />

            {/* Ruta de calendario */}
            <Route path="calendar" element={<CalendarView />} />

            {/* Rutas de vacunas */}
            <Route path="vaccinations" element={<VaccinationList />} />

            {/* Rutas de revisión de documentos */}
            <Route path="document-reviews" element={<DocumentReviewList />} />

            {/* Rutas de actas de reuniones */}
            <Route path="meeting-minutes" element={<MeetingMinutesList />} />

            {/* Rutas de actividades */}
            <Route path="activities" element={<ActivityList />} />

            {/* Rutas para padres */}
            <Route path="parent-dashboard" element={<ParentDashboard />} />
            <Route path="register-child" element={<RegisterChildForm />} />
          </Route>

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;