'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api-client'
import { useAuthStore } from '@/stores/auth.store'
import { ExportMenu } from '@/components/shared/ExportMenu'

interface PurchaseLine { itemId: string; quantity: number; unitCost: number; item?: { name: string; sku: string } }
interface Purchase {
  id: string; purchaseNo: string; totalCost: unknown; status: string; paymentMethod?: string
  createdAt: string; supplier?: { id: string; name: string; phone?: string; contactName?: string }
  channel?: { name: string }; committedBy?: { username: string }
  lines?: PurchaseLine[]
}
interface Supplier { id: string; name: string; phone?: string; contactName?: string }

const statusColor: Record<string, string> = { COMMITTED: 'badge-success', DRAFT: 'badge-warning', CANCELLED: 'badge-danger' }

export default function PurchasesPage() {
  const token = useAuthStore((s) => s.accessToken)
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 })
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [selectedSupplier, setSelectedSupplier] = useState('')
  const [selectedChannel, setSelectedChannel] = useState('')
  const [channels, setChannels] = useState<{id: string, name: string}[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [tab, setTab] = useState<'all'|'supplier'>('all')

  // Default to today
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0])

  const fetchAll = async (p = 1) => {
    if (!token) return
    setLoading(true)
    try {
      const start = new Date(startDate)
      start.setHours(0,0,0,0)
      const end = new Date(endDate)
      end.setHours(23,59,59,999)

      const params = new URLSearchParams({
        limit:     '20',
        page:      p.toString(),
        startDate: start.toISOString(),
        endDate:   end.toISOString(),
      })
      if (selectedChannel) params.append('channelId', selectedChannel)

      const [pRes, sRes, cRes] = await Promise.all([
        api.get<{ data: Purchase[]; meta: typeof meta }>(`/purchases?${params.toString()}`, token),
        api.get<{ data: Supplier[] }>('/items/suppliers?limit=100', token),
        api.get<{ id: string, name: string }[]>('/channels', token),
      ])
      setPurchases(pRes.data ?? [])
      setMeta(pRes.meta ?? { total: 0, page: 1, totalPages: 1 })
      setSuppliers(sRes.data ?? [])
      setChannels(Array.isArray(cRes) ? cRes : [])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const fetchBySupplier = async (supplierId: string) => {
    if (!token || !supplierId) return
    setLoading(true)
    try {
      const start = new Date(startDate)
      start.setHours(0,0,0,0)
      const end = new Date(endDate)
      end.setHours(23,59,59,999)

      const params = new URLSearchParams({
        supplierId: supplierId,
        limit:     '50',
        startDate: start.toISOString(),
        endDate:   end.toISOString(),
      })
      if (selectedChannel) params.append('channelId', selectedChannel)

      const res = await api.get<{ data: Purchase[] }>(`/purchases?${params.toString()}`, token)
      setPurchases(res.data ?? [])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const getExportData = async () => {
    const start = new Date(startDate)
    start.setHours(0,0,0,0)
    const end = new Date(endDate)
    end.setHours(23,59,59,999)

    const params = new URLSearchParams({
      limit:     '5000',
      startDate: start.toISOString(),
      endDate:   end.toISOString(),
    })
    
    if (selectedChannel) params.append('channelId', selectedChannel)
    if (tab === 'supplier' && selectedSupplier) params.append('supplierId', selectedSupplier)

    const res = await api.get<{ data: Purchase[] }>(`/purchases?${params.toString()}`, token!)
    return res.data.map(p => [
      p.purchaseNo,
      p.supplier?.name || '—',
      p.channel?.name || '—',
      p.lines?.length || 0,
      p.totalCost,
      p.status,
      new Date(p.createdAt).toLocaleString()
    ])
  }

  useEffect(() => { fetchAll(page) }, [token, page, startDate, endDate, selectedChannel])
  useEffect(() => {
    if (tab === 'supplier' && selectedSupplier) fetchBySupplier(selectedSupplier)
    else if (tab === 'all') fetchAll(1)
  }, [tab, selectedSupplier, startDate, endDate])

  const fmt = (n: unknown) => new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(Number(n ?? 0))
  const fmtDT = (d: string) => new Date(d).toLocaleString()

  const filteredPurchases = purchases.filter(p => 
    !search || 
    p.purchaseNo.toLowerCase().includes(search.toLowerCase()) || 
    p.supplier?.name?.toLowerCase().includes(search.toLowerCase())
  )

  const bySupplierStats = suppliers.map(s => ({
    ...s,
    count: purchases.filter(p => p.supplier?.id === s.id).length,
    total: purchases.filter(p => p.supplier?.id === s.id).reduce((sum, p) => sum + Number(p.totalCost ?? 0), 0),
  }))

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ flexWrap: 'wrap', gap: 12 }}>
        <h1>Purchases</h1>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <ExportMenu 
            title="Purchases Report"
            headers={['Purchase No', 'Supplier', 'Channel', 'Lines', 'Total', 'Status', 'Date']}
            getData={getExportData}
          />
          <Link href="/dashboard/purchases/lpo" className="btn btn-ghost">📝 LPOs</Link>
          <Link href="/dashboard/purchases/new" className="btn btn-primary">+ New Purchase</Link>
        </div>
      </div>

      {/* Stats */}
      <div className="stat-grid" style={{ marginBottom: 20 }}>
        <div className="stat-card">
          <div className="stat-value">{meta.total}</div>
          <div className="stat-label">Total Purchases</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{suppliers.length}</div>
          <div className="stat-label">Active Suppliers</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{fmt(purchases.reduce((s, p) => s + Number(p.totalCost ?? 0), 0))}</div>
          <div className="stat-label">Total Value (This View)</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <input 
          className="input" 
          placeholder="🔍 Search by Purchase # or Supplier..." 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          style={{ maxWidth: 300, flex: 1 }}
        />
        {['SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER'].includes(useAuthStore.getState().user?.role || '') && (
          <select 
            className="input" 
            style={{ width: 180 }} 
            value={selectedChannel} 
            onChange={e => setSelectedChannel(e.target.value)}
          >
            <option value="">All Channels</option>
            {channels.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        )}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>From:</label>
          <input type="date" className="input" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ width: 150 }} />
          <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>To:</label>
          <input type="date" className="input" value={endDate} onChange={e => setEndDate(e.target.value)} style={{ width: 150 }} />
          <button className="btn btn-ghost btn-sm" onClick={() => {
            const today = new Date().toISOString().split('T')[0]
            setStartDate(today)
            setEndDate(today)
          }}>Today</button>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className={`btn ${tab === 'all' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTab('all')}>All Purchases</button>
          <button className={`btn ${tab === 'supplier' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTab('supplier')}>By Supplier</button>
        </div>
      </div>

      {tab === 'supplier' && (
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 20 }}>
          {/* Supplier List */}
          <div className="card" style={{ height: 'fit-content' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>Suppliers</div>
            {suppliers.length === 0 ? (
              <div style={{ padding: 24, color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.9rem' }}>No suppliers found</div>
            ) : suppliers.map(s => (
              <div key={s.id} onClick={() => setSelectedSupplier(s.id)}
                style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid var(--border)', background: selectedSupplier === s.id ? 'var(--bg-elevated)' : undefined, borderLeft: selectedSupplier === s.id ? '3px solid var(--accent)' : '3px solid transparent' }}>
                <div style={{ fontWeight: 600 }}>{s.name}</div>
                {s.contactName && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{s.contactName}</div>}
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
                  {purchases.filter(p => p.supplier?.id === s.id).length} purchases
                </div>
              </div>
            ))}
          </div>

          {/* Purchases for selected supplier */}
          <div className="card">
            {!selectedSupplier ? (
              <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>Select a supplier to view their purchase records.</div>
            ) : loading ? (
              <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div>
            ) : (
              <>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{suppliers.find(s => s.id === selectedSupplier)?.name}</strong>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {purchases.filter(p => p.supplier?.id === selectedSupplier).length} records · {fmt(purchases.filter(p => p.supplier?.id === selectedSupplier).reduce((s, p) => s + Number(p.totalCost ?? 0), 0))} total
                  </span>
                </div>
                <table className="table">
                  <thead><tr><th>Purchase No</th><th>Channel</th><th>Lines</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th></tr></thead>
                  <tbody>
                    {filteredPurchases.filter(p => p.supplier?.id === selectedSupplier).length === 0 ? (
                      <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>No purchases found matching &quot;{search}&quot;.</td></tr>
                    ) : filteredPurchases.filter(p => p.supplier?.id === selectedSupplier).map(p => (
                      <>
                        <tr key={p.id} style={{ cursor: 'pointer' }} onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}>
                          <td><strong>{p.purchaseNo}</strong></td>
                          <td>{p.channel?.name || '—'}</td>
                          <td>{p.lines?.length ?? '—'} items</td>
                          <td style={{ fontWeight: 600 }}>{fmt(p.totalCost)}</td>
                          <td>{p.paymentMethod || '—'}</td>
                          <td><span className={`badge ${statusColor[p.status] || 'badge-info'}`}>{p.status}</span></td>
                          <td style={{ fontSize: '0.82rem' }}>{fmtDT(p.createdAt)}</td>
                        </tr>
                        {expandedId === p.id && p.lines && (
                          <tr key={p.id + '-detail'} style={{ background: 'var(--bg-elevated)' }}>
                            <td colSpan={7} style={{ padding: '12px 20px' }}>
                              <strong style={{ display: 'block', marginBottom: 8 }}>Items Received:</strong>
                              <table style={{ width: '100%', fontSize: '0.85rem' }}>
                                <thead><tr><th>Item</th><th>SKU</th><th>Qty</th><th>Unit Cost</th><th>Subtotal</th></tr></thead>
                                <tbody>
                                  {p.lines.map((l, i) => (
                                    <tr key={i}>
                                      <td>{l.item?.name || l.itemId}</td>
                                      <td><code>{l.item?.sku || '—'}</code></td>
                                      <td>{l.quantity}</td>
                                      <td>{fmt(l.unitCost)}</td>
                                      <td>{fmt(l.quantity * l.unitCost)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                              {p.committedBy && <p style={{ marginTop: 8, fontSize: '0.82rem', color: 'var(--text-muted)' }}>Committed by: {p.committedBy.username}</p>}
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
      )}

      {tab === 'all' && (
        <div className="card">
          {loading ? <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div> : (
            <table className="table">
              <thead><tr><th>Purchase No</th><th>Supplier</th><th>Channel</th><th>Items</th><th>Total</th><th>Status</th><th>Date & Time</th></tr></thead>
              <tbody>
                {filteredPurchases.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>No purchases found matching &quot;{search}&quot;.</td></tr>
                ) : filteredPurchases.map(p => (
                  <tr key={p.id} style={{ cursor: 'pointer' }} onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}>
                    <td><strong>{p.purchaseNo}</strong></td>
                    <td>{p.supplier?.name || '—'}</td>
                    <td>{p.channel?.name || '—'}</td>
                    <td>{p.lines?.length ?? '—'} items</td>
                    <td style={{ fontWeight: 600 }}>{fmt(p.totalCost)}</td>
                    <td><span className={`badge ${statusColor[p.status] || 'badge-info'}`}>{p.status}</span></td>
                    <td style={{ fontSize: '0.82rem', whiteSpace: 'nowrap' }}>{fmtDT(p.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {meta.totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: 16, borderTop: '1px solid var(--border)' }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>← Prev</button>
              <span style={{ padding: '6px 12px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Page {page} / {meta.totalPages}</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))} disabled={page === meta.totalPages}>Next →</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
