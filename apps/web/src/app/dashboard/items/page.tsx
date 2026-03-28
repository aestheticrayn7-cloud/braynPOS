'use client'
import { useEffect, useState } from 'react'
import { api, ApiError } from '@/lib/api-client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth.store'
import { StockAdjustmentModal } from '@/components/shared/StockAdjustmentModal'
import { OpeningStockAgreement } from '@/components/shared/OpeningStockAgreement'
import { ExportMenu } from '@/components/shared/ExportMenu'
import { toast } from 'react-hot-toast'

interface Item {
  id: string
  sku: string
  name: string
  retailPrice: unknown
  wholesalePrice: unknown
  weightedAvgCost: unknown
  isActive: boolean
  category?: { name: string }
  brand?: { name: string }
  supplier?: { name: string }
  availableQty?: number
}

export default function ItemsPage() {
  const token = useAuthStore((s) => s.accessToken)
  const user = useAuthStore((s) => s.user)
  const router = useRouter()
  const [items, setItems] = useState<Item[]>([])
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [brandId, setBrandId] = useState('')
  const [supplierId, setSupplierId] = useState('')
  const [channelId, setChannelId] = useState('')
  const [categories, setCategories] = useState<{id: string; name: string}[]>([])
  const [brands, setBrands] = useState<{id: string; name: string}[]>([])
  const [suppliers, setSuppliers] = useState<{id: string; name: string}[]>([])
  const [channels, setChannels] = useState<{id: string; name: string}[]>([])
  const [loading, setLoading] = useState(true)
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [adjustingItem, setAdjustingItem] = useState<Item | null>(null)
  const [preferOpening, setPreferOpening] = useState(false)
  const [sortBy, setSortBy] = useState<string>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  
  const [globalWindowActive, setGlobalWindowActive] = useState(false)
  const [hasAgreed, setHasAgreed] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 150)
    return () => clearTimeout(timer)
  }, [search])

  const fetchCategories = async () => {
    if (!token) return
    try {
      const res = await api.get<{id: string; name: string}[]>('/items/categories', token)
      setCategories(res)
    } catch (err) { console.error(err) }
  }

  const fetchBrands = async () => {
    if (!token) return
    try {
      const res = await api.get<{id: string; name: string}[]>('/items/brands', token)
      setBrands(res)
    } catch (err) { console.error(err) }
  }

  const fetchSuppliers = async () => {
    if (!token) return
    try {
      const res = await api.get<{id: string; name: string}[]>('/items/suppliers', token)
      setSuppliers(res)
    } catch (err) { console.error(err) }
  }

  const fetchChannels = async () => {
    if (!token) return
    try {
      const res = await api.get<{id: string; name: string}[]>('/channels', token)
      setChannels(Array.isArray(res) ? res : [])
    } catch (err) { console.error(err) }
  }

  const buildQuery = () => {
    const q = new URLSearchParams()
    if (search) q.append('search', search)
    if (categoryId) q.append('categoryId', categoryId)
    if (brandId) q.append('brandId', brandId)
    if (supplierId) q.append('supplierId', supplierId)
    
    const canFilterChannel = ['SUPER_ADMIN', 'MANAGER_ADMIN'].includes(user?.role || '')
    if (canFilterChannel) {
      if (channelId) q.append('channelId', channelId)
    } else {
      q.append('channelId', user?.channelId || '')
    }

    if (sortBy) {
      q.append('sortBy', sortBy)
      q.append('sortOrder', sortOrder)
    }
    return q
  }

  const fetchItems = async () => {
    if (!token) return
    const q = buildQuery()
    const url = `/items?limit=100&${q.toString()}`
    try {
      const res = await api.get<{ data: Item[] }>(url, token)
      setItems(res.data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const getExportData = async () => {
    const q = buildQuery()
    const url = `/items?limit=5000&${q.toString()}`
    const res = await api.get<{ data: Item[] }>(url, token!)
    return res.data.map(item => [
      item.sku,
      item.name,
      item.category?.name || '—',
      item.brand?.name || '—',
      item.supplier?.name || '—',
      item.availableQty || 0,
      item.retailPrice,
      item.wholesalePrice,
      item.isActive ? 'Active' : 'Inactive'
    ])
  }

  useEffect(() => { 
    fetchCategories()
    fetchBrands()
    fetchSuppliers()
    if (['SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER', 'STOREKEEPER'].includes(user?.role || '')) {
      fetchChannels()
    }
  }, [token, user?.role])
  
  useEffect(() => {
    const fetchGlobalSettings = async () => {
      try {
        const res = await api.get<Record<string, any>>('/dashboard/settings', token as string)
        setGlobalWindowActive(res.advancedSettings?.globalOpeningStockActive || false)
        const agreed = localStorage.getItem(`opening_stock_agreed_${user?.id}`) === 'true'
        setHasAgreed(agreed)
      } catch (err) {
        console.error('Failed to load global settings:', err)
      }
    }
    fetchItems()
    fetchGlobalSettings()
  }, [token, debouncedSearch, categoryId, brandId, supplierId, channelId, user?.id, user?.channelId, sortBy, sortOrder])

  // Set default channel only once
  useEffect(() => {
    if (user?.channelId && !channelId) setChannelId(user.channelId)
  }, [user?.channelId])

  const handleToggleActive = async (item: Item) => {
    try {
      await api.patch(`/items/${item.id}`, { isActive: !item.isActive }, token!)
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, isActive: !i.isActive } : i))
      toast.success(`Item ${item.isActive ? 'deactivated' : 'activated'}`)
    } catch (err) { 
      const msg = (err as Error).message
      if ((err as any).status === 403) {
        toast.error(msg, { id: 'security-block', icon: '🛡️' })
      } else {
        toast.error('Operation failed: ' + msg)
      }
    }
  }

  const handleDelete = async (item: Item) => {
    if (!confirm(`Delete "${item.name}"? This will soft-delete the item.`)) return
    try {
      await api.delete(`/items/${item.id}`, token!)
      setItems(prev => prev.filter(i => i.id !== item.id))
      toast.success('Item deleted')
    } catch (err) { 
      const msg = (err as Error).message
      if ((err as any).status === 403) {
        toast.error(msg, { id: 'security-block', icon: '🛡️' })
      } else {
        toast.error('Deletion failed: ' + msg)
      }
    }
  }

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const sortIcon = (field: string) => {
    if (sortBy !== field) return '↕️'
    return sortOrder === 'asc' ? '🔼' : '🔽'
  }

  const fmt = (n: unknown) => new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(Number(n ?? 0))

  // Flatten category tree for dropdown
  const flattenCategories = (cats: {id: string; name: string; parentId?: string | null; children?: any[]}[], depth = 0): { id: string; label: string }[] => {
    return cats.flatMap(c => [
      { id: c.id, label: '  '.repeat(depth) + c.name },
      ...flattenCategories(c.children || [], depth + 1)
    ])
  }

  const flatCats = flattenCategories(categories.filter(c => !(c as any).parentId))

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Items</h1>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <ExportMenu 
            title="Items Inventory Report"
            headers={['SKU', 'Name', 'Category', 'Brand', 'Supplier', 'Stock Quantity', 'Retail Price', 'Wholesale Price', 'Status']}
            getData={getExportData}
          />
          {['SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER'].includes(user?.role || '') && (
            <>
              <Link href="/dashboard/items/categories" className="btn btn-ghost">📁 Categories</Link>
              <Link href="/dashboard/items/brands" className="btn btn-ghost">🏷️ Brands</Link>
              <Link href="/dashboard/items/suppliers" className="btn btn-ghost">📦 Suppliers</Link>
              <Link href="/dashboard/items/new" className="btn btn-primary">+ Add Item</Link>
            </>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <input
          className="input"
          placeholder="🔍 Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 280, maxWidth: 400 }}
          id="items-search"
        />
        <select
          className="input"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          style={{ width: 180 }}
        >
          <option value="">All Categories</option>
          {flatCats.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>

        <select
          className="input"
          value={brandId}
          onChange={(e) => setBrandId(e.target.value)}
          style={{ width: 180 }}
        >
          <option value="">All Brands</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>

        <select
          className="input"
          value={supplierId}
          onChange={(e) => setSupplierId(e.target.value)}
          style={{ width: 180 }}
        >
          <option value="">All Suppliers</option>
          {suppliers.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        {['SUPER_ADMIN', 'MANAGER_ADMIN'].includes(user?.role || '') && (
          <select
            className="input"
            value={channelId}
            onChange={(e) => setChannelId(e.target.value)}
            style={{ width: 180 }}
          >
            <option value="">All Channels</option>
            {channels.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        )}
      </div>

      {globalWindowActive && (
        <OpeningStockAgreement 
          isAgreed={hasAgreed} 
          onAgree={() => {
            setHasAgreed(true)
            localStorage.setItem(`opening_stock_agreed_${user?.id}`, 'true')
          }} 
        />
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('sku')} style={{ cursor: 'pointer' }}>SKU {sortIcon('sku')}</th>
              <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>Name {sortIcon('name')}</th>
              <th onClick={() => handleSort('category')} style={{ cursor: 'pointer' }}>Category {sortIcon('category')}</th>
              <th onClick={() => handleSort('brand')} style={{ cursor: 'pointer' }}>Brand {sortIcon('brand')}</th>
              <th onClick={() => handleSort('supplier')} style={{ cursor: 'pointer' }}>Supplier {sortIcon('supplier')}</th>
              <th style={{ textAlign: 'center' }}>Stock</th>
              <th onClick={() => handleSort('retailPrice')} style={{ cursor: 'pointer', textAlign: 'right' }}>Price {sortIcon('retailPrice')}</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No items found</td></tr>
            ) : (
              items.map((item) => (
                <tr key={item.id}>
                  <td><code>{item.sku}</code></td>
                  <td><strong>{item.name}</strong></td>
                  <td><span className="badge badge-info">{item.category?.name || '—'}</span></td>
                  <td>{item.brand?.name || '—'}</td>
                  <td>{item.supplier?.name || '—'}</td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`badge ${Number(item.availableQty || 0) <= 0 ? 'badge-danger' : 'badge-info'}`}>
                      {Number(item.availableQty || 0).toLocaleString()}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}><strong>{fmt(item.retailPrice)}</strong></td>
                  <td>
                    <span className={`badge ${item.isActive ? 'badge-success' : 'badge-danger'}`}>
                      {item.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      {['SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER'].includes(user?.role || '') && (
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => router.push(`/dashboard/items/${item.id}/edit`)}
                          style={{ marginRight: 4 }}
                        >✏️</button>
                      )}
                      {globalWindowActive && hasAgreed && (
                        <button 
                          className="btn btn-ghost btn-sm" 
                          onClick={() => {
                            setPreferOpening(true);
                            setAdjustingItem(item);
                          }}
                          style={{ color: 'var(--accent)', marginRight: 4 }}
                          title="Opening Stock"
                        >📥</button>
                      )}
                      {['SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER'].includes(user?.role || '') && (
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => handleToggleActive(item)}
                          title={item.isActive ? 'Deactivate' : 'Activate'}
                          style={{ marginRight: 4 }}
                        >{item.isActive ? '🔴' : '🟢'}</button>
                      )}
                      {['SUPER_ADMIN', 'MANAGER_ADMIN'].includes(user?.role || '') && (
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => handleDelete(item)}
                          title="Delete"
                          style={{ color: 'var(--danger)' }}
                        >🗑️</button>
                      )}
                    </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
