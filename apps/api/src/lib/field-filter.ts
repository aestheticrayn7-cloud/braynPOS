// apps/api/src/lib/field-filter.ts
// Strips sensitive fields from API responses based on actor role.
 
import { UserRole } from '@prisma/client'
 
// Fields stripped from Item/stock responses for low-privilege roles
const ITEM_SENSITIVE_FIELDS = ['costPrice', 'weightedAvgCost'] as const
 
// Fields stripped from SaleItem responses for CASHIER
const SALE_ITEM_SENSITIVE_FIELDS = ['costPriceSnapshot', 'markup'] as const
 
// Roles that may NOT see cost/financial data
const RESTRICTED_ROLES: UserRole[] = ['CASHIER', 'PROMOTER']
 
// ── Item field filter ────────────────────────────────────────────────
export function filterItemFields<T extends Record<string, any>>(
  item: T,
  actorRole: string
): Partial<T> {
  if (!RESTRICTED_ROLES.includes(actorRole as UserRole)) return item
 
  const filtered = { ...item }
  for (const field of ITEM_SENSITIVE_FIELDS) {
    delete (filtered as any)[field]
  }
  return filtered
}
 
// ── SaleItem field filter ────────────────────────────────────────────
export function filterSaleItemFields<T extends Record<string, any>>(
  item: T,
  actorRole: string
): Partial<T> {
  if (!RESTRICTED_ROLES.includes(actorRole as UserRole)) return item
 
  const filtered = { ...item }
  for (const field of SALE_ITEM_SENSITIVE_FIELDS) {
    delete (filtered as any)[field]
  }
  return filtered
}
 
// ── Array shorthand ──────────────────────────────────────────────────
export function filterItemArray<T extends Record<string, any>>(
  items: T[],
  actorRole: string
): Partial<T>[] {
  return items.map(item => filterItemFields(item, actorRole))
}
