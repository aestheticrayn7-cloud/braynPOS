'use client'

interface JsonViewModalProps {
  isOpen:    boolean
  title:     string
  oldValues?: any
  newValues?: any
  onClose:   () => void
}

const FIELD_LABELS: Record<string, string> = {
  id: 'ID', sku: 'SKU', name: 'Name', barcode: 'Barcode',
  brandId: 'Brand', categoryId: 'Category', supplierId: 'Supplier',
  description: 'Description', imageUrl: 'Image', isActive: 'Active',
  taxClass: 'Tax Class', unitOfMeasure: 'Unit', reorderLevel: 'Reorder Level',
  isSerialized: 'Serialized', retailPrice: 'Retail Price', wholesalePrice: 'Wholesale Price',
  minRetailPrice: 'Min Retail', minWholesalePrice: 'Min Wholesale',
  weightedAvgCost: 'Avg Cost', createdAt: 'Created', updatedAt: 'Updated',
  deletedAt: 'Deleted', username: 'Username', email: 'Email', role: 'Role',
  status: 'Status', channelId: 'Channel', mfaEnabled: 'MFA Enabled',
  passwordHash: 'Password', phone: 'Phone', address: 'Address',
  contactName: 'Contact', taxPin: 'Tax PIN', paymentTerms: 'Payment Terms',
  quantity: 'Quantity', reason: 'Reason', reasonCode: 'Reason Code',
  movementType: 'Movement Type', availableQty: 'Available Qty',
  grossSalary: 'Gross Salary', hireDate: 'Hire Date', jobTitle: 'Job Title',
}

const HIDDEN_FIELDS = ['passwordHash', 'id', 'deletedAt', 'updatedAt']

function formatValue(key: string, value: any): string {
  if (value === null || value === undefined) return '—'
  if (key === 'passwordHash') return '••••••••'
  if (typeof value === 'boolean') return value ? '✅ Yes' : '❌ No'
  if (key === 'createdAt' || key === 'updatedAt' || key === 'deletedAt' || key === 'hireDate') {
    try { return new Date(value).toLocaleString() } catch { return String(value) }
  }
  if (key.includes('Price') || key.includes('Cost') || key === 'grossSalary' || key.includes('price') || key.includes('cost')) {
    const num = Number(value)
    if (!isNaN(num)) return `KES ${num.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
  }
  if (typeof value === 'object') return JSON.stringify(value, null, 2)
  return String(value)
}

function formatLabel(key: string): string {
  return FIELD_LABELS[key] || key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, s => s.toUpperCase())
    .replace(/_/g, ' ')
    .trim()
}

function ValueTable({ data, color }: { data: any; color?: string }) {
  if (!data || typeof data !== 'object') {
    return <pre style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{data === null ? 'null' : String(data)}</pre>
  }

  const entries = Object.entries(data).filter(([key]) => !HIDDEN_FIELDS.includes(key))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {entries.map(([key, value]) => (
        <div key={key} style={{
          display: 'flex',
          padding: '8px 12px',
          borderBottom: '1px solid var(--border)',
          gap: 12,
          alignItems: 'baseline',
        }}>
          <span style={{
            fontWeight: 600,
            fontSize: '0.78rem',
            color: 'var(--text-secondary)',
            minWidth: 120,
            flexShrink: 0,
            textTransform: 'uppercase',
            letterSpacing: '0.03em',
          }}>
            {formatLabel(key)}
          </span>
          <span style={{
            fontSize: '0.85rem',
            color: color || 'var(--text-primary)',
            wordBreak: 'break-word',
            fontFamily: typeof value === 'object' ? 'monospace' : 'inherit',
            whiteSpace: typeof value === 'object' ? 'pre-wrap' : 'normal',
          }}>
            {formatValue(key, value)}
          </span>
        </div>
      ))}
    </div>
  )
}

export function JsonViewModal({ isOpen, title, oldValues, newValues, onClose }: JsonViewModalProps) {
  if (!isOpen) return null
  const hasDiff = oldValues !== undefined && oldValues !== null && newValues !== undefined && newValues !== null

  return (
    <div className="modal-overlay no-print" style={{ zIndex: 1100 }}>
      <div className="modal-content" style={{ maxWidth: 800, width: '90%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>🔍 {title}</h2>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: hasDiff ? '1fr 1fr' : '1fr',
          gap: 20,
          maxHeight: '65vh',
          overflowY: 'auto',
        }}>
          {oldValues !== undefined && oldValues !== null && (
            <div>
              <label style={{
                fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)',
                textTransform: 'uppercase', marginBottom: 8, display: 'block',
              }}>
                {hasDiff ? 'Original State' : 'Record Details'}
              </label>
              <div style={{
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                overflow: 'hidden',
              }}>
                <ValueTable data={oldValues} />
              </div>
            </div>
          )}

          {newValues !== undefined && newValues !== null && (
            <div>
              <label style={{
                fontSize: '0.75rem', fontWeight: 700,
                color: hasDiff ? 'var(--success)' : 'var(--text-secondary)',
                textTransform: 'uppercase', marginBottom: 8, display: 'block',
              }}>
                {hasDiff ? 'Change / New State' : 'Record Details'}
              </label>
              <div style={{
                background: hasDiff ? 'rgba(34,197,94,0.03)' : 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                border: `1px solid ${hasDiff ? 'rgba(34,197,94,0.2)' : 'var(--border)'}`,
                overflow: 'hidden',
              }}>
                <ValueTable data={newValues} color={hasDiff ? 'var(--accent)' : undefined} />
              </div>
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
