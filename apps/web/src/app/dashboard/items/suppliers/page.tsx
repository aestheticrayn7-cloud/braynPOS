'use client'
import { useState, useEffect } from 'react'
import { api } from '@/lib/api-client'
import { useAuthStore } from '@/stores/auth.store'
import { useRouter } from 'next/navigation'
import { PhoneInput } from '@/components/shared/PhoneInput'

interface Supplier {
  id: string
  name: string
  contactName?: string
  email?: string
  phone?: string
  address?: string
  taxPin?: string
  paymentTerms?: string
  createdAt: string
}

const EMPTY_SUPPLIER = { name: '', contactName: '', email: '', phone: '', address: '', taxPin: '', paymentTerms: '' }

export default function SuppliersPage() {
  const token = useAuthStore((s) => s.accessToken)
  const router = useRouter()
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentSupplier, setCurrentSupplier] = useState<Partial<Supplier>>(EMPTY_SUPPLIER)
  const [saving, setSaving] = useState(false)

  const fetchSuppliers = async () => {
    if (!token) return
    try {
      const data = await api.get<Supplier[]>('/items/suppliers', token)
      setSuppliers(data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchSuppliers() }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentSupplier.name?.trim()) return alert('Supplier name is required')
    setSaving(true)
    try {
      const payload: Record<string, unknown> = { name: currentSupplier.name }
      if (currentSupplier.contactName) payload.contactName = currentSupplier.contactName
      if (currentSupplier.email) payload.email = currentSupplier.email
      if (currentSupplier.phone) payload.phone = currentSupplier.phone
      if (currentSupplier.address) payload.address = currentSupplier.address
      if (currentSupplier.taxPin) payload.taxPin = currentSupplier.taxPin
      if (currentSupplier.paymentTerms) payload.paymentTerms = currentSupplier.paymentTerms

      if (editMode && currentSupplier.id) {
        await api.patch(`/items/suppliers/${currentSupplier.id}`, payload, token!)
      } else {
        await api.post('/items/suppliers', payload, token!)
      }
      setShowModal(false)
      setCurrentSupplier(EMPTY_SUPPLIER)
      setEditMode(false)
      fetchSuppliers()
    } catch (err) {
      alert('❌ Failed to save supplier: ' + (err as Error).message)
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete supplier "${name}"? This cannot be undone.`)) return
    try {
      await api.delete(`/items/suppliers/${id}`, token!)
      setSuppliers(prev => prev.filter(s => s.id !== id))
    } catch (err) {
      alert('❌ Failed to delete supplier: ' + (err as Error).message)
    }
  }

  const openEdit = (s: Supplier) => {
    setCurrentSupplier(s)
    setEditMode(true)
    setShowModal(true)
  }

  const openAdd = () => {
    setCurrentSupplier(EMPTY_SUPPLIER)
    setEditMode(false)
    setShowModal(true)
  }

  const filtered = suppliers.filter(s => 
    !search || 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.contactName?.toLowerCase().includes(search.toLowerCase()) ||
    s.phone?.includes(search)
  )

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => router.back()}>←</button>
          <h1>Suppliers</h1>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Supplier</button>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <input 
          className="input" 
          placeholder="🔍 Search suppliers..." 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          style={{ maxWidth: 400 }}
        />
      </div>

      <div className="card">
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading suppliers...</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Payment Terms</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>No suppliers matching &quot;{search}&quot;.</td></tr>
              ) : filtered.map(s => (
                <tr key={s.id}>
                  <td><strong>{s.name}</strong></td>
                  <td>{s.contactName || '—'}</td>
                  <td>{s.email || '—'}</td>
                  <td>{s.phone || '—'}</td>
                  <td>{s.paymentTerms || '—'}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => openEdit(s)} style={{ marginRight: 6 }}>✏️ Edit</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(s.id, s.name)} style={{ color: 'var(--danger)' }}>🗑️ Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content card" style={{ maxWidth: 480 }}>
            <h3>{editMode ? '✏️ Edit Supplier' : '+ New Supplier'}</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
              <div className="form-group">
                <label>Supplier Name *</label>
                <input className="input" value={currentSupplier.name || ''} onChange={e => setCurrentSupplier({ ...currentSupplier, name: e.target.value })} required placeholder="e.g. Global Electronics Inc" />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Contact Person</label>
                  <input className="input" value={currentSupplier.contactName || ''} onChange={e => setCurrentSupplier({ ...currentSupplier, contactName: e.target.value })} placeholder="e.g. John Doe" />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <PhoneInput 
                    label="Phone *" 
                    value={currentSupplier.phone || ''} 
                    onChange={val => setCurrentSupplier({ ...currentSupplier, phone: val })} 
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" className="input" value={currentSupplier.email || ''} onChange={e => setCurrentSupplier({ ...currentSupplier, email: e.target.value })} placeholder="supplier@company.com" />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input className="input" value={currentSupplier.address || ''} onChange={e => setCurrentSupplier({ ...currentSupplier, address: e.target.value })} placeholder="Physical address" />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Tax PIN (KRA)</label>
                  <input className="input" value={currentSupplier.taxPin || ''} onChange={e => setCurrentSupplier({ ...currentSupplier, taxPin: e.target.value })} placeholder="A001234567B" />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Payment Terms</label>
                  <select className="input" value={currentSupplier.paymentTerms || ''} onChange={e => setCurrentSupplier({ ...currentSupplier, paymentTerms: e.target.value })}>
                    <option value="">Select...</option>
                    <option value="Cash on Delivery">Cash on Delivery</option>
                    <option value="Net 7">Net 7</option>
                    <option value="Net 14">Net 14</option>
                    <option value="Net 30">Net 30</option>
                    <option value="Net 60">Net 60</option>
                    <option value="Prepaid">Prepaid</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editMode ? 'Update Supplier' : 'Create Supplier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
