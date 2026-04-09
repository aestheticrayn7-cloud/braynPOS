'use client'
import { useState, useEffect } from 'react'
import { api } from '@/lib/api-client'
import { useAuthStore } from '@/stores/auth.store'
import { toast } from 'react-hot-toast'

interface SerialAudit {
  id:          string
  action:      string
  oldSerialNo: string
  newSerialNo: string
  reason:      string
  performedBy: string
  createdAt:   string
}

export default function SerialForensicsPage() {
  const token = useAuthStore(s => s.accessToken)
  const [saleId, setSaleId] = useState('')
  const [itemId, setItemId] = useState('')
  const [oldSerialId, setOldSerialId] = useState('')
  const [newSerialNo, setNewSerialNo] = useState('')
  const [reason, setReason] = useState('')
  const [history, setHistory] = useState<SerialAudit[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!token) return
    fetchHistory()
  }, [token])

  const fetchHistory = async () => {
    try {
      const res = await api.get<SerialAudit[]>('/audit/serial-history', token!)
      setHistory(res)
    } catch (err) {
      console.error(err)
    }
  }

  const handleSwap = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/audit/serial-swap', {
        saleId, itemId, oldSerialId: oldSerialId || null, newSerialNo, reason
      }, token!)
      toast.success('Serial swapped successfully')
      fetchHistory()
      setNewSerialNo('')
      setReason('')
    } catch (err: any) {
      toast.error('Failed: ' + (err.message || 'Check IDs and try again'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-fade-in" style={{ paddingBottom: 40 }}>
      <div className="page-header">
        <div>
          <h1>Forensic Serial Correction</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Authorized correction of finalized serialized sales</p>
        </div>
        <div className="badge badge-danger">High Authority Only</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 24 }}>
        
        {/* Correction Form */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 20 }}>🛠 Perform Serial Swap</h3>
          <form onSubmit={handleSwap} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label>Sale ID (UUID) *</label>
              <input className="input" required value={saleId} onChange={e => setSaleId(e.target.value)} placeholder="00000000-0000-0000-0000-000000000000" />
            </div>
            <div className="form-group">
              <label>Item ID (UUID) *</label>
              <input className="input" required value={itemId} onChange={e => setItemId(e.target.value)} placeholder="Item to correct" />
            </div>
            <div className="form-group">
              <label>Old Serial Record ID (Optional if adding new)</label>
              <input className="input" value={oldSerialId} onChange={e => setOldSerialId(e.target.value)} placeholder="UUID of the record to replace" />
            </div>
            <div className="form-group">
              <label>New Corrected Serial Number *</label>
              <input className="input" required value={newSerialNo} onChange={e => setNewSerialNo(e.target.value)} placeholder="Enter correct Serial No." />
            </div>
            <div className="form-group">
              <label>Reason for Correction *</label>
              <textarea className="input" required rows={2} value={reason} onChange={e => setReason(e.target.value)} placeholder="e.g. Typpo on intake, mistakenly swapped with item B" />
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? 'Processing Forensic Swap...' : 'Execute Serial Correction'}
            </button>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              ⚠️ This action will be permanently logged in the Forensic Audit Trail.
            </p>
          </form>
        </div>

        {/* Correction History */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 20 }}>📜 Swap History</h3>
          <div style={{ overflowY: 'auto', maxHeight: 500 }}>
            {history.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No historical corrections found.</div>
            ) : (
              history.map((h) => (
                <div key={h.id} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>{h.action}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{new Date(h.createdAt).toLocaleString()}</span>
                  </div>
                  <div style={{ fontWeight: 600 }}>{h.oldSerialNo} → {h.newSerialNo}</div>
                  <div style={{ fontStyle: 'italic', color: 'var(--text-secondary)', marginTop: 4 }}>&quot;{h.reason}&quot;</div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
