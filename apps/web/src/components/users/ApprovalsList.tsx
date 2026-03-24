'use client'
import { useState, useEffect } from 'react'
import { api } from '@/lib/api-client'
import { useAuthStore } from '@/stores/auth.store'

interface Approval {
  id: string
  action: string
  contextId: string
  status: string
  requester: { id: string; username: string; role: string }
  createdAt: string
}

export function ApprovalsList() {
  const token = useAuthStore((s) => s.accessToken)
  const [approvals, setApprovals] = useState<Approval[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)

  const fetchApprovals = async () => {
    try {
      const data = await api.get<Approval[]>('/users/approvals', token!)
      setApprovals(data)
    } catch (err) {
      console.error('Failed to fetch approvals:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApprovals()
  }, [token])

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    setProcessing(id)
    try {
      if (action === 'approve') {
        const res = await api.post<{ approvalToken: string }>(`/users/approvals/${id}/approve`, {}, token!)
        alert(`Request Approved! Token: ${res.approvalToken}\n\nThe requester can now complete their action.`)
      } else {
        await api.post(`/users/approvals/${id}/reject`, {}, token!)
        alert('Request Rejected.')
      }
      fetchApprovals()
    } catch (err: any) {
      alert('Action failed: ' + (err.message || 'Unknown error'))
    } finally {
      setProcessing(null)
    }
  }

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading approvals...</div>

  return (
    <div className="card" style={{ marginTop: 20 }}>
      <table className="table">
        <thead>
          <tr>
            <th>Requester</th>
            <th>Action</th>
            <th>Target</th>
            <th>Date</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {approvals.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>
                No pending approvals found.
              </td>
            </tr>
          ) : (
            approvals.map((a) => (
              <tr key={a.id}>
                <td>
                  <strong>{a.requester.username}</strong>
                  <br />
                  <small className="text-muted">{a.requester.role}</small>
                </td>
                <td>
                  <span className={`badge ${
                    a.action.includes('delete') ? 'badge-danger' : 
                    a.action.includes('create') ? 'badge-success' : 
                    'badge-info'
                  }`}>
                    {a.action.replace('_', ' ').toUpperCase()}
                  </span>
                </td>
                <td>{a.contextId}</td>
                <td>{new Date(a.createdAt).toLocaleString()}</td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleAction(a.id, 'approve')}
                      disabled={processing === a.id}
                    >
                      {processing === a.id ? '...' : '✅ Approve'}
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleAction(a.id, 'reject')}
                      disabled={processing === a.id}
                    >
                      {processing === a.id ? '...' : '❌ Reject'}
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
