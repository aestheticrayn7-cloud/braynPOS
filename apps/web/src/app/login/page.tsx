'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api-client'
import { useAuthStore } from '@/stores/auth.store'
import { ROLE_LANDING_PAGES } from '@/lib/nav-config'

export default function LoginPage() {
  const router = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mfaMode, setMfaMode] = useState(false)
  const [tempToken, setTempToken] = useState('')
  const [totpCode, setTotpCode] = useState('')

  // Clear any corrupted or old auth state when reaching the login page
  useEffect(() => {
    useAuthStore.getState().logout()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await api.post<{
        requiresMfa: boolean
        tempToken?: string
        accessToken?: string
        refreshToken?: string
        user: { role: string; [key: string]: any }
      }>('/auth/login', { email: email.trim().toLowerCase(), password })

      if (res.requiresMfa) {
        setMfaMode(true)
        setTempToken(res.tempToken!)
      } else {
        setAuth(
          { accessToken: res.accessToken!, refreshToken: res.refreshToken! },
          res.user as never
        )
        const landingPage = ROLE_LANDING_PAGES[res.user.role] || '/dashboard'
        router.push(landingPage)
      }
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleMfaVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await api.post<{
        accessToken: string
        refreshToken: string
      }>('/auth/mfa/verify', { tempToken, code: totpCode })

      // Fetch profile with the new token
      const profile = await api.get<{ role: string; [key: string]: any }>('/auth/profile', res.accessToken)
      setAuth(res, profile as never)
      
      const landingPage = ROLE_LANDING_PAGES[profile.role] || '/dashboard'
      router.push(landingPage)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card animate-fade-in">
        <div className="brand">
          <h1>◆ BRAYN</h1>
          <p>Hybrid Edition • Enterprise POS</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        {!mfaMode ? (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="login-email">Email Address</label>
              <input
                id="login-email"
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@brayn.app"
                autoComplete="off"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                required
              />
            </div>
            <button
              id="login-submit"
              className="btn btn-primary btn-lg"
              type="submit"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleMfaVerify}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24, textAlign: 'center' }}>
              Enter the 6-digit code from your authenticator app
            </p>
            <div className="form-group">
              <label htmlFor="mfa-code">Verification Code</label>
              <input
                id="mfa-code"
                className="input"
                type="text"
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value)}
                placeholder="000000"
                maxLength={6}
                style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.3em' }}
                required
              />
            </div>
            <button
              id="mfa-submit"
              className="btn btn-primary btn-lg"
              type="submit"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
