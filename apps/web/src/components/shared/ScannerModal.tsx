'use client'
import { useEffect, useRef, useState } from 'react'
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode'

interface ScannerModalProps {
  isOpen: boolean
  onClose: () => void
  onScan: (decodedText: string) => void
}

export function ScannerModal({ isOpen, onClose, onScan }: ScannerModalProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && !scannerRef.current) {
      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        formatsToSupport: [
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.UPC_E,
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.QR_CODE
        ]
      }

      const scanner = new Html5QrcodeScanner('scanner-region', config, false)
      
      scanner.render((decodedText: string) => {
        // Success
        onScan(decodedText)
        scanner.clear().catch(console.error)
        scannerRef.current = null
        onClose()
      }, (err: any) => {
        // Silent error for most frames
        if (typeof err === 'string' && err.includes('NotFound')) return
        console.warn('[Scanner Error]', err)
      })

      scannerRef.current = scanner
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error)
        scannerRef.current = null
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div 
      className="modal-overlay" 
      style={{ zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="card" style={{ maxWidth: 450, width: '100%', padding: '20px', textAlign: 'center', position: 'relative' }}>
        <button 
          className="btn btn-ghost" 
          onClick={onClose}
          style={{ position: 'absolute', top: 10, right: 10, fontSize: '1.2rem' }}
        >✕</button>
        <h3 style={{ marginBottom: 20 }}>Scan Barcode</h3>
        
        <div id="scanner-region" style={{ width: '100%', borderRadius: 12, overflow: 'hidden', background: '#000' }}></div>
        
        <p style={{ marginTop: 20, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Position the barcode within the center square to scan.
        </p>
        
        <button className="btn btn-secondary" onClick={onClose} style={{ marginTop: 16, width: '100%' }}>
          Cancel
        </button>
      </div>
    </div>
  )
}
