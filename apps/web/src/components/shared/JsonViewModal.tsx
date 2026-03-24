'use client'

interface JsonViewModalProps {
  isOpen:    boolean
  title:     string
  oldValues?: any
  newValues?: any
  onClose:   () => void
}

export function JsonViewModal({ isOpen, title, oldValues, newValues, onClose }: JsonViewModalProps) {
  if (!isOpen) return null
  const hasDiff = oldValues !== undefined && newValues !== undefined

  return (
    <div className="modal-overlay no-print" style={{ zIndex: 1100 }}>
      <div className="modal-content" style={{ maxWidth: 800, width: '90%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>🔍 {title}</h2>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: hasDiff ? '1fr 1fr' : '1fr', gap: 20, maxHeight: '60vh', overflowY: 'auto' }}>
          {oldValues !== undefined && (
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 8, display: 'block' }}>
                {hasDiff ? 'Original State' : 'Record Details'}
              </label>
              <pre style={{ 
                background: 'var(--bg-secondary)', 
                padding: '12px 14px', 
                borderRadius: 'var(--radius-md)', 
                fontSize: '0.8125rem', 
                whiteSpace: 'pre-wrap', 
                wordBreak: 'break-all',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)'
              }}>
                {JSON.stringify(oldValues, null, 2)}
              </pre>
            </div>
          )}

          {newValues !== undefined && (
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--success)', textTransform: 'uppercase', marginBottom: 8, display: 'block' }}>
                {hasDiff ? 'Change / New State' : 'Record Details'}
              </label>
              <pre style={{ 
                background: 'rgba(34,197,94,0.05)', 
                padding: '12px 14px', 
                borderRadius: 'var(--radius-md)', 
                fontSize: '0.8125rem', 
                whiteSpace: 'pre-wrap', 
                wordBreak: 'break-all',
                color: 'var(--text-primary)',
                border: '1px solid rgba(34,197,94,0.2)'
              }}>
                {JSON.stringify(newValues, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-primary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}
