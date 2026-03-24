'use client'
import { useState, useEffect } from 'react'
import { api } from '@/lib/api-client'
import { useAuthStore } from '@/stores/auth.store'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

interface Brand {
  id: string
  name: string
  _count?: { items: number }
}

export default function BrandsPage() {
  const token = useAuthStore((s) => s.accessToken)
  const router = useRouter()
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentBrand, setCurrentBrand] = useState<Partial<Brand>>({ name: '' })

  const fetchBrands = async () => {
    if (!token) return
    try {
      const data = await api.get<Brand[]>('/items/brands', token)
      setBrands(data)
    } catch (err) {
      console.error('Failed to fetch brands:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBrands()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentBrand.name?.trim()) return toast.error('Brand name is required')
    
    const payload = {
      name: currentBrand.name.trim(),
    }

    try {
      if (editMode && currentBrand.id) {
        await api.patch(`/items/brands/${currentBrand.id}`, payload, token!)
      } else {
        await api.post('/items/brands', payload, token!)
      }
      toast.success('Brand saved successfully')
      setShowModal(false)
      setCurrentBrand({ name: '' })
      setEditMode(false)
      fetchBrands()
    } catch (err) {
      toast.error('Failed to save brand: ' + (err as Error).message)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this brand?')) return
    try {
      await api.delete(`/items/brands/${id}`, token!)
      toast.success('Brand deleted')
      fetchBrands()
    } catch (err) {
      toast.error('Failed to delete brand: ' + (err as Error).message)
    }
  }

  const openEdit = (brand: Brand) => {
    setCurrentBrand(brand)
    setEditMode(true)
    setShowModal(true)
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => router.back()}>←</button>
          <h1>Item Brands</h1>
        </div>
        <button className="btn btn-primary" onClick={() => { setCurrentBrand({ name: '' }); setEditMode(false); setShowModal(true) }}>
          + Add Brand
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Items (Count)</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {brands.length === 0 ? (
                <tr><td colSpan={3} style={{ textAlign: 'center' }}>No brands created yet.</td></tr>
              ) : brands.map(b => (
                <tr key={b.id}>
                  <td><strong>{b.name}</strong></td>
                  <td><span className="badge badge-info">{b._count?.items || 0} items</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => openEdit(b)} style={{ marginRight: 8 }}>Edit</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(b.id)} style={{ color: 'var(--danger)' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content card" style={{ maxWidth: 400 }}>
            <h3>{editMode ? 'Edit Brand' : 'New Brand'}</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
              <div className="form-group">
                <label>Brand Name</label>
                <input 
                  className="input" 
                  value={currentBrand.name || ''} 
                  onChange={e => setCurrentBrand({...currentBrand, name: e.target.value})} 
                  required 
                  placeholder="e.g. Samsung"
                  autoFocus
                />
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editMode ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
