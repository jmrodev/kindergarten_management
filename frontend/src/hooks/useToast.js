import { useState, useCallback } from 'react';

export const useToast = () => {
    const [toastConfig, setToastConfig] = useState({
        show: false,
        variant: 'success',
        title: '',
        message: ''
    });

    const showToast = useCallback((variant, title, message) => {
        setToastConfig({
            show: true,
            variant,
            title,
            message
        });
    }, []);

    const hideToast = useCallback(() => {
        setToastConfig(prev => ({
            ...prev,
            show: false
        }));
    }, []);

    const showSuccess = useCallback((title, message) => {
        showToast('success', title, message);
    }, [showToast]);

    const showError = useCallback((title, message) => {
        showToast('danger', title, message);
    }, [showToast]);

    const showWarning = useCallback((title, message) => {
        showToast('warning', title, message);
    }, [showToast]);

    const showInfo = useCallback((title, message) => {
        showToast('info', title, message);
    }, [showToast]);

    return {
        toastConfig,
        showToast,
        hideToast,
        showSuccess,
        showError,
        showWarning,
        showInfo
    };
};

export default useToast;
