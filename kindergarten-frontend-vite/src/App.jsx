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
    <PermissionsProvider>
      <div className="app-container">
        <div className="main-content">
          <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={currentUser ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/auth/google" element={<GoogleAuth />} />

            {/* Rutas protegidas */}
            <Route path="/" element={<ProtectedRoute />}>
              <Route index element={
                <>
                  <OfficeRibbon />
                  <div className="main-content-with-ribbon">
                    <Navigate to="/dashboard" />
                  </div>
                </>
              } />
              <Route path="dashboard" element={
                <>
                  <OfficeRibbon />
                  <div className="main-content-with-ribbon">
                    <Dashboard />
                  </div>
                </>
              } />


              {/* Rutas de salas */}
              <Route path="classrooms" element={
                <>
                  <OfficeRibbon />
                  <div className="main-content-with-ribbon">
                    <ClassroomList />
                  </div>
                </>
              } />
              <Route path="classrooms/new" element={
                <>
                  <OfficeRibbon />
                  <div className="main-content-with-ribbon">
                    <ClassroomForm />
                  </div>
                </>
              } />
              <Route path="classrooms/edit/:id" element={
                <>
                  <OfficeRibbon />
                  <div className="main-content-with-ribbon">
                    <ClassroomForm />
                  </div>
                </>
              } />

              {/* Rutas de personal */}
              <Route path="staff" element={
                <>
                  <OfficeRibbon />
                  <div className="main-content-with-ribbon">
                    <StaffList />
                  </div>
                </>
              } />
              <Route path="staff/new" element={
                <>
                  <OfficeRibbon />
                  <div className="main-content-with-ribbon">
                    <StaffForm />
                  </div>
                </>
              } />
              <Route path="staff/edit/:id" element={
                <>
                  <OfficeRibbon />
                  <div className="main-content-with-ribbon">
                    <StaffForm />
                  </div>
                </>
              } />

              {/* Rutas de responsables */}
              <Route path="guardians" element={
                <>
                  <OfficeRibbon />
                  <div className="main-content-with-ribbon">
                    <GuardianList />
                  </div>
                </>
              } />
              <Route path="guardians/new" element={
                <>
                  <OfficeRibbon />
                  <div className="main-content-with-ribbon">
                    <GuardianForm />
                  </div>
                </>
              } />
              <Route path="guardians/edit/:id" element={
                <>
                  <OfficeRibbon />
                  <div className="main-content-with-ribbon">
                    <GuardianForm />
                  </div>
                </>
              } />

              {/* Rutas de asistencia */}
              <Route path="attendance" element={
                <>
                  <OfficeRibbon />
                  <div className="main-content-with-ribbon">
                    <AttendanceList />
                  </div>
                </>
              } />

              {/* Ruta de calendario */}
              <Route path="calendar" element={
                <>
                  <OfficeRibbon />
                  <div className="main-content-with-ribbon">
                    <CalendarView />
                  </div>
                </>
              } />

              {/* Rutas de vacunas */}
              <Route path="vaccinations" element={
                <>
                  <OfficeRibbon />
                  <div className="main-content-with-ribbon">
                    <VaccinationList />
                  </div>
                </>
              } />

              {/* Rutas de revisión de documentos */}
              <Route path="document-reviews" element={
                <>
                  <OfficeRibbon />
                  <div className="main-content-with-ribbon">
                    <DocumentReviewList />
                  </div>
                </>
              } />

              {/* Rutas de actas de reuniones */}
              <Route path="meeting-minutes" element={
                <>
                  <OfficeRibbon />
                  <div className="main-content-with-ribbon">
                    <MeetingMinutesList />
                  </div>
                </>
              } />

              {/* Rutas de actividades */}
              <Route path="activities" element={
                <>
                  <OfficeRibbon />
                  <div className="main-content-with-ribbon">
                    <ActivityList />
                  </div>
                </>
              } />

              {/* Ruta de configuración */}
              <Route path="configuracion" element={
                <>
                  <OfficeRibbon />
                  <div className="main-content-with-ribbon">
                    <ConfiguracionPage />
                  </div>
                </>
              } />

              {/* Rutas para alumnos */}
              <Route path="students" element={
                <>
                  <OfficeRibbon />
                  <div className="main-content-with-ribbon">
                    <StudentList />
                  </div>
                </>
              } />
              <Route path="students/new" element={
                <>
                  <OfficeRibbon />
                  <div className="main-content-with-ribbon">
                    <StudentForm />
                  </div>
                </>
              } />
              <Route path="students/:id/edit" element={
                <>
                  <OfficeRibbon />
                  <div className="main-content-with-ribbon">
                    <StudentForm />
                  </div>
                </>
              } />
              <Route path="students/:id/view" element={
                <>
                  <OfficeRibbon />
                  <div className="main-content-with-ribbon">
                    <StudentDetailsView />
                  </div>
                </>
              } />

              {/* Rutas para padres */}
              <Route path="parent-dashboard" element={
                <>
                  <OfficeRibbon />
                  <div className="main-content-with-ribbon">
                    <ParentDashboard />
                  </div>
                </>
              } />
            </Route>

            {/* Redirección por defecto */}
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </div>
    </PermissionsProvider>
  );
}

export default App;