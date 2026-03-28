'use client'

import React, { useEffect, useState } from 'react'
import { api } from '@/lib/api-client'
import { useAuthStore } from '@/stores/auth.store'

type HealthStatus = 'HEALTHY' | 'DEGRADED' | 'CRITICAL' | 'LOADING'

export function SystemHealthPill() {
  const token = useAuthStore((s) => s.accessToken)
  const user  = useAuthStore((s) => s.user)
  const [status, setStatus] = useState<HealthStatus>('LOADING')
  const [latency, setLatency] = useState<number | null>(null)

  const isAuthorized = ['SUPER_ADMIN', 'MANAGER_ADMIN', 'ADMIN'].includes(user?.role || '')

  const checkHealth = async () => {
    if (!token || !isAuthorized) return
    const start = Date.now()
    try {
      const res = await api.get<{ status: 'HEALTHY' | 'DEGRADED' | 'CRITICAL'; score?: number }>(`/dashboard/health`, token)
      setLatency(Date.now() - start)
      // Backend returns status directly; fall back to score for compatibility
      if (res.status === 'HEALTHY' || (res.score !== undefined && res.score >= 90)) setStatus('HEALTHY')
      else if (res.status === 'DEGRADED' || (res.score !== undefined && res.score >= 60)) setStatus('DEGRADED')
      else setStatus('CRITICAL')
    } catch {
      setStatus('CRITICAL')
    }
  }

  useEffect(() => {
    checkHealth()
    const interval = setInterval(checkHealth, 60000) // Poll every 60s
    return () => clearInterval(interval)
  }, [token, isAuthorized])

  if (!isAuthorized) return null

  const config = {
    HEALTHY:  { color: 'var(--success)', label: 'System Healthy', bg: 'rgba(34, 197, 94, 0.1)' },
    DEGRADED: { color: 'var(--warning)', label: 'Performance Degraded', bg: 'rgba(245, 158, 11, 0.1)' },
    CRITICAL: { color: 'var(--danger)',  label: 'System Critical', bg: 'rgba(239, 68, 68, 0.1)' },
    LOADING:  { color: 'var(--text-muted)', label: 'Checking Health...', bg: 'var(--bg-secondary)' },
  }[status]

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '8px 12px',
      borderRadius: 'var(--radius-md)',
      background: config.bg,
      border: `1px solid ${config.color}33`,
      fontSize: '0.75rem',
      fontWeight: 600,
      color: config.color,
      transition: 'all 0.3s ease'
    }}>
      <span style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: config.color,
        boxShadow: `0 0 8px ${config.color}66`,
        animation: status === 'LOADING' ? 'pulse 1.5s infinite' : 'none'
      }} />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span>{config.label}</span>
        {latency !== null && status !== 'LOADING' && (
          <span style={{ fontSize: '0.65rem', opacity: 0.7, fontWeight: 400 }}>Latency: {latency}ms</span>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 0.4; }
          50% { opacity: 1; }
          100% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}
