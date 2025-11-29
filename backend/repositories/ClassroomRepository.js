// backend/repositories/ClassroomRepository.js
const { getConnection } = require('../db');
const Classroom = require('../models/Classroom');

class ClassroomRepository {
    async create(salaData) {
        let conn;
        try {
            conn = await getConnection();
            const result = await conn.query(
                "INSERT INTO classroom (name, capacity, shift) VALUES (?, ?, ?)",
                [salaData.name, salaData.capacity, salaData.shift]
            );
            salaData.id = result.insertId;
            return Classroom.fromDbRow(salaData);
        } catch (err) {
            console.error("Error creating classroom:", err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }

    async findAll() {
        let conn;
        try {
            conn = await getConnection();
            const rows = await conn.query(`
                SELECT
                    c.id,
                    c.name,
                    c.capacity,
                    c.shift,
                    COUNT(DISTINCT s.id) as assigned_students,
                    GROUP_CONCAT(DISTINCT CONCAT(st.first_name, ' ', st.paternal_surname) SEPARATOR ', ') as teachers,
                    COUNT(DISTINCT st.id) as teachers_count,
                    (SELECT st2.id
                     FROM staff st2
                     WHERE st2.classroom_id = c.id
                     AND st2.role_id IN (SELECT id FROM role WHERE role_name = 'Teacher')
                     LIMIT 1) as teacher_id
                FROM classroom c
                LEFT JOIN student s ON c.id = s.classroom_id
                LEFT JOIN staff st ON c.id = st.classroom_id AND st.role_id IN (SELECT id FROM role WHERE role_name = 'Teacher')
                GROUP BY c.id, c.name, c.capacity, c.shift
                ORDER BY c.shift, c.name
            `);
            return rows.map(row => {
                const classroom = Classroom.fromDbRow(row);
                classroom.assignedStudents = Number(row.assigned_students);
                classroom.teachers = row.teachers || null;
                classroom.teachersCount = Number(row.teachers_count);
                classroom.teacherId = row.teacher_id || null;
                return classroom;
            });
        } catch (err) {
            console.error("Error finding all classrooms:", err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }

    async findById(id) {
        let conn;
        try {
            conn = await getConnection();
            const rows = await conn.query(`
                SELECT
                    c.id,
                    c.name,
                    c.capacity,
                    c.shift,
                    COUNT(DISTINCT s.id) as assigned_students,
                    GROUP_CONCAT(DISTINCT CONCAT(st.first_name, ' ', st.paternal_surname) SEPARATOR ', ') as teachers,
                    COUNT(DISTINCT st.id) as teachers_count,
                    (SELECT GROUP_CONCAT(st2.id)
                     FROM staff st2
                     WHERE st2.classroom_id = c.id
                     AND st2.role_id IN (SELECT id FROM role WHERE role_name = 'Teacher')) as teacher_ids
                FROM classroom c
                LEFT JOIN student s ON c.id = s.classroom_id
                LEFT JOIN staff st ON c.id = st.classroom_id AND st.role_id IN (SELECT id FROM role WHERE role_name = 'Teacher')
                WHERE c.id = ?
                GROUP BY c.id, c.name, c.capacity, c.shift
            `, [id]);
            if (rows.length === 0) return null;
            const classroom = Classroom.fromDbRow(rows[0]);
            classroom.assignedStudents = Number(rows[0].assigned_students);
            classroom.teachers = rows[0].teachers || null;
            classroom.teachersCount = Number(rows[0].teachers_count);
            classroom.teacherIds = rows[0].teacher_ids ? rows[0].teacher_ids.split(',')[0] : null; // Tomar el primero
            return classroom;
        } catch (err) {
            console.error(`Error finding classroom with id ${id}:`, err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }

    async update(id, salaData) {
        let conn;
        try {
            conn = await getConnection();
            await conn.query(
                "UPDATE classroom SET name = ?, capacity = ?, shift = ? WHERE id = ?",
                [salaData.name, salaData.capacity, salaData.shift, id]
            );
            return this.findById(id); // Return the updated classroom
        } catch (err) {
            console.error(`Error updating classroom with id ${id}:`, err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }

    async delete(id) {
        let conn;
        try {
            conn = await getConnection();
            
            // Check if there are students assigned to this classroom
            const studentsCheck = await conn.query(
                "SELECT COUNT(*) as count FROM student WHERE classroom_id = ?", 
                [id]
            );
            
            if (studentsCheck[0].count > 0) {
                throw new Error(`Cannot delete classroom: ${studentsCheck[0].count} student(s) are still assigned to this classroom. Please reassign or remove students first.`);
            }

            // Check if there are staff members assigned to this classroom
            const staffCheck = await conn.query(
                "SELECT COUNT(*) as count FROM staff WHERE classroom_id = ?", 
                [id]
            );

            if (staffCheck[0].count > 0) {
                throw new Error(`Cannot delete classroom: ${staffCheck[0].count} staff member(s) are still assigned to this classroom. Please reassign or remove staff first.`);
            }
            
            const result = await conn.query("DELETE FROM classroom WHERE id = ?", [id]);
            return result.affectedRows > 0;
        } catch (err) {
            console.error(`Error deleting classroom with id ${id}:`, err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }

    async assignTeacher(classroomId, teacherId) {
        let conn;
        try {
            conn = await getConnection();
            
            // Si teacherId es vacío o null, desasignar maestros de esta sala
            if (!teacherId || teacherId === '') {
                await conn.query(
                    "UPDATE staff SET classroom_id = NULL WHERE classroom_id = ? AND role_id IN (SELECT id FROM role WHERE role_name = 'Teacher')",
                    [classroomId]
                );
                return true;
            }

            // Primero desasignar cualquier maestro anterior de esta sala
            await conn.query(
                "UPDATE staff SET classroom_id = NULL WHERE classroom_id = ? AND role_id IN (SELECT id FROM role WHERE role_name = 'Teacher')",
                [classroomId]
            );
            
            // Asignar el nuevo maestro a esta sala
            await conn.query(
                "UPDATE staff SET classroom_id = ? WHERE id = ?",
                [classroomId, teacherId]
            );
            
            return true;
        } catch (err) {
            console.error(`Error assigning teacher ${teacherId} to classroom ${classroomId}:`, err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }
}

module.exports = new ClassroomRepository();
