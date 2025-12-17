// backend/routes/permissions.js
const express = require('express')
const router = express.Router()
const { protect, requireRoles, checkPermission } = require('../middleware/auth')
const { AppError } = require('../middleware/errorHandler') // Import AppError
const { sanitizeObject, sanitizeWhitespace } = require('../utils/sanitization') // Import sanitization utilities

// GET /api/permissions - Obtener todos los permisos
router.get(
  '/',
  protect,
  checkPermission('configuracion', 'ver'),
  async (req, res, next) => {
    const pool = req.app.get('pool')

    try {
      const permissions = await pool.query(`
            SELECT * FROM v_role_permissions
            ORDER BY role_id, module_id, action_id
        `)

      res.json(permissions)
    } catch (error) {
      console.error('Error fetching permissions:', error)
      next(new AppError('Error al obtener permisos', 500))
    }
  }
)

// GET /api/permissions/modules - Obtener módulos
router.get(
  '/modules',
  protect,
  checkPermission('configuracion', 'ver'),
  async (req, res, next) => {
    const pool = req.app.get('pool')

    try {
      const modules = await pool.query(`
            SELECT * FROM system_module
            WHERE is_active = TRUE
            ORDER BY display_order
        `)

      res.json(modules)
    } catch (error) {
      console.error('Error fetching modules:', error)
      next(new AppError('Error al obtener módulos', 500))
    }
  }
)

// GET /api/permissions/actions - Obtener acciones
router.get(
  '/actions',
  protect,
  checkPermission('configuracion', 'ver'),
  async (req, res, next) => {
    const pool = req.app.get('pool')

    try {
      const actions = await pool.query(`
            SELECT * FROM permission_action
            ORDER BY id
        `)

      res.json(actions)
    } catch (error) {
      console.error('Error fetching actions:', error)
      next(new AppError('Error al obtener acciones', 500))
    }
  }
)

