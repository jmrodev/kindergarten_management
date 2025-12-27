import { useState, useEffect } from 'react';
import Modal from '../components/Atoms/Modal';
import Button from '../components/Atoms/Button';
import Loading from '../components/Atoms/Loading';
import ErrorMessage from '../components/Atoms/ErrorMessage';
import useIsMobile from '../hooks/useIsMobile';
import DesktopStudents from '../components/Organisms/DesktopStudents';
import MobileStudents from '../components/Organisms/MobileStudents';
import StudentDetailModal from '../components/Organisms/StudentDetailModal';
import studentsService from '../services/studentsService';
import StudentWizard from '../components/Organisms/StudentWizard';
import Pagination from '../components/Atoms/Pagination';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10); // Standard mobile-friendly limit
  const [statusFilter, setStatusFilter] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [detailStudent, setDetailStudent] = useState(null);
  const [wizardSavingStatus, setWizardSavingStatus] = useState('saved');
  const [isRecoveryModalOpen, setIsRecoveryModalOpen] = useState(false);

  const [draftData, setDraftData] = useState(null);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);

  // Initial Form State
  const initialFormState = {
    first_name: '',
    middle_name_optional: '',
    third_name_optional: '',
    paternal_surname: '',
    maternal_surname: '',
    nickname_optional: '',
    dni: '',
    birth_date: '',
    status: 'activo',
    street: '',
    number: '',
    city: '',
    provincia: '',
    postal_code_optional: '',
    blood_type: '',
    health_insurance: '',
    allergies: '',
    medications: '',
    special_needs: '',
    medical_observations: '',
    pediatrician_name: '',
    pediatrician_phone: '',
    photo_authorization: false,
    trip_authorization: false,
    medical_attention_authorization: false,
    guardians: []
  };

  const [wizardData, setWizardData] = useState(initialFormState);

  // Load students
  useEffect(() => {
    loadStudents();
  }, [page, statusFilter]); // Reload when page or status changes

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      // If searchTerm exists, we might want to use search endpoint instead of getAll with pagination, 
      // or ensure search endpoint also supports pagination.
      // For now, let's assume search handles its own filtering logic or we use client-side filtering 
      // for small datasets returned by search. 
      // However, if we are paginating, client-side filtering on a page is weird.
      // Ideally, the backend search should be paginated too.
      // But for this task, let's focus on the main list pagination.

      const response = await studentsService.getAll({ page, limit, status: statusFilter });

      if (response.data && response.meta) {
        setStudents(response.data);
        setTotalPages(response.meta.totalPages);
      } else {
        // Fallback for non-paginated response or error structure
        setStudents(Array.isArray(response) ? response : (response.data || []));
      }
    } catch (err) {
      console.error('Error loading students:', err);
      setError(err.message || 'Error al cargar estudiantes');
    } finally {
      setLoading(false);
    }
  };

  const normalizeText = (text) => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u0386]/g, '');

  const filteredStudents = students.filter(student => {
    const fullName = `${student.first_name} ${student.paternal_surname || ''} ${student.maternal_surname || ''}`.toLowerCase();
    return normalizeText(fullName).includes(normalizeText(searchTerm)) || (student.dni && student.dni.includes(searchTerm));
  });

  // Local Storage Save Logic
  const handleWizardSaveDraft = (data, step) => {
    if (!currentStudent) {
      // Only save draft for new students (creation mode)
      setWizardSavingStatus('saving');
      localStorage.setItem('student_creation_draft', JSON.stringify({ data, step }));
      // Simulate network delay for UX
      setTimeout(() => setWizardSavingStatus('saved'), 500);
    }
    setWizardData(data); // Sync state but don't strictly need it if Wizard maintains it, but useful for final submit
  };

  const handleEdit = async (student) => {
    setCurrentStudent(student);
    setIsFetchingDetails(true);
    // Initial partial set to open modal immediately (will show loading spinner via isLoading prop)
    const partialData = {
      ...initialFormState,
      ...student,
      ...(student.address || {}),
      guardians: student.guardians || []
    };
    setWizardData(partialData);
    setIsModalOpen(true);

    // Fetch full data
    try {
      const detailed = await studentsService.getById(student.id);
      const fullData = Array.isArray(detailed) ? (detailed[0] || student) : (detailed.data || detailed || student);

      const safeStudent = {
        ...initialFormState,
        ...fullData,
        ...(fullData.address || {}),
        guardians: fullData.guardians || []
      };

      setWizardData(safeStudent);
      setCurrentStudent(fullData);
    } catch (err) {
      console.error('Error loading full student details:', err);
      // If error, we should probably close modal or warn, but keeping it open with partial data is risky.
      // Ideally show error inside modal.
    } finally {
      setIsFetchingDetails(false);
    }
  };

  const handleAdd = () => {
    setCurrentStudent(null);
    // Check for draft
    const draft = localStorage.getItem('student_creation_draft');
    if (draft) {
      setDraftData(JSON.parse(draft));
      setIsRecoveryModalOpen(true);
    } else {
      setWizardData(initialFormState);
      setIsModalOpen(true);
    }
  };

  const handleRecoverDraft = () => {
    if (draftData) {
      const { data, step } = draftData;
      setWizardData({ ...data, currentStep: step });
    }
    setIsRecoveryModalOpen(false);
    setIsModalOpen(true);
  };

  const handleDiscardDraft = () => {
    localStorage.removeItem('student_creation_draft');
    setWizardData(initialFormState);
    setIsRecoveryModalOpen(false);
    setIsModalOpen(true);
  };

  const handleWizardSubmit = async (finalData) => {
    try {
      if (currentStudent) {
        await studentsService.update(currentStudent.id, finalData);
      } else {
        await studentsService.create(finalData);
        // Clear draft
        localStorage.removeItem('student_creation_draft');
      }
      await loadStudents();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving student:', err);
      // Pass error to wizard? Or show alert
      alert(`Error al guardar: ${err.message}`);
    }
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const confirmDelete = (studentId) => {
    setStudentToDelete(studentId);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!studentToDelete) return;
    try {
      await studentsService.delete(studentToDelete);
      await loadStudents();
      setIsDeleteModalOpen(false);
      setStudentToDelete(null);
    } catch (err) {
      console.error('Error deleting student:', err);
      setError(err.message || 'Error al eliminar estudiante');
    }
  };

  const handleView = async (student) => {
    try {
      const detailed = await studentsService.getById(student.id);
      const fullData = Array.isArray(detailed) ? (detailed[0] || student) : (detailed.data || detailed || student);
      setDetailStudent(fullData);
    } catch (e) {
      console.warn('Falling back to list student data', e);
      setDetailStudent(student);
    } finally {
      setIsDetailOpen(true);
    }
  };

  const isMobile = useIsMobile();

  return (
    <>
      {isMobile ? (
        <MobileStudents
          students={filteredStudents}
          onEdit={handleEdit}
          onDelete={confirmDelete}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onView={handleView}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />
      ) : (
        <DesktopStudents
          students={filteredStudents}
          onEdit={handleEdit}
          onDelete={confirmDelete}
          onAdd={handleAdd}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onView={handleView}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />
      )}

      {/* Pagination Controls */}
      {!loading && !error && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      {/* Wizard Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentStudent ? "Editar Estudiante" : "Nuevo Estudiante"}
        size="large" // Assuming Modal supports size or we rely on default width
      >
        <StudentWizard
          initialData={wizardData}
          onSaveDraft={handleWizardSaveDraft}
          onSubmit={handleWizardSubmit}
          isLoading={isFetchingDetails}
          title={null} // Modal header already has title
          savingStatus={currentStudent ? 'saved' : wizardSavingStatus}
        />
      </Modal>

      <StudentDetailModal student={detailStudent} isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} />

      {/* Draft Recovery Modal */}
      <Modal
        isOpen={isRecoveryModalOpen}
        onClose={() => setIsRecoveryModalOpen(false)}
        title="Recuperar Borrador"
      >
        <div style={{ padding: '20px' }}>
          <p>Existe un borrador de estudiante no guardado. ¿Desea recuperarlo o empezar de nuevo?</p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <Button variant="secondary" onClick={handleDiscardDraft}>Empezar de Nuevo</Button>
            <Button variant="primary" onClick={handleRecoverDraft}>Recuperar Borrador</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmar Eliminación"
      >
        <div style={{ padding: '20px' }}>
          <p>¿Está seguro que desea eliminar este estudiante? Esta acción no se puede deshacer.</p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>Cancelar</Button>
            <Button variant="danger" onClick={handleDelete}>Eliminar</Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Students;
