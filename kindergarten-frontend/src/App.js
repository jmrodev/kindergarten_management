import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Dashboard from './views/Dashboard';
import Login from './views/auth/Login';
import StudentList from './views/students/StudentList';
import StudentForm from './views/students/StudentForm';
import ClassroomList from './views/classrooms/ClassroomList';
import ClassroomForm from './views/classrooms/ClassroomForm';
import StaffList from './views/staff/StaffList';
import StaffForm from './views/staff/StaffForm';
import GuardianList from './views/guardians/GuardianList';
import GuardianForm from './views/guardians/GuardianForm';
import AttendanceList from './views/attendance/AttendanceList';
import CalendarView from './views/calendar/CalendarView';
import VaccinationList from './views/vaccinations/VaccinationList';
import DocumentReviewList from './views/documentReviews/DocumentReviewList';
import MeetingMinutesList from './views/meetingMinutes/MeetingMinutesList';
import ActivityList from './views/activities/ActivityList';

// Componente para rutas protegidas
function App() {
  return (
    <Router>
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
    <div>
      {currentUser && <Navbar />}
      <Container fluid className="main-content">
        <Routes>
          {/* Ruta pública para login */}
          <Route path="/login" element={currentUser ? <Navigate to="/dashboard" /> : <Login />} />

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
          </Route>

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;