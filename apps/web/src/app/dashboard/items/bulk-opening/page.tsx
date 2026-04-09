'use client'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api-client'
import { useAuthStore } from '@/stores/auth.store'
import { toast } from 'react-hot-toast'
import Select from 'react-select'

interface Channel {
  id:   string
  name: string
}

interface Item {
  id:   string
  name: string
  sku:  string
  weightedAvgCost: number
}

export default function BulkOpeningStockPage() {
  const token = useAuthStore(s => s.accessToken)
  const [items, setItems] = useState<any[]>([])
  const [channels, setChannels] = useState<Channel[]>([])
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [allocations, setAllocations] = useState<Record<string, { qty: number, cost: number }>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!token) return
    const fetchData = async () => {
      try {
        const [itRes, chRes] = await Promise.all([
          api.get<any>('/items?limit=100', token!),
          api.get<Channel[]>('/channels', token!)
        ])
        setItems(itRes.data.map((i: any) => ({ label: `${i.name} (${i.sku})`, value: i.id, cost: i.weightedAvgCost, ...i })))
        setChannels(chRes)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [token])

  const handleAllocationChange = (channelId: string, field: 'qty' | 'cost', value: number) => {
    setAllocations(prev => ({
      ...prev,
      [channelId]: {
        ...(prev[channelId] || { qty: 0, cost: selectedItem?.cost || 0 }),
        [field]: value
      }
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedItem) {
      toast.error('Please select an item first')
      return
    }

    const payload = Object.entries(allocations)
      .filter(([_, data]) => data.qty > 0)
      .map(([channelId, data]) => ({
        channelId,
        quantity:  data.qty,
        costPrice: data.cost
      }))

    if (payload.length === 0) {
      toast.error('At least one allocation with quantity > 0 is required')
      return
    }

    setSaving(true)
    try {
      await api.post('/items/bulk-opening-stock', {
        itemId: selectedItem.value,
        allocations: payload
      }, token!)
      toast.success('Inventory allocated successfully across all branches')
      setAllocations({})
      setSelectedItem(null)
    } catch (err: any) {
      toast.error('Allocation failed: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading onboarding wizard...</div>

  return (
    <div className="animate-fade-in" style={{ paddingBottom: 60 }}>
      <div className="page-header">
        <div>
          <h1>Bulk Opening Stock Wizard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Allocate initial balances across all branches in one operation</p>
        </div>
      </div>

      <div className="card" style={{ padding: 24, marginTop: 24 }}>
        <h3 style={{ marginBottom: 20 }}>1. Select High-Value Item</h3>
        <div style={{ maxWidth: 500 }}>
           <Select 
            options={items}
            placeholder="Search items by name or SKU..."
            className="react-select-container"
            classNamePrefix="react-select"
            onChange={(val: any) => {
              setSelectedItem(val)
              setAllocations({})
            }}
            styles={{
              control: (base: any) => ({
                ...base,
                background: 'var(--bg-elevated)',
                borderColor: 'var(--border)',
                color: 'var(--text-primary)'
              }),
              menu: (base: any) => ({
                ...base,
                background: 'var(--bg-elevated)',
              }),
              option: (base: any, state: any) => ({
                ...base,
                backgroundColor: state.isFocused ? 'var(--primary-light)' : 'transparent',
                color: 'var(--text-primary)'
              })
            }}
           />
        </div>
      </div>

      {selectedItem && (
        <div className="card animate-slide-up" style={{ padding: 24, marginTop: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3>2. Set Branch Allocations</h3>
            <div className="badge badge-success">Selected: {selectedItem.name}</div>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 20 }}>
            Input the opening balances for each branch below. Cost price defaults to the item&apos;s global average but can be overridden.
          </p>

          <div style={{ display: 'grid', gap: 16 }}>
            {channels.map((ch) => (
              <div key={ch.id} style={{ display: 'grid', gridTemplateColumns: '1fr 120px 180px', gap: 16, alignItems: 'center', padding: '12px 16px', background: 'var(--bg-elevated)', borderRadius: 8, border: '1px solid var(--border)' }}>
                <span style={{ fontWeight: 600 }}>{ch.name}</span>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <input 
                    type="number" 
                    className="input" 
                    placeholder="Qty" 
                    value={allocations[ch.id]?.qty || ''} 
                    onChange={e => handleAllocationChange(ch.id, 'qty', Number(e.target.value))} 
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <input 
                    type="number" 
                    className="input" 
                    placeholder="Unit Cost" 
                    value={allocations[ch.id]?.cost || selectedItem.cost} 
                    onChange={e => handleAllocationChange(ch.id, 'cost', Number(e.target.value))} 
                  />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 32, display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn-primary btn-lg" onClick={handleSubmit} disabled={saving}>
              {saving ? 'Processing Allocations...' : 'Proceed with Bulk Allocation →'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
