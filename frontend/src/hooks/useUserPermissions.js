import { useState, useEffect } from 'react'
import userPermissionsService from '../services/userPermissionsService'

// Hook para verificar permisos del usuario actual
export const useUserPermissions = () => {
  const [permissions, setPermissions] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadPermissions = async () => {
      try {
        setLoading(true)
        const perms = await userPermissionsService.getUserPermissions()
        setPermissions(perms)
      } catch (err) {
        console.error('Error loading permissions:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadPermissions()
  }, [])

  // Helper function para verificar un permiso
  const can = (moduleKey, actionKey) => {
    const key = `${moduleKey}:${actionKey}`
    return permissions[key] === true
  }

  // Helper para verificar múltiples acciones
  const canAny = (moduleKey, actions = []) => {
    return actions.some((action) => can(moduleKey, action))
  }

  return {
    permissions,
    loading,
    error,
    can,
    canAny,
  }
}

export default useUserPermissions
