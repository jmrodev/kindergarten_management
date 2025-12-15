import api from '../utils/api'

const login = async ({ email, password }) => {
  return api.post('/api/auth/login', { email, password })
}

const me = async () => {
  return api.get('/api/auth/me')
}

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

export default { login, me, logout }
