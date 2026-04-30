'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/stores/auth.store'
import { api } from '@/lib/api-client'
import { toast } from 'react-hot-toast'
import { ExportMenu } from '@/components/shared/ExportMenu'

interface ForensicRecord {
  id: string
  receiptNo: string
  createdAt: string
  saleType: string
  netAmount: number
  totalAmount: number
  discountAmount: number
  notes: string | null
  performedBy: string
  totalCost: number
  margin: number
}

export default function ForensicMarginAuditPage() {
  const token = useAuthStore((s) => s.accessToken)
  
  const [records, setRecords] = useState<ForensicRecord[]>([])
  const [loading, setLoading] = useState(true)
  
  const today = new Date().toISOString().split('T')[0]
  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate]     = useState(today)

  const fetchRecords = async () => {
    if (!token) return
    setLoading(true)
    try {
      const channelId = useAuthStore.getState().user?.channelId
      const url = `/reports/forensic-audit?startDate=${startDate}&endDate=${endDate}${channelId ? `&channelId=${channelId}` : ''}`
      const res = await api.get<ForensicRecord[]>(url, token)
      setRecords(res)
    } catch {
      toast.error('Failed to load forensic audit records')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchRecords() }, [token, startDate, endDate])

  const getExportData = async () => {
    return records.map(r => [
      new Date(r.createdAt).toLocaleString(),
      r.receiptNo,
      r.saleType,
      r.performedBy,
      r.totalAmount.toLocaleString(),
      r.totalCost.toLocaleString(),
      r.margin.toLocaleString(),
      r.notes || '-'
    ])
  }

  return (
    <div className="animate-fade-in" style={{ padding: '16px 20px' }}>
      
      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="page-header" style={{ marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>
            🔍 Forensic Margin Audit
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Auditing sales performed below cost price.
          </p>
        </div>
        <ExportMenu 
          title="Forensic Margin Audit"
          headers={['Date', 'Receipt', 'Type', 'Cashier', 'Revenue', 'Cost', 'Loss (Margin)', 'Justification']}
          getData={getExportData}
        />
      </div>

      {/* ── Filters ───────────────────────────────────────────────── */}
      <div className="card" style={{ marginBottom: 20, padding: '14px 16px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
            <label>Start Date</label>
            <input type="date" className="input" value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>
          <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
            <label>End Date</label>
            <input type="date" className="input" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>
          <button className="btn btn-primary" style={{ alignSelf: 'flex-end' }} onClick={fetchRecords}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* ── Report Card ───────────────────────────────────────────── */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Receipt No</th>
                <th>Cashier</th>
                <th style={{ textAlign: 'right' }}>Revenue</th>
                <th style={{ textAlign: 'right' }}>Cost</th>
                <th style={{ textAlign: 'right' }}>Loss / Margin</th>
                <th>Justification / Notes</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 60 }}>Generating audit report...</td></tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: 60 }}>
                    <div style={{ fontSize: '2rem', marginBottom: 12 }}>🛡️</div>
                    <div style={{ fontWeight: 600 }}>No loss-making sales found in this period.</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Your profit margins are well-guarded.</div>
                  </td>
                </tr>
              ) : (
                records.map(record => (
                  <tr key={record.id}>
                    <td style={{ fontSize: '0.85rem' }}>{new Date(record.createdAt).toLocaleString()}</td>
                    <td style={{ fontWeight: 700 }}>{record.receiptNo}</td>
                    <td>{record.performedBy}</td>
                    <td style={{ textAlign: 'right' }}>{record.netAmount.toLocaleString()}</td>
                    <td style={{ textAlign: 'right', color: 'var(--text-secondary)' }}>{record.totalCost.toLocaleString()}</td>
                    <td style={{ textAlign: 'right', color: 'var(--danger)', fontWeight: 700 }}>
                      {record.margin.toLocaleString()}
                    </td>
                    <td style={{ fontSize: '0.85rem', maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {record.notes || <span style={{ opacity: 0.5 }}>-</span>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Audit Stats Footer */}
        {!loading && records.length > 0 && (
          <div style={{ padding: 20, background: 'rgba(239, 68, 68, 0.05)', borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 40 }}>
              <div>
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Total Loss Incured</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--danger)' }}>
                  {records.reduce((sum, r) => sum + Number(r.margin), 0).toLocaleString()}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Overriden Sales Count</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{records.length}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
