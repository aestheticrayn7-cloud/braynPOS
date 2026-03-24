'use client'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api-client'
import { useAuthStore } from '@/stores/auth.store'

interface Serial { id: string; serialNo: string; status: string; item?: { name: string; sku: string }; channel?: { name: string }; createdAt: string }
interface Item { id: string; name: string; sku: string }
interface Channel { id: string; name: string }

const STATUS_COLORS: Record<string, string> = {
  AVAILABLE: 'badge-success', SOLD: 'badge-primary', TRANSFERRED: 'badge-info',
  WRITTEN_OFF: 'badge-danger', RESERVED: 'badge-warning'
}

export default function SerialsPage() {
  const token = useAuthStore((s) => s.accessToken)
  const user = useAuthStore((s) => s.user)
  const [serials, setSerials] = useState<Serial[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [channels, setChannels] = useState<Channel[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedItem, setSelectedItem] = useState('')
  const [selectedChannel, setSelectedChannel] = useState('')
  const [lookup, setLookup] = useState('')
  const [lookupResult, setLookupResult] = useState<Serial | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [addForm, setAddForm] = useState({ serialNo: '', itemId: '', channelId: '' })
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [lookupResults, setLookupResults] = useState<Serial[]>([])
  const [showLookupResults, setShowLookupResults] = useState(false)

  useEffect(() => {
    if (!token) return
    Promise.all([
      api.get<{ data: Item[] }>('/items?limit=100', token),
      api.get<Channel[]>('/channels', token),
    ]).then(([iRes, cRes]) => {
      setItems(iRes.data ?? [])
      const chs = Array.isArray(cRes) ? cRes : [cRes as unknown as Channel]
      setChannels(chs)
      const ch = user?.channelId || (chs.length > 0 ? chs[0].id : '')
      setSelectedChannel(ch)
      setAddForm(f => ({ ...f, channelId: ch }))
    }).catch(console.error)
  }, [token, user?.channelId])

  const fetchSerials = async () => {
    if (!selectedItem || !token) return
    setLoading(true)
    try {
      const ch = selectedChannel ? `&channelId=${selectedChannel}` : ''
      const res = await api.get<Serial[]>(`/serials?itemId=${selectedItem}${ch}`, token)
      setSerials(Array.isArray(res) ? res : [])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { if (selectedItem) fetchSerials() }, [selectedItem, selectedChannel])
  const [searching, setSearching] = useState(false)

  // Real-time lookup with debounce
  useEffect(() => {
    if (!lookup || !token) {
      setLookupResults([])
      return
    }

    const timer = setTimeout(async () => {
      setSearching(true)
      try {
        const res = await api.get<Serial[]>(`/serials/search?q=${encodeURIComponent(lookup)}`, token)
        setLookupResults(Array.isArray(res) ? res : [])
        setShowLookupResults(true)
      } catch (err) {
        console.error('Search failed', err)
      } finally {
        setSearching(false)
      }
    }, 150)

    return () => clearTimeout(timer)
  }, [lookup, token])

  const selectSerial = (s: Serial) => {
    setLookupResult(s)
    setLookup(s.serialNo)
    setShowLookupResults(false)
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!addForm.serialNo || !addForm.itemId || !addForm.channelId) return alert('Fill all fields')
    setSaving(true)
    try {
      await api.post('/serials', addForm, token!)
      setShowAddModal(false)
      setAddForm(f => ({ ...f, serialNo: '' }))
      fetchSerials()
    } catch (err) { alert('Failed: ' + (err as Error).message) }
    finally { setSaving(false) }
  }

  const handleWriteOff = async (id: string, sn: string) => {
    if (!confirm(`Write off serial ${sn}? This cannot be undone.`)) return
    try {
      await api.post(`/serials/${id}/write-off`, {}, token!)
      fetchSerials()
    } catch (err) { alert('Failed: ' + (err as Error).message) }
  }

  const filtered = serials.filter(s => !search || s.serialNo.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Serial Numbers</h1>
        <button className="btn btn-primary" onClick={() => { setAddForm(f => ({ ...f, itemId: selectedItem })); setShowAddModal(true) }}>+ Add Serial</button>
      </div>

      {/* Quick Lookup */}
      <div className="card" style={{ marginBottom: 20, padding: '16px 20px', position: 'relative' }}>
        <strong style={{ marginBottom: 10, display: 'block' }}>🔍 Quick Serial Lookup</strong>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ flex: 1, maxWidth: 360, position: 'relative' }}>
            <input 
              className="input" 
              style={{ width: '100%' }} 
              placeholder="Type to search serial numbers..." 
              value={lookup} 
              onChange={e => { setLookup(e.target.value); setShowLookupResults(true); }}
              onFocus={() => lookupResults.length > 0 && setShowLookupResults(true)}
            />
            {searching && (
              <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)' }}>
                <div className="animate-spin" style={{ width: 16, height: 16, border: '2px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%' }} />
              </div>
            )}
            
            {showLookupResults && lookupResults.length > 0 && (
              <div 
                className="card" 
                style={{ 
                  position: 'absolute', 
                  top: '100%', 
                  left: 0, 
                  right: 0, 
                  zIndex: 100, 
                  marginTop: 4, 
                  padding: 8, 
                  maxHeight: 250, 
                  overflowY: 'auto',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-lg)'
                }}
              >
                {lookupResults.map(s => (
                  <div 
                    key={s.id} 
                    className="clickable-item" 
                    style={{ 
                      padding: '8px 12px', 
                      borderRadius: 6, 
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2
                    }}
                    onClick={() => selectSerial(s)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong>{s.serialNo}</strong>
                      <span className={`badge badge-sm ${STATUS_COLORS[s.status] || 'badge-info'}`} style={{ fontSize: '0.7rem' }}>{s.status}</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {s.item?.name} · {s.channel?.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {lookup && (
            <button className="btn btn-ghost" onClick={() => { setLookup(''); setLookupResult(null); setLookupResults([]); }}>Clear</button>
          )}
        </div>
        {lookupResult && (
          <div style={{ marginTop: 12, padding: 12, background: 'var(--bg-elevated)', borderRadius: 8 }}>
            <strong>{lookupResult.serialNo}</strong>
            <span style={{ margin: '0 12px', color: 'var(--text-muted)' }}>·</span>
            <span className={`badge ${STATUS_COLORS[lookupResult.status] || 'badge-info'}`}>{lookupResult.status}</span>
            {lookupResult.item && <span style={{ marginLeft: 12, color: 'var(--text-muted)' }}>{lookupResult.item.name} ({lookupResult.item.sku})</span>}
            {lookupResult.channel && <span style={{ marginLeft: 12, color: 'var(--text-muted)' }}>@ {lookupResult.channel.name}</span>}
          </div>
        )}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <select className="input" style={{ flex: 1, minWidth: 200 }} value={selectedItem} onChange={e => setSelectedItem(e.target.value)}>
          <option value="">Select an item to view serials...</option>
          {items.map(it => <option key={it.id} value={it.id}>{it.name} ({it.sku})</option>)}
        </select>
        <select className="input" style={{ width: 200 }} value={selectedChannel} onChange={e => setSelectedChannel(e.target.value)}>
          <option value="">All Channels</option>
          {channels.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        {serials.length > 0 && (
          <input className="input" style={{ width: 200 }} placeholder="Filter serials..." value={search} onChange={e => setSearch(e.target.value)} />
        )}
      </div>

      {/* Stats */}
      {serials.length > 0 && (
        <div className="stat-grid" style={{ marginBottom: 16 }}>
          {['AVAILABLE', 'SOLD', 'TRANSFERRED', 'WRITTEN_OFF'].map(s => (
            <div className="stat-card" key={s}>
              <div className="stat-value">{serials.filter(sr => sr.status === s).length}</div>
              <div className="stat-label">{s}</div>
            </div>
          ))}
        </div>
      )}

      <div className="card">
        {!selectedItem ? (
          <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>Select an item above to view its serial numbers.</div>
        ) : loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>Loading...</div>
        ) : (
          <table className="table">
            <thead><tr><th>Serial No</th><th>Status</th><th>Channel</th><th>Date Added</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>No serial numbers found.</td></tr>
              ) : filtered.map(s => (
                <tr key={s.id}>
                  <td><code style={{ fontSize: '0.9rem' }}>{s.serialNo}</code></td>
                  <td><span className={`badge ${STATUS_COLORS[s.status] || 'badge-info'}`}>{s.status}</span></td>
                  <td>{s.channel?.name || '—'}</td>
                  <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                  <td style={{ textAlign: 'right' }}>
                    {s.status === 'AVAILABLE' && (
                      <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} onClick={() => handleWriteOff(s.id, s.serialNo)}>Write Off</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content card" style={{ maxWidth: 400 }}>
            <h3>➕ Add Serial Number</h3>
            <form onSubmit={handleAdd} style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="form-group">
                <label>Item *</label>
                <select className="input" value={addForm.itemId} onChange={e => setAddForm({ ...addForm, itemId: e.target.value })} required>
                  <option value="">Select item...</option>
                  {items.map(it => <option key={it.id} value={it.id}>{it.name} ({it.sku})</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Channel *</label>
                <select className="input" value={addForm.channelId} onChange={e => setAddForm({ ...addForm, channelId: e.target.value })} required>
                  {channels.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Serial Number *</label>
                <input className="input" value={addForm.serialNo} onChange={e => setAddForm({ ...addForm, serialNo: e.target.value })} required placeholder="e.g. SN-ABC-12345" />
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Adding...' : 'Add Serial'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
