'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/stores/auth.store'
import { api } from '@/lib/api-client'
import { toast } from 'react-hot-toast'
import { JsonViewModal } from '@/components/shared/JsonViewModal'

interface AuditLog {
  id: string
  action: string
  actorId: string
  actorRole: string
  channelId?: string
  targetType?: string
  targetId?: string
  oldValues?: any
  newValues?: any
  createdAt: string
  actorDetail: { username: string; role: string }
}

export default function AuditTrailPage() {
  const token = useAuthStore((s) => s.accessToken)
  const user  = useAuthStore((s) => s.user)

  const [logs, setLogs]           = useState<AuditLog[]>([])
  const [loading, setLoading]     = useState(true)
  const [page, setPage]           = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [exporting, setExporting] = useState(false)
  
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [filters, setFilters] = useState({ action: '', targetType: '', channelId: '' })

  const fetchLogs = async () => {
    if (!token) return
    setLoading(true)
    try {
      const query = new URLSearchParams({
        page:  page.toString(),
        limit: '50',
        ...(filters.action     && { action:     filters.action }),
        ...(filters.targetType && { targetType: filters.targetType }),
        ...(filters.channelId  && { channelId:  filters.channelId }),
      }).toString()
      const res = await api.get<{ data: AuditLog[]; meta: { totalPages: number } }>(`/audit?${query}`, token ?? undefined)
      setLogs(res.data)
      setTotalPages(res.meta.totalPages)
    } catch {
      toast.error('Failed to load audit logs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchLogs() }, [token, page, filters])

  const exportToCsv = async () => {
    setExporting(true)
    try {
      const res = await api.get<{ data: AuditLog[] }>(`/audit?limit=1000`, token ?? undefined)
      const headers = ['Timestamp', 'Action', 'Actor', 'Role', 'Target', 'Details']
      const rows = res.data.map(log => [
        new Date(log.createdAt).toLocaleString(),
        log.action,
        log.actorDetail.username,
        log.actorRole,
        `${log.targetType || ''} ${log.targetId || ''}`,
        JSON.stringify(log.newValues || {}).replace(/"/g, '""'),
      ])
      const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `audit_trail_${new Date().toISOString().split('T')[0]}.csv`
      link.click()
      toast.success('Audit trail exported successfully')
    } catch {
      toast.error('Failed to export audit logs')
    } finally {
      setExporting(false)
    }
  }

  const formatAction = (action: string) =>
    action.split('.').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

  return (
    <div className="animate-fade-in" style={{ padding: '16px 20px' }}>

      {/* ── Header ────────────────────────────────────────────────── */}
      {/* FIX: page-header now uses flex-wrap so the Export button
              never gets pushed off-screen on narrow phones */}
      <div className="page-header" style={{ marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>
            📜 Audit Trail
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Track all administrative and financial actions across the system.
          </p>
        </div>
        <button
          className="btn btn-ghost"
          onClick={exportToCsv}
          disabled={exporting}
        >
          {exporting ? '📦 Exporting...' : '📥 Export CSV'}
        </button>
      </div>

      {/* ── Filters ───────────────────────────────────────────────── */}
      {/* FIX: was a horizontal flex row with hardcoded pixel widths.
              Now uses flex-wrap so filters stack to full width on mobile.
              The global CSS rule in mobile-responsive-additions.css also
              handles this, but these inline overrides make it explicit. */}
      <div className="card" style={{ marginBottom: 20, padding: '14px 16px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ marginBottom: 0, flex: '1 1 150px', minWidth: 0 }}>
            <label>Action Type</label>
            <input
              className="input"
              placeholder="e.g. sale.void"
              value={filters.action}
              onChange={e => setFilters({ ...filters, action: e.target.value })}
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0, flex: '1 1 130px', minWidth: 0 }}>
            <label>Target Type</label>
            <input
              className="input"
              placeholder="e.g. sale"
              value={filters.targetType}
              onChange={e => setFilters({ ...filters, targetType: e.target.value })}
            />
          </div>
          {['SUPER_ADMIN', 'MANAGER_ADMIN', 'ADMIN'].includes(user?.role || '') && (
            <div className="form-group" style={{ marginBottom: 0, flex: '1 1 180px', minWidth: 0 }}>
              <label>Channel ID</label>
              <input
                className="input"
                placeholder="Search by Channel..."
                value={filters.channelId}
                onChange={e => setFilters({ ...filters, channelId: e.target.value })}
              />
            </div>
          )}
          <button
            className="btn btn-ghost"
            onClick={() => setFilters({ action: '', targetType: '', channelId: '' })}
            style={{ flexShrink: 0, alignSelf: 'flex-end' }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* ── Table ────────────────────────────────────────────────── */}
      {/* FIX: Added data-label attributes to every <td>.
              The global CSS uses these to render "LABEL: value" rows
              on mobile, turning the 6-column table into readable cards
              without any JS or extra components. */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Action</th>
                <th>Actor</th>
                <th>Role</th>
                <th>Target</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40 }}>Loading audit records...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No audit logs matched your filters</td></tr>
              ) : (
                logs.map(log => (
                  <tr key={log.id}>
                    <td data-label="Timestamp" style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td data-label="Action">
                      <span className="badge badge-info" style={{ textTransform: 'none', fontSize: '0.75rem' }}>
                        {formatAction(log.action)}
                      </span>
                    </td>
                    <td data-label="Actor" style={{ fontWeight: 600 }}>
                      {log.actorDetail.username}
                    </td>
                    <td data-label="Role">
                      <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>{log.actorRole}</span>
                    </td>
                    <td data-label="Target" style={{ fontSize: '0.85rem' }}>
                      {log.targetType && (
                        <code>{log.targetType}: {log.targetId?.slice(0, 8)}...</code>
                      )}
                    </td>
                    <td data-label="Details">
                      {(log.oldValues || log.newValues) && (
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => {
                            setSelectedLog(log)
                            setIsModalOpen(true)
                          }}
                        >
                          👁️ View
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 8,
        }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Page {page} of {totalPages}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
              Previous
            </button>
            <button className="btn btn-ghost btn-sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
              Next
            </button>
          </div>
        </div>
      </div>

      {selectedLog && (
        <JsonViewModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={formatAction(selectedLog.action)}
          oldValues={selectedLog.oldValues}
          newValues={selectedLog.newValues}
        />
      )}
    </div>
  )
}
