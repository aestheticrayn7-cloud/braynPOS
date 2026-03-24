// apps/web/src/components/shared/PasswordConfirmModal.tsx
import { useState } from 'react'

interface PasswordConfirmModalProps {
  title: string
  message: string
  onConfirm: (password: string) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export function PasswordConfirmModal({ 
  title, 
  message, 
  onConfirm, 
  onCancel,
  loading: externalLoading
}: PasswordConfirmModalProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [internalLoading, setInternalLoading] = useState(false)
  
  const loading = externalLoading || internalLoading

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setInternalLoading(true)
    try {
      await onConfirm(password)
    } catch (err: any) {
      setError(err.message || 'Verification failed')
    } finally {
      setInternalLoading(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-scale-in" style={{ maxWidth: 400 }}>
        <h2>{title}</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>
          {message}
        </p>

        {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Confirm Your Password</label>
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoFocus
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 24 }}>
            <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-danger" disabled={loading}>
              {loading ? 'Processing...' : 'Delete'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
