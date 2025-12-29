// middleware/auth.js
const jwt = require('jsonwebtoken')
const StaffRepository = require('../repositories/StaffRepository')
const { AppError } = require('./errorHandler')
const { getConnection } = require('../db')

const generateToken = (user) => {
  try {
    // Convertir BigInt a número o string para evitar problemas de serialización
    let payload = {
      id: typeof user.id === 'bigint' ? Number(user.id) : user.id,
      role: user.role,
    }

    // Si es un usuario del portal de padres, incluir información específica
    if (user.parent_portal_user) {
      payload.google_user = !!user.google_id // Mantener flag si existe google_id
      payload.google_id = user.google_id
      payload.email = user.email
      payload.name = user.name
      payload.parent_portal_user = true // Indicar que es un usuario del portal de padres
      payload.role_id = user.role_id // Ensure role_id is present if passed
    } else {
      // Para usuarios normales del sistema (staff), usar la información tradicional
      payload.email = user.email
      // Ensure role_id/role is present for Staff if needed, though 'role' above handles it
    }

    console.log('[generateToken] Payload:', payload);

    return jwt.sign(payload, process.env.JWT_SECRET || 'kindergarten_secret', {
      expiresIn: '24h',
    })
  } catch (error) {
    console.error('[generateToken] Error generating token:', error);
    throw error;
  }
}

const protect = async (req, res, next) => {
  let token

  // Check for token in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1]

      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'kindergarten_secret'
      )

      // Check if it's a parent portal user token (has google_user flag)
      if (decoded.parent_portal_user) {
        // Get parent portal user from database
        const conn = await getConnection()
        try {
          const result = await conn.query(
            'SELECT * FROM parent_portal_users WHERE id = ?',
            [typeof decoded.id === 'number' ? BigInt(decoded.id) : decoded.id]
          )

          if (result.length === 0) {
            return next(
              new AppError('No parent portal user found with this token', 401)
            )
          }

          req.user = {
            id: result[0].id,
            email: result[0].email,
            name: result[0].name,
            google_id: result[0].google_id,
            role_id: result[0].role_id,
            role: 'Parent',
            parent_portal_user: true,
          }
        } finally {
          conn.release()
        }
      } else {
        // Get staff user from database (original behavior)
        const userId =
          typeof decoded.id === 'number' ? BigInt(decoded.id) : decoded.id
        const user = await StaffRepository.getById(userId)

        if (!user || !user.is_active) {
          return next(new AppError('No staff found with this token', 401))
        }

        req.user = user
      }

      next()
    } catch (error) {
      console.error('[Middleware Auth Error]:', error);
      return next(new AppError('Not authorized, token failed: ' + error.message, 401))
    }
  }

  if (!token) {
    return next(new AppError('Not authorized, no token', 401))
  }
}

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Not authorized, no user information', 401))
    }

    // The role field might be called 'role' (from auth query) or 'role_name' (from Staff model)
    let userRoleLower = (
      req.user.role ||
      req.user.role_name ||
      ''
    ).toLowerCase()

    // Map common role aliases to standard role names
    // This handles cases where the role names in code don't exactly match the DB role names
    const roleAliases = {
      admin: 'administrator',
      administrator: 'administrator',
      director: 'director',
      directivo: 'director',
      secretary: 'secretary',
      secretaria: 'secretary',
      teacher: 'teacher',
      docente: 'teacher',
    }

    // Check if user role matches any of the allowed roles
    const allowedRolesLower = roles.map((role) => role.toLowerCase())

    // Check for exact match or alias match
    const hasPermission = allowedRolesLower.some((allowedRole) => {
      // Direct match
      if (userRoleLower === allowedRole) return true

      // Check against role aliases
      const canonicalUserRole = roleAliases[userRoleLower] || userRoleLower
      const canonicalAllowedRole = roleAliases[allowedRole] || allowedRole

      return canonicalUserRole === canonicalAllowedRole
    })

    if (!hasPermission) {
      return next(new AppError('Not authorized to perform this action', 403))
    }

    next()
  }
}

