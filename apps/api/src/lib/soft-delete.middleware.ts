import { Prisma } from '@prisma/client'

const SOFT_DELETE_MODELS = new Set([
  'Channel',
  'User',
  'Brand',
  'Category',
  'Supplier',
  'Item',
  'Serial',
  'Sale',
  'Customer',
  'PurchaseOrder',
  'Purchase',
  'Expense',
])

const READ_OPERATIONS = new Set([
  'findUnique',
  'findUniqueOrThrow',
  'findFirst',
  'findFirstOrThrow',
  'findMany',
  'count',
  'aggregate',
  'groupBy',
])

// FIX 3: Bulk write operations also need the soft-delete filter
// so they don't accidentally touch deleted records.
const BULK_WRITE_OPERATIONS = new Set([
  'updateMany',
  'deleteMany',
])

// FIX 4: Single-record mutations — inject deletedAt: null into `where`
// so updates silently no-op on soft-deleted records by default.
const SINGLE_WRITE_OPERATIONS = new Set([
  'update',
  'upsert',
])

export const softDeleteMiddleware: Prisma.Middleware = async (params, next) => {
  if (!params.model || !SOFT_DELETE_MODELS.has(params.model)) {
    return next(params)
  }

  // ── Opt-out escape hatch ───────────────────────────────────────────
  // Caller passes { __includeDeleted: true } in the where clause to
  // bypass all soft-delete filtering.
  if (params.args?.where?.__includeDeleted === true) {
    const { __includeDeleted, ...realWhere } = params.args.where
    params.args = { ...params.args, where: realWhere }
    return next(params)
  }

  // ── READ operations ────────────────────────────────────────────────
  if (READ_OPERATIONS.has(params.action)) {
    params.args       = params.args       ?? {}
    params.args.where = params.args.where ?? {}
    if (!('deletedAt' in params.args.where)) {
      params.args.where.deletedAt = null
    }
    return next(params)
  }

  // ── FIX 3: Bulk write operations ──────────────────────────────────
  if (BULK_WRITE_OPERATIONS.has(params.action)) {
    params.args       = params.args       ?? {}
    params.args.where = params.args.where ?? {}
    if (!('deletedAt' in params.args.where)) {
      params.args.where.deletedAt = null
    }
    return next(params)
  }

  // ── FIX 4: Single-record mutations ────────────────────────────────
  if (SINGLE_WRITE_OPERATIONS.has(params.action)) {
    params.args       = params.args       ?? {}
    params.args.where = params.args.where ?? {}
    if (!('deletedAt' in params.args.where)) {
      params.args.where.deletedAt = null
    }
    return next(params)
  }

  // All other operations (create, createMany, etc.) — pass through unchanged
  return next(params)
}
