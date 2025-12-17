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

const ClassDetailModal = ({ classItem, isOpen, onClose }) => {
    if (!classItem) return null

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Detalle de la Clase`} size="lg">
            <Card>
                <div className="card-content">
                    <Text variant="h2">{classItem.name || 'Clase'}</Text>

                    <Table bordered responsive>
                        <TableHeader>
                            <TableRow>
                                <TableCell as="th">Campo</TableCell>
                                <TableCell as="th">Valor</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <FieldRow label="ID" value={classItem.id} />
                            <FieldRow label="Nombre" value={classItem.name} />
                            <FieldRow label="Capacidad" value={classItem.capacity} />
                            <FieldRow label="Turno" value={classItem.shift} />
                            <FieldRow label="Año Académico" value={classItem.academicYear} />
                            <FieldRow label="Grupo de Edad" value={classItem.ageGroup} />
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </Modal>
    )
}

export default ClassDetailModal
