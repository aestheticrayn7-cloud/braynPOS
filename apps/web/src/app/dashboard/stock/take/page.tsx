'use client'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api-client'
import { useAuthStore } from '@/stores/auth.store'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface StockTake {
  id: string
  createdAt: string
  status: 'OPEN' | 'COMPLETED' | 'CANCELLED'
  channel: { name: string }
  startedByUser: { username: string }
}

export default function StockTakePage() {
  const token = useAuthStore((s) => s.accessToken)
  const user = useAuthStore((s) => s.user)
  const router = useRouter()
  const [takes, setTakes] = useState<StockTake[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      api.get<StockTake[]>('/stock/take', token)
        .then(setTakes)
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [token])

  const handleStartNew = async () => {
    if (!token || !user?.channelId) return alert('Channel ID missing')
    try {
      const res = await api.post<StockTake>('/stock/take', { channelId: user.channelId }, token)
      router.push(`/dashboard/stock/take/${res.id}`)
    } catch (err) {
      alert('Failed to start stock take: ' + (err as Error).message)
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Stock Takes (Physical Count)</h1>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '6px 12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            🛡️ <span>72hr Purge Policy: <strong>Enabled</strong></span>
          </div>
          <button className="btn btn-primary" onClick={handleStartNew}>+ Start New Take</button>
        </div>
      </div>

      <div className="alert alert-info" style={{ marginBottom: 20, fontSize: '0.9rem' }}>
        ℹ️ <strong>System Policy:</strong> To ensure inventory accuracy, any stock take that remains in "OPEN" status for more than 72 hours without completion will be automatically cancelled.
      </div>

      <div className="table-container card">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Channel</th>
              <th>Status</th>
              <th>Started By</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center">Loading...</td></tr>
            ) : takes.length === 0 ? (
              <tr><td colSpan={5} className="text-center">No stock takes found</td></tr>
            ) : (
              takes.map(t => (
                <tr key={t.id}>
                  <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                  <td>{t.channel.name}</td>
                  <td>
                    <span className={`badge badge-${t.status === 'OPEN' ? 'warning' : t.status === 'COMPLETED' ? 'success' : 'danger'}`}>
                      {t.status}
                    </span>
                  </td>
                  <td>{t.startedByUser.username}</td>
                  <td style={{ textAlign: 'right' }}>
                    <Link href={`/dashboard/stock/take/${t.id}`} className="btn btn-ghost btn-sm">View Details</Link>
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
