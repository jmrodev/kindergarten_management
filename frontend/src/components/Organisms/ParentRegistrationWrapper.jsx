import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import StudentWizard from './StudentWizard';
import parentPortalService from '../../services/parentPortalService';

const ParentRegistrationWrapper = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [initialData, setInitialData] = useState({});
    const [loading, setLoading] = useState(true);
    const [savingStatus, setSavingStatus] = useState('saved');
    const [user, setUser] = useState(null);

    // Initial Load
    useEffect(() => {
        const loadData = async () => {
            try {
                // Check for token in URL (Google Auth Callback)
                const urlToken = searchParams.get('token');
                let storedUser = JSON.parse(localStorage.getItem('user'));

                if (urlToken) {
                    localStorage.setItem('token', urlToken);
                    // Fetch user details
                    const authService = await import('../../services/authService');
                    const me = await authService.default.me();

                    const normalized = {
                        id: me.id,
                        email: me.email,
                        firstName: me.name || me.firstName || 'Usuario',
                        paternalSurname: '', // Parents might just have 'name'
                        role: 'Parent',
                        parentPortalUser: true
                    };

                    localStorage.setItem('user', JSON.stringify(normalized));
                    storedUser = normalized;

                    // Clear token from URL to look cleaner
                    setSearchParams({});
                }

                if (!storedUser) {
                    navigate('/login');
                    return;
                }
                setUser(storedUser);

                // Check enrollment
                const status = await parentPortalService.getEnrollmentStatus();
                if (!status.enrollmentOpen) {
                    alert('Las inscripciones están cerradas en este momento.');
                    navigate('/');
                    return;
                }

                // Load Draft
                const draft = await parentPortalService.getDraft(storedUser.id);
                if (draft && draft.data) {
                    setInitialData({
                        ...draft.data.data,
                        currentStep: draft.data.currentStep
                    });
                }
            } catch (err) {
                console.error('Error loading parent data:', err);
                if (err.status === 401) navigate('/login');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [navigate, searchParams, setSearchParams]);

    // Auto-save Handler
    const handleSaveDraft = useCallback(async (data, step) => {
        if (!user) return;
        setSavingStatus('saving');

        // Debounce via simple timeout is handled inside Wizard? 
        // actually Wizard calls this on every change if we passed it directly.
        // Let's implement debounce here or just let Wizard handle it?
        // The Wizard logic has "onSaveDraft" called on change. 
        // We should debounce HERE to avoid API spam.
    }, [user]);

    // Better approach: Let's use a debounced effect HERE based on local state updates if we lifted state up?
    // But State is inside Wizard. 
    // Let's modify Wizard to DEBOUNCE the callback. 
    // OR: we can implement the debounce in this wrapper.

    // Simple implementation: 
    // We will just pass a function that actually calls API, and let Wizard debounce it?
    // Looking back at StudentWizard.jsx, it calls onSaveDraft immediately on change.
    // AND it has no internal debounce effect for the callback anymore (only the old Effect).
    // Wait, I removed the debounce effect in StudentWizard.jsx ? 
    // Checking previous file write...

    // In StudentWizard.jsx (Step 448):
    // "handleChange" calls "onSaveDraft" immediately.
    // So we MUST debounce here.

    const [debouncedData, setDebouncedData] = useState(null);

    useEffect(() => {
        if (!debouncedData || !user) return;

        const timer = setTimeout(async () => {
            setSavingStatus('saving');
            try {
                await parentPortalService.saveDraft({
                    data: debouncedData.data,
                    currentStep: debouncedData.step
                });
                setSavingStatus('saved');
            } catch (err) {
                console.error('Auto-save error:', err);
                setSavingStatus('error');
            }
        }, 2000);

        return () => clearTimeout(timer);
    }, [debouncedData, user]);

    const onWizardChange = (data, step) => {
        setSavingStatus('saving'); // UI feedback in Wizard
        setDebouncedData({ data, step });
    };

    const handleSubmit = async (formData) => {
        if (!window.confirm('¿Está seguro de enviar la inscripción? Una vez enviada no podrá modificarla.')) return;

        setLoading(true);
        try {
            await parentPortalService.submitRegistration(formData);
            await parentPortalService.deleteDraft(user.id);
            alert('¡Inscripción enviada con éxito!');
            navigate('/');
        } catch (err) {
            console.error('Submission error:', err);
            alert('Error al enviar la inscripción. Por favor intente nuevamente.');
            setLoading(false);
        }
    };

    return (
        <StudentWizard
            initialData={initialData}
            onSaveDraft={onWizardChange}
            onSubmit={handleSubmit}
            isLoading={loading}
            savingStatus={savingStatus}
            title={`Inscripción ${new Date().getFullYear()}`}
        />
    );
};

export default ParentRegistrationWrapper;
