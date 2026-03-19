import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { isAuthenticated } from '../services/authStorage.js'

export default function PrivateRoute() {
  const location = useLocation()

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}
