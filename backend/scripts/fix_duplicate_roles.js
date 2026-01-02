const { getConnection } = require('../db');

async function fixDuplicateRoles() {
    let conn;
    try {
        conn = await getConnection();
        console.log('Connected to database.');

        // 1. Find all 'Administrator' roles
        const roles = await conn.query("SELECT * FROM role WHERE role_name = 'Administrator' ORDER BY id");
        console.log('Found Administrator roles:', roles);

        if (roles.length <= 1) {
            console.log('No duplicate Administrator roles found. Exiting.');
            return;
        }

        const primaryRole = roles[0]; // Assuming the first one (ID 1) is the correct one
        const duplicates = roles.slice(1);
        const duplicateIds = duplicates.map(r => r.id);

        console.log(`Keeping primary role ID: ${primaryRole.id}`);
        console.log(`Duplicate IDs to remove: ${duplicateIds.join(', ')}`);

        // 2. Reassign users (Staff)
        const staffUpdate = await conn.query(
            `UPDATE staff SET role_id = ? WHERE role_id IN (?)`,
            [primaryRole.id, duplicateIds]
        );
        console.log(`Updated ${staffUpdate.affectedRows} staff members.`);

        // 3. Reassign users (Parent Portal)
        const parentUpdate = await conn.query(
            `UPDATE parent_portal_users SET role_id = ? WHERE role_id IN (?)`,
            [primaryRole.id, duplicateIds]
        );
        console.log(`Updated ${parentUpdate.affectedRows} parent portal users.`);

        // 4. Delete Role Permissions for duplicates (cascade might not be set, so safe to delete)
        const permDelete = await conn.query(
            `DELETE FROM role_permission WHERE role_id IN (?)`,
            [duplicateIds]
        );
        console.log(`Deleted ${permDelete.affectedRows} role permissions.`);


        // 5. Delete duplicates
        const deleteResult = await conn.query(
            `DELETE FROM role WHERE id IN (?)`,
            [duplicateIds]
        );
        console.log(`Deleted ${deleteResult.affectedRows} duplicate roles.`);

        console.log('Cleanup completed successfully.');

    } catch (error) {
        console.error('Error fixing duplicate roles:', error);
    } finally {
        if (conn) conn.release();
        process.exit();
    }
}

fixDuplicateRoles();
