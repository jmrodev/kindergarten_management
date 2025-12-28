import React, { useState, useEffect } from 'react';
import FormGroup from '../Molecules/FormGroup';
import Input from '../Atoms/Input';
import Button from '../Atoms/Button';

// Step 1: Child Basic Info
export const StepChildInfo = ({ data, onChange, onVerifyStudent, classrooms }) => {
    // Inject classrooms into data for select mapping if not present directly (passed as prop to component, need to ensure access)
    // Actually, Wizard passes `classrooms` as a prop to StepChildInfo separately, but here we can just attach it to data context 
    // OR use the prop directly. Let's merge standard props.
    // NOTE: In StudentWizard.jsx we passed `classrooms={classrooms}`.
    // So `classrooms` is available here as prop.
    // However, my previous edit used `data.classrooms`. Let's fix that.

    // We can just use the prop.

    const derivedClassrooms = classrooms || data.classrooms || [];

    // Determine if we are in "Create Mode" (no ID) or "Edit Mode".
    // Determine if we are in "Create Mode" (no ID) or "Edit Mode".
    // If Edit Mode, verification is already done (or not needed in this strict sense), so fields enabled.
    // If Create Mode, fields disabled until DNI verified.
    const isEditMode = !!data.id;
    const [dniVerified, setDniVerified] = useState(isEditMode);
    const [searching, setSearching] = useState(false);
    const [feedback, setFeedback] = useState({ message: '', type: '' }); // type: 'success', 'error', 'info'

    const handleDniSearch = async () => {
        setFeedback({ message: '', type: '' });
        if (!data.dni) {
            setFeedback({ message: 'Por favor ingrese el DNI para verificar.', type: 'error' });
            return;
        }

        if (!onVerifyStudent) {
            setDniVerified(true);
            return;
        }

        setSearching(true);
        try {
            const existingStudent = await onVerifyStudent(data.dni);
            if (existingStudent) {
                setFeedback({
                    message: `El alumno con DNI ${data.dni} ya está registrado (${existingStudent.first_name} ${existingStudent.paternal_surname}).`,
                    type: 'error'
                });
                setDniVerified(false);
            } else {
                setFeedback({ message: '✓ DNI disponible. Puede continuar.', type: 'success' });
                setDniVerified(true);
            }
        } catch (error) {
            console.error(error);
            setFeedback({ message: 'Error al verificar DNI. Intente nuevamente.', type: 'error' });
        } finally {
            setSearching(false);
        }
    };

    const isFieldDisabled = !isEditMode && !dniVerified;

    return (
        <div className="wizard-step fade-in">
            <h3 className="form-section-title">Datos del Alumno</h3>

            {/* DNI First - Verification Row */}
            <div className="form-row" style={{ alignItems: 'flex-end', backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #eee' }}>
                <FormGroup style={{ flexGrow: 1 }}>
                    <Input
                        label="DNI *"
                        name="dni"
                        value={data.dni || ''}
                        onChange={(e) => {
                            onChange(e);
                            setFeedback({ message: '', type: '' }); // Clear feedback on type
                            setDniVerified(false); // Invalidate on change
                        }}
                        required
                        placeholder="Ingrese DNI y Click en Verificar"
                        disabled={isEditMode}
                    />
                    {feedback.message && (
                        <div style={{ marginTop: '5px', fontSize: '0.85rem', color: feedback.type === 'error' ? 'var(--danger-color, red)' : feedback.type === 'success' ? 'var(--success-color, green)' : 'inherit', fontWeight: '500' }}>
                            {feedback.message}
                        </div>
                    )}
                </FormGroup>
                <div style={{ marginBottom: '15px', marginLeft: '10px' }}>
                    {!isEditMode && (
                        <Button
                            variant="info"
                            onClick={handleDniSearch}
                            disabled={searching || !data.dni}
                            type="button"
                        >
                            {searching ? 'Verificando...' : '🔍 Verificar'}
                        </Button>
                    )}
                </div>
            </div>

            <FormGroup>
                <Input label="Nombre *" name="first_name" value={data.first_name || ''} onChange={onChange} required placeholder="Nombre del niño/a" disabled={isFieldDisabled} />
            </FormGroup>
            <div className="form-row">
                <FormGroup>
                    <Input label="Segundo Nombre" name="middle_name_optional" value={data.middle_name_optional || ''} onChange={onChange} disabled={isFieldDisabled} />
                </FormGroup>
                <FormGroup>
                    <Input label="Tercer Nombre" name="third_name_optional" value={data.third_name_optional || ''} onChange={onChange} disabled={isFieldDisabled} />
                </FormGroup>
                <FormGroup>
                    <Input label="Apodo (Cómo lo llaman)" name="nickname_optional" value={data.nickname_optional || ''} onChange={onChange} disabled={isFieldDisabled} placeholder="Ej. Vico" />
                </FormGroup>
            </div>
            <div className="form-row">
                <FormGroup>
                    <Input label="Apellido Paterno *" name="paternal_surname" value={data.paternal_surname || ''} onChange={onChange} required disabled={isFieldDisabled} />
                </FormGroup>
                <FormGroup>
                    <Input label="Apellido Materno" name="maternal_surname" value={data.maternal_surname || ''} onChange={onChange} disabled={isFieldDisabled} />
                </FormGroup>
            </div>
            <div className="form-row">
                <FormGroup>
                    <Input label="Fecha de Nacimiento *" name="birth_date" type="date" value={data.birth_date || ''} onChange={onChange} required disabled={isFieldDisabled} />
                </FormGroup>
                <FormGroup>
                    <label className="input-label">Género *</label>
                    <select className="select-field" name="gender" value={data.gender || ''} onChange={onChange} required disabled={isFieldDisabled}>
                        <option value="">Seleccionar...</option>
                        <option value="M">Masculino</option>
                        <option value="F">Femenino</option>
                    </select>
                </FormGroup>
            </div>

            <h4 className="form-section-subtitle" style={{ marginTop: '20px' }}>Datos Académicos y Otros</h4>
            <div className="form-row">
                <FormGroup>
                    <label className="input-label">Sala</label>
                    <select className="select-field" name="classroom_id" value={data.classroom_id || ''} onChange={onChange} disabled={isFieldDisabled}>
                        <option value="">Seleccionar Sala...</option>
                        {derivedClassrooms.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </FormGroup>
                <FormGroup>
                    <label className="input-label">Turno</label>
                    <select className="select-field" name="shift" value={data.shift || ''} onChange={onChange} disabled={isFieldDisabled}>
                        <option value="">Seleccionar...</option>
                        <option value="Mañana">Mañana</option>
                        <option value="Tarde">Tarde</option>
                    </select>
                </FormGroup>
            </div>

            <div className="form-row">
                <FormGroup>
                    <label className="input-label">Estado de Inscripción</label>
                    <select className="select-field" name="status" value={data.status || 'preinscripto'} onChange={onChange} disabled={isFieldDisabled}>
                        <option value="preinscripto">Preinscripto</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="approved">Aprobado</option>
                        <option value="sorteo">En Sorteo</option>
                        <option value="inscripto">Inscripto</option>
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                        <option value="egresado">Egresado</option>
                        <option value="rechazado">Rechazado</option>
                    </select>
                </FormGroup>
                <FormGroup>
                    <label className="checkbox-label checkbox-card" style={{ marginTop: '28px' }}>
                        <input type="checkbox" name="has_siblings_in_school" checked={!!data.has_siblings_in_school} onChange={onChange} disabled={isFieldDisabled} />
                        <span>Tiene hermanos en la escuela</span>
                    </label>
                </FormGroup>
            </div>

            <FormGroup>
                <label className="input-label">Observaciones Generales</label>
                <textarea className="input-field" name="observations" value={data.observations || ''} onChange={onChange} rows="2" placeholder="Observaciones administrativas o generales..." disabled={isFieldDisabled} />
            </FormGroup>
        </div>
    );
};

// Step 2: Address & Contact
export const StepAddress = ({ data, onChange }) => (
    <div className="wizard-step fade-in">
        <h3 className="form-section-title">Domicilio y Contacto</h3>
        <div className="form-row">
            <FormGroup>
                <Input label="Calle *" name="street" value={data.street || ''} onChange={onChange} required />
            </FormGroup>
            <FormGroup>
                <Input label="Número *" name="number" value={data.number || ''} onChange={onChange} required />
            </FormGroup>
        </div>
        <div className="form-row">
            <FormGroup>
                <Input label="Ciudad" name="city" value={data.city || ''} onChange={onChange} />
            </FormGroup>
            <FormGroup>
                <Input label="Provincia" name="provincia" value={data.provincia || ''} onChange={onChange} />
            </FormGroup>
            <FormGroup>
                <Input label="CP" name="postal_code_optional" value={data.postal_code_optional || ''} onChange={onChange} placeholder="C.P." />
            </FormGroup>
        </div>
    </div>
);

// Step 3: Medical Info
export const StepMedical = ({ data, onChange, healthInsurances = [], pediatricians = [] }) => {
    const [showNewInsuranceInput, setShowNewInsuranceInput] = useState(false);
    const [showNewPediatricianInput, setShowNewPediatricianInput] = useState(false);

    const handleInsuranceChange = (e) => {
        const value = e.target.value;
        if (value === '___NEW___') {
            setShowNewInsuranceInput(true);
            onChange({ target: { name: 'health_insurance', value: '' } });
        } else {
            setShowNewInsuranceInput(false);
            onChange(e);
        }
    };

    const handlePediatricianChange = (e) => {
        const value = e.target.value;
        if (value === '___NEW___') {
            setShowNewPediatricianInput(true);
            onChange({ target: { name: 'pediatrician_name', value: '' } });
            onChange({ target: { name: 'pediatrician_phone', value: '' } });
        } else {
            setShowNewPediatricianInput(false);
            const ped = pediatricians.find(p => p.full_name === value);
            onChange({ target: { name: 'pediatrician_name', value: value } });
            if (ped) {
                onChange({ target: { name: 'pediatrician_phone', value: ped.phone || '' } });
            }
        }
    };

    return (
        <div className="wizard-step fade-in">
            <h3 className="form-section-title">Información de Salud</h3>
            <div className="form-row">
                <FormGroup>
                    <label className="input-label">Grupo Sanguíneo</label>
                    <select className="select-field" name="blood_type" value={data.blood_type || ''} onChange={onChange}>
                        <option value="">Seleccionar...</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="No informado">No informado</option>
                    </select>
                </FormGroup>
                <FormGroup>
                    <label className="input-label">Obra Social</label>
                    {!showNewInsuranceInput ? (
                        <select
                            className="select-field"
                            name="health_insurance"
                            value={data.health_insurance || ''}
                            onChange={handleInsuranceChange}
                        >
                            <option value="">Seleccionar...</option>
                            {healthInsurances.map(hi => (
                                <option key={hi.id} value={hi.name}>{hi.name}</option>
                            ))}
                            <option value="___NEW___">+ Agregar Nueva...</option>
                        </select>
                    ) : (
                        <div style={{ display: 'flex', gap: '5px' }}>
                            <Input
                                name="health_insurance"
                                value={data.health_insurance || ''}
                                onChange={onChange}
                                placeholder="Escriba el nombre..."
                                autoFocus
                            />
                            <Button
                                variant="secondary"
                                size="small"
                                onClick={() => {
                                    setShowNewInsuranceInput(false);
                                    onChange({ target: { name: 'health_insurance', value: '' } });
                                }}
                                type="button"
                            >
                                Ver Lista
                            </Button>
                        </div>
                    )}
                </FormGroup>
            </div>
            <FormGroup>
                <label className="input-label">Alergias</label>
                <textarea className="input-field" name="allergies" value={data.allergies || ''} onChange={onChange} rows="2" placeholder="Describa alergias..." />
            </FormGroup>

            <FormGroup>
                <label className="input-label">Medicaciones</label>
                <textarea className="input-field" name="medications" value={data.medications || ''} onChange={onChange} rows="2" placeholder="Medicamentos que toma regularmente..." />
            </FormGroup>

            <FormGroup>
                <label className="input-label">Necesidades Especiales</label>
                <textarea className="input-field" name="special_needs" value={data.special_needs || ''} onChange={onChange} rows="2" placeholder="Requerimientos especiales, dietas, etc..." />
            </FormGroup>

            <div className="form-row">
                <FormGroup>
                    <label className="input-label">Estado de Vacunación</label>
                    <select className="select-field" name="vaccination_status" value={data.vaccination_status || 'no_informado'} onChange={onChange}>
                        <option value="no_informado">No informado</option>
                        <option value="completo">Completo</option>
                        <option value="incompleto">Incompleto</option>
                        <option value="pendiente">Pendiente</option>
                    </select>
                </FormGroup>
                <FormGroup>
                    <Input label="Observaciones Médicas" name="medical_observations" value={data.medical_observations || ''} onChange={onChange} />
                </FormGroup>
            </div>

            <FormGroup>
                <label className="input-label">Pediatra</label>
                {!showNewPediatricianInput ? (
                    <select
                        className="select-field"
                        name="pediatrician_name"
                        value={data.pediatrician_name || ''}
                        onChange={handlePediatricianChange}
                    >
                        <option value="">Seleccionar...</option>
                        {pediatricians.map(p => (
                            <option key={p.id} value={p.full_name}>{p.full_name}</option>
                        ))}
                        <option value="___NEW___">+ Agregar Nuevo...</option>
                    </select>
                ) : (
                    <div style={{ display: 'flex', gap: '5px' }}>
                        <Input
                            name="pediatrician_name"
                            value={data.pediatrician_name || ''}
                            onChange={onChange}
                            placeholder="Nombre del pediatra..."
                            autoFocus
                        />
                        <Button
                            variant="secondary"
                            size="small"
                            onClick={() => {
                                setShowNewPediatricianInput(false);
                                onChange({ target: { name: 'pediatrician_name', value: '' } });
                            }}
                            type="button"
                        >
                            Ver Lista
                        </Button>
                    </div>
                )}
            </FormGroup>
            <FormGroup>
                <Input
                    label="Tel. Pediatra"
                    name="pediatrician_phone"
                    value={data.pediatrician_phone || ''}
                    onChange={onChange}
                    disabled={!showNewPediatricianInput && !!data.pediatrician_name} // Locked if selected from list unless we want to allow editing phone here too
                />
                {/* TIP: If we allow editing phone here, the backend update logic will handle it */}
            </FormGroup>
        </div>
    );
};

// Step 4: Authorizations
export const StepAuth = ({ data, onChange }) => (
    <div className="wizard-step fade-in">
        <h3 className="form-section-title">Autorizaciones</h3>
        <p className="wizard-section-intro">Por favor marque las casillas para autorizar:</p>
        <FormGroup>
            <label className="checkbox-label checkbox-card">
                <input type="checkbox" name="photo_authorization" checked={!!data.photo_authorization} onChange={onChange} />
                <span><strong>Uso de Imagen:</strong> Autorizo a la institución a tomar y utilizar fotografías de mi hijo/a para fines institucionales y educativos.</span>
            </label>
        </FormGroup>
        <FormGroup>
            <label className="checkbox-label checkbox-card">
                <input type="checkbox" name="trip_authorization" checked={!!data.trip_authorization} onChange={onChange} />
                <span><strong>Paseos:</strong> Autorizo a mi hijo/a a participar en paseos y excursiones organizadas por la institución.</span>
            </label>
        </FormGroup>
        <FormGroup>
            <label className="checkbox-label checkbox-card">
                <input type="checkbox" name="medical_attention_authorization" checked={!!data.medical_attention_authorization} onChange={onChange} />
                <span><strong>Atención Médica:</strong> Autorizo a la institución a solicitar atención médica de urgencia en caso de ser necesario.</span>
            </label>
        </FormGroup>
    </div>
);

// Step 5: Responsables (Family)
export const StepFamily = ({ data, onChange, onAddGuardian, onRemoveGuardian, onVerifyGuardian }) => {
    const [newGuardian, setNewGuardian] = useState({
        first_name: '', paternal_surname: '', dni: '', relationship: '',
        phone: '', email: '', is_primary: false, is_emergency: false,
        can_pickup: false, has_restraining_order: false, can_change_diaper: false
    });

    // Guardian DNI First Logic
    const [dniVerified, setDniVerified] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [feedback, setFeedback] = useState({ message: '', type: '' });

    // Listen for auto-save event from wizard
    useEffect(() => {
        const handleAutoSave = () => {
            console.log('[STEP_FAMILY] Auto-save triggered');
            // Check if there's data to save
            if (newGuardian.first_name && newGuardian.paternal_surname && newGuardian.dni &&
                newGuardian.relationship && newGuardian.phone) {
                console.log('[STEP_FAMILY] Auto-saving guardian:', newGuardian);

                // Directly add to data.guardians instead of using handleAdd
                // This ensures synchronous update
                const updatedGuardians = [...(data.guardians || []), newGuardian];
                console.log('[STEP_FAMILY] Updated guardians list:', updatedGuardians);

                // Call onAddGuardian which updates parent state
                onAddGuardian(newGuardian);

                // Clear form
                setNewGuardian({
                    first_name: '', paternal_surname: '', dni: '', relationship: '',
                    phone: '', email: '', is_primary: false, is_emergency: false,
                    can_pickup: false, has_restraining_order: false, can_change_diaper: false
                });
                setDniVerified(false);

                // Show brief notification
                setFeedback({ message: '✓ Responsable guardado automáticamente', type: 'success' });
                setTimeout(() => setFeedback({ message: '', type: '' }), 2000);
            }
        };

        window.addEventListener('autoSaveGuardian', handleAutoSave);
        return () => window.removeEventListener('autoSaveGuardian', handleAutoSave);
    }, [newGuardian, data.guardians, onAddGuardian]);

    const handleAdd = () => {
        console.log('[STEP_FAMILY] handleAdd called', {
            first_name: newGuardian.first_name,
            paternal_surname: newGuardian.paternal_surname,
            dni: newGuardian.dni,
            relationship: newGuardian.relationship,
            phone: newGuardian.phone
        });

        if (!newGuardian.first_name || !newGuardian.paternal_surname || !newGuardian.dni || !newGuardian.relationship || !newGuardian.phone) {
            console.log('[STEP_FAMILY] Validation failed - missing required fields');
            alert('Por favor complete los campos obligatorios (*)');
            return;
        }
        console.log('[STEP_FAMILY] Calling onAddGuardian with:', newGuardian);
        onAddGuardian(newGuardian);
        setNewGuardian({
            first_name: '', paternal_surname: '', dni: '', relationship: '',
            phone: '', email: '', is_primary: false, is_emergency: false,
            can_pickup: false, has_restraining_order: false, can_change_diaper: false
        });
        setDniVerified(false);
        setFeedback({ message: '', type: '' });
    };

    const handleLocalChange = (e) => {
        const { name, value, type, checked } = e.target;

        // If DNI changes, invalidate verification to force re-check
        if (name === 'dni') {
            setDniVerified(false);
            setFeedback({ message: '', type: '' });
        }

        setNewGuardian(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleDniSearch = async () => {
        setFeedback({ message: '', type: '' });
        if (!newGuardian.dni) {
            setFeedback({ message: 'Por favor ingrese un DNI.', type: 'error' });
            return;
        }

        if (!onVerifyGuardian) {
            setDniVerified(true);
            return;
        }

        setIsVerifying(true);
        try {
            const found = await onVerifyGuardian(newGuardian.dni);
            if (found) {
                setNewGuardian(prev => ({
                    ...prev,
                    first_name: found.first_name || '',
                    paternal_surname: found.paternal_surname || '',
                    phone: found.phone || '',
                    email: found.email_optional || '',
                    // Keep defaults for specific fields
                    relationship: '',
                    is_primary: false,
                    is_emergency: false,
                    can_pickup: false,
                    has_restraining_order: false,
                    can_change_diaper: false
                }));
                // Success message
                setFeedback({ message: `✓ Responsable encontrado: ${found.first_name} ${found.paternal_surname}.`, type: 'success' });
            } else {
                setFeedback({ message: 'ℹ No encontrado. Puede registrar los datos.', type: 'info' });
            }
            setDniVerified(true);
        } catch (error) {
            console.error(error);
            setFeedback({ message: 'Error en búsqueda. Intente nuevamente.', type: 'error' });
        } finally {
            setIsVerifying(false);
        }
    };

    // Disable fields other than DNI if not verified
    const isFieldDisabled = !dniVerified;

    return (
        <div className="wizard-step fade-in">
            <h3 className="form-section-title">Responsables y Contactos</h3>
            <p className="wizard-section-intro">
                Agregue a los padres, tutores y personas autorizadas.
            </p>

            {/* List of added guardians moved to bottom */}

            <hr className="divider" />

            <h4 className="form-section-subtitle">Agregar Nueva Persona</h4>

            {/* DNI Search Row - Primary Action */}
            <div className="form-row" style={{ alignItems: 'flex-end', backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #eee' }}>
                <FormGroup style={{ flexGrow: 1 }}>
                    <Input label="Buscar por DNI *" name="dni" value={newGuardian.dni} onChange={handleLocalChange} placeholder="Ingrese DNI y presione Buscar" />
                    {feedback.message && (
                        <div style={{ marginTop: '5px', fontSize: '0.85rem', color: feedback.type === 'error' ? 'var(--danger-color, red)' : feedback.type === 'success' ? 'var(--success-color, green)' : 'var(--info-color, blue)', fontWeight: '500' }}>
                            {feedback.message}
                        </div>
                    )}
                </FormGroup>
                <div style={{ marginBottom: '15px', marginLeft: '10px' }}>
                    <Button variant="info" onClick={handleDniSearch} type="button">🔍 Buscar</Button>
                </div>
            </div>

            <div className="form-row">
                <FormGroup>
                    <Input label="Nombre *" name="first_name" value={newGuardian.first_name} onChange={handleLocalChange} disabled={isFieldDisabled} />
                </FormGroup>
                <FormGroup>
                    <Input label="Apellido *" name="paternal_surname" value={newGuardian.paternal_surname} onChange={handleLocalChange} disabled={isFieldDisabled} />
                </FormGroup>
            </div>
            <div className="form-row">
                <FormGroup>
                    <label className="input-label">Relación *</label>
                    <select className="select-field" name="relationship" value={newGuardian.relationship} onChange={handleLocalChange} disabled={isFieldDisabled}>
                        <option value="">Seleccionar...</option>
                        <option value="Madre">Madre</option>
                        <option value="Padre">Padre</option>
                        <option value="Tutor">Tutor</option>
                        <option value="Abuelo/a">Abuelo/a</option>
                        <option value="Tio/a">Tío/a</option>
                        <option value="Vecino">Vecino</option>
                        <option value="Otro">Otro</option>
                    </select>
                </FormGroup>
                <FormGroup>
                    <Input label="Teléfono *" name="phone" value={newGuardian.phone} onChange={handleLocalChange} disabled={isFieldDisabled} />
                </FormGroup>
            </div>
            <div className="form-row">
                <FormGroup>
                    <Input label="Email" name="email" value={newGuardian.email} onChange={handleLocalChange} type="email" disabled={isFieldDisabled} />
                </FormGroup>
            </div>

            <div className="form-row checkbox-group-row">
                <FormGroup className="full-width">
                    <p className="input-label">Roles y Permisos:</p>
                    <div className="permissions-grid">
                        <label className="checkbox-card">
                            <input type="checkbox" name="is_primary" checked={newGuardian.is_primary} onChange={handleLocalChange} />
                            <span>Tutor Principal (Responsable Legal)</span>
                        </label>
                        <label className="checkbox-card">
                            <input type="checkbox" name="is_emergency" checked={newGuardian.is_emergency} onChange={handleLocalChange} />
                            <span>Contacto de Emergencia</span>
                        </label>
                        <label className="checkbox-card">
                            <input type="checkbox" name="can_pickup" checked={newGuardian.can_pickup} onChange={handleLocalChange} />
                            <span>Autorizado a Retirar 🚙</span>
                        </label>
                        <label className="checkbox-card info">
                            <input type="checkbox" name="can_change_diaper" checked={newGuardian.can_change_diaper} onChange={handleLocalChange} />
                            <span>Autorizado a Cambiar Pañales 👶</span>
                        </label>
                        <label className="checkbox-card danger">
                            <input type="checkbox" name="has_restraining_order" checked={newGuardian.has_restraining_order} onChange={handleLocalChange} />
                            <span>⛔ Restricción Judicial (No contactar)</span>
                        </label>
                    </div>
                </FormGroup>
            </div>
            <div style={{ textAlign: 'right', marginTop: '1rem' }}>
                <Button variant="secondary" onClick={handleAdd} disabled={isFieldDisabled}>
                    {(data.guardians && data.guardians.length > 0) ? '+ Agregar Otra Persona' : 'Agregar Responsable'}
                </Button>
            </div>

            {/* List of added guardians */}
            {data.guardians && data.guardians.length > 0 && (
                <div style={{ marginTop: '2rem' }}>
                    <h4>Personas Agregadas ({data.guardians.length})</h4>
                    {data.guardians.map((g, index) => (
                        <div key={index} style={{
                            padding: '1rem',
                            marginBottom: '0.5rem',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                <strong>{g.first_name} {g.paternal_surname}</strong>
                                <div style={{ fontSize: '0.9em', color: '#666' }}>
                                    {g.relationship} | DNI: {g.dni} | Tel: {g.phone}
                                    {g.is_primary && <span style={{ marginLeft: '10px', color: '#007bff' }}>⭐ Principal</span>}
                                    {g.is_emergency && <span style={{ marginLeft: '10px', color: '#dc3545' }}>🚨 Emergencia</span>}
                                </div>
                            </div>
                            <Button variant="danger" onClick={() => onRemoveGuardian(index)}>Eliminar</Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Step 6: Review
export const StepReview = ({ data }) => (
    <div className="wizard-step fade-in">
        <h3 className="form-section-title">Revisión Final</h3>
        <p>Por favor verifique que los datos sean correctos antes de enviar.</p>

        <div className="review-block review-summary-block">
            <p><strong>Alumno:</strong> {data.first_name} {data.paternal_surname}</p>
            <p><strong>DNI:</strong> {data.dni}</p>
            <p><strong>Estado:</strong> {data.status} | <strong>Sala:</strong> {data.classroom_id ? 'Seleccionada' : 'No asignada'} | <strong>Turno:</strong> {data.shift || 'No asignado'}</p>
            <p><strong>Domicilio:</strong> {data.street} {data.number}, {data.city} ({data.postal_code_optional}) - {data.provincia}</p>
            <p><strong>Salud:</strong> {data.health_insurance || 'No informa'} - Vacunación: {data.vaccination_status || 'No informado'}</p>
            {data.medications && <p><strong>Medicaciones:</strong> {data.medications}</p>}
            {data.special_needs && <p><strong>Necesidades Especiales:</strong> {data.special_needs}</p>}

            <hr style={{ margin: '10px 0', borderTop: '1px dashed #ccc' }} />
            <p><strong>Responsables:</strong></p>
            {data.guardians && data.guardians.map((g, i) => (
                <div key={i} style={{ marginBottom: '5px', paddingLeft: '10px', borderLeft: '3px solid #eee' }}>
                    - <strong>{g.first_name} {g.paternal_surname}</strong> ({g.relationship}) <br />
                    <small>Tel: {g.phone}</small>
                    <div className="review-badges" style={{ marginTop: '2px', display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                        {g.is_primary && <span className="badge-primary-xs">Tutor</span>}
                        {g.is_emergency && <span className="badge-warning-xs">Emergencia</span>}
                        {g.can_pickup && <span className="badge-success-xs">Retira 🚙</span>}
                        {g.has_restraining_order && <span className="badge-danger-xs">⛔ Restricción</span>}
                        {g.can_change_diaper && <span className="badge-info-xs">Pañales 👶</span>}
                    </div>
                </div>
            ))}

            <p className="review-auth-section" style={{ marginTop: '10px' }}>
                <strong>Autorizaciones:</strong>
                {data.photo_authorization ? ' Fotos ✅ ' : ''}
                {data.trip_authorization ? ' Paseos ✅ ' : ''}
                {data.medical_attention_authorization ? ' Médico ✅ ' : ''}
            </p>
        </div>
    </div>
);
