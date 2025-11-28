// frontend/src/components/GuardiansManager.jsx
import React, { useState } from 'react';
import { Card, Button, Alert } from 'react-bootstrap';
import GuardianList from './GuardianList';
import GuardianForm from './GuardianForm';
import EmergencyContactForm from './EmergencyContactForm';

/**
 * Componente para gestionar responsables y contacto de emergencia
 * Puede usarse en modo "local" (sin guardar en BD) o "remoto" (guardando inmediatamente)
 */
const GuardiansManager = ({
    studentId = null,
    initialGuardians = [],
    initialEmergencyContact = null,
    onGuardiansChange,
    onEmergencyContactChange,
    mode = 'local', // 'local' o 'remote'
    canEdit = true
}) => {
    const [guardians, setGuardians] = useState(initialGuardians);
    const [emergencyContact, setEmergencyContact] = useState(initialEmergencyContact);
    const [showGuardianForm, setShowGuardianForm] = useState(false);
    const [editingGuardian, setEditingGuardian] = useState(null);
    const [message, setMessage] = useState(null);

    const handleAddGuardian = () => {
        setEditingGuardian(null);
        setShowGuardianForm(true);
    };

    const handleEditGuardian = (guardian) => {
        setEditingGuardian(guardian);
        setShowGuardianForm(true);
    };

    const handleSaveGuardian = (guardianData) => {
        let updatedGuardians;

        if (editingGuardian) {
            // Editar existente
            updatedGuardians = guardians.map(g =>
                (g.id === editingGuardian.id || g.tempId === editingGuardian.tempId)
                    ? { ...g, ...guardianData }
                    : g
            );
        } else {
            // Agregar nuevo
            const newGuardian = {
                ...guardianData,
                tempId: Date.now(), // ID temporal para nuevos
                id: null
            };
            updatedGuardians = [...guardians, newGuardian];
        }

        // Si es principal, quitar flag de otros
        if (guardianData.esPrincipal) {
            updatedGuardians = updatedGuardians.map(g => ({
                ...g,
                esPrincipal: g.tempId === guardianData.tempId || g.id === editingGuardian?.id ? true : false,
                isPrimary: g.tempId === guardianData.tempId || g.id === editingGuardian?.id ? true : false
            }));
        }

        setGuardians(updatedGuardians);
        setShowGuardianForm(false);
        setEditingGuardian(null);

        // Notificar cambio al padre
        if (onGuardiansChange) {
            onGuardiansChange(updatedGuardians);
        }

        setMessage({
            type: 'success',
            text: editingGuardian ? 'Responsable actualizado' : 'Responsable agregado'
        });

        setTimeout(() => setMessage(null), 3000);
    };

    const handleRemoveGuardian = (guardian) => {
        if (guardians.length === 1) {
            setMessage({
                type: 'danger',
                text: 'No se puede eliminar el único responsable'
            });
            setTimeout(() => setMessage(null), 3000);
            return;
        }

        if (window.confirm(`¿Eliminar a ${guardian.nombre} ${guardian.apellidoPaterno} como responsable?`)) {
            const updatedGuardians = guardians.filter(g =>
                g.id !== guardian.id && g.tempId !== guardian.tempId
            );
            setGuardians(updatedGuardians);

            if (onGuardiansChange) {
                onGuardiansChange(updatedGuardians);
            }

            setMessage({
                type: 'info',
                text: 'Responsable eliminado'
            });

            setTimeout(() => setMessage(null), 3000);
        }
    };

    const handleEmergencyContactChange = (contactData) => {
        setEmergencyContact(contactData);
        if (onEmergencyContactChange) {
            onEmergencyContactChange(contactData);
        }
    };

    return (
        <div>
            {/* Mensaje de feedback */}
            {message && (
                <Alert variant={message.type} dismissible onClose={() => setMessage(null)}>
                    {message.text}
                </Alert>
            )}

            {/* Sección de Responsables */}
            <Card className="mb-4">
                <Card.Header className="bg-primary text-white">
                    <h5 className="mb-0">
                        <span className="material-icons" style={{ fontSize: '1.3rem', verticalAlign: 'middle', marginRight: '0.5rem' }}>
                            family_restroom
                        </span>
                        Responsables del Alumno
                    </h5>
                </Card.Header>
                <Card.Body>
                    <GuardianList
                        guardians={guardians}
                        onEdit={handleEditGuardian}
                        onRemove={handleRemoveGuardian}
                        onAdd={handleAddGuardian}
                        canEdit={canEdit}
                    />
                </Card.Body>
            </Card>

            {/* Sección de Contacto de Emergencia */}
            <EmergencyContactForm
                emergencyContact={emergencyContact}
                onChange={handleEmergencyContactChange}
                required={true}
            />

            {/* Modal de Formulario de Guardian */}
            <GuardianForm
                show={showGuardianForm}
                guardian={editingGuardian}
                onSave={handleSaveGuardian}
                onCancel={() => {
                    setShowGuardianForm(false);
                    setEditingGuardian(null);
                }}
            />
        </div>
    );
};

export default GuardiansManager;
