'use client'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api-client'
import { useAuthStore } from '@/stores/auth.store'

interface ReceiptData {
  receiptNo: string
  date:      string
  channel:   { name: string; address?: string; phone?: string; email?: string }
  customer?: { name: string; phone?: string }
  items:     Array<{ name: string; sku: string; quantity: number; unitPrice: number; lineTotal: number }>
  totals:    { subtotal: number; discount: number; tax: number; total: number }
  payments:  Array<{ method: string; amount: number }>
  cashier?:   string
  vatPIN?:    string
}

interface ReceiptSettings {
  receiptHeader?: string
  receiptFooter?: string
  showLogo?: boolean
  showBarcode?: boolean
  paperWidth?: string
  fontSize?: string
  showBusinessName?: boolean
  showBusinessAddress?: boolean
  showBusinessPhone?: boolean
  showBusinessEmail?: boolean
  showVatNumber?: boolean
  showCashierName?: boolean
  showCustomerInfo?: boolean
  showPoweredBy?: boolean
}

interface ReceiptModalProps {
  saleId:  string
  onClose: () => void
}

export function ReceiptModal({ saleId, onClose }: ReceiptModalProps) {
  const token = useAuthStore((s) => s.accessToken)
  const [data, setData]     = useState<ReceiptData | null>(null)
  const [settings, setSettings] = useState<ReceiptSettings>({
    showBusinessName: true, showBusinessAddress: true, showBusinessPhone: true, paperWidth: '80mm', fontSize: 'md', showPoweredBy: true
  })
  const [loading, setLoading] = useState(true)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  useEffect(() => {
    if (token && saleId) {
      Promise.all([
        api.get<ReceiptData>(`/receipts/${saleId}`, token),
        api.get<any>('/dashboard/settings', token)
      ]).then(([rData, sData]) => {
        setData(rData)
        if (sData.receiptSettings) setSettings(sData.receiptSettings)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
    }
  }, [token, saleId])

  const handlePrint = () => window.print()

  const handleShare = async () => {
    if (!data) return
    const text = formatReceiptText(data, settings)

    if (navigator.share) {
      try {
        await navigator.share({ title: `Receipt ${data.receiptNo}`, text })
        return
      } catch { /* ignored */ }
    }

    try {
      await navigator.clipboard.writeText(text)
      alert('Receipt copied to clipboard')
    } catch {
      alert('Unable to share receipt')
    }
  }

  if (loading) return null

  return (
    <div className="modal-overlay no-print">
      <style>{`
        #receipt-print-area * {
          background-color: transparent !important;
          color: #000000 !important;
        }
        #receipt-print-area {
          background-color: #ffffff !important;
        }
        #receipt-print-area table, 
        #receipt-print-area tr, 
        #receipt-print-area td, 
        #receipt-print-area th {
          background-color: transparent !important;
          border-color: #eee !important;
        }
      `}</style>
      <div className="card modal-content" style={{ maxWidth: 400, padding: 0, background: '#ffffff' }}>
        {/* Receipt body */}
        <div
          id="receipt-print-area"
          style={{ 
            padding: settings.paperWidth === '58mm' ? '12px' : '24px', 
            background: '#ffffff', 
            color: '#000000', 
            fontFamily: "'Courier New', Courier, monospace",
            width: '100%',
            maxWidth: settings.paperWidth === '58mm' ? '300px' : '400px',
            margin: '0 auto',
            boxSizing: 'border-box',
            fontSize: settings.fontSize === 'sm' ? '0.75rem' : settings.fontSize === 'lg' ? '1.05rem' : '0.9rem'
          }}
        >
          {settings.receiptHeader && (
            <div style={{ textAlign: 'center', marginBottom: 16, fontSize: '0.8rem', fontStyle: 'italic' }}>
              {settings.receiptHeader}
            </div>
          )}

          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            {settings.showBusinessName !== false && (
              <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#000' }}>{data?.channel.name}</h2>
            )}
            {settings.showBusinessAddress !== false && (
              <p style={{ margin: '4px 0', color: '#000' }}>
                {(data?.channel.address === 'None' || !data?.channel.address) ? '' : data.channel.address}
              </p>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 4 }}>
              {settings.showBusinessPhone !== false && data?.channel.phone && (
                <p style={{ margin: 0, color: '#000' }}>TEL: {data.channel.phone}</p>
              )}
              {settings.showBusinessEmail && data?.channel.email && (
                <p style={{ margin: 0, color: '#000' }}>{data.channel.email}</p>
              )}
              {settings.showVatNumber && data?.vatPIN && (
                <p style={{ margin: 0, color: '#000' }}>VAT/PIN: {data.vatPIN}</p>
              )}
            </div>
          </div>

          <div style={{ borderBottom: '1px dashed #333', marginBottom: 16 }} />

          <div style={{ marginBottom: 12, color: '#000' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 600 }}>ID: {data?.receiptNo}</span>
              <span style={{ opacity: 0.8 }}>{data ? new Date(data.date).toLocaleDateString() : ''}</span>
            </div>
            {settings.showCashierName && data?.cashier && (
              <div style={{ marginTop: 4, fontSize: '0.8rem' }}>Served by: {data.cashier}</div>
            )}
            {settings.showCustomerInfo && data?.customer && (
              <div style={{ marginTop: 6 }}>Customer: {data.customer.name}</div>
            )}
          </div>

          <div style={{ borderBottom: '1px dashed #333', marginBottom: 12 }} />

          <table style={{ width: '100%', fontSize: '0.9rem', borderCollapse: 'collapse', background: 'transparent' }}>
            <thead>
              <tr style={{ borderBottom: '1.5px solid #000' }}>
                <th style={{ textAlign: 'left', padding: '6px 0', color: '#000' }}>ITEM</th>
                <th style={{ textAlign: 'right', padding: '6px 4px', color: '#000' }}>QTY</th>
                <th style={{ textAlign: 'right', padding: '6px 0', color: '#000' }}>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {data?.items.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px 0', verticalAlign: 'top', color: '#000' }}>
                    <div style={{ fontWeight: 500 }}>{item.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#444' }}>@{item.unitPrice.toLocaleString()}</div>
                  </td>
                  <td style={{ textAlign: 'right', padding: '10px 4px', verticalAlign: 'top', color: '#000' }}>{item.quantity}</td>
                  <td style={{ textAlign: 'right', padding: '10px 0', color: '#000', verticalAlign: 'top', fontWeight: 500 }}>
                    <div style={{ textAlign: 'right', height: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', paddingTop: '10px' }}>
                      {item.lineTotal.toLocaleString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ borderTop: '1px dashed #333', marginTop: 12, paddingTop: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, color: '#000' }}>
              <span>Subtotal</span>
              <span>{data?.totals.subtotal.toLocaleString()}</span>
            </div>
            {data?.totals.discount ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, color: '#000' }}>
                <span>Discount</span>
                <span>-{data.totals.discount.toLocaleString()}</span>
              </div>
            ) : null}
            {data?.totals.tax ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, color: '#000' }}>
                <span>Tax</span>
                <span>{data.totals.tax.toLocaleString()}</span>
              </div>
            ) : null}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem', marginTop: 8, color: '#000', borderTop: '2px solid #000', paddingTop: 8 }}>
              <span>TOTAL</span>
              <span>{data?.totals.total.toLocaleString()}</span>
            </div>
          </div>

          <div style={{ marginTop: 20, fontSize: '0.9rem', color: '#000' }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>PAYMENTS:</div>
            {data?.payments.map((p, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <span>{p.method.replace('_', ' ')}</span>
                <span>{p.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 24, fontSize: '0.85rem', lineBreak: 'anywhere' }}>
            {settings.receiptFooter && <p style={{ marginBottom: 8 }}>{settings.receiptFooter}</p>}
            {settings.showPoweredBy !== false && (
               <p style={{ marginTop: 12, opacity: 0.7, fontSize: '0.7rem', fontWeight: 600 }}>POWERED BY BRAYN POS</p>
            )}
          </div>
        </div>

        <div className="modal-actions" style={{ padding: '16px' }}>
          {isMobile ? (
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleShare}>
              📤 Share Receipt
            </button>
          ) : (
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={handlePrint}>
              🖨️ Print Receipt
            </button>
          )}
          {!isMobile && (
            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={handleShare}>
              📤 Share
            </button>
          )}
          {isMobile && (
            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={handlePrint}>
              🖨️ Print
            </button>
          )}
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>
            ✓ Done
          </button>
        </div>
      </div>
    </div>
  )
}

function formatReceiptText(data: ReceiptData, settings: ReceiptSettings): string {
  const lines = [
    settings.showBusinessName !== false ? data.channel.name : '',
    settings.showBusinessAddress !== false ? data.channel.address || '' : '',
    settings.showBusinessPhone !== false ? `TEL: ${data.channel.phone || 'N/A'}` : '',
    '──────────────────────',
    `ID: ${data.receiptNo}`,
    `Date: ${new Date(data.date).toLocaleString()}`,
    settings.showCashierName && data.cashier ? `Cashier: ${data.cashier}` : '',
    settings.showCustomerInfo && data.customer ? `Customer: ${data.customer.name}` : '',
    '──────────────────────',
    ...data.items.map(i => `${i.name} x${i.quantity}  ${i.lineTotal.toLocaleString()}`),
    '──────────────────────',
    `Subtotal: ${data.totals.subtotal.toLocaleString()}`,
    data.totals.discount ? `Discount: -${data.totals.discount.toLocaleString()}` : '',
    data.totals.tax ? `Tax: ${data.totals.tax.toLocaleString()}` : '',
    `TOTAL: ${data.totals.total.toLocaleString()}`,
    '──────────────────────',
    ...data.payments.map(p => `${p.method.replace('_', ' ')}: ${p.amount.toLocaleString()}`),
    '',
    settings.receiptFooter || '',
    settings.showPoweredBy !== false ? 'Powered by BRAYN POS' : '',
  ]
  return lines.filter(Boolean).join('\n')
}
