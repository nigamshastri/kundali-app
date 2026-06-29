import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { loginUser } = useAuth()
  const navigate = useNavigate()

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await login(form)
      loginUser(res.data.user, res.data.token)
      toast.success(res.data.message)
      navigate('/kundali')
    } catch (err) {
      toast.error(err.response?.data?.error || 'લૉગિન નિષ્ફળ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '2rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🕉️</div>
          <h1 style={{ fontSize: '1.8rem', color: 'var(--gold)' }}>શાસ્ત્રી જ્યોતિષ</h1>
          <p style={{ color: 'rgba(255,248,240,0.5)', marginTop: '0.3rem', fontSize: '0.9rem' }}>
            તમારા એકાઉન્ટમાં પ્રવેશ કરો
          </p>
        </div>

        <div className="card fade-in">
          <form onSubmit={submit}>
            <div className="form-group">
              <label>ઇમેઇલ</label>
              <input name="email" type="email" placeholder="your@email.com"
                value={form.email} onChange={handle} required />
            </div>
            <div className="form-group">
              <label>પાસવર્ડ</label>
              <input name="password" type="password" placeholder="••••••••"
                value={form.password} onChange={handle} required />
            </div>
            <button className="btn-primary" type="submit" disabled={loading}
              style={{ marginTop: '0.5rem' }}>
              {loading ? '⏳ લૉગિન...' : '🔑 લૉગિન કરો'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem',
            color: 'rgba(255,248,240,0.5)' }}>
            એકાઉન્ટ નથી?{' '}
            <Link to="/register" style={{ color: 'var(--saffron)' }}>
              અહીં નોંધો
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
