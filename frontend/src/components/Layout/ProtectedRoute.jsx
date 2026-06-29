import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
      height:'100vh', color:'var(--gold)', fontSize:'1.2rem' }}>
      🕉️ લોડ થઈ રહ્યું છે...
    </div>
  )

  return user ? children : <Navigate to="/login" replace />
}
