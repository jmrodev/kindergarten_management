import { useState, useEffect } from 'react';
import Card from '../Atoms/Card';
import Button from '../Atoms/Button';
import Text from '../Atoms/Text';
import { StepChildInfo, StepAddress, StepMedical, StepAuth, StepFamily, StepReview } from '../Molecules/WizardSteps';
import './organisms.css';

const STEPS = [
    { id: 1, title: 'Datos Básicos', component: StepChildInfo },
    { id: 2, title: 'Domicilio', component: StepAddress },
    { id: 3, title: 'Salud', component: StepMedical },
    { id: 4, title: 'Autorizaciones', component: StepAuth },
    { id: 5, title: 'Responsables', component: StepFamily },
    { id: 6, title: 'Revisión', component: StepReview }
];

/**
 * Generic Student Wizard
 * @param {Object} initialData - Pre-filled data
 * @param {Function} onSaveDraft - Callback to save draft (auto or manual)
 * @param {Function} onSubmit - Callback for final submission
 * @param {boolean} isLoading - External loading state
 * @param {string} title - Wizard title
 */
const StudentWizard = ({
    initialData = {},
    onSaveDraft,
    onSubmit,
    isLoading = false,
    title = "Inscripción de Estudiante",
    savingStatus = "saved" // saved, saving, error
}) => {
    const [currentStep, setCurrentStep] = useState(initialData.currentStep || 1);
    const [formData, setFormData] = useState({
        ...initialData,
        guardians: initialData.guardians || []
    });

    // Update form data if initialData changes drastically (e.g. loaded async)
    useEffect(() => {
        if (initialData && Object.keys(initialData).length > 0) {
            // Merge to avoid overwriting user progress if they started typing before load? 
            // For now, simpler to just set it if formData is empty, or trust parent to manage loading state.
            setFormData(prev => ({
                ...prev,
                ...initialData,
                guardians: initialData.guardians || prev.guardians || []
            }));
            if (initialData.currentStep) {
                setCurrentStep(initialData.currentStep);
            }
        }
    }, [initialData]);

    // Handle changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        console.log('[WIZARD] handleChange:', { name, value, type, checked });
        setFormData(prev => {
            const newData = {
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            };
            console.log('[WIZARD] Updated formData:', newData);

            // Auto-save trigger
            // Wrap in setTimeout to avoid "Cannot update a component while rendering a different component"
            if (onSaveDraft) {
                setTimeout(() => {
                    onSaveDraft(newData, currentStep);
                }, 0);
            }
            return newData;
        });
    };

    const handleAddGuardian = (guardian) => {
        console.log('[WIZARD] Adding guardian:', guardian);
        setFormData(prev => ({
            ...prev,
            guardians: [...(prev.guardians || []), guardian]
        }));
    };

    const handleRemoveGuardian = (index) => {
        setFormData(prev => ({
            ...prev,
            guardians: (prev.guardians || []).filter((_, i) => i !== index)
        }));
    };

    const handleNext = () => {
        if (currentStep < STEPS.length) {
            const nextStep = currentStep + 1;
            console.log('[WIZARD] Moving to next step:', nextStep, 'Current formData:', formData);

            // Auto-save guardian if on Step 5 (Responsables) by getting latest state
            if (currentStep === 5) {
                // Dispatch event to trigger auto-save
                const autoSaveEvent = new CustomEvent('autoSaveGuardian');
                window.dispatchEvent(autoSaveEvent);

                // Wait for event to be processed, then advance
                setTimeout(() => {
                    // Read the latest state without causing renders
                    setFormData(currentFormData => {
                        console.log('[WIZARD] Checking guardians after auto-save:', currentFormData.guardians);

                        // Schedule the navigation and save as separate updates
                        Promise.resolve().then(() => {
                            setCurrentStep(nextStep);
                            window.scrollTo(0, 0);
                            if (onSaveDraft) onSaveDraft(currentFormData, nextStep);
                        });

                        return currentFormData; // Don't modify state
                    });
                }, 350);
            } else {
                setCurrentStep(nextStep);
                window.scrollTo(0, 0);
                if (onSaveDraft) onSaveDraft(formData, nextStep);
            }
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            const prevStep = currentStep - 1;
            setCurrentStep(prevStep);
            if (onSaveDraft) onSaveDraft(formData, prevStep);
        }
    };

    const handleSubmit = () => {
        console.log('[WIZARD] Submitting formData:', JSON.stringify(formData, null, 2));
        if (onSubmit) onSubmit(formData);
    };

    const [healthInsurances, setHealthInsurances] = useState([]);
    const [pediatricians, setPediatricians] = useState([]);

    useEffect(() => {
        const fetchHealthInsurances = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
                const token = localStorage.getItem('token');
                const response = await fetch(`${apiUrl}/health-insurances`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setHealthInsurances(data.data || []);
                }
            } catch (error) {
                console.error("Error fetching health insurances", error);
            }
        };
        const fetchPediatricians = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
                const token = localStorage.getItem('token');
                const response = await fetch(`${apiUrl}/pediatricians`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setPediatricians(data.data || []);
                }
            } catch (error) {
                console.error("Error fetching pediatricians", error);
            }
        };
        fetchHealthInsurances();
        fetchPediatricians();
    }, []);

    const [classrooms, setClassrooms] = useState([]);
    useEffect(() => {
        const fetchClassrooms = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
                const token = localStorage.getItem('token');
                const response = await fetch(`${apiUrl}/classrooms`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setClassrooms(data.data || data || []);
                }
            } catch (error) {
                console.error("Error fetching classrooms", error);
            }
        };
        fetchClassrooms();
    }, []);

    const verifyStudentDni = async (dni) => {
        if (!dni) return null;
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
            const token = localStorage.getItem('token');

            const response = await fetch(`${apiUrl}/students?dni=${dni}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Error verifying student');

            const data = await response.json();
            // API returns { status: 'success', data: [...] } or just [...] depending on implementation.
            // Controller getAllStudents returns { status: 'success', data: students, ... }
            const students = data.data || data;

            if (students && students.length > 0) {
                return students[0];
            }
            return null;
        } catch (error) {
            console.error("Error verifying student", error);
            return null;
        }
    };

    const verifyGuardianDni = async (dni) => {
        if (!dni) return null;
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
            const token = localStorage.getItem('token');

            const response = await fetch(`${apiUrl}/guardians?dni=${dni}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Error verifying guardian');

            const data = await response.json();
            if (data && data.length > 0) {
                return data[0];
            }
            return null;
        } catch (error) {
            console.error("Error verifying guardian", error);
            // Optionally notify user of technical error
            return null;
        }
    };

    if (isLoading) return <div className="loading-container">Cargando...</div>;

    const CurrentStepComponent = STEPS[currentStep - 1].component;

    return (
        <div className="wizard-container">
            <Card className="wizard-card">
                {/* Header / Stepper */}
                <div className="wizard-header">
                    <Text variant="h2">{title}</Text>

                    <div className="stepper">
                        {STEPS.map(step => (
                            <div
                                key={step.id}
                                onClick={() => {
                                    // Optional: Allow clicking to navigate back to completed steps
                                    if (step.id < currentStep) setCurrentStep(step.id);
                                }}
                                className={`step-indicator ${step.id === currentStep ? 'active' : ''} ${step.id < currentStep ? 'completed' : ''} ${step.id < currentStep ? 'cursor-pointer' : 'cursor-default'}`}
                            >
                                <div className="step-circle">{step.id}</div>
                                <span className="step-label">{step.title}</span>
                            </div>
                        ))}
                    </div>

                    <div className="save-indicator">
                        {savingStatus === 'saving' && <span className="text-muted">Guardando...</span>}
                        {savingStatus === 'saved' && <span className="text-success">Borrador guardado</span>}
                        {savingStatus === 'error' && <span className="text-danger">Error al guardar</span>}
                    </div>
                </div>

                {/* Body */}
                <div className="wizard-body">
                    <CurrentStepComponent
                        data={formData}
                        onChange={handleChange}
                        onAddGuardian={handleAddGuardian}
                        onRemoveGuardian={handleRemoveGuardian}
                        onVerifyGuardian={verifyGuardianDni}
                        onVerifyStudent={verifyStudentDni}
                        healthInsurances={healthInsurances}
                        pediatricians={pediatricians}
                        classrooms={classrooms}
                    />
                </div>

                {/* Footer */}
                <div className="wizard-footer">
                    <Button
                        variant="secondary"
                        onClick={handleBack}
                        disabled={currentStep === 1}
                    >
                        Atrás
                    </Button>

                    {currentStep < STEPS.length ? (
                        <Button variant="primary" onClick={handleNext}>
                            Siguiente
                        </Button>
                    ) : (
                        <Button variant="success" onClick={handleSubmit}>
                            {initialData && initialData.id ? 'Guardar Cambios' : 'Finalizar & Guardar'}
                        </Button>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default StudentWizard;
