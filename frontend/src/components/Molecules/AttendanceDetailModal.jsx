import { useState, useEffect } from 'react';
import './AttendanceDetailModal.css';
import { ATTENDANCE_CONFIG } from '../../config/attendance';

const AttendanceDetailModal = ({ isOpen, onClose, onSave, student, currentStatus, initialData, guardians = [] }) => {
    const [status, setStatus] = useState(currentStatus);
    const [details, setDetails] = useState({
        check_in_time: '',
        check_out_time: '',
        check_in_adult: '',
        check_out_adult: '',
        notes: ''
    });

    const [showManualInput, setShowManualInput] = useState(false);

    useEffect(() => {
        if (initialData) {
            setDetails({
                check_in_time: initialData.check_in_time || '',
                check_out_time: initialData.check_out_time || '',
                check_in_adult: initialData.check_in_adult || '',
                check_out_adult: initialData.check_out_adult || '',
                notes: initialData.notes || ''
            });
        } else {
            // Auto-fill time with current time for new entries
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

            setDetails(prev => ({
                ...prev,
                check_in_time: prev.check_in_time || timeString,
                check_out_time: prev.check_out_time || timeString
            }));
        }
        if (currentStatus) {
            setStatus(currentStatus);
        }
    }, [initialData, currentStatus]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(student.id, status, details);
        onClose();
    };

    const handleSelectStatus = (newStatus) => {
        setStatus(newStatus);
        // Auto-fill time on selection
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        setDetails(prev => ({
            ...prev,
            check_in_time: prev.check_in_time || timeString,
            check_out_time: prev.check_out_time || timeString
        }));
    };

    const isSelectionMode = !status || (status !== 'llegada_tarde' && status !== 'retiro_anticipado');

    const handleSelectGuardian = (field, name) => {
        setDetails({ ...details, [field]: name });
        setShowManualInput(false);
    };

    const renderGuardianButtons = (field) => {
        return (
            <div className="guardian-selection">
                <label>Seleccionar Responsable:</label>
                <div className="guardian-buttons">
                    {guardians.map(g => (
                        <button
                            key={g.id}
                            type="button"
                            className={`guardian-btn ${details[field] === `${g.first_name} ${g.paternal_surname}` ? 'selected' : ''}`}
                            onClick={() => handleSelectGuardian(field, `${g.first_name} ${g.paternal_surname}`)}
                        >
                            <span className="guardian-name">{g.first_name} {g.paternal_surname}</span>
                            <span className="guardian-relation">({g.relationship_type || 'R'})</span>
                        </button>
                    ))}
                    <button
                        type="button"
                        className={`guardian-btn ${showManualInput ? 'selected' : ''}`}
                        onClick={() => { setShowManualInput(true); setDetails({ ...details, [field]: '' }); }}
                    >
                        Otro / Manual
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="attendance-modal-overlay">
            <div className="attendance-modal">
                <div className="attendance-modal-header">
                    <h3>Asistencia: {student.first_name} {student.paternal_surname}</h3>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                {isSelectionMode ? (
                    <div className="modal-selection-view" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <p style={{ textAlign: 'center', marginBottom: '10px' }}>Seleccione el tipo de registro fuera de horario:</p>
                        <button
                            className="action-btn-large late"
                            onClick={() => handleSelectStatus('llegada_tarde')}
                            style={{ padding: '15px', fontSize: '1.1rem', background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                        >
                            ⏱️ Registrar Llegada Tarde
                        </button>
                        <button
                            className="action-btn-large early"
                            onClick={() => handleSelectStatus('retiro_anticipado')}
                            style={{ padding: '15px', fontSize: '1.1rem', background: '#eef2ff', border: '1px solid #a5b4fc', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                        >
                            🏃 Registrar Retiro Anticipado
                        </button>
                        <button
                            className="action-btn-large cancel"
                            onClick={onClose}
                            style={{ padding: '10px', marginTop: '10px', background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer' }}
                        >
                            Cancelar
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {/* Status selection handled by action buttons */}
                        <div className="status-indicator" style={{
                            marginBottom: '20px',
                            padding: '10px',
                            borderRadius: '6px',
                            backgroundColor: status === 'llegada_tarde' ? '#fffbeb' : '#eef2ff',
                            color: status === 'llegada_tarde' ? '#92400e' : '#3730a3',
                            border: `1px solid ${status === 'llegada_tarde' ? '#fde68a' : '#c7d2fe'}`,
                            textAlign: 'center',
                            fontWeight: 'bold'
                        }}>
                            {status === 'llegada_tarde' ? '⏱️ REGISTRAR LLEGADA TARDE' : '🏃 REGISTRAR RETIRO ANTICIPADO'}
                        </div>

                        {status === 'llegada_tarde' && (
                            <div className="special-fields">
                                <div className="form-group">
                                    <label>Hora de Llegada</label>
                                    <input
                                        type="time"
                                        value={details.check_in_time}
                                        onChange={(e) => setDetails({ ...details, check_in_time: e.target.value })}
                                        required
                                    />
                                </div>

                                {renderGuardianButtons('check_in_adult')}

                                {(showManualInput || (details.check_in_adult && !guardians.some(g => `${g.first_name} ${g.paternal_surname}` === details.check_in_adult))) && (
                                    <div className="form-group" style={{ marginTop: '10px' }}>
                                        <label>Nombre del adulto (Manual)</label>
                                        <input
                                            type="text"
                                            placeholder="Nombre del adulto"
                                            value={details.check_in_adult}
                                            onChange={(e) => setDetails({ ...details, check_in_adult: e.target.value })}
                                            required
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {status === 'retiro_anticipado' && (
                            <div className="special-fields">
                                <div className="form-group">
                                    <label>Hora de Retiro</label>
                                    <input
                                        type="time"
                                        value={details.check_out_time}
                                        onChange={(e) => setDetails({ ...details, check_out_time: e.target.value })}
                                        required
                                    />
                                </div>

                                {renderGuardianButtons('check_out_adult')}

                                {(showManualInput || (details.check_out_adult && !guardians.some(g => `${g.first_name} ${g.paternal_surname}` === details.check_out_adult))) && (
                                    <div className="form-group" style={{ marginTop: '10px' }}>
                                        <label>Nombre del adulto (Manual)</label>
                                        <input
                                            type="text"
                                            placeholder="Nombre del adulto"
                                            value={details.check_out_adult}
                                            onChange={(e) => setDetails({ ...details, check_out_adult: e.target.value })}
                                            required
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="form-group">
                            <label>Notas / Observaciones</label>
                            <textarea
                                rows="3"
                                value={details.notes}
                                onChange={(e) => setDetails({ ...details, notes: e.target.value })}
                            />
                        </div>

                        <div className="attendance-modal-actions">
                            <button type="button" onClick={() => setStatus(null)} className="cancel-btn" style={{ marginRight: 'auto' }}>⬅ Volver</button>
                            <button type="button" onClick={onClose} className="cancel-btn">Cancelar</button>
                            <button type="submit" className="save-btn">Guardar</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AttendanceDetailModal;
