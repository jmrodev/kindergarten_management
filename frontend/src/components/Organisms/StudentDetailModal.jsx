import React, { useState } from 'react';
import Modal from '../Atoms/Modal';
import Card from '../Atoms/Card';
import Text from '../Atoms/Text';
import Table from '../Atoms/Table';
import TableHeader from '../Atoms/TableHeader';
import TableBody from '../Atoms/TableBody';
import TableRow from '../Atoms/TableRow';
import TableCell from '../Atoms/TableCell';
import GuardianDetailModal from './GuardianDetailModal';

const FieldRow = ({ label, value }) => (
    <TableRow>
        <TableCell as="th" className="table-cell-left table-cell-width-35">{label}</TableCell>
        <TableCell className="table-cell-left">{value ?? '—'}</TableCell>
    </TableRow>
);

const StudentDetailModal = ({ student, isOpen, onClose }) => {
    const [selectedGuardian, setSelectedGuardian] = useState(null);

    if (!student) return null;
    const fullName = [
        student.first_name,
        student.middle_name_optional,
        student.third_name_optional,
        student.paternal_surname,
        student.maternal_surname
    ].filter(Boolean).join(' ');

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Detalle del Alumno`} size="lg">
            <Card>
                <div className="card-content">
                    <Text variant="h2">{fullName}</Text>
                    {student.nickname_optional && <Text variant="h4" style={{ color: '#666', marginTop: '-10px', marginBottom: '15px' }}>"{student.nickname_optional}"</Text>}

                    <Table bordered responsive>
                        <TableHeader>
                            <TableRow>
                                <TableCell as="th">Campo</TableCell>
                                <TableCell as="th">Valor</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* Datos básicos */}
                            <FieldRow label="Nombre Completo" value={fullName} />
                            <FieldRow label="Apodo" value={student.nickname_optional} />
                            <FieldRow label="DNI" value={student.dni} />
                            <FieldRow label="Fecha de nacimiento" value={student.birth_date} />
                            <FieldRow label="Estado" value={student.status} />

                            {/* Sala y turno */}
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
                        </TableBody>
                    </Table>

                    {/* Show all guardians if there are any */}
                    {student.guardians && student.guardians.length > 0 && (
                        <>
                            <Text variant="h3" style={{ marginTop: '20px', marginBottom: '10px' }}>Responsables y Contactos</Text>
                            <Table bordered responsive hover>
                                <TableHeader>
                                    <TableRow>
                                        <TableCell as="th">Nombre</TableCell>
                                        <TableCell as="th">Roles & Permisos</TableCell>
                                        <TableCell as="th" style={{ width: '50px' }}></TableCell>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {student.guardians.map((guardian, index) => (
                                        <TableRow
                                            key={index}
                                            onClick={() => setSelectedGuardian(guardian)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <TableCell>
                                                <strong>{`${guardian.first_name} ${guardian.paternal_surname}`}</strong>
                                            </TableCell>
                                            <TableCell>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                                                    {!!guardian.is_primary && <span style={{ padding: '2px 6px', background: '#007bff', color: 'white', borderRadius: '4px', fontSize: '0.75em' }}>Tutor Principal</span>}
                                                    {!!guardian.is_emergency && <span style={{ padding: '2px 6px', background: '#dc3545', color: 'white', borderRadius: '4px', fontSize: '0.75em' }}>Emergencia</span>}
                                                    {!!guardian.can_pickup && <span style={{ padding: '2px 6px', background: '#28a745', color: 'white', borderRadius: '4px', fontSize: '0.75em' }}>Retira 🚙</span>}
                                                    {!!guardian.can_change_diaper && <span style={{ padding: '2px 6px', background: '#17a2b8', color: 'white', borderRadius: '4px', fontSize: '0.75em' }}>Pañales 👶</span>}
                                                    {!!guardian.has_restraining_order && <span style={{ padding: '2px 6px', background: '#343a40', color: 'white', borderRadius: '4px', fontSize: '0.75em' }}>⛔ Restricción</span>}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span title="Ver detalle">👁️</span>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <p style={{ fontSize: '0.8em', color: '#666', marginTop: '5px' }}>
                                * Haga clic en una persona para ver todos los detalles de contacto y dirección.
                            </p>
                        </>
                    )}
                </div>
            </Card>

            <GuardianDetailModal
                guardian={selectedGuardian}
                isOpen={!!selectedGuardian}
                onClose={() => setSelectedGuardian(null)}
            />
        </Modal>
    );
};

export default StudentDetailModal;
