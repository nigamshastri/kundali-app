import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
    gender: '', dob: ''
  })
  const [loading, setLoading] = useState(false)
  const { loginUser } = useAuth()
  const navigate = useNavigate()

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      toast.error('પાસવર્ડ મેળ ખાતો નથી')
      return
    }
    setLoading(true)
    try {
      const { confirmPassword, ...payload } = form
      const res = await register(payload)
      loginUser(res.data.user, res.data.token)
      toast.success(res.data.message)
      navigate('/kundali')
    } catch (err) {
      toast.error(err.response?.data?.error || 'નોંધણી નિષ્ફળ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '2rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: 520 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🌟</div>
          <h1 style={{ fontSize: '1.8rem', color: 'var(--gold)' }}>નવું ખાતું બનાવો</h1>
          <p style={{ color: 'rgba(255,248,240,0.5)', marginTop: '0.3rem', fontSize: '0.9rem' }}>
            શાસ્ત્રી જ્યોતિષ - તમારી કુંડળી, તમારી ઓળખ
          </p>
        </div>

        <div className="card fade-in">
          <form onSubmit={submit}>
            <div className="form-grid">
              <div className="form-group">
                <label>પૂરું નામ *</label>
                <input name="name" placeholder="તમારું નામ" value={form.name} onChange={handle} required />
              </div>
              <div className="form-group">
                <label>ફોન નંબર *</label>
                <input name="phone" placeholder="10-અંક" value={form.phone} onChange={handle} required />
              </div>
            </div>

            <div className="form-group">
              <label>ઇમેઇલ *</label>
              <input name="email" type="email" placeholder="your@email.com"
                value={form.email} onChange={handle} required />
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>લિંગ</label>
                <select name="gender" value={form.gender} onChange={handle}>
                  <option value="">પસંદ કરો</option>
                  <option value="શ્રી">શ્રી (પુરુષ)</option>
                  <option value="શ્રીમતી">શ્રીમતી (સ્ત્રી)</option>
                  <option value="કુ.">કુ. (અ-વિવાહિત)</option>
                </select>
              </div>
              <div className="form-group">
                <label>જન્મ તારીખ</label>
                <input name="dob" type="date" value={form.dob} onChange={handle} />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>પાસવર્ડ *</label>
                <input name="password" type="password" placeholder="ઓછામાં ઓછો 6 અક્ષર"
                  value={form.password} onChange={handle} required />
              </div>
              <div className="form-group">
                <label>પાસવર્ડ ફરી *</label>
                <input name="confirmPassword" type="password" placeholder="ફરી ભરો"
                  value={form.confirmPassword} onChange={handle} required />
              </div>
            </div>

            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? '⏳ નોંધણી...' : '✨ ખાતું બનાવો'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem',
            color: 'rgba(255,248,240,0.5)' }}>
            પહેલેથી ખાતું છે?{' '}
            <Link to="/login" style={{ color: 'var(--saffron)' }}>
              લૉગિન કરો
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
