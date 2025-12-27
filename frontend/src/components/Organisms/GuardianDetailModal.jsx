
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
        <TableCell as="th" className="table-cell-left table-cell-width-35">{label}</TableCell>
        <TableCell className="table-cell-left">{value ?? '—'}</TableCell>
    </TableRow>
);

const GuardianDetailModal = ({ guardian, isOpen, onClose }) => {
    if (!guardian) return null;

    const fullName = `${guardian.first_name} ${guardian.paternal_surname} ${guardian.maternal_surname || ''}`.trim();
    const address = [guardian.address_street, guardian.address_number].filter(Boolean).join(' ');
    const location = [guardian.address_city, guardian.address_provincia].filter(Boolean).join(', ');
    const fullAddress = [address, location].filter(Boolean).join(' - ');

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Detalle Responsable" size="md">
            <Card>
                <div className="card-content">
                    <Text variant="h2">{fullName}</Text>

                    <Table bordered responsive>
                        <TableBody>
                            <FieldRow label="Relación" value={guardian.relationship_type} />
                            <FieldRow label="DNI" value={guardian.dni} />
                            <FieldRow label="Teléfono" value={guardian.phone} />
                            <FieldRow label="Email" value={guardian.email_optional} />
                            <FieldRow label="Dirección" value={fullAddress} />
                            <FieldRow label="Código Postal" value={guardian.address_postal_code} />
                        </TableBody>
                    </Table>

                    <Text variant="h3" style={{ marginTop: '20px', marginBottom: '10px' }}>Permisos y Roles</Text>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {!!guardian.is_primary && <span className="badge badge-primary">Tutor Principal</span>}
                        {!!guardian.is_emergency && <span className="badge badge-danger">Emergencia</span>}
                        {!!guardian.can_pickup && <span className="badge badge-success">Retira 🚙</span>}
                        {!!guardian.can_change_diaper && <span className="badge badge-info">Pañales 👶</span>}
                        {!!guardian.has_restraining_order && <span className="badge badge-error">⛔ Restricción</span>}
                    </div>
                </div>
            </Card>
        </Modal>
    );
};

export default GuardianDetailModal;
