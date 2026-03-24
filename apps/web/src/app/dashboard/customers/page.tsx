'use client'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api-client'
import { useAuthStore } from '@/stores/auth.store'
import { PhoneInput } from '@/components/shared/PhoneInput'

interface Customer {
  id: string
  name: string
  phone?: string
  email?: string
  tier: string
  creditLimit: number
  outstandingCredit: number
  loyaltyPoints: number
  createdAt: string
}

const EMPTY_CUSTOMER = { name: '', phone: '', email: '', tier: 'BRONZE', creditLimit: 1000 }

export default function CustomersPage() {
  const token = useAuthStore((s) => s.accessToken)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [current, setCurrent] = useState<Partial<Customer>>(EMPTY_CUSTOMER)
  const [saving, setSaving] = useState(false)

  const fetchCustomers = async () => {
    if (!token) return
    setLoading(true)
    try {
      const q = search ? `&search=${encodeURIComponent(search)}` : ''
      const res = await api.get<{ data: Customer[] }>(`/customers?limit=50${q}`, token)
      setCustomers(res.data ?? [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  useEffect(() => {
    const timer = setTimeout(() => fetchCustomers(), 300)
    return () => clearTimeout(timer)
  }, [token, search])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!current.name?.trim()) return alert('Name is required')
    setSaving(true)
    try {
      if (editMode && current.id) {
        await api.patch(`/customers/${current.id}`, current, token!)
      } else {
        await api.post('/customers', current, token!)
      }
      setShowModal(false)
      fetchCustomers()
    } catch (err) {
      alert('Failed to save: ' + (err as Error).message)
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete customer "${name}"?`)) return
    try {
      await api.delete(`/customers/${id}`, token!)
      fetchCustomers()
    } catch (err) { alert('Failed: ' + (err as Error).message) }
  }

  const fmt = (n: number) => new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(n)

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Customers</h1>
        <button className="btn btn-primary" onClick={() => { setCurrent(EMPTY_CUSTOMER); setEditMode(false); setShowModal(true) }}>+ Add Customer</button>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <input 
          className="input" 
          placeholder="🔍 Search name, phone, or email..." 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          style={{ maxWidth: 400 }}
        />
      </div>

      <div className="card">
        {loading ? <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div> : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Tier</th>
                <th>Credit Limit</th>
                <th>Outstanding</th>
                <th>Loyalty Points</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>No customers found.</td></tr>
              ) : customers.map(c => (
                <tr key={c.id}>
                  <td><strong>{c.name}</strong></td>
                  <td>
                    <div style={{ fontSize: '0.9rem' }}>{c.phone || '—'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.email || ''}</div>
                  </td>
                  <td><span className={`badge badge-${c.tier.toLowerCase()}`}>{c.tier}</span></td>
                  <td>{fmt(Number(c.creditLimit))}</td>
                  <td style={{ color: Number(c.outstandingCredit) > 0 ? 'var(--danger)' : 'var(--success)' }}>{fmt(Number(c.outstandingCredit))}</td>
                  <td><span className="badge badge-info">{c.loyaltyPoints} pts</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => { setCurrent(c); setEditMode(true); setShowModal(true) }}>Edit</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(c.id, c.name)} style={{ color: 'var(--danger)' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content card" style={{ maxWidth: 460 }}>
            <h3>{editMode ? '✏️ Edit Customer' : '👥 New Customer'}</h3>
            <form onSubmit={handleSubmit} style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="form-group">
                <label>Full Name *</label>
                <input className="input" value={current.name || ''} onChange={e => setCurrent({ ...current, name: e.target.value })} required />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <PhoneInput 
                    label="Phone *" 
                    value={current.phone || ''} 
                    onChange={val => setCurrent({ ...current, phone: val })} 
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Email</label>
                  <input type="email" className="input" value={current.email || ''} onChange={e => setCurrent({ ...current, email: e.target.value })} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Tier</label>
                  <select 
                    className="input" 
                    value={current.tier || 'BRONZE'} 
                    onChange={e => {
                      const tier = e.target.value
                      const limits = { BRONZE: 1000, SILVER: 5000, GOLD: 10000 }
                      setCurrent({ 
                        ...current, 
                        tier, 
                        // Only auto-update limit if it's currently 0 or matches a default
                        creditLimit: limits[tier as keyof typeof limits] || 0
                      })
                    }}
                  >
                    <option value="BRONZE">Bronze</option>
                    <option value="SILVER">Silver</option>
                    <option value="GOLD">Gold</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Credit Limit (KES)</label>
                  <input type="number" className="input" value={current.creditLimit ?? 0} onChange={e => setCurrent({ ...current, creditLimit: Number(e.target.value) })} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Customer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
