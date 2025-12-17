import React from 'react';
import Modal from '../Atoms/Modal';
import Card from '../Atoms/Card';
import Text from '../Atoms/Text';
import Table from '../Atoms/Table';
import TableHeader from '../Atoms/TableHeader';
import TableBody from '../Atoms/TableBody';
import TableRow from '../Atoms/TableRow';
import TableCell from '../Atoms/TableCell';

const FieldRow = ({ label, value }) => (
    <TableRow>
        <TableCell as="th" className="table-cell-left" style={{ width: '35%' }}>{label}</TableCell>
        <TableCell className="table-cell-left">{value ?? '—'}</TableCell>
    </TableRow>
);

const StudentDetailModal = ({ student, isOpen, onClose }) => {
    if (!student) return null;
    const fullName = `${student.first_name || ''} ${student.paternal_surname || ''} ${student.maternal_surname || ''}`.trim();

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Detalle del Alumno`} size="lg">
            <Card>
                <div className="card-content">
                    <Text variant="h2">{fullName}</Text>

                    <Table bordered responsive>
                        <TableHeader>
                            <TableRow>
                                <TableCell as="th">Campo</TableCell>
                                <TableCell as="th">Valor</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* Datos básicos */}
                            <FieldRow label="ID" value={student.id} />
                            <FieldRow label="Nombre" value={fullName} />
                            <FieldRow label="DNI" value={student.dni} />
                            <FieldRow label="Fecha de nacimiento" value={student.birth_date} />
                            <FieldRow label="Estado" value={student.status} />

                            {/* Sala y turno (detallado) */}
                            <FieldRow label="Sala" value={student.classroom_name} />
                            <FieldRow label="Turno" value={student.shift} />

                            {/* Dirección */}
                            <FieldRow label="Calle" value={student.address?.street} />
                            <FieldRow label="Número" value={student.address?.number} />
                            <FieldRow label="Ciudad" value={student.address?.city} />
                            <FieldRow label="Provincia" value={student.address?.provincia} />
                            <FieldRow label="Código Postal" value={student.address?.postal_code_optional} />

                            {/* Salud */}
                            <FieldRow label="Grupo sanguíneo" value={student.blood_type} />
                            <FieldRow label="Obra social" value={student.health_insurance} />
                            <FieldRow label="Alergias" value={student.allergies} />
                            <FieldRow label="Medicaciones" value={student.medications} />
                            <FieldRow label="Necesidades especiales" value={student.special_needs} />
                            <FieldRow label="Observaciones médicas" value={student.medical_observations} />
                            <FieldRow label="Pediatra" value={student.pediatrician_name} />
                            <FieldRow label="Tel. Pediatra" value={student.pediatrician_phone} />

                            {/* Autorizaciones */}
                            <FieldRow label="Autorización fotos" value={student.photo_authorization ? 'Sí' : 'No'} />
                            <FieldRow label="Autorización paseos" value={student.trip_authorization ? 'Sí' : 'No'} />
                            <FieldRow label="Autorización atención médica" value={student.medical_attention_authorization ? 'Sí' : 'No'} />

                            {/* Contacto de emergencia */}
                            <FieldRow label="Emergencia: Nombre" value={student.emergency_contact?.full_name} />
                            <FieldRow label="Emergencia: Relación" value={student.emergency_contact?.relationship} />
                            <FieldRow label="Emergencia: Teléfono" value={student.emergency_contact?.phone} />
                            <FieldRow label="Emergencia: Teléfono alternativo" value={student.emergency_contact?.alternative_phone} />
                            <FieldRow label="Emergencia: Autoriza retiro" value={student.emergency_contact?.is_authorized_pickup ? 'Sí' : 'No'} />

                            {/* Padres/Tutores (si vienen en el objeto) */}
                            <FieldRow label="Tutor principal" value={`${student.guardian_first_name || ''} ${student.guardian_paternal_surname || ''}`.trim() || student.emergency_contact?.full_name} />
                            <FieldRow label="Email Tutor" value={student.guardian_email || student.emergency_contact?.email_optional} />
                            <FieldRow label="Tel. Tutor" value={student.guardian_phone || student.emergency_contact?.phone} />
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </Modal>
    );
};

export default StudentDetailModal;
