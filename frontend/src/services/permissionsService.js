import api from '../utils/api'

// Check a single permission for a role
const check = async (role, moduleKey, actionKey) => {
  try {
    const res = await api.get(
      `/api/permissions/check/${encodeURIComponent(role)}/${encodeURIComponent(
        moduleKey
      )}/${encodeURIComponent(actionKey)}`
    )
    return res && res.hasPermission
  } catch (err) {
    console.warn('Permission check failed', role, moduleKey, actionKey, err)
    return false
  }
}

// Check multiple permissions in parallel; pairs is array of {module, action, key}
const bulkCheck = async (role, pairs = []) => {
  const results = await Promise.all(
    pairs.map(async (p) => {
      const allowed = await check(role, p.module, p.action)
      return { key: p.key, allowed }
    })
  )

  const map = {}
  results.forEach((r) => {
    map[r.key] = r.allowed
  })
  return map
}

// Get full permissions view (requires admin/director)
const getAll = async () => {
  return api.get('/api/permissions')
}

const getModules = async () => {
  return api.get('/api/permissions/modules')
}

const getActions = async () => {
  return api.get('/api/permissions/actions')
}

const toggle = async ({ roleId, moduleId, actionId, isGranted }) => {
  return api.post('/api/permissions/toggle', {
    roleId,
    moduleId,
    actionId,
    isGranted,
  })
}

const getAudit = async (limit = 100) => {
  return api.get(`/api/permissions/audit?limit=${limit}`)
}

export default {
  check,
  bulkCheck,
  getAll,
  getModules,
  getActions,
  toggle,
  getAudit,
}
