'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api-client'
import { useAuthStore } from '@/stores/auth.store'

interface Category { id: string; name: string; parentId: string | null; children?: Category[] }
interface Brand { id: string; name: string }
interface Supplier { id: string; name: string }

export default function EditItemPage() {
  const router = useRouter()
  const { id } = useParams() as { id: string }
  const token = useAuthStore((s) => s.accessToken)
  
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  const [formData, setFormData] = useState({
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
    reorderLevel: 0,
    isActive: true,
  })

  const persistenceKey = `brayn_edit_item_form_${id}`

  const set = (field: string, val: unknown) => setFormData(prev => ({ ...prev, [field]: val }))

  const fetchData = async () => {
    if (!token) return
    try {
      const [cats, brnds, supps] = await Promise.all([
        api.get<Category[]>('/items/categories', token),
        api.get<Brand[]>('/items/brands', token),
        api.get<Supplier[]>('/items/suppliers', token),
      ])
      setCategories(cats)
      setBrands(brnds)
      setSuppliers(supps)
    } catch (err) { console.error(err) }
  }

  const fetchItem = async () => {
    if (!token || !id) return
    try {
      // Check if we have saved progress first
      const saved = localStorage.getItem(persistenceKey)
      if (saved) {
        try {
          setFormData(JSON.parse(saved))
          setFetching(false)
          return
        } catch (e) {
          console.error('Failed to parse saved form data', e)
        }
      }

      const item = await api.get<any>(`/items/${id}`, token)
      setFormData({
        sku: item.sku || '',
        barcode: item.barcode || '',
        name: item.name || '',
        description: item.description || '',
        categoryId: item.categoryId || '',
        brandId: item.brandId || '',
        supplierId: item.supplierId || '',
        unitOfMeasure: item.unitOfMeasure || 'PCS',
        retailPrice: Number(item.retailPrice) || 0,
        wholesalePrice: Number(item.wholesalePrice) || 0,
        minRetailPrice: Number(item.minRetailPrice) || 0,
        minWholesalePrice: Number(item.minWholesalePrice) || 0,
        reorderLevel: item.reorderLevel || 0,
        isActive: item.isActive,
      })
    } catch (err) { 
      console.error(err)
      alert('Failed to fetch item details')
      router.back()
    } finally {
      setFetching(false)
    }
  }

  // Save to localStorage on change (only after initial fetch)
  useEffect(() => {
    if (!fetching) {
      localStorage.setItem(persistenceKey, JSON.stringify(formData))
    }
  }, [formData, fetching, id])

  useEffect(() => { 
    fetchData()
    fetchItem()
  }, [token, id])

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
        isActive: formData.isActive,
        sku: formData.sku,
        barcode: formData.barcode,
        description: formData.description,
        categoryId: formData.categoryId,
        brandId: formData.brandId,
        supplierId: formData.supplierId,
        unitOfMeasure: formData.unitOfMeasure,
        wholesalePrice: Number(formData.wholesalePrice) || 0,
        minRetailPrice: Number(formData.minRetailPrice) || 0,
        minWholesalePrice: Number(formData.minWholesalePrice) || 0,
        reorderLevel: Number(formData.reorderLevel) || 0,
      }

      await api.patch(`/items/${id}`, payload, token!)
      localStorage.removeItem(persistenceKey)
      alert('✅ Item updated successfully!')
      router.push('/dashboard/items')
    } catch (err) {
      console.error('Update item error:', err)
      alert('❌ Failed to update item: ' + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <div style={{ padding: 20 }}>Loading...</div>

  const flatCats = flattenCategories(categories.filter(c => !c.parentId))

  return (
    <div className="animate-fade-in" style={{ maxWidth: 700 }}>
      <div className="page-header" style={{ marginBottom: 24 }}>
        <h1>Edit Item: {formData.name}</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" className="btn btn-ghost" onClick={() => {
            if (confirm('Discard changes and restore original data?')) {
              localStorage.removeItem(persistenceKey)
              setFetching(true)
              fetchItem()
            }
          }}>🧹 Reset</button>
          <button className="btn btn-ghost" onClick={() => router.back()}>← Back</button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* SKU & Name */}
        <div style={{ display: 'flex', gap: 16 }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>SKU</label>
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

        {/* Status */}
        <div className="form-group">
          <label style={{ display: 'flex', gap: 10, alignItems: 'center', cursor: 'pointer' }}>
            <input type="checkbox" checked={formData.isActive} onChange={e => set('isActive', e.target.checked)} />
            <span>Active — available for sale in POS</span>
          </label>
        </div>

        <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ marginTop: 4, justifyContent: 'center' }}>
          {loading ? '⏳ Updating...' : '✅ Update Item'}
        </button>
      </form>
    </div>
  )
}
