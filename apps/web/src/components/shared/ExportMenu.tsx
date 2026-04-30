'use client'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { Download, FileSpreadsheet, FileText, Printer, ChevronDown } from 'lucide-react'
import { api } from '@/lib/api-client'
import { useAuthStore } from '@/stores/auth.store'

interface ExportMenuProps {
  title: string
  headers: string[]
  getData: () => Promise<any[][]>
  onPrint?: () => void
}

export function ExportMenu({ title, headers, getData, onPrint }: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const { accessToken } = useAuthStore()

  const handleExport = async (type: 'sheets' | 'docs') => {
    try {
      setIsExporting(true)
      const data = await getData()
      const payload = { title, headers, data }
      
      const response = await api.post<{ url: string }>(`/export/${type}`, payload, accessToken || undefined)

      if (response?.url) {
        toast.success(`Exported to Google ${type === 'sheets' ? 'Sheets' : 'Docs'}`)
        window.open(response.url, '_blank')
      }
    } catch (error: any) {
      const status = error?.status ?? error?.response?.status
      if (status === 400 || status === 401) {
        toast.error('Google account not connected. Please link it in Settings → Profile → Linked Accounts first.')
      } else {
        toast.error(error?.message || `Failed to export to Google ${type === 'sheets' ? 'Sheets' : 'Docs'}`)
      }
      console.error('[ExportMenu] Export failed:', error)
    } finally {
      setIsExporting(false)
      setIsOpen(false)
    }
  }

  const handlePrint = () => {
    if (onPrint) onPrint()
    else window.print()
    setIsOpen(false)
  }

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        className="btn btn-secondary btn-sm flex items-center gap-2"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
      >
        <Download size={16} />
        {isExporting ? 'Exporting...' : 'Export / Print'}
        <ChevronDown size={14} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-[var(--bg-elevated)] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-[var(--border)] overflow-hidden">
            <div className="py-1" role="none">
              <button
                onClick={() => handleExport('sheets')}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
              >
                <FileSpreadsheet size={16} className="text-green-500" />
                Google Sheets
              </button>
              <button
                onClick={() => handleExport('docs')}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
              >
                <FileText size={16} className="text-blue-500" />
                Google Docs
              </button>
              <div className="h-px bg-[var(--border)] my-1"></div>
              <button
                onClick={handlePrint}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
              >
                <Printer size={16} className="text-gray-500" />
                Print (A4 / Thermal)
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
