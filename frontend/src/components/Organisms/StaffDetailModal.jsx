import React from 'react'
import Modal from '../Atoms/Modal'
import Card from '../Atoms/Card'
import Text from '../Atoms/Text'
import Table from '../Atoms/Table'
import TableHeader from '../Atoms/TableHeader'
import TableBody from '../Atoms/TableBody'
import TableRow from '../Atoms/TableRow'
import TableCell from '../Atoms/TableCell'

const FieldRow = ({ label, value }) => (
    <TableRow>
        <TableCell as="th" className="table-cell-left" style={{ width: '35%' }}>{label}</TableCell>
        <TableCell className="table-cell-left">{value ?? '—'}</TableCell>
    </TableRow>
)

const StaffDetailModal = ({ staff, isOpen, onClose }) => {
    if (!staff) return null

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Detalle del Personal`} size="lg">
            <Card>
                <div className="card-content">
                    <Text variant="h2">{staff.name || staff.full_name || 'Personal'}</Text>

                    <Table bordered responsive>
                        <TableHeader>
                            <TableRow>
                                <TableCell as="th">Campo</TableCell>
                                <TableCell as="th">Valor</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <FieldRow label="ID" value={staff.id} />
                            <FieldRow label="Nombre" value={staff.name || staff.full_name} />
                            <FieldRow label="Rol" value={staff.role_name} />
                            <FieldRow label="DNI" value={staff.dni} />
                            <FieldRow label="Email" value={staff.email} />
                            <FieldRow label="Salón asignado" value={staff.classroom} />
                            <FieldRow label="Teléfono" value={staff.phone} />
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </Modal>
    )
}

export default StaffDetailModal
