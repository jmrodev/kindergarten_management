// frontend/src/components/ToastNotification.jsx
import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

const ToastNotification = ({ show, onClose, message, variant = 'success', title }) => {
    const getBgClass = () => {
        switch (variant) {
            case 'success': return 'bg-success text-white';
            case 'danger': return 'bg-danger text-white';
            case 'warning': return 'bg-warning';
            case 'info': return 'bg-info text-white';
            default: return 'bg-success text-white';
        }
    };

    const getIcon = () => {
        switch (variant) {
            case 'success': return '✓';
            case 'danger': return '✕';
            case 'warning': return '⚠';
            case 'info': return 'ℹ';
            default: return '✓';
        }
    };

    const getGeneratedTitle = () => {
        switch (variant) {
            case 'success': return 'Éxito';
            case 'danger': return 'Error';
            case 'warning': return 'Advertencia';
            case 'info': return 'Información';
            default: return 'Notificación';
        }
    };

    return (
        <ToastContainer position="top-end" className="p-3" style={{ zIndex: 99999, position: 'fixed', top: '20px', right: '20px' }}>
            <Toast 
                show={show} 
                onClose={onClose} 
                delay={5000} 
                autohide 
                className={getBgClass()}
                style={{ minWidth: '300px' }}
            >
                <Toast.Header>
                    <strong className="me-auto">
                        <span className="me-2">{getIcon()}</span>
                        {title || getGeneratedTitle()}
                    </strong>
                </Toast.Header>
                <Toast.Body>{message}</Toast.Body>
            </Toast>
        </ToastContainer>
    );
};

export default ToastNotification;
