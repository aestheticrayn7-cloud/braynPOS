'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api-client'
import { useAuthStore } from '@/stores/auth.store'
import { toast } from 'react-hot-toast'

interface Session {
  id:            string
  status:        'OPEN' | 'CLOSED'
  openingFloat:  number
  closingFloat?: number
  expectedFloat?: number
  variance?:     number
  openedAt:      string
  closedAt?:     string
  notes?:        string
  user?:         { id: string; username: string }
  channel?:      { id: string; name: string; code: string }
  _count?:       { sales: number }
}

interface Channel { id: string; name: string; code: string }

export default function SessionsPage() {
  const router = useRouter()
  const token  = useAuthStore((s) => s.accessToken)
  const user   = useAuthStore((s) => s.user)

  const [activeSession, setActiveSession]   = useState<Session | null>(null)
  const [sessions, setSessions]             = useState<Session[]>([])
  const [channels, setChannels]             = useState<Channel[]>([])
  const [loading, setLoading]               = useState(true)
  const [showOpenModal, setShowOpenModal]   = useState(false)
  const [showCloseModal, setShowCloseModal] = useState(false)
  const [saving, setSaving]                 = useState(false)

  // Open session form
  const [openFloat, setOpenFloat]     = useState('')
  const [openChannel, setOpenChannel] = useState('')

  // Close session form
  const [closeFloat, setCloseFloat] = useState('')
  const [closeNotes, setCloseNotes] = useState('')

  const isAdmin = ['SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER'].includes(user?.role || '')

  const fetchData = async () => {
    if (!token) return
    setLoading(true)
    try {
      const [activeRes, channelsRes] = await Promise.all([
        api.get<Session | null>('/sessions/active', token),
        api.get<Channel[]>('/channels', token),
      ])
      setActiveSession(activeRes)
      const chs = Array.isArray(channelsRes) ? channelsRes : [channelsRes as unknown as Channel]
      setChannels(chs)

      // Default channel to user's assigned channel
      if (!openChannel) {
        const defaultCh = chs.find(c => c.id === user?.channelId) || chs[0]
        if (defaultCh) setOpenChannel(defaultCh.id)
      }

      if (isAdmin) {
        const histRes = await api.get<{ data: Session[] }>('/sessions', token)
        setSessions(histRes.data ?? [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [token])

  // ── Open session ────────────────────────────────────────────────
  const handleOpen = async (e: React.FormEvent) => {
    e.preventDefault()
    const float = parseFloat(openFloat)
    if (isNaN(float) || float < 0) return toast.error('Enter a valid opening float amount')
    if (!openChannel) return toast.error('Select a channel')

    setSaving(true)
    try {
      await api.post('/sessions/open', {
        channelId:    openChannel,
        openingFloat: float,
      }, token!)
      toast.success('Session opened successfully')
      setShowOpenModal(false)
      setOpenFloat('')
      await fetchData()
    } catch (err: any) {
      toast.error(err.message || 'Failed to open session')
    } finally {
      setSaving(false)
    }
  }

  // ── Close session ───────────────────────────────────────────────
  const handleClose = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeSession) return
    const float = parseFloat(closeFloat)
    if (isNaN(float) || float < 0) return toast.error('Enter a valid closing float amount')

    setSaving(true)
    try {
      await api.post(`/sessions/${activeSession.id}/close`, {
        closingFloat: float,
        notes:        closeNotes || undefined,
      }, token!)
      toast.success('Session closed successfully')
      setShowCloseModal(false)
      setCloseFloat('')
      setCloseNotes('')
      await fetchData()
    } catch (err: any) {
      toast.error(err.message || 'Failed to close session')
    } finally {
      setSaving(false)
    }
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(n)

  const dur = (openedAt: string, closedAt?: string) => {
    const start = new Date(openedAt).getTime()
    const end   = closedAt ? new Date(closedAt).getTime() : Date.now()
    const mins  = Math.floor((end - start) / 60000)
    if (mins < 60) return `${mins}m`
    const hrs = Math.floor(mins / 60)
    const rem = mins % 60
    return rem > 0 ? `${hrs}h ${rem}m` : `${hrs}h`
  }

  return (
    <div className="animate-fade-in" style={{ padding: '0 0 40px' }}>

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div>
          <h1>Sessions</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 4 }}>
            Manage shift float entries and cash drawer sessions
          </p>
        </div>
        {!activeSession && !loading && (
          <button className="btn btn-primary" onClick={() => setShowOpenModal(true)}>
            + Open Session
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
          Loading sessions...
        </div>
      ) : (
        <>
          {/* ── Active session card ───────────────────────────── */}
          {activeSession ? (
            <div className="card" style={{
              marginBottom: 24,
              border: '1px solid rgba(16, 185, 129, 0.3)',
              background: 'rgba(16, 185, 129, 0.05)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--success)', flexShrink: 0 }} />
                    <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--success)' }}>
                      Active Session
                    </span>
                    <span className="badge badge-success">OPEN</span>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 2 }}>
                    <div><strong style={{ color: 'var(--text-primary)' }}>Channel:</strong> {activeSession.channel?.name || 'N/A'}</div>
                    <div><strong style={{ color: 'var(--text-primary)' }}>Opened:</strong> {new Date(activeSession.openedAt).toLocaleString()}</div>
                    <div><strong style={{ color: 'var(--text-primary)' }}>Duration:</strong> {dur(activeSession.openedAt)}</div>
                    <div><strong style={{ color: 'var(--text-primary)' }}>Opening Float:</strong> {fmt(Number(activeSession.openingFloat))}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 160 }}>
                  <button
                    className="btn btn-primary"
                    onClick={() => router.push('/dashboard/pos')}
                    style={{ justifyContent: 'center' }}
                  >
                    🛒 Go to POS
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => { setCloseFloat(''); setCloseNotes(''); setShowCloseModal(true) }}
                    style={{ justifyContent: 'center' }}
                  >
                    Close Session
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ── No active session ─────────────────────────────── */
            <div className="card" style={{
              marginBottom: 24,
              border: '1px solid rgba(245, 158, 11, 0.3)',
              background: 'rgba(245, 158, 11, 0.05)',
              textAlign: 'center',
              padding: '32px 24px',
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🎫</div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8, color: 'var(--warning)' }}>
                No Active Session
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 20 }}>
                You need to open a shift session before you can accept payments at the POS terminal.
              </p>
              <button
                className="btn btn-primary btn-lg"
                onClick={() => setShowOpenModal(true)}
                style={{ margin: '0 auto' }}
              >
                🎫 Open New Session
              </button>
            </div>
          )}

          {/* ── Session history (managers only) ──────────────── */}
          {isAdmin && sessions.length > 0 && (
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
                <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>Session History</h3>
              </div>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Cashier</th>
                      <th>Channel</th>
                      <th>Opened</th>
                      <th>Duration</th>
                      <th>Opening Float</th>
                      <th>Closing Float</th>
                      <th>Variance</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map(s => {
                      const variance = Number(s.variance ?? 0)
                      return (
                        <tr key={s.id}>
                          <td data-label="Cashier" style={{ fontWeight: 600 }}>
                            {s.user?.username || '—'}
                          </td>
                          <td data-label="Channel">
                            <span className="badge badge-outline">{s.channel?.name || '—'}</span>
                          </td>
                          <td data-label="Opened" style={{ fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                            {new Date(s.openedAt).toLocaleString()}
                          </td>
                          <td data-label="Duration" style={{ fontSize: '0.82rem' }}>
                            {dur(s.openedAt, s.closedAt)}
                          </td>
                          <td data-label="Opening Float">
                            {fmt(Number(s.openingFloat))}
                          </td>
                          <td data-label="Closing Float">
                            {s.closingFloat != null ? fmt(Number(s.closingFloat)) : '—'}
                          </td>
                          <td data-label="Variance" style={{
                            fontWeight: 600,
                            color: variance === 0 ? 'var(--success)'
                              : variance > 0  ? 'var(--info)'
                              : 'var(--danger)',
                          }}>
                            {s.variance != null
                              ? (variance >= 0 ? '+' : '') + fmt(variance)
                              : '—'}
                          </td>
                          <td data-label="Status">
                            <span className={`badge ${s.status === 'OPEN' ? 'badge-success' : 'badge-outline'}`}>
                              {s.status}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Open Session Modal ──────────────────────────────────── */}
      {showOpenModal && (
        <div className="modal-overlay">
          <div className="modal-content card" style={{ maxWidth: 440 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0 }}>🎫 Open New Session</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowOpenModal(false)}>✕</button>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 20 }}>
              Count the cash in your drawer and enter it as the opening float to begin your shift.
            </p>

            <form onSubmit={handleOpen} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Channel</label>
                <select
                  className="input"
                  value={openChannel}
                  onChange={e => setOpenChannel(e.target.value)}
                  required
                  disabled={!isAdmin && channels.length <= 1}
                >
                  {channels.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Opening Float (KES)</label>
                <input
                  type="number"
                  className="input"
                  inputMode="decimal"
                  placeholder="e.g. 5000"
                  value={openFloat}
                  onChange={e => setOpenFloat(e.target.value)}
                  min="0"
                  step="0.01"
                  required
                  autoFocus
                  style={{ fontSize: '1.3rem', textAlign: 'center', fontWeight: 700 }}
                />
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 6 }}>
                  Enter the exact cash amount currently in the drawer.
                </p>
              </div>

              {/* Quick amount buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {[1000, 2000, 5000, 10000].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => setOpenFloat(String(amt))}
                    style={{ justifyContent: 'center', fontSize: '0.78rem' }}
                  >
                    {new Intl.NumberFormat('en-KE').format(amt)}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowOpenModal(false)} style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-success" disabled={saving} style={{ flex: 2, justifyContent: 'center' }}>
                  {saving ? 'Opening...' : '✓ Open Session'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Close Session Modal ─────────────────────────────────── */}
      {showCloseModal && activeSession && (
        <div className="modal-overlay">
          <div className="modal-content card" style={{ maxWidth: 440 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0 }}>🔒 Close Session</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowCloseModal(false)}>✕</button>
            </div>

            <div style={{
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
              marginBottom: 20,
              fontSize: '0.875rem',
              lineHeight: 2,
            }}>
              <div><strong>Channel:</strong> {activeSession.channel?.name}</div>
              <div><strong>Opened:</strong> {new Date(activeSession.openedAt).toLocaleString()}</div>
              <div><strong>Duration:</strong> {dur(activeSession.openedAt)}</div>
              <div><strong>Opening Float:</strong> {fmt(Number(activeSession.openingFloat))}</div>
            </div>

            <form onSubmit={handleClose} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Closing Float (KES)</label>
                <input
                  type="number"
                  className="input"
                  inputMode="decimal"
                  placeholder="Count cash in drawer..."
                  value={closeFloat}
                  onChange={e => setCloseFloat(e.target.value)}
                  min="0"
                  step="0.01"
                  required
                  autoFocus
                  style={{ fontSize: '1.3rem', textAlign: 'center', fontWeight: 700 }}
                />
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 6 }}>
                  Count your cash drawer and enter the total amount.
                </p>
              </div>

              {/* Show expected vs actual variance preview */}
              {closeFloat && !isNaN(parseFloat(closeFloat)) && (
                <div style={{
                  padding: '10px 14px',
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                  border: '1px solid var(--border)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ color: 'var(--text-muted)' }}>Closing float entered</span>
                    <strong>{fmt(parseFloat(closeFloat))}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Opening float</span>
                    <span>{fmt(Number(activeSession.openingFloat))}</span>
                  </div>
                </div>
              )}

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Notes (optional)</label>
                <input
                  className="input"
                  placeholder="Any notes about this session..."
                  value={closeNotes}
                  onChange={e => setCloseNotes(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowCloseModal(false)} style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-danger" disabled={saving} style={{ flex: 2, justifyContent: 'center' }}>
                  {saving ? 'Closing...' : '🔒 Close Session'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