// Function to check if user has any of the specified roles (case-insensitive comparison)
const checkUserRoles = (req, acceptedRoles) => {
  if (!req.user) {
    return false
  }

  // The role field might be called 'role' (from auth query) or 'role_name' (from Staff model)
  let userRoleLower = (req.user.role || req.user.role_name || '').toLowerCase()

  // Map common role aliases to standard role names
  const roleAliases = {
    admin: 'administrator',
    administrator: 'administrator',
    director: 'director',
    directivo: 'director',
    secretary: 'secretary',
    secretaria: 'secretary',
    teacher: 'teacher',
    docente: 'teacher',
  }

  // Check if user role matches any of the accepted roles
  const acceptedRolesLower = acceptedRoles.map((role) => role.toLowerCase())

  // Check for exact match or alias match
  return acceptedRolesLower.some((acceptedRole) => {
    // Direct match
    if (userRoleLower === acceptedRole) return true

    // Check against role aliases
    const canonicalUserRole = roleAliases[userRoleLower] || userRoleLower
    const canonicalAcceptedRole = roleAliases[acceptedRole] || acceptedRole

    return canonicalUserRole === canonicalAcceptedRole
  })
}

// Middleware for specific authorization needs in routes
// NOTE: This middleware only checks role names, not granular permissions
// For granular permission checking, use checkPermission middleware instead
const requireRoles = (acceptedRoles) => {
  return (req, res, next) => {
    if (!checkUserRoles(req, acceptedRoles)) {
      return next(new AppError('Acceso denegado. Permisos insuficientes.', 403))
    }
    next()
  }
}

// Middleware to check specific permissions based on role permissions
// This middleware queries the role_permission table and respects granular permissions
const checkPermission = (moduleKey, actionKey) => {
  return async (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Not authorized, no user information', 401))
    }

    try {
      const hasPermission = await checkUserPermission(
        req.user.id,
        moduleKey,
        actionKey
      )

      if (!hasPermission) {
        console.log(
          `[checkPermission] DENIED: User ${req.user.id} cannot ${actionKey} on ${moduleKey}`
        )
        return next(
          new AppError(
            `No tiene permisos para ${actionKey} en ${moduleKey}`,
            403
          )
        )
      }

      next()
    } catch (error) {
      console.error('[checkPermission] Error checking permissions:', error)
      return next(new AppError('Error verificando permisos', 500))
    }
  }
}

// Alternative middleware that accepts either specific roles OR checks permissions
// Use this for backward compatibility where some roles have blanket access
const requireRolesOrPermission = (acceptedRoles, moduleKey, actionKey) => {
  return async (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Not authorized, no user information', 401))
    }

    // First check if user has one of the accepted roles (legacy behavior)
    if (checkUserRoles(req, acceptedRoles)) {
      return next()
    }

    // If not, check granular permissions from database
    try {
      const hasPermission = await checkUserPermission(
        req.user.id,
        moduleKey,
        actionKey
      )

      if (!hasPermission) {
        return next(
          new AppError('Acceso denegado. Permisos insuficientes.', 403)
        )
      }

      next()
    } catch (error) {
      return next(new AppError('Error verificando permisos', 500))
    }
  }
}

// Helper function to check user permission by querying the role_permission table
const checkUserPermission = async (userId, moduleKey, actionKey, roleId = null) => {
  const conn = await getConnection()
  try {
    let userRoleId = roleId

    // If roleId not provided (legacy call), fetch from staff table
    if (!userRoleId) {
      // First, get the user's role
      const userResult = await conn.query(
        `SELECT s.role_id, r.role_name
        FROM staff s
        JOIN role r ON s.role_id = r.id
        WHERE s.id = ? AND s.is_active = 1`,
        [userId]
      )

      if (userResult.length === 0) {
        return false
      }
      userRoleId = userResult[0].role_id
    }

    // Check if the role has the requested permission
    const permissionResult = await conn.query(
      `SELECT rp.is_granted
       FROM role_permission rp
       JOIN system_module sm ON rp.module_id = sm.id
       JOIN permission_action pa ON rp.action_id = pa.id
       WHERE rp.role_id = ? AND sm.module_key = ? AND pa.action_key = ?`,
      [userRoleId, moduleKey, actionKey]
    )

    // If no permission is set for this role/module/action combination, deny by default
    if (permissionResult.length === 0) {
      return false
    }

    // Return the granted status
    return permissionResult[0].is_granted === 1
  } catch (error) {
    console.error('Error checking user permission:', error)
    return false // Deny access on error
  } finally {
    conn.release()
  }
}

module.exports = {
  protect,
  authorize,
  requireRoles,
  requireRolesOrPermission,
  checkPermission,
  generateToken,
}
