'use client'
import { useEffect, useState } from 'react'
import { db } from '@/lib/indexed-db'
import { useOfflineStore } from '@/stores/offline.store'

export function ConnectivityStatus() {
  const isOnline = useOfflineStore(s => s.isOnline)
  const [pendingCount, setPendingCount] = useState(0)

  useEffect(() => {
    const updateCount = async () => {
      try {
        const count = await db.sales.where('status').equals('pending').count()
        setPendingCount(count)
      } catch (err) {
        // Safe to ignore if DB not ready
      }
    }

    updateCount()
    const interval = setInterval(updateCount, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full animate-pulse ${isOnline ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`} />
        <span className="text-xs font-medium text-slate-300">
          {isOnline ? 'CLOUD LIVE' : 'OFFLINE MODE'}
        </span>
      </div>
      
      {pendingCount > 0 && (
        <>
          <div className="w-px h-3 bg-slate-700" />
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
              {pendingCount} PENDING SYNC
            </span>
          </div>
        </>
      )}
    </div>
  )
}
