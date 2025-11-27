// frontend/src/hooks/useFormValidation.js

import { useState, useCallback } from 'react';
import { sanitizeInput, validateSecurity, VALIDATION_PATTERNS } from '../utils';

/**
 * Hook personalizado para validación de formularios con sanitización y seguridad
 * @param {Object} initialState - Estado inicial del formulario
 * @returns {Object} - { formData, errors, handleChange, handleNestedChange, handleSubmit, resetForm }
 */
export const useFormValidation = (initialState = {}) => {
    const [formData, setFormData] = useState(initialState);
    const [errors, setErrors] = useState({});

    /**
     * Maneja cambios en campos simples
     * @param {Event} e - Evento del input
     * @param {string} patternType - Tipo de patrón a validar (name, address, phone, etc.)
     */
    const handleChange = useCallback((e, patternType = null) => {
        const { name, value } = e.target;
        const sanitized = sanitizeInput(value);
        
        // Validar según el patrón
        const pattern = patternType ? VALIDATION_PATTERNS[patternType] : null;
        const validation = validateSecurity(sanitized, pattern);
        
        if (!validation.isValid) {
            setErrors(prev => ({
                ...prev,
                [name]: validation.error
            }));
            return;
        }
        
        // Limpiar error
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
        });
        
        setFormData(prev => ({
            ...prev,
            [name]: sanitized
        }));
    }, []);

    /**
     * Maneja cambios en campos anidados (objetos)
     * @param {string} section - Sección del objeto (ej: 'direccion')
     * @param {string} field - Campo dentro de la sección
     * @param {string} value - Valor del campo
     * @param {string} patternType - Tipo de patrón a validar
     */
    const handleNestedChange = useCallback((section, field, value, patternType = null) => {
        const sanitized = sanitizeInput(value);
        const fieldKey = `${section}.${field}`;
        
        // Validar según el patrón
        const pattern = patternType ? VALIDATION_PATTERNS[patternType] : null;
        const validation = validateSecurity(sanitized, pattern);
        
        if (!validation.isValid) {
            setErrors(prev => ({
                ...prev,
                [fieldKey]: validation.error
            }));
            return;
        }
        
        // Limpiar error
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[fieldKey];
            return newErrors;
        });
        
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: sanitized
            }
        }));
    }, []);

    /**
     * Maneja el envío del formulario
     * @param {Function} onSubmit - Función a ejecutar si el formulario es válido
     * @returns {Function} - Handler del evento submit
     */
    const handleSubmit = useCallback((onSubmit) => {
        return (e) => {
            e.preventDefault();
            
            // Verificar si hay errores
            if (Object.keys(errors).length > 0) {
                alert('Por favor corrija los errores en el formulario antes de enviar.');
                return;
            }
            
            // Ejecutar callback con datos sanitizados
            onSubmit(formData);
        };
    }, [formData, errors]);

    /**
     * Resetea el formulario al estado inicial
     */
    const resetForm = useCallback(() => {
        setFormData(initialState);
        setErrors({});
    }, [initialState]);

    /**
     * Actualiza formData manualmente (útil para modo edición)
     */
    const setFormDataManual = useCallback((newData) => {
        setFormData(newData);
    }, []);

    return {
        formData,
        errors,
        handleChange,
        handleNestedChange,
        handleSubmit,
        resetForm,
        setFormData: setFormDataManual,
        setErrors
    };
};

export default useFormValidation;
