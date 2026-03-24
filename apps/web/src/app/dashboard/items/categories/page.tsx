'use client'
import { useState, useEffect } from 'react'
import { api } from '@/lib/api-client'
import { useAuthStore } from '@/stores/auth.store'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

interface Category {
  id: string
  name: string
  parentId: string | null
  children?: Category[]
  _count?: { items: number }
}

export default function CategoriesPage() {
  const token = useAuthStore((s) => s.accessToken)
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<Partial<Category>>({ name: '', parentId: null })

  useEffect(() => {
    fetchCategories()
  }, [token])

  const fetchCategories = async () => {
    if (!token) return
    try {
      const data = await api.get<Category[]>('/items/categories', token)
      setCategories(data)
    } catch (err) {
      console.error('Failed to fetch categories:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentCategory.name?.trim()) return toast.error('Category name is required')
    
    const payload = {
      name: currentCategory.name.trim(),
      parentId: currentCategory.parentId || undefined,
    }

    try {
      if (editMode && currentCategory.id) {
        await api.patch(`/items/categories/${currentCategory.id}`, payload, token!)
      } else {
        await api.post('/items/categories', payload, token!)
      }
      toast.success('Category saved successfully')
      setShowModal(false)
      setCurrentCategory({ name: '', parentId: null })
      setEditMode(false)
      fetchCategories()
    } catch (err) {
      toast.error('Failed to save category: ' + (err as Error).message)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return
    try {
      await api.delete(`/items/categories/${id}`, token!)
      toast.success('Category deleted')
      fetchCategories()
    } catch (err) {
      toast.error('Failed to delete category: ' + (err as Error).message)
    }
  }

  const openEdit = (cat: Category) => {
    setCurrentCategory(cat)
    setEditMode(true)
    setShowModal(true)
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => router.back()}>←</button>
          <h1>Item Categories</h1>
        </div>
        <button className="btn btn-primary" onClick={() => { setCurrentCategory({ name: '', parentId: null }); setEditMode(false); setShowModal(true) }}>
          + Add Category
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
                <th>Parent</th>
                <th>Items (Count)</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign: 'center' }}>No categories created yet.</td></tr>
              ) : categories.map(c => (
                <tr key={c.id}>
                  <td><strong>{c.name}</strong></td>
                  <td>{categories.find(p => p.id === c.parentId)?.name || '—'}</td>
                  <td><span className="badge badge-info">{c._count?.items || 0} items</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => openEdit(c)} style={{ marginRight: 8 }}>Edit</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(c.id)} style={{ color: 'var(--danger)' }}>Delete</button>
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
            <h3>{editMode ? 'Edit Category' : 'New Category'}</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
              <div className="form-group">
                <label>Category Name</label>
                <input 
                  className="input" 
                  value={currentCategory.name || ''} 
                  onChange={e => setCurrentCategory({...currentCategory, name: e.target.value})} 
                  required 
                  placeholder="e.g. Electronics"
                />
              </div>
              <div className="form-group">
                <label>Parent Category (Optional)</label>
                <select 
                  className="input" 
                  value={currentCategory.parentId || ''} 
                  onChange={e => setCurrentCategory({...currentCategory, parentId: e.target.value || null})}
                >
                  <option value="">None (Top Level)</option>
                  {categories
                    .filter(c => c.id !== currentCategory.id) // Prevent circular ref
                    .map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
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
