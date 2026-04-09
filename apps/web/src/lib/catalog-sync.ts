import { db, type LocalItem } from './indexed-db'
import { api } from './api-client'
import { toast } from 'react-hot-toast'

export class CatalogSyncService {
  /**
   * Performs a background sync of the entire product catalog.
   * Downloads SKU, price, and barcode data for offline search.
   */
  static async sync(token: string) {
    try {
      // 1. Fetch all items (limit set high to capture entire catalog)
      // Implementation Note: For extremely large catalogs (>5000 items), 
      // we would use cursor-based pagination.
      const response = await api.get<{ data: any[] }>('/items?limit=2000', token)
      const items = response.data || []

      if (items.length === 0) return

      // 2. Format for local storage
      const localItems: LocalItem[] = items.map(item => ({
        id:                 item.id,
        name:               item.name,
        sku:                item.sku,
        barcode:            item.barcode ?? null,
        retailPrice:        Number(item.retailPrice),
        wholesalePrice:     Number(item.wholesalePrice),
        minRetailPrice:     Number(item.minRetailPrice),
        minWholesalePrice:  Number(item.minWholesalePrice),
        weightedAvgCost:    Number(item.weightedAvgCost),
        isSerialized:       item.isSerialized ?? false,
        categoryName:       item.category?.name,
        updatedAt:          new Date().toISOString()
      }))

      // 3. Persist to IndexedDB (Atomic Transaction)
      await db.transaction('rw', db.items, async () => {
        await db.items.clear()
        await db.items.bulkAdd(localItems)
        localStorage.setItem('brayn_last_catalog_sync', new Date().toISOString())
      })

      console.log(`[CatalogSync] Successfully cached ${localItems.length} items locally.`)
      return localItems.length
    } catch (err) {
      console.error('[CatalogSync] Failed to sync catalog:', err)
      throw err
    }
  }

  static getLastSyncTime(): string | null {
    return localStorage.getItem('brayn_last_catalog_sync')
  }

  /**
   * Fast offline search within the local IndexedDB.
   */
  static async searchOffline(query: string): Promise<LocalItem[]> {
    if (!query) {
      return db.items.limit(50).toArray()
    }

    const lowerQuery = query.toLowerCase()
    
    // Search by Barcode, Sku, or Name
    return db.items
      .filter(item => 
        (item.barcode?.toLowerCase().includes(lowerQuery) || 
         item.sku.toLowerCase().includes(lowerQuery) || 
         item.name.toLowerCase().includes(lowerQuery))
      )
      .limit(50)
      .toArray()
  }
}
