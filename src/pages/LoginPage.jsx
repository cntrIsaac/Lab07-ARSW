import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import api from '../services/httpClient.js'
import { setToken } from '../services/authStorage.js'

const authPath = import.meta.env.VITE_AUTH_PATH || '/auth/login'

function readToken(payload) {
  if (!payload || typeof payload !== 'object') return null
  if (payload.token) return payload.token
  if (payload.access_token) return payload.access_token
  if (payload.data && typeof payload.data === 'object') {
    return payload.data.token || payload.data.access_token || null
  }
  return null
}

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from?.pathname || '/'
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      const { data } = await api.post(authPath, { username, password })
      const token = readToken(data)
      if (!token) {
        throw new Error('Token no encontrado en la respuesta del login')
      }
      setToken(token)
      navigate(redirectTo, { replace: true })
    } catch (e) {
      setError('Credenciales inválidas o servidor no disponible')
    }
  }

  return (
    <form className="card" onSubmit={submit}>
      <h2 style={{ marginTop: 0 }}>Login</h2>
      <div className="grid cols-2">
        <div>
          <label>Usuario</label>
          <input className="input" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label>Contraseña</label>
          <input
            type="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>
      {error && <p style={{ color: '#f87171' }}>{error}</p>}
      <button className="btn primary" style={{ marginTop: 12 }}>
        Ingresar
      </button>
    </form>
  )
}
