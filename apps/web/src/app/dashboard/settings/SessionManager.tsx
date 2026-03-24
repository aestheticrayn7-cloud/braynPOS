'use client'

import React, { useEffect, useState } from 'react'
import { api } from '@/lib/api-client'
import { useAuthStore } from '@/stores/auth.store'
import { toast } from 'react-hot-toast'

interface Session {
  id: string
  issuedAt: string
  expiresAt: string
}

export function SessionManager() {
  const token = useAuthStore((s) => s.accessToken)
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSessions = async () => {
    if (!token) return
    try {
      setLoading(true)
      const data = await api.get<Session[]>('/auth/sessions', token)
      setSessions(data)
    } catch (err) {
      console.error('Failed to fetch sessions:', err)
    } finally {
      setLoading(false)
    }
  }

  const revokeSession = async (id: string) => {
    if (!token) return
    if (!confirm('Are you sure you want to revoke this session? The device will be logged out immediately.')) return
    
    try {
      await api.delete(`/auth/sessions/${id}`, token)
      toast.success('Session revoked')
      setSessions(sessions.filter(s => s.id !== id))
    } catch (err) {
      toast.error('Failed to revoke session')
    }
  }

  useEffect(() => {
    fetchSessions()
  }, [token])

  if (loading) return <div className="loading-spinner" />

  return (
    <div className="session-manager">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h4 style={{ margin: 0 }}>Active Logins</h4>
        <button className="btn btn-ghost btn-xs" onClick={fetchSessions}>↻ Refresh</button>
      </div>

      {sessions.length === 0 ? (
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No other active sessions found.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {sessions.map((s) => (
            <div key={s.id} className="card" style={{ 
              padding: '12px 16px', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              background: 'var(--bg-main)',
              border: '1px solid var(--border)'
            }}>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                  Device Session
                  <span style={{ marginLeft: 8, fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 400 }}>ID: {s.id.slice(0, 8)}...</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                  Logged in: {new Date(s.issuedAt).toLocaleString()}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Expires: {new Date(s.expiresAt).toLocaleDateString()}
                </div>
              </div>
              <button 
                className="btn btn-ghost btn-sm" 
                style={{ color: 'var(--danger)' }}
                onClick={() => revokeSession(s.id)}
              >
                Revoke
              </button>
            </div>
          ))}
        </div>
      )}

      <p style={{ marginTop: 16, fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
        Note: The current session you are using is not shown and cannot be revoked from here.
      </p>

      <style jsx>{`
        .session-manager {
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid var(--border);
        }
      `}</style>
    </div>
  )
}
