'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api-client'
import { useAuthStore } from '@/stores/auth.store'
import { ROLE_LANDING_PAGES } from '@/lib/nav-config'
import QRCode from 'qrcode'

type Mode = 'login' | 'mfa-verify' | 'mfa-setup' | 'mfa-recovery'

export default function LoginPage() {
  const router = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<Mode>('login')
  const [tempToken, setTempToken] = useState('')
  const [totpCode, setTotpCode] = useState('')
  const [qrCode, setQrCode] = useState('')
  const [setupCode, setSetupCode] = useState('')
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([])

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
        mfaSetupRequired?: boolean
        tempToken?: string
        accessToken?: string
        refreshToken?: string
        user: { role: string; [key: string]: any }
      }>('/auth/login', { email: email.trim().toLowerCase(), password })

      if (res.mfaSetupRequired && res.tempToken) {
        setTempToken(res.tempToken)
        try {
          const setup = await api.post<{ uri: string; secret: string }>(
            '/auth/mfa/setup',
            {},
            res.tempToken
          )
          const dataUrl = await QRCode.toDataURL(setup.uri, { width: 180, margin: 1 })
          setQrCode(dataUrl)
          setMode('mfa-setup')
        } catch {
          setError('Failed to load MFA setup. Please try again.')
        }
      } else if (res.requiresMfa && res.tempToken) {
        setMode('mfa-verify')
        setTempToken(res.tempToken)
      } else if (res.accessToken) {
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

  const handleMfaEnable = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await api.post<{ message: string; recoveryCodes: string[] }>(
        '/auth/mfa/enable',
        { code: setupCode },
        tempToken
      )
      setRecoveryCodes(res.recoveryCodes)
      setMode('mfa-recovery')
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const proceedToVerify = () => {
    setMode('mfa-verify')
    setTotpCode('')
    setError('')
  }

  return (
    <div className="login-container">
      <div className="login-card animate-fade-in">
        <div className="brand">
          <h1>◆ BRAYN</h1>
          <p>Hybrid Edition • Enterprise POS</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        {mode === 'login' && (
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
        )}

        {mode === 'mfa-verify' && (
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

        {mode === 'mfa-setup' && (
          <form onSubmit={handleMfaEnable}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 12, textAlign: 'center', fontSize: '0.9rem' }}>
              🛡️ MFA is required for your role. Scan this QR code with Google Authenticator or Authy.
            </p>
            {qrCode && (
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                <img src={qrCode} alt="MFA QR Code" style={{ width: 180, height: 180, borderRadius: 8, background: 'white', padding: 8 }} />
              </div>
            )}
            <div className="form-group">
              <label htmlFor="setup-code">Enter the 6-digit code to confirm</label>
              <input
                id="setup-code"
                className="input"
                type="text"
                value={setupCode}
                onChange={(e) => setSetupCode(e.target.value)}
                placeholder="000000"
                maxLength={6}
                style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.3em' }}
                required
              />
            </div>
            <button
              id="mfa-enable-submit"
              className="btn btn-primary btn-lg"
              type="submit"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {loading ? 'Activating...' : 'Activate MFA & Continue'}
            </button>
          </form>
        )}

        {mode === 'mfa-recovery' && (
          <div>
            <p style={{ color: 'var(--success, #4ade80)', textAlign: 'center', marginBottom: 8, fontWeight: 600 }}>
              ✅ MFA Activated Successfully!
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'center', marginBottom: 12 }}>
              Save these recovery codes somewhere safe. Each can only be used once.
            </p>
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: '12px 16px', marginBottom: 20, fontFamily: 'monospace', fontSize: '0.85rem' }}>
              {recoveryCodes.map((code, i) => (
                <div key={i} style={{ padding: '2px 0' }}>{code}</div>
              ))}
            </div>
            <button
              id="continue-after-recovery"
              className="btn btn-primary btn-lg"
              onClick={proceedToVerify}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {"I've saved my codes — Continue"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
