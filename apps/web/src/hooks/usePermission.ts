// apps/web/src/hooks/usePermission.ts
 
import { useAuthStore } from '@/stores/auth.store'
 
const ROLE_CAPABILITIES: Record<string, string[]> = {
  SUPER_ADMIN:   ['*'],
  MANAGER_ADMIN: ['*'],
  ADMIN:         ['*'],
  MANAGER:       ['*'], // Note: Backend handles the actual isolation
  STOREKEEPER: [
    'item.view', 'stock.view', 'stock.adjust',
    'transfer.create', 'transfer.receive', 'transfer.dispute',
  ],
  CASHIER: [
    'sale.view', 'sale.commit', 'item.view', 'stock.view'
  ],
  PROMOTER: [
    'sale.view', 'sale.commit', 'item.view', 'stock.view'
  ],
  SALES_PERSON: [
    'sale.view', 'sale.commit', 'item.view', 'stock.view'
  ],
}
 
export function usePermission() {
  const user = useAuthStore((s) => s.user)
  const role = user?.role || 'CASHIER'
 
  const hasPermission = (capability: string): boolean => {
    const caps = ROLE_CAPABILITIES[role] || []
    if (caps.includes('*')) return true
    return caps.includes(capability)
  }
 
  return { hasPermission, role }
}
