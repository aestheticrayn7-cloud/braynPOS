'use client'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api-client'
import { useAuthStore } from '@/stores/auth.store'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

interface StockTakeItem {
  id: string
  itemId: string
  expectedQty?: number
  recordedQty: number | null
  discrepancy?: number
  item: { name: string; sku: string }
}

interface StockTake {
  id: string
  status: 'OPEN' | 'COMPLETED' | 'CANCELLED'
  items: StockTakeItem[]
  channel: { name: string }
}

export default function StockTakeDetailsPage() {
  const { id } = useParams()
  const token = useAuthStore((s) => s.accessToken)
  const user = useAuthStore((s) => s.user)
  const router = useRouter()
  
  const [take, setTake] = useState<StockTake | null>(null)
  const [loading, setLoading] = useState(true)
  const [recordingId, setRecordingId] = useState<string | null>(null)
  const [scanMode, setScanMode] = useState(false)
  const [scanBuffer, setScanBuffer] = useState('')

  const fetchDetails = async () => {
    if (!token || !id) return
    try {
      const res = await api.get<StockTake>(`/stock/take/${id}`, token)
      setTake(res)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchDetails() }, [token, id])

  const handleRecord = async (itemId: string, recordedQty: number) => {
    if (!token || !id) return
    setRecordingId(itemId)
    try {
      await api.post(`/stock/take/${id}/record`, { itemId, recordedQty }, token)
      fetchDetails()
    } catch (err) {
      alert('Failed to record: ' + (err as Error).message)
    } finally {
      setRecordingId(null)
    }
  }

  const handleComplete = async () => {
    if (!confirm('Complete this stock take? This will adjust system inventory to match counts.') || !token) return
    try {
      await api.post(`/stock/take/${id}/complete`, {}, token)
      router.push('/dashboard/stock/take')
    } catch (err) {
      alert('Failed: ' + (err as Error).message)
    }
  }

  if (loading) return <div>Loading...</div>
  if (!take) return <div>Stock take not found</div>

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Stock Take: {take.channel.name}</h1>
          <p className="text-muted">Status: <span className="badge">{take.status}</span></p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {take.status === 'OPEN' && (
            <button className={`btn ${scanMode ? 'btn-success' : 'btn-ghost'}`} onClick={() => setScanMode(!scanMode)}>
              {scanMode ? '📡 Scan Mode: ON' : '🔍 Scan Mode: OFF'}
            </button>
          )}
          {take.status === 'OPEN' && (
            <button className="btn btn-success" onClick={handleComplete}>✅ Complete & Adjust</button>
          )}
          <button className="btn btn-ghost" onClick={() => router.back()}>Back</button>
        </div>
      </div>

      {scanMode && take.status === 'OPEN' && (
        <div className="card" style={{ marginBottom: 20, padding: 24, textAlign: 'center', background: 'var(--bg-elevated)', border: '2px dashed var(--primary)' }}>
          <h3 style={{ marginBottom: 12 }}>Rapid Scan Mode</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>Scan item barcodes sequentially to auto-increment counts.</p>
          <input
            className="input"
            style={{ maxWidth: 400, fontSize: '1.2rem', textAlign: 'center' }}
            placeholder="Scan barcode here..."
            value={scanBuffer}
            onChange={(e) => setScanBuffer(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && scanBuffer) {
                const found = take.items.find(i => i.item.sku === scanBuffer || i.itemId === scanBuffer) 
                if (found) {
                  handleRecord(found.itemId, (found.recordedQty || 0) + 1)
                  setScanBuffer('')
                  toast.success(`Incremented ${found.item.name}`)
                } else {
                  alert('Item not found in this stock take list')
                  setScanBuffer('')
                }
              }
            }}
            autoFocus
          />
        </div>
      )}

      <div className="table-container card">
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>SKU</th>
              {user?.role !== 'STOREKEEPER' && <th>System Qty</th>}
              <th>Physical Count</th>
              {user?.role !== 'STOREKEEPER' && <th>Discrepancy</th>}
            </tr>
          </thead>
          <tbody>
            {take.items.map((i) => (
              <tr key={i.id}>
                <td>{i.item.name}</td>
                <td><code>{i.item.sku}</code></td>
                {user?.role !== 'STOREKEEPER' && <td>{i.expectedQty}</td>}
                <td>
                  {take.status === 'OPEN' ? (
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <input 
                        type="number" 
                        className="input input-sm" 
                        defaultValue={i.recordedQty ?? ''}
                        style={{ width: 80 }}
                        onBlur={(e) => {
                          const val = parseInt(e.target.value)
                          if (!isNaN(val) && val !== i.recordedQty) handleRecord(i.itemId, val)
                        }}
                      />
                      {recordingId === i.itemId && <span>⏳</span>}
                    </div>
                  ) : (
                    i.recordedQty ?? '—'
                  )}
                </td>
                {user?.role !== 'STOREKEEPER' && (
                  <td style={{ color: (i.discrepancy || 0) < 0 ? 'var(--danger)' : (i.discrepancy || 0) > 0 ? 'var(--success)' : 'inherit' }}>
                    {i.discrepancy ?? '—'}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
