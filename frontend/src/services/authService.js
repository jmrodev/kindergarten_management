import api from '../utils/api'

const login = async ({ email, password }) => {
  return api.post('/api/auth/login', { email, password })
}

const loginParent = async ({ email, password }) => {
  return api.post('/api/parent-portal/login', { email, password })
}

const registerParent = async ({ email, password, name }) => {
  return api.post('/api/parent-portal/register', { email, password, name })
}

const me = async () => {
  return api.get('/api/auth/me')
}

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

export default { login, loginParent, registerParent, me, logout }
