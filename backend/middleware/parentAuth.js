const { pool } = require('../db');
const { AppError } = require('./errorHandler');

const authorizeParent = (module, action) => {
    return async (req, res, next) => {
        if (!req.isAuthenticated() || !req.user) {
            return next(new AppError('Authentication required.', 401));
        }

        const parentPortalUserId = req.user.id;
        let conn;
        let roleId;

        try {
            conn = await pool.getConnection();

            // Find the guardian associated with the parent portal user
            const guardians = await conn.query(
                'SELECT role_id FROM guardian WHERE parent_portal_user_id = ?',
                [parentPortalUserId]
            );

            if (guardians.length > 0 && guardians[0].role_id) {
                // If a guardian exists and has a role, use that role
                roleId = guardians[0].role_id;
            } else {
                // If no guardian is found, or they have no role,
                // default to the 'Tutor' role for permission checking.
                const tutorRole = await conn.query("SELECT id FROM role WHERE role_name = 'Tutor'");
                if (tutorRole.length === 0) {
                    return next(new AppError('"Tutor" role not found. System configuration error.', 500));
                }
                roleId = tutorRole[0].id;
            }

            // Check for the specific permission in the role_permission table
            const permissions = await conn.query(
                `SELECT rp.is_granted
                 FROM role_permission rp
                 JOIN system_module sm ON rp.module_id = sm.id
                 JOIN permission_action pa ON rp.action_id = pa.id
                 WHERE rp.role_id = ? AND sm.module_key = ? AND pa.action_key = ?`,
                [roleId, module, action]
            );

            if (permissions.length === 0 || !permissions[0].is_granted) {
                return next(new AppError(`Access Denied. You do not have permission to '${action}' in '${module}'.`, 403));
            }

            next();

        } catch (error) {
            console.error('Error in authorizeParent middleware:', error);
            return next(new AppError('Server error during authorization.', 500));
        } finally {
            if (conn) conn.release();
        }
    };
};

module.exports = { authorizeParent };
