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

const TeacherDetailModal = ({ teacher, isOpen, onClose }) => {
    if (!teacher) return null

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Detalle del Maestro`} size="lg">
            <Card>
                <div className="card-content">
                    <Text variant="h2">{teacher.name || teacher.full_name || 'Maestro'}</Text>

                    <Table bordered responsive>
                        <TableHeader>
                            <TableRow>
                                <TableCell as="th">Campo</TableCell>
                                <TableCell as="th">Valor</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <FieldRow label="ID" value={teacher.id} />
                            <FieldRow label="Nombre" value={teacher.name || teacher.full_name} />
                            <FieldRow label="DNI" value={teacher.dni} />
                            <FieldRow label="Email" value={teacher.email} />
                            <FieldRow label="Salón asignado" value={teacher.classroom} />
                            <FieldRow label="Especialidad" value={teacher.specialty} />
                            <FieldRow label="Teléfono" value={teacher.phone} />
                            <FieldRow label="Turno" value={teacher.shift} />
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </Modal>
    )
}

export default TeacherDetailModal
