// backend/repositories/ClassroomRepository.js
const { getConnection } = require('../db');
const Classroom = require('../models/Classroom');

class ClassroomRepository {
    async create(salaData) {
        let conn;
        try {
            conn = await getConnection();
            const result = await conn.query(
                "INSERT INTO classroom (name, capacity) VALUES (?, ?)",
                [salaData.name, salaData.capacity]
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
            const rows = await conn.query("SELECT id, name, capacity FROM classroom");
            return rows.map(Classroom.fromDbRow);
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
            const rows = await conn.query("SELECT id, name, capacity FROM classroom WHERE id = ?", [id]);
            if (rows.length === 0) return null;
            return Classroom.fromDbRow(rows[0]);
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
                "UPDATE classroom SET name = ?, capacity = ? WHERE id = ?",
                [salaData.name, salaData.capacity, id]
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
            const result = await conn.query("DELETE FROM classroom WHERE id = ?", [id]);
            return result.affectedRows > 0;
        } catch (err) {
            console.error(`Error deleting classroom with id ${id}:`, err);
            throw err;
        } finally {
            if (conn) conn.release();
        }
    }
}

module.exports = new ClassroomRepository();
