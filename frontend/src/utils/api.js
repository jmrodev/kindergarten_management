// Pequeño wrapper para fetch que añade `Authorization` si hay token en localStorage
const getToken = () => localStorage.getItem('token')

const buildHeaders = (headers = {}) => {
  const token = getToken()
  const base = {
    'Content-Type': 'application/json',
    ...headers,
  }

  if (token) {
    base['Authorization'] = `Bearer ${token}`
  }

  return base
}

const request = async (url, options = {}) => {
  const res = await fetch(url, {
    ...options,
    headers: buildHeaders(options.headers || {}),
  })

  const text = await res.text()
  let data = null
  try {
    data = text ? JSON.parse(text) : null
  } catch (e) {
    data = text
  }

  if (!res.ok) {
    const message =
      (data && data.message) || res.statusText || 'Error en la petición'
    const err = new Error(message)
    err.status = res.status
    err.payload = data
    throw err
  }

  return data
}

const get = (url) => request(url, { method: 'GET' })
const post = (url, body) =>
  request(url, { method: 'POST', body: JSON.stringify(body) })
const put = (url, body) =>
  request(url, { method: 'PUT', body: JSON.stringify(body) })
const del = (url) => request(url, { method: 'DELETE' })

export default { get, post, put, del }
