'use client'
import { useState, useEffect, useRef } from 'react'
import { api } from '@/lib/api-client'
import { useAuthStore } from '@/stores/auth.store'

interface Serial { id: string; serialNo: string; status: string }

interface Props {
  itemId:    string
  itemName:  string
  channelId: string
  isOpen:    boolean
  onClose:   () => void
  onSelect:  (serial: Serial) => void
}

export function SerialSelectorModal({ itemId, itemName, channelId, isOpen, onClose, onSelect }: Props) {
  const token = useAuthStore((s) => s.accessToken)
  const [serials, setSerials]   = useState<Serial[]>([])
  const [loading, setLoading]   = useState(false)
  const [search, setSearch]     = useState('')
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isOpen || !token) return
    setLoading(true)
    setSearch('')
    api.get<Serial[]>(`/serials?itemId=${itemId}&channelId=${channelId}&status=IN_STOCK`, token)
      .then(res => setSerials(Array.isArray(res) ? res : []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [isOpen, itemId, channelId, token])

  // Focus search after load
  useEffect(() => {
    if (!loading && isOpen) setTimeout(() => searchRef.current?.focus(), 100)
  }, [loading, isOpen])

  if (!isOpen) return null

  const filtered = serials.filter(s => s.serialNo.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="modal-overlay no-print" role="dialog" aria-modal="true" aria-label="Select serial number">
      <div className="modal-content" style={{ maxWidth: 440 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Select Serial</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 2 }}>{itemName}</p>
          </div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={onClose}
            style={{ width: 44, height: 44, padding: 0, minWidth: 44 }}
            aria-label="Close"
          >✕</button>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 14 }}>
          Serialized item — select a specific unit from stock.
        </p>

        {/* Search / scan input */}
        <input
          ref={searchRef}
          className="input"
          placeholder="🔍 Scan or type serial number..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ marginBottom: 14 }}
          autoComplete="off"
          inputMode="text"
        />

        {/* Serial list — full height, large touch targets */}
        <div style={{
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          maxHeight: '50vh',
          overflowY: 'auto',
        }}>
          {loading ? (
            <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>
              Loading available units...
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>
              {search ? `No units matching "${search}"` : 'No units in stock'}
            </div>
          ) : (
            filtered.map(s => (
              <div
                key={s.id}
                onClick={() => { onSelect(s); onClose() }}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && onSelect(s)}
                style={{
                  padding: '14px 16px',
                  cursor: 'pointer',
                  borderBottom: '1px solid var(--border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  minHeight: 'var(--touch-target)',
                  touchAction: 'manipulation',
                  transition: 'background var(--transition-fast)',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
              >
                <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{s.serialNo}</span>
                <span className="badge badge-success">In Stock</span>
              </div>
            ))
          )}
        </div>

        <div style={{ marginTop: 16, fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
          {filtered.length > 0 && `${filtered.length} unit${filtered.length !== 1 ? 's' : ''} available`}
        </div>
      </div>
    </div>
  )
}
