import React from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext.jsx';
import { PersonCircle, Book, DoorOpen, House, Calendar, People, PersonFill, FileEarmarkMedical, FileEarmarkCheck } from 'react-bootstrap-icons';

const NavigationBar = () => {
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top" className="px-3">
      <Container fluid>
        <Navbar.Brand href="/dashboard">
          <House className="me-2" />
          Sistema Jardín de Infantes
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="navbar-nav" />
        
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/dashboard">
              <House className="me-2" />
              Dashboard
            </Nav.Link>
            
            <NavDropdown title={
              <span>
                <Book className="me-2" />
                Alumnos
              </span>
            } id="students-dropdown">
              <NavDropdown.Item href="/students">Listado</NavDropdown.Item>
              <NavDropdown.Item href="/students/new">Nuevo Alumno</NavDropdown.Item>
            </NavDropdown>
            
            <NavDropdown title={
              <span>
                <People className="me-2" />
                Salas
              </span>
            } id="classrooms-dropdown">
              <NavDropdown.Item href="/classrooms">Listado</NavDropdown.Item>
              <NavDropdown.Item href="/classrooms/new">Nueva Sala</NavDropdown.Item>
            </NavDropdown>
            
            <NavDropdown title={
              <span>
                <PersonFill className="me-2" />
                Personal
              </span>
            } id="staff-dropdown">
              <NavDropdown.Item href="/staff">Listado</NavDropdown.Item>
              <NavDropdown.Item href="/staff/new">Nuevo Personal</NavDropdown.Item>
            </NavDropdown>
            
            <NavDropdown title={
              <span>
                <PersonCircle className="me-2" />
                Responsables
              </span>
            } id="guardians-dropdown">
              <NavDropdown.Item href="/guardians">Listado</NavDropdown.Item>
              <NavDropdown.Item href="/guardians/new">Nuevo Responsable</NavDropdown.Item>
            </NavDropdown>
            
            <Nav.Link href="/attendance">
              <FileEarmarkMedical className="me-2" />
              Asistencia
            </Nav.Link>
            
            <Nav.Link href="/calendar">
              <Calendar className="me-2" />
              Calendario
            </Nav.Link>
            
            <NavDropdown title={
              <span>
                <FileEarmarkCheck className="me-2" />
                Documentos
              </span>
            } id="documents-dropdown">
              <NavDropdown.Item href="/vaccinations">Vacunas</NavDropdown.Item>
              <NavDropdown.Item href="/document-reviews">Revisión de Documentos</NavDropdown.Item>
              <NavDropdown.Item href="/meeting-minutes">Actas de Reuniones</NavDropdown.Item>
              <NavDropdown.Item href="/activities">Actividades Especiales</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          
          <Nav>
            <NavDropdown title={
              <span>
                <PersonCircle className="me-2" />
                {currentUser?.first_name} {currentUser?.paternal_surname}
              </span>
            } id="user-dropdown" align="end">
              <NavDropdown.Item disabled>
                Rol: {currentUser?.role_name || 'No asignado'}
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>
                <DoorOpen className="me-2" />
                Cerrar Sesión
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;