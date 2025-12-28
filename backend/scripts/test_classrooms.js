const ClassroomRepository = require('../repositories/ClassroomRepository');
const { pool } = require('../db');

async function test() {
    try {
        console.log('Fetching classrooms...');
        const classrooms = await ClassroomRepository.getAll();
        console.log('Classrooms fetched:', classrooms.length);
        if (classrooms.length > 0) {
            console.log('Sample classroom:', classrooms[0]);
        } else {
            console.log('No classrooms found.');
        }
    } catch (error) {
        console.error('Error fetching classrooms:', error);
    } finally {
        await pool.end();
    }
}

test();
