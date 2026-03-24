'use client'
import { useState } from 'react'
import { api } from '@/lib/api-client'
import { useAuthStore } from '@/stores/auth.store'

interface Props {
  item: { itemId: string; itemName?: string; availableQty: number }
  channelId: string
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  initialIsOpening?: boolean
}

export function StockAdjustmentModal({ item, channelId, isOpen, onClose, onSuccess, initialIsOpening = false }: Props) {
  const token = useAuthStore((s) => s.accessToken)
  const user = useAuthStore((s) => s.user)
  const [quantity, setQuantity] = useState(0)
  const [reason, setReason] = useState('')
  const [reasonCode, setReasonCode] = useState('SYSTEM_CORRECTION')
  const [isOpening, setIsOpening] = useState(initialIsOpening)
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (quantity === 0) return alert('Quantity cannot be zero')
    if (!reason.trim()) return alert('Note is required')

    setLoading(true)
    try {
      const res = await api.post<any>('/items/stock-adjustment', {
        itemId: item.itemId,
        channelId,
        quantity,
        reason,
        reasonCode,
        isOpening: isOpening && user?.role === 'SUPER_ADMIN',
      }, token!)
      
      if (res.status === 'PENDING_APPROVAL') {
        alert('Threshold Exceeded: This adjustment has been submitted for Manager Approval.')
      } else {
        alert('Stock adjustment recorded successfully.')
      }
      
      onSuccess()
      onClose()
    } catch (err) {
      alert('Failed to adjust stock: ' + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const isAuthorisedForOpening = user?.role === 'SUPER_ADMIN'

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: 450 }}>
        <h3>Adjust Stock: {item.itemName || item.itemId}</h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Current System Balance: <strong>{item.availableQty}</strong></p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label>Reason Category</label>
              <select 
                className="input" 
                value={reasonCode} 
                onChange={e => setReasonCode(e.target.value)}
                required
              >
                <option value="SYSTEM_CORRECTION">System Correction</option>
                <option value="DAMAGED_IN_STORE">Damaged in Store</option>
                <option value="EXPIRED">Expired</option>
                <option value="THEFT_INVESTIGATION">Theft Investigation</option>
                <option value="INITIAL_WALKTHROUGH">Initial Walkthrough</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Quantity Change</label>
              <input 
                type="number" 
                className="input" 
                value={quantity} 
                onChange={e => setQuantity(Number(e.target.value))} 
                required 
                placeholder="+/-"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Notes / Specifics</label>
            <textarea 
              className="input" 
              placeholder="Provide context for this adjustment..." 
              value={reason} 
              onChange={e => setReason(e.target.value)} 
              required 
              style={{ minHeight: 80, resize: 'none' }}
            />
          </div>

          <div className="alert alert-info" style={{ fontSize: '0.8rem', padding: '8px 12px' }}>
            🔔 Note: Adjustments {'>'} 50 units or {'>'} $500 value require Manager Approval.
          </div>

          {isAuthorisedForOpening && (
            <div className="form-group">
              <label style={{ display: 'flex', gap: 10, alignItems: 'center', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={isOpening} 
                  onChange={e => setIsOpening(e.target.checked)} 
                />
                <span style={{ fontWeight: 600 }}>Mark as Opening Stock</span>
              </label>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                * Opening stock does not trigger financial expenses.
              </p>
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Processing...' : 'Submit Adjustment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
