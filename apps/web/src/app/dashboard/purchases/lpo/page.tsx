'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api-client'
import { useAuthStore } from '@/stores/auth.store'

interface LPO {
  id: string
  orderNo: string
  supplier: { name: string }
  status: string
  createdAt: string
  totalAmount?: number
}

export default function LPOPage() {
  const token = useAuthStore((s) => s.accessToken)
  const router = useRouter()
  const [orders, setOrders] = useState<LPO[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return
    api.get<{ data: LPO[] }>('/purchases/lpo', token)
      .then(res => {
        setOrders(res.data || [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [token])

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Purchase Orders (LPOs)</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => router.back()} className="btn btn-ghost">← Back</button>
          <Link href="/dashboard/purchases/lpo/new" className="btn btn-primary">+ New LPO</Link>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center' }}>Loading orders...</div>
        ) : orders.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
            No purchase orders found.
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Supplier</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td style={{ fontWeight: 600 }}>{order.orderNo}</td>
                  <td>{order.supplier.name}</td>
                  <td>
                    <span className={`badge badge-${order.status === 'FULFILLED' ? 'success' : order.status === 'CANCELLED' ? 'danger' : 'warning'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="btn btn-xs btn-ghost">View</button>
                      {order.status !== 'FULFILLED' && order.status !== 'CANCELLED' && (
                        <Link 
                          href={`/dashboard/purchases/new?lpoId=${order.id}`}
                          className="btn btn-xs btn-primary"
                        >
                          Receive
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
