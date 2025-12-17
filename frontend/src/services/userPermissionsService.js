import api from '../utils/api'

// Get current user's actual permissions from the role_permission table
const getUserPermissions = async () => {
  try {
    const response = await api.get('/api/permissions/user-permissions')
    console.log('[getUserPermissions] Got user permissions:', response)
    return response || {}
  } catch (err) {
    console.error('Error getting user permissions:', err)
    return {}
  }
}

// Check if user has specific permission
const hasPermission = async (moduleKey, actionKey) => {
  try {
    const permissions = await getUserPermissions()
    const permKey = `${moduleKey}:${actionKey}`
    const result = permissions[permKey] === true
    console.log(`[hasPermission] ${permKey}: ${result}`)
    return result
  } catch (err) {
    console.error('Error checking permission:', err)
    return false
  }
}

// Check multiple permissions at once
const bulkCheckPermissions = async (checks = []) => {
  try {
    const permissions = await getUserPermissions()
    const results = {}
    checks.forEach((check) => {
      const permKey = `${check.module}:${check.action}`
      results[check.key] = permissions[permKey] === true
    })
    return results
  } catch (err) {
    console.error('Error bulk checking permissions:', err)
    return {}
  }
}

export default {
  getUserPermissions,
  hasPermission,
  bulkCheckPermissions,
}
