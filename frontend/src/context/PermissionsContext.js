import { createContext, useContext } from 'react'

const PermissionsContext = createContext({})

export const usePermissions = () => useContext(PermissionsContext)

export default PermissionsContext
