'use client'
import { useState, useEffect } from 'react'
import { api } from '@/lib/api-client'
import { useAuthStore } from '@/stores/auth.store'
import { toast } from 'react-hot-toast'

interface Props {
  item: { itemId: string; itemName?: string; availableQty: number }
  channelId: string
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  initialIsOpening?: boolean
}

// Reason codes that only make sense as subtractions (losses)
const SUBTRACT_ONLY_REASONS = ['DAMAGED_IN_STORE', 'EXPIRED', 'THEFT_INVESTIGATION']
// Reason codes that only make sense as additions (gains)
const ADD_ONLY_REASONS: string[] = []

export function StockAdjustmentModal({ item, channelId, isOpen, onClose, onSuccess, initialIsOpening = false }: Props) {
  const token = useAuthStore((s) => s.accessToken)
  const user  = useAuthStore((s) => s.user)

  const [mode, setMode]           = useState<'add' | 'subtract'>('add')
  const [quantity, setQuantity]   = useState<number | ''>('')
  const [reason, setReason]       = useState('')
  const [reasonCode, setReasonCode] = useState('SYSTEM_CORRECTION')
  const [isOpening, setIsOpening] = useState(initialIsOpening)
  const [loading, setLoading]     = useState(false)

  // Auto-lock mode when reason category forces a direction
  useEffect(() => {
    if (SUBTRACT_ONLY_REASONS.includes(reasonCode)) setMode('subtract')
    if (ADD_ONLY_REASONS.includes(reasonCode))      setMode('add')
  }, [reasonCode])

  if (!isOpen) return null

  const qty         = Number(quantity) || 0
  const signedQty   = mode === 'add' ? qty : -qty
  const newBalance  = item.availableQty + signedQty
  const isForced    = SUBTRACT_ONLY_REASONS.includes(reasonCode) || ADD_ONLY_REASONS.includes(reasonCode)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (qty === 0)          return toast.error('Quantity cannot be zero')
    if (!reason.trim())     return toast.error('Note is required')
    if (newBalance < 0 && mode === 'subtract')
      if (!confirm(`⚠️ This will bring stock below zero (${newBalance}). Continue?`)) return

    setLoading(true)
    try {
      const res = await api.post<any>('/items/stock-adjustment', {
        itemId:     item.itemId,
        channelId,
        quantity:   signedQty,   // send signed value to API
        reason,
        reasonCode,
        isOpening:  isOpening && ['SUPER_ADMIN', 'ADMIN', 'MANAGER_ADMIN'].includes(user?.role || ''),
      }, token!)

      if (res.status === 'PENDING_APPROVAL') {
        toast('⏳ Submitted for Manager Approval. Stock will update once approved.', { duration: 6000 })
      } else {
        toast.success('Stock adjustment recorded successfully.')
        onSuccess()
        onClose()
      }
    } catch (err) {
      toast.error('Failed: ' + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const isAuthorisedForOpening = ['SUPER_ADMIN', 'ADMIN', 'MANAGER_ADMIN'].includes(user?.role || '')

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 460 }} onClick={e => e.stopPropagation()}>
        <h3>⚙️ Adjust Stock: {item.itemName || item.itemId}</h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: 4 }}>
          Current Balance: <strong style={{ color: 'var(--text-primary)' }}>{item.availableQty}</strong>
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>

          {/* Add / Subtract Toggle */}
          <div className="form-group">
            <label>Adjustment Type</label>
            <div style={{ display: 'flex', gap: 0, borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)' }}>
              <button
                type="button"
                disabled={SUBTRACT_ONLY_REASONS.includes(reasonCode)}
                onClick={() => setMode('add')}
                style={{
                  flex: 1, padding: '10px 0', border: 'none', cursor: SUBTRACT_ONLY_REASONS.includes(reasonCode) ? 'not-allowed' : 'pointer',
                  background: mode === 'add' ? 'var(--success)' : 'var(--bg-secondary)',
                  color: mode === 'add' ? '#fff' : 'var(--text-muted)',
                  fontWeight: 700, fontSize: '0.9rem',
                  opacity: SUBTRACT_ONLY_REASONS.includes(reasonCode) ? 0.4 : 1,
                  transition: 'all 0.18s',
                }}
              >
                ＋ Add Stock
              </button>
              <button
                type="button"
                disabled={ADD_ONLY_REASONS.includes(reasonCode)}
                onClick={() => setMode('subtract')}
                style={{
                  flex: 1, padding: '10px 0', border: 'none', cursor: ADD_ONLY_REASONS.includes(reasonCode) ? 'not-allowed' : 'pointer',
                  background: mode === 'subtract' ? 'var(--danger)' : 'var(--bg-secondary)',
                  color: mode === 'subtract' ? '#fff' : 'var(--text-muted)',
                  fontWeight: 700, fontSize: '0.9rem',
                  opacity: ADD_ONLY_REASONS.includes(reasonCode) ? 0.4 : 1,
                  transition: 'all 0.18s',
                  borderLeft: '1px solid var(--border)',
                }}
              >
                － Subtract Stock
              </button>
            </div>
            {isForced && (
              <p style={{ fontSize: '0.75rem', color: 'var(--warning)', marginTop: 4 }}>
                ⚠️ Adjustment type is locked by the reason category selected.
              </p>
            )}
          </div>

          {/* Reason + Quantity */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label>Reason Category</label>
              <select className="input" value={reasonCode} onChange={e => setReasonCode(e.target.value)} required>
                <option value="SYSTEM_CORRECTION">System Correction</option>
                <option value="DAMAGED_IN_STORE">Damaged in Store</option>
                <option value="EXPIRED">Expired / Spoiled</option>
                <option value="THEFT_INVESTIGATION">Theft / Missing</option>
                <option value="FOUND_SURPLUS">Found Surplus</option>
                <option value="INITIAL_WALKTHROUGH">Initial Walkthrough</option>
              </select>
            </div>

            <div className="form-group">
              <label>Quantity (units) <span style={{ color: mode === 'add' ? 'var(--success)' : 'var(--danger)', fontWeight: 700 }}>
                {mode === 'add' ? '(+)' : '(−)'}
              </span></label>
              <input
                type="number"
                className="input"
                value={quantity}
                min={1}
                onChange={e => setQuantity(e.target.value === '' ? '' : Math.abs(Number(e.target.value)))}
                required
                placeholder="e.g. 10"
                style={{ borderColor: mode === 'add' ? 'var(--success)' : 'var(--danger)' }}
              />
            </div>
          </div>

          {/* Preview */}
          {qty > 0 && (
            <div style={{
              padding: '10px 14px', borderRadius: 'var(--radius-md)',
              background: newBalance < 0 ? 'rgba(239,68,68,0.1)' : 'rgba(var(--accent-rgb),0.08)',
              border: `1px solid ${newBalance < 0 ? 'var(--danger)' : 'var(--border)'}`,
              fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ color: 'var(--text-muted)' }}>New balance after adjustment:</span>
              <strong style={{ color: newBalance < 0 ? 'var(--danger)' : newBalance === 0 ? 'var(--warning)' : 'var(--success)', fontSize: '1rem' }}>
                {newBalance < 0 ? '⚠️ ' : ''}{newBalance} units
              </strong>
            </div>
          )}

          {/* Notes */}
          <div className="form-group">
            <label>Notes / Specifics <span style={{ color: 'var(--danger)' }}>*</span></label>
            <textarea
              className="input"
              placeholder={
                mode === 'subtract'
                  ? 'e.g. 3 units found damaged during shelf check on 28/03...'
                  : 'e.g. Received additional stock from HQ transfer...'
              }
              value={reason}
              onChange={e => setReason(e.target.value)}
              required
              style={{ minHeight: 80, resize: 'none' }}
            />
          </div>

          <div style={{ padding: '8px 12px', background: 'var(--bg-secondary)', borderRadius: 8, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            🔔 Adjustments &gt; 50 units or &gt; $500 value require Manager Approval.
          </div>

          {isAuthorisedForOpening && (
            <div className="form-group">
              <label style={{ display: 'flex', gap: 10, alignItems: 'center', cursor: 'pointer' }}>
                <input type="checkbox" checked={isOpening} onChange={e => setIsOpening(e.target.checked)} />
                <span style={{ fontWeight: 600 }}>Mark as Opening Stock</span>
              </label>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                * Opening stock does not trigger financial expenses.
              </p>
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading || qty === 0}>
              {loading ? 'Processing...' : `Submit ${mode === 'add' ? 'Addition' : 'Subtraction'}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
