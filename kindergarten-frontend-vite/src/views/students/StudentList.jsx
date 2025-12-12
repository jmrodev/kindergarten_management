import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Pencil, Trash, Plus } from 'react-bootstrap-icons';
import Card from '../../components/atoms/Card';
import Button from '../../components/atoms/Button';
import TableHeaderCell from '../../components/atoms/TableHeaderCell';
import TableCell from '../../components/atoms/TableCell';
import { OfficeRibbonWithTitle } from '../../components/organisms';
import ConfirmationModal from '../../components/molecules/ConfirmationModal';
import { studentService } from '../../api/studentService';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await studentService.getAll();
      setStudents(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar la lista de alumnos');
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!studentToDelete) return;

    try {
      await studentService.delete(studentToDelete.id);
      setStudents(students.filter(student => student.id !== studentToDelete.id));
      setShowDeleteModal(false);
      setStudentToDelete(null);
    } catch (err) {
      setError('Error al eliminar el alumno');
      console.error('Error deleting student:', err);
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedStudents = React.useMemo(() => {
    if (!students || !Array.isArray(students)) return [];

    if (!sortConfig.key) return students;

    return [...students].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [students, sortConfig]);

  const menuItems = [
    {
      label: 'Nuevo Alumno',
      icon: <Plus size={16} />,
      onClick: () => navigate('/students/new')
    }
  ];

  const handleView = (student) => {
    navigate(`/students/${student.id}/view`);
  };

  const handleEdit = (student) => {
    navigate(`/students/${student.id}/edit`);
  };

  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setShowDeleteModal(true);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-h-200">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="student-list-container">
      <OfficeRibbonWithTitle
        title="Alumnos"
        menuItems={menuItems}
        backPath="/dashboard"
      />

      <div className="main-content-with-ribbon">
        <Card>
          <Card.Header>
            <div className="d-flex justify-content-between align-items-center">
              <h3>Lista de Alumnos</h3>
              <Button 
                variant="primary" 
                onClick={() => navigate('/students/new')}
              >
                <Plus size={16} className="me-2" />
                Nuevo Alumno
              </Button>
            </div>
          </Card.Header>
          
          <Card.Body>
            {error && !students && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <TableHeaderCell 
                      onClick={() => handleSort('first_name')}
                      className={sortConfig.key === 'first_name' ? sortConfig.direction : ''}
                    >
                      Nombre
                    </TableHeaderCell>
                    <TableHeaderCell 
                      onClick={() => handleSort('paternal_surname')}
                      className={sortConfig.key === 'paternal_surname' ? sortConfig.direction : ''}
                    >
                      Apellido
                    </TableHeaderCell>
                    <TableHeaderCell 
                      onClick={() => handleSort('dni')}
                      className={sortConfig.key === 'dni' ? sortConfig.direction : ''}
                    >
                      DNI
                    </TableHeaderCell>
                    <TableHeaderCell 
                      onClick={() => handleSort('birth_date')}
                      className={sortConfig.key === 'birth_date' ? sortConfig.direction : ''}
                    >
                      Fecha Nacimiento
                    </TableHeaderCell>
                    <TableHeaderCell 
                      onClick={() => handleSort('classroom_name')}
                      className={sortConfig.key === 'classroom_name' ? sortConfig.direction : ''}
                    >
                      Sala
                    </TableHeaderCell>
                    <TableHeaderCell 
                      onClick={() => handleSort('status')}
                      className={sortConfig.key === 'status' ? sortConfig.direction : ''}
                    >
                      Estado
                    </TableHeaderCell>
                    <TableHeaderCell>
                      Acciones
                    </TableHeaderCell>
                  </tr>
                </thead>
                <tbody>
                  {sortedStudents && sortedStudents.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No hay alumnos registrados
                      </td>
                    </tr>
                  ) : (
                    sortedStudents.map((student) => (
                      <tr key={student.id}>
                        <TableCell>
                          {student.first_name} {student.middle_name_optional || ''}
                        </TableCell>
                        <TableCell>
                          {student.paternal_surname} {student.maternal_surname || ''}
                        </TableCell>
                        <TableCell>
                          {student.dni}
                        </TableCell>
                        <TableCell>
                          {student.birth_date ? new Date(student.birth_date).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell>
                          {student.classroom_name || 'Sin sala'}
                        </TableCell>
                        <TableCell>
                          <span className={`badge bg-${getStatusVariant(student.status)}`}>
                            {getStatusDisplay(student.status)}
                          </span>
                        </TableCell>
                        <TableCell className="actions-container">
                          <button
                            className="action-btn action-view"
                            onClick={() => handleView(student)}
                            title="Ver"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            className="action-btn action-edit"
                            onClick={() => handleEdit(student)}
                            title="Editar"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            className="action-btn action-delete"
                            onClick={() => handleDeleteClick(student)}
                            title="Eliminar"
                          >
                            <Trash size={16} />
                          </button>
                        </TableCell>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card.Body>
        </Card>
      </div>

      <ConfirmationModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Confirmar Eliminación"
        message={`¿Está seguro de que desea eliminar al alumno ${studentToDelete?.first_name} ${studentToDelete?.paternal_surname}?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
};

// Helper functions
const getStatusVariant = (status) => {
  switch (status) {
    case 'activo':
      return 'success';
    case 'inactivo':
      return 'secondary';
    case 'preinscripto':
      return 'warning';
    case 'inscripto':
      return 'info';
    case 'egresado':
      return 'dark';
    default:
      return 'light';
  }
};

const getStatusDisplay = (status) => {
  switch (status) {
    case 'activo':
      return 'Activo';
    case 'inactivo':
      return 'Inactivo';
    case 'preinscripto':
      return 'Preinscripto';
    case 'inscripto':
      return 'Inscripto';
    case 'egresado':
      return 'Egresado';
    default:
      return status || 'Sin estado';
  }
};

export default StudentList;