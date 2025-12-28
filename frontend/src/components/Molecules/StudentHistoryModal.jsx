import React from 'react';
import './AttendanceDetailModal.css'; // Reusing styles
import Table from '../Atoms/Table';
import TableRow from '../Atoms/TableRow';
import TableCell from '../Atoms/TableCell';
import TableHeader from '../Atoms/TableHeader';
import TableBody from '../Atoms/TableBody';

const StudentHistoryModal = ({
    isOpen,
    onClose,
    student,
    historyType, // 'ausente', 'llegada_tarde', 'retiro_anticipado', 'all'
    records
}) => {
    if (!isOpen || !student) return null;

    const getTitle = () => {
        switch (historyType) {
            case 'ausente': return `Faltas de ${student.first_name} ${student.paternal_surname}`;
            case 'llegada_tarde': return `Llegadas Tarde de ${student.first_name} ${student.paternal_surname}`;
            case 'retiro_anticipado': return `Retiros Anticipados de ${student.first_name} ${student.paternal_surname}`;
            default: return `Historial de ${student.first_name} ${student.paternal_surname}`;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        // Handle both ISO string and 'YYYY-MM-DD'
        const date = new Date(dateString);
        // Adjust for timezone if necessary or just split if strictly YYYY-MM-DD
        // simpler:
        return dateString.split('T')[0];
    };

    return (
        <div className="attendance-modal-overlay">
            <div className="attendance-modal" style={{ maxWidth: '800px', width: '90%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
                <div className="attendance-modal-header">
                    <h3>{getTitle()}</h3>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', marginBottom: '20px' }}>
                    {records.length === 0 ? (
                        <p style={{ textAlign: 'center', padding: '20px' }}>No se encontraron registros.</p>
                    ) : (
                        <Table striped bordered>
                            <TableHeader>
                                <TableRow>
                                    <TableCell as="th">Fecha</TableCell>
                                    <TableCell as="th">Tipo</TableCell>
                                    <TableCell as="th">Hora</TableCell>
                                    <TableCell as="th">Motivo / Notas</TableCell>
                                    <TableCell as="th">Autorizado / Retirado Por</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {records.map((rec, idx) => {
                                    // Determine time and adult based on status
                                    let time = '-';
                                    let adult = '-';

                                    if (rec.status === 'llegada_tarde' || rec.status === 'presente') {
                                        time = rec.check_in_time || '-';
                                        adult = rec.check_in_adult || '-';
                                    } else if (rec.status === 'retiro_anticipado') {
                                        time = rec.check_out_time || '-';
                                        adult = rec.check_out_adult || '-';
                                    }

                                    return (
                                        <TableRow key={idx}>
                                            <TableCell>{formatDate(rec.date)}</TableCell>
                                            <TableCell>
                                                {rec.status === 'presente' ? 'Presente' :
                                                    rec.status === 'ausente' ? 'Ausente' :
                                                        rec.status === 'llegada_tarde' ? 'Llegada Tarde' :
                                                            rec.status === 'retiro_anticipado' ? 'Retiro Antic.' : rec.status}
                                            </TableCell>
                                            <TableCell>{time}</TableCell>
                                            <TableCell>{rec.notes || '-'}</TableCell>
                                            <TableCell>{adult}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    )}
                </div>

                <div className="attendance-modal-actions">
                    <button type="button" className="cancel-btn" onClick={onClose}>Cerrar</button>
                </div>
            </div>
        </div>
    );
};

export default StudentHistoryModal;