// POST /api/permissions/toggle - Toggle permiso
router.post(
  '/toggle',
  protect,
  checkPermission('configuracion', 'gestionar'),
  async (req, res, next) => {
    const pool = req.app.get('pool')
    const sanitizedBody = sanitizeObject(req.body, sanitizeWhitespace)
    const { roleId, moduleId, actionId, isGranted } = sanitizedBody
    const userId = req.user.id

    if (!roleId || !moduleId || !actionId || isGranted === undefined) {
      return next(new AppError('Faltan parámetros requeridos', 400))
    }

    try {
      // Verificar si es un permiso protegido
      const permCheck = await pool.query(
        `
            SELECT r.role_name, m.module_key
            FROM role r, system_module m
            WHERE r.id = ? AND m.id = ?
        `,
        [roleId, moduleId]
      )

      if (permCheck.length > 0) {
        const { role_name, module_key } = permCheck[0]

        // Bloquear modificación de permisos críticos para admin/directivo
        if (
          (role_name === 'Administrator' || role_name === 'Directivo') &&
          (module_key === 'personal' ||
            module_key === 'configuracion' ||
            module_key === 'roles')
        ) {
          // Added 'roles' module
          console.warn(
            `Intento de modificar permiso protegido para ${role_name} en ${module_key}.`
          )
          return next(
            new AppError(
              'Los permisos de Personal, Configuración y Roles para Administrador/Directivo están protegidos',
              403
            )
          )
        }
      }

      // Obtener valor anterior para auditoría
      const previous = await pool.query(
        `
            SELECT is_granted FROM role_permission
            WHERE role_id = ? AND module_id = ? AND action_id = ?
        `,
        [roleId, moduleId, actionId]
      )

      const previousValue = previous.length > 0 ? previous[0].is_granted : null

      console.log(
        `[Permissions Toggle] Attempting to set roleId: ${roleId}, moduleId: ${moduleId}, actionId: ${actionId}, isGranted: ${isGranted}, userId: ${userId}`
      )

      // Insertar o actualizar permiso
      const updateResult = await pool.query(
        `
            INSERT INTO role_permission (role_id, module_id, action_id, is_granted, updated_by)
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                is_granted = VALUES(is_granted),
                updated_by = VALUES(updated_by),
                updated_at = CURRENT_TIMESTAMP
        `,
        [roleId, moduleId, actionId, isGranted, userId]
      )

      console.log('[Permissions Toggle] Update/Insert result:', updateResult)

      // Registrar en auditoría
      await pool.query(
        `
            INSERT INTO permission_audit_log 
            (role_id, module_id, action_id, previous_value, new_value, changed_by, ip_address)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [roleId, moduleId, actionId, previousValue, isGranted, userId, req.ip]
      )

      res.json({
        success: true,
        message: 'Permiso actualizado correctamente',
        isGranted,
      })
    } catch (error) {
      console.error('Error toggling permission:', error)
      next(new AppError('Error al actualizar permiso', 500))
    }
  }
)

// GET /api/permissions/audit - Obtener log de auditoría
router.get(
  '/audit',
  protect,
  checkPermission('configuracion', 'ver'),
  async (req, res, next) => {
    const pool = req.app.get('pool')
    const sanitizedQuery = sanitizeObject(req.query, sanitizeWhitespace)
    const { limit } = sanitizedQuery
    const parsedLimit = parseInt(limit) || 100

    try {
      const logs = await pool.query(
        `
            SELECT 
                pal.*,
                r.role_name,
                m.module_name,
                a.action_name,
                s.first_name,
                s.paternal_surname
            FROM permission_audit_log pal
            LEFT JOIN role r ON pal.role_id = r.id
            LEFT JOIN system_module m ON pal.module_id = m.id
            LEFT JOIN permission_action a ON pal.action_id = a.id
            LEFT JOIN staff s ON pal.changed_by = s.id
            ORDER BY pal.changed_at DESC
            LIMIT ?
        `,
        [parsedLimit]
      )

      res.json(logs)
    } catch (error) {
      console.error('Error fetching audit logs:', error)
      next(new AppError('Error al obtener logs de auditoría', 500))
    }
  }
)

// GET /api/permissions/check/:role/:module/:action - Verificar permiso específico
router.get('/check/:role/:module/:action', protect, async (req, res, next) => {
  const pool = req.app.get('pool')
  const sanitizedParams = sanitizeObject(req.params, sanitizeWhitespace)
  const { role, module, action } = sanitizedParams

  try {
    const result = await pool.query(
      `
            SELECT has_permission
            FROM v_role_permissions
            WHERE role_name = ? AND module_key = ? AND action_key = ?
        `,
      [role, module, action]
    )

    res.json({
      hasPermission: result.length > 0 ? result[0].has_permission : false,
    })
  } catch (error) {
    console.error('Error checking permission:', error)
    next(new AppError('Error al verificar permiso', 500))
  }
})

// GET /api/permissions/user-permissions - Obtener todos los permisos del usuario actual
router.get('/user-permissions', protect, async (req, res, next) => {
  const pool = req.app.get('pool');
  const userId = req.user.id;

  console.log(`[user-permissions] Fetching permissions for user: ${userId}`);

  try {
    // Get user's role
    const userResult = await pool.query(
      `SELECT s.role_id, r.role_name
             FROM staff s
             JOIN role r ON s.role_id = r.id
             WHERE s.id = ? AND s.is_active = 1`,
      [userId]
    );

    if (userResult.length === 0) {
      console.log(`[user-permissions] User ${userId} not found or inactive`);
      return res.json({}); // No permissions for inactive/missing user
    }

    const roleId = userResult[0].role_id;
    const roleName = userResult[0].role_name;
    console.log(`[user-permissions] User ${userId} has role: ${roleName} (id: ${roleId})`);

    // Get all permissions for this role as a key:value map
    const permissionsResult = await pool.query(
      `
            SELECT sm.module_key, pa.action_key, rp.is_granted
            FROM role_permission rp
            JOIN system_module sm ON rp.module_id = sm.id
            JOIN permission_action pa ON rp.action_id = pa.id
            WHERE rp.role_id = ?
            ORDER BY sm.module_key, pa.action_key
        `,
      [roleId]
    );

    console.log(`[user-permissions] Found ${permissionsResult.length} permissions for role ${roleName}`);

    // Convert to object format: { "modulo:accion": true/false }
    const permissionsMap = {};
    permissionsResult.forEach((perm) => {
      const key = `${perm.module_key}:${perm.action_key}`;
      permissionsMap[key] = perm.is_granted === 1;
    });

    const activePerms = Object.keys(permissionsMap).filter((k) => permissionsMap[k]);
    console.log(
      `[user-permissions] User ${userId} (${roleName}) has ${activePerms.length} active permissions:`,
      activePerms.slice(0, 10)
    );
    res.json(permissionsMap);
  } catch (error) {
    console.error('[user-permissions] Error fetching user permissions:', error);
    next(new AppError('Error al obtener permisos del usuario', 500));
  }
});

module.exports = router
