'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api-client'
import { useAuthStore } from '@/stores/auth.store'

interface Category { id: string; name: string; parentId: string | null; children?: Category[] }
interface Brand { id: string; name: string }
interface Supplier { id: string; name: string }

export default function NewItemPage() {
  const router = useRouter()
  const token = useAuthStore((s) => s.accessToken)
  const user = useAuthStore((s) => s.user)
  
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(false)
  const [openingWindowActive, setOpeningWindowActive] = useState(false)
  
  const initialFormData = {
    sku: '',
    barcode: '',
    name: '',
    description: '',
    categoryId: '',
    brandId: '',
    supplierId: '',
    unitOfMeasure: 'PCS',
    retailPrice: 0,
    wholesalePrice: 0,
    minRetailPrice: 0,
    minWholesalePrice: 0,
    reorderLevel: 5,
    isActive: true,
    initialStock: 0,
  }

  const [formData, setFormData] = useState(initialFormData)

  const persistenceKey = 'brayn_new_item_form'

  const set = (field: string, val: unknown) => setFormData(prev => ({ ...prev, [field]: val }))

  const fetchData = async () => {
    if (!token) return
    try {
      const [cats, brnds, supps, chRes] = await Promise.all([
        api.get<Category[]>('/items/categories', token),
        api.get<Brand[]>('/items/brands', token),
        api.get<Supplier[]>('/items/suppliers', token),
        api.get<any>('/channels', token),
      ])
      setCategories(cats)
      setBrands(brnds)
      setSuppliers(supps)

      const currentChannelId = user?.channelId || (Array.isArray(chRes) ? chRes[0]?.id : chRes?.id)
      
      // Check global window active from dashboard settings
      const settings = await api.get<any>('/dashboard/settings', token)
      const globalActive = !!settings.advancedSettings?.globalOpeningStockActive
      
      if (currentChannelId) {
        const ch = await api.get<any>(`/channels/${currentChannelId}`, token)
        const channelActive = !!ch.featureFlags?.openingStockWindowActive
        
        // Show only if global is active AND (channel is active OR user is super admin)
        setOpeningWindowActive(globalActive && (channelActive || user?.role === 'SUPER_ADMIN'))
      } else {
        setOpeningWindowActive(globalActive && user?.role === 'SUPER_ADMIN')
      }
    } catch (err) { console.error(err) }
  }

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(persistenceKey)
    if (saved) {
      try {
        setFormData(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse saved form data', e)
      }
    }
  }, [])

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem(persistenceKey, JSON.stringify(formData))
  }, [formData])

  useEffect(() => { fetchData() }, [token, user?.channelId])

  // Flatten category tree for dropdown
  const flattenCategories = (cats: Category[], depth = 0): { id: string; label: string }[] => {
    return cats.flatMap(c => [
      { id: c.id, label: '  '.repeat(depth) + c.name },
      ...flattenCategories(c.children || [], depth + 1)
    ])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return alert('Item name is required')
    if (formData.retailPrice <= 0) return alert('Retail price must be greater than 0')

    setLoading(true)
    try {
      const payload: Record<string, unknown> = {
        name: formData.name,
        retailPrice: Number(formData.retailPrice) || 0,
        wholesalePrice: Number(formData.wholesalePrice) || 0,
        minRetailPrice: Number(formData.minRetailPrice) || 0,
        minWholesalePrice: Number(formData.minWholesalePrice) || 0,
        isActive: formData.isActive,
      }
      if (formData.sku)          payload.sku = formData.sku
      if (formData.barcode)      payload.barcode = formData.barcode
      if (formData.description)  payload.description = formData.description
      if (formData.categoryId)   payload.categoryId = formData.categoryId
      if (formData.brandId)      payload.brandId = formData.brandId
      if (formData.supplierId)   payload.supplierId = formData.supplierId
      if (formData.unitOfMeasure) payload.unitOfMeasure = formData.unitOfMeasure
      if (Number(formData.wholesalePrice) > 0) payload.wholesalePrice = Number(formData.wholesalePrice)
      if (Number(formData.reorderLevel) > 0) payload.reorderLevel = Number(formData.reorderLevel)

      const item = await api.post<any>('/items', payload, token!)
      
      // If initial stock provided and window active, record it
      if (openingWindowActive && Number(formData.initialStock) !== 0) {
        await api.post('/items/stock-adjustment', {
          itemId: item.id,
          channelId: user?.channelId || '',
          quantity: Number(formData.initialStock),
          reason: 'Initial Opening Stock',
          isOpening: true
        }, token!)
      }

      localStorage.removeItem(persistenceKey)
      alert('✅ Item created successfully!')
      router.push('/dashboard/items')
    } catch (err) {
      console.error('Create item error:', err)
      alert('❌ Failed to create item: ' + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const flatCats = flattenCategories(categories.filter(c => !c.parentId))

  return (
    <div className="animate-fade-in" style={{ maxWidth: 700 }}>
      <div className="page-header" style={{ marginBottom: 24 }}>
        <h1>Create New Item</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" className="btn btn-ghost" onClick={() => {
            if (confirm('Clear form and start over?')) {
              localStorage.removeItem(persistenceKey)
              setFormData(initialFormData)
            }
          }}>🧹 Reset</button>
          <button className="btn btn-ghost" onClick={() => router.back()}>← Back</button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* SKU & Name */}
        <div style={{ display: 'flex', gap: 16 }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>SKU <span style={{ color: 'var(--text-muted)', fontSize: '0.8em' }}>(auto-generated if empty)</span></label>
            <input className="input" placeholder="e.g. ITEM-001" value={formData.sku} onChange={e => set('sku', e.target.value)} />
          </div>
          <div className="form-group" style={{ flex: 2 }}>
            <label>Item Name *</label>
            <input className="input" placeholder="e.g. Wireless Laser Mouse" value={formData.name} onChange={e => set('name', e.target.value)} required />
          </div>
        </div>

        {/* Barcode & UoM */}
        <div style={{ display: 'flex', gap: 16 }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Barcode</label>
            <input className="input" placeholder="e.g. 6901234567890" value={formData.barcode} onChange={e => set('barcode', e.target.value)} />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Unit of Measure</label>
            <select className="input" value={formData.unitOfMeasure} onChange={e => set('unitOfMeasure', e.target.value)}>
              <option value="PCS">Pieces (PCS)</option>
              <option value="KG">Kilograms (KG)</option>
              <option value="LTR">Litres (LTR)</option>
              <option value="MTR">Meters (MTR)</option>
              <option value="BOX">Box</option>
              <option value="PACK">Pack</option>
              <option value="DOZEN">Dozen</option>
            </select>
          </div>
        </div>

        {/* Category & Brand */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <label style={{ marginBottom: 0 }}>Category</label>
              <Link href="/dashboard/items/categories" className="btn btn-ghost btn-sm" style={{ padding: '0 4px', fontSize: '0.75em', color: 'var(--accent)' }}>
                + New
              </Link>
            </div>
            <select className="input" value={formData.categoryId} onChange={e => set('categoryId', e.target.value)}>
              <option value="">Select Category...</option>
              {flatCats.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <label style={{ marginBottom: 0 }}>Brand</label>
              <Link href="/dashboard/items/brands" className="btn btn-ghost btn-sm" style={{ padding: '0 4px', fontSize: '0.75em', color: 'var(--accent)' }}>
                + New
              </Link>
            </div>
            <select className="input" value={formData.brandId} onChange={e => set('brandId', e.target.value)}>
              <option value="">Select Brand...</option>
              {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
        </div>

        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <label style={{ marginBottom: 0 }}>Supplier</label>
            <Link href="/dashboard/items/suppliers" className="btn btn-ghost btn-sm" style={{ padding: '0 4px', fontSize: '0.75em', color: 'var(--accent)' }}>
               + New
            </Link>
          </div>
          <select className="input" value={formData.supplierId} onChange={e => set('supplierId', e.target.value)}>
            <option value="">Select Supplier...</option>
            {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        {/* Description */}
        <div className="form-group">
          <label>Description</label>
          <textarea className="input" rows={2} placeholder="Optional item description..." value={formData.description} onChange={e => set('description', e.target.value)} style={{ resize: 'vertical' }} />
        </div>

        {/* Pricing */}
        <div style={{ display: 'flex', gap: 16 }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Retail Price (KES) *</label>
            <input type="number" className="input" min="0" step="0.01" value={formData.retailPrice} onChange={e => set('retailPrice', e.target.value)} required />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Wholesale Price (KES)</label>
            <input type="number" className="input" min="0" step="0.01" value={formData.wholesalePrice} onChange={e => set('wholesalePrice', e.target.value)} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16 }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Floor Price - Retail (KES)</label>
            <input type="number" className="input" min="0" step="0.01" value={formData.minRetailPrice} onChange={e => set('minRetailPrice', e.target.value)} />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Floor Price - Wholesale (KES)</label>
            <input type="number" className="input" min="0" step="0.01" value={formData.minWholesalePrice} onChange={e => set('minWholesalePrice', e.target.value)} />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Reorder Level (Qty)</label>
            <input type="number" className="input" min="0" value={formData.reorderLevel} onChange={e => set('reorderLevel', e.target.value)} />
          </div>
        </div>

        {openingWindowActive && (
          <div className="form-group card" style={{ padding: 16, background: 'rgba(var(--accent-rgb), 0.05)', border: '1px dashed var(--accent)' }}>
            <label style={{ color: 'var(--accent)', fontWeight: 600 }}>Initial Stock (Opening Window Active)</label>
            <input 
              type="number" 
              className="input" 
              value={formData.initialStock} 
              onChange={e => set('initialStock', Number(e.target.value))} 
              placeholder="Enter initial quantity in stock"
            />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
              * This will be recorded as Opening Stock (no financial impact).
            </p>
          </div>
        )}

        {/* Status */}
        <div className="form-group">
          <label style={{ display: 'flex', gap: 10, alignItems: 'center', cursor: 'pointer' }}>
            <input type="checkbox" checked={formData.isActive} onChange={e => set('isActive', e.target.checked)} />
            <span>Active — available for sale in POS</span>
          </label>
        </div>

        <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ marginTop: 4, justifyContent: 'center' }}>
          {loading ? '⏳ Creating...' : '✅ Create Item'}
        </button>
      </form>
    </div>
  )
}
