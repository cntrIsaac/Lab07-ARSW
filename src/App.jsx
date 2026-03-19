import { useEffect, useState } from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import BlueprintsPage from './pages/BlueprintsPage.jsx'
import BlueprintDetailPage from './pages/BlueprintDetailPage.jsx'
import CreateBlueprintPage from './pages/CreateBlueprintPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import NotFound from './pages/NotFound.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import { clearToken, isAuthenticated, subscribeAuthChanges } from './services/authStorage.js'
import {
  getRealtimeMode,
  setRealtimeMode,
  subscribeRealtimeModeChanges,
} from './services/realtimeModeStorage.js'
import {
  getSocketStatus,
  onSocketStatusChange,
} from './services/socketRealtime.js'

export default function App() {
  const [authenticated, setAuthenticated] = useState(isAuthenticated())
  const [realtimeMode, setRealtimeModeState] = useState(getRealtimeMode())
  const [socketStatus, setSocketStatus] = useState(getSocketStatus())

  useEffect(() => {
    return subscribeAuthChanges(() => {
      setAuthenticated(isAuthenticated())
    })
  }, [])

  useEffect(() => {
    return subscribeRealtimeModeChanges(() => {
      setRealtimeModeState(getRealtimeMode())
    })
  }, [])

  useEffect(() => {
    return onSocketStatusChange((status) => {
      setSocketStatus(status)
    })
  }, [])

  const onRealtimeModeChange = (event) => {
    setRealtimeMode(event.target.value)
  }

  const getStatusColor = () => {
    if (realtimeMode !== 'socketio') return null
    return socketStatus === 'connected' ? '#4CAF50' : '#F44336'
  }

  const getStatusText = () => {
    if (realtimeMode !== 'socketio') return null
    return socketStatus === 'connected' ? '🟢 Conectado' : '🔴 Desconectado'
  }

  return (
    <div className="container">
      <header>
        <h1>ECI - Laboratorio de Blueprints en React</h1>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <NavLink to="/" end>
            Blueprints
          </NavLink>
          <NavLink to="/create">Crear</NavLink>
          <select
            className="input"
            aria-label="realtime-mode"
            value={realtimeMode}
            onChange={onRealtimeModeChange}
            style={{ width: 170, padding: '6px 8px' }}
          >
            <option value="none">RT: None</option>
            <option value="socketio">RT: Socket.IO</option>
            <option value="stomp">RT: STOMP</option>
          </select>
          {getStatusText() && (
            <span
              style={{
                padding: '6px 12px',
                borderRadius: '4px',
                fontSize: '0.9rem',
                backgroundColor: getStatusColor(),
                color: 'white',
                fontWeight: 'bold',
                minWidth: '140px',
                textAlign: 'center',
              }}
            >
              {getStatusText()}
            </span>
          )}
          {!authenticated && <NavLink to="/login">Login</NavLink>}
          {authenticated && (
            <button className="btn" onClick={clearToken} type="button">
              Logout
            </button>
          )}
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<BlueprintsPage />} />
        <Route path="/blueprints/:author/:name" element={<BlueprintDetailPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/create" element={<CreateBlueprintPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}
