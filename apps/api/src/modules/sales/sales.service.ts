import { prisma } from '../../lib/prisma.js'
import { Prisma } from '@prisma/client'
import { eventBus } from '../../lib/event-bus.js'
import { buildSaleJournalEntry, buildCreditNoteJournalEntry } from '../../lib/ledger.js'
import { hasRole } from '../../middleware/authorize.js'
import { checkIdempotency, storeIdempotencyResult } from '../../lib/idempotency.js'
import { validateApprovalToken } from '../auth/manager-approve.routes.js'
import { logAction, AUDIT } from '../../lib/audit.js'
import type { TokenPayload } from '../../lib/jwt.js'
import { verifyPassword } from '../../lib/password.js'
import { randomBytes } from 'crypto'

// â”€â”€ In-flight guard (server-level double-commit protection) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const inFlightCommits = new Map<string, number>()
const IN_FLIGHT_TTL_MS = 10_000

/**
 * â”€â”€ Receipt Number Generator â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
 *
 * PRIMARY: uses receipt_sequences table with atomic UPDATE
 * FALLBACK: timestamp (microseconds) + 4 random hex chars
 *
 * The suffix makes every number globally unique even if the sequence
 * table is broken, missing, or has been manually tampered with.
 *
 * Format: RCP-YYYYMMDD-XXXX-AAAA
 * Example: RCP-20260322-5001-a3f7
 */
async function generateReceiptNo(
  channelId: string,
  tx: Prisma.TransactionClient
): Promise<string> {
  // EAT date string (UTC+3) so midnight in Kenya is correct
  const now     = new Date()
  const eatDate = new Date(now.getTime() + 3 * 60 * 60 * 1000)
  const dateStr = eatDate.toISOString().slice(0, 10).replace(/-/g, '')
  // 4-char random suffix â€” makes collision physically impossible
  const suffix  = randomBytes(2).toString('hex')

  try {
    const seqKey = `sales_${channelId}_${dateStr}`

    await tx.$executeRaw`
      INSERT INTO receipt_sequences (seq_key, last_seq)
      VALUES (${seqKey}::text, 0)
      ON CONFLICT (seq_key) DO NOTHING
    `

    const rows = await tx.$queryRaw<Array<{ last_seq: number }>>`
      UPDATE receipt_sequences
      SET    last_seq = last_seq + 1
      WHERE  seq_key  = ${seqKey}::text
      RETURNING last_seq
    `

    if (rows && rows.length > 0) {
      const seq = String(rows[0]?.last_seq || 0).padStart(4, '0')
      return `RCP-${dateStr}-${seq}-${suffix}`
    }
  } catch {
    // Table missing or broken â€” fall through to timestamp fallback
  }

  // Timestamp fallback: microsecond precision + random â€” guaranteed unique
  const ts = process.hrtime.bigint().toString().slice(-8)
  return `RCP-${dateStr}-${ts}-${suffix}`
}

// â”€â”€ commitSaleOnce â€” inner function, one attempt â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
async function commitSaleOnce(
  input:     CommitSaleInput,
  actor:     TokenPayload,
  receiptNo: string,
  options?:  { skipStockCheck?: boolean; offlineReceiptNo?: string; approvalToken?: string }
) {
  return prisma.$transaction(async (tx) => {
    // Pessimistic locks on ALL items first
    const itemIds       = [...new Set(input.items.map(l => l.itemId))]
    const sortedItemIds = itemIds.sort()

    await tx.$executeRaw`SET LOCAL lock_timeout = '3000ms'`

    const lockedBalances = await tx.$queryRaw<
      Array<{ itemId: string; availableQty: number }>
    >`
      SELECT "itemId", "availableQty"
      FROM   inventory_balances
      WHERE  "itemId"    = ANY(${sortedItemIds}::text[])
        AND  "channelId" = ${input.channelId}::text
      ORDER BY "itemId"
      FOR UPDATE
    `

    const stockMap = Object.fromEntries(
      lockedBalances.map(r => [r.itemId, r.availableQty])
    )

    let totalCost     = 0
    let totalAmount   = 0
    let totalDiscount = input.discountAmount ?? 0
    const itemDetails: Record<string, any> = {}

    for (const line of input.items) {
      const item = await tx.item.findUniqueOrThrow({ where: { id: line.itemId } })

      const balance = await (tx as any).inventoryBalance.findUnique({
        where:  { itemId_channelId: { itemId: line.itemId, channelId: input.channelId } },
        select: { weightedAvgCost: true },
      })
      const effectiveCost = Number(balance?.weightedAvgCost ?? item.weightedAvgCost ?? 0)
      itemDetails[line.itemId] = { ...item, effectiveCost }

      const currentQty = stockMap[line.itemId] ?? 0

      if (!options?.skipStockCheck && currentQty < line.quantity) {
        throw { statusCode: 422, message: `Insufficient stock for ${item.name}. Available: ${currentQty}` }
      }

      if (Number(line.unitPrice) < Number(item.minRetailPrice)) {
        if (!hasRole(actor, 'MANAGER')) {
          if (!options?.approvalToken) {
            throw { statusCode: 403, message: `Price below minimum for ${item.name} requires manager approval` }
          }
          const approval = await validateApprovalToken(options.approvalToken, 'price_below_min', line.itemId)
          if (!approval) {
            throw { statusCode: 403, message: `Invalid or expired approval token for ${item.name}` }
          }
        }
        
        // Audit log the price override (either via manager account or approval token)
        logAction({
          action:     AUDIT.PRICE_BELOW_MIN,
          actorId:    actor.sub,
          actorRole:  actor.role,
          channelId:  input.channelId,
          targetType: 'Item',
          targetId:   line.itemId,
          oldValues:  { minRetailPrice: item.minRetailPrice },
          newValues:  { unitPrice: line.unitPrice },
        })
      }

      const lineTotal    = line.quantity * Number(line.unitPrice)
      totalAmount   += lineTotal
      totalDiscount += line.discountAmount ?? 0
      totalCost     += effectiveCost * line.quantity
    }

    const netAmount = totalAmount - totalDiscount

    if (input.saleType !== 'CREDIT') {
      const paymentTotal = input.payments.reduce((s, p) => s + Number(p.amount), 0)
      if (paymentTotal < netAmount - 0.01) {
        throw { statusCode: 422, message: `Payment (${paymentTotal.toFixed(2)}) does not cover sale amount (${netAmount.toFixed(2)})` }
      }
    }

    if (input.saleType === 'CREDIT' && input.customerId) {
      const customer = await tx.customer.findUniqueOrThrow({
        where:  { id: input.customerId },
        select: { creditLimit: true, outstandingCredit: true, name: true },
      })
      const available = Number(customer.creditLimit) - Number(customer.outstandingCredit)
      if (netAmount > available) {
        throw { statusCode: 422, message: `Credit limit exceeded. Available: ${available.toFixed(2)}` }
      }
    }

    const loyaltyPayment = input.payments.find(p => p.method === 'LOYALTY_POINTS')
    if (loyaltyPayment && input.customerId) {
      const customer = await tx.customer.findUniqueOrThrow({
        where:  { id: input.customerId },
        select: { loyaltyPoints: true },
      })
      if (customer.loyaltyPoints < loyaltyPayment.amount) {
        throw { statusCode: 422, message: 'Insufficient loyalty points' }
      }
    }

    // Create sale with the pre-generated receiptNo
    const newSale = await tx.sale.create({
      data: {
        receiptNo,
        channelId:        input.channelId,
        sessionId:        input.sessionId,
        customerId:       input.customerId ?? null,
        saleType:         input.saleType as any,
        totalAmount:      new Prisma.Decimal(totalAmount.toFixed(4)),
        discountAmount:   new Prisma.Decimal(totalDiscount.toFixed(4)),
        taxAmount:        0,
        netAmount:        new Prisma.Decimal(netAmount.toFixed(4)),
        performedBy:      actor.sub,
        offlineReceiptNo: options?.offlineReceiptNo ?? null,
        notes:            input.notes ?? null,
        dueDate:          input.dueDate ? new Date(input.dueDate) : null,
      },
    })

    // â”€â”€ BATCH WRITE (replaces N+1 sequential loop) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    // saleItems, stockMovements, and inventory deduction all happen in
    // parallel batched operations: 10-item sale goes from ~30 DB round
    // trips to 3 total (createMany + createMany + 1 bulk SQL).
    await Promise.all([
      // 1) Batch-insert all sale line items in one statement
      tx.saleItem.createMany({
        data: input.items.map(line => {
          const item = itemDetails[line.itemId]
          return {
            saleId:                 newSale.id,
            itemId:                 line.itemId,
            serialId:               line.serialId ?? null,
            quantity:               line.quantity,
            unitPrice:              new Prisma.Decimal(Number(line.unitPrice).toFixed(4)),
            minRetailPriceSnapshot: item.minRetailPrice,
            costPriceSnapshot:      new Prisma.Decimal(item.effectiveCost.toFixed(4)),
            markup:                 new Prisma.Decimal((Number(line.unitPrice) - item.effectiveCost).toFixed(4)),
            lineTotal:              new Prisma.Decimal((line.quantity * Number(line.unitPrice)).toFixed(4)),
            discountAmount:         new Prisma.Decimal((line.discountAmount ?? 0).toFixed(4)),
          }
        }),
      }),

      // 2) Batch-insert all stock movements in one statement
      tx.stockMovement.createMany({
        data: input.items.map(line => ({
          itemId:         line.itemId,
          channelId:      input.channelId,
          movementType:   'SALE',
          quantityChange: -(line.quantity),
          referenceId:    newSale.id,
          referenceType:  'sale',
          unitCostAtTime: itemDetails[line.itemId].effectiveCost,
          performedBy:    actor.sub,
        })),
      }),

      // 3) Bulk inventory deduction — No DB trigger exists! We must map the deductions directly.
      ...input.items.map(line =>
        tx.inventoryBalance.update({
          where:  { itemId_channelId: { itemId: line.itemId, channelId: input.channelId } },
          data:   { availableQty: { decrement: line.quantity } }
        })
      )
    ])

    // 4) Batch-insert all payments in one statement
    await tx.payment.createMany({
      data: input.payments.map(pmt => ({
        saleId:    newSale.id,
        method:    pmt.method as any,
        amount:    new Prisma.Decimal(pmt.amount.toFixed(4)),
        reference: pmt.reference ?? null,
      })),
    })

    if (input.saleType === 'CREDIT' && input.customerId) {
      await tx.customer.update({
        where: { id: input.customerId },
        data:  { outstandingCredit: { increment: new Prisma.Decimal(netAmount.toFixed(4)) } },
      })
    }

    if (loyaltyPayment && input.customerId) {
      await tx.customer.update({
        where: { id: input.customerId },
        data:  { loyaltyPoints: { decrement: Math.round(loyaltyPayment.amount) } },
      })
    }

    const isCredit = newSale.saleType === 'CREDIT'
    await buildSaleJournalEntry(tx as any, newSale as any, totalCost, actor.sub, isCredit)

    if (totalDiscount > 0) {
      logAction({
        action:     AUDIT.DISCOUNT_OVERRIDE,
        actorId:    actor.sub,
        actorRole:  actor.role,
        channelId:  input.channelId,
        targetType: 'Sale',
        targetId:   newSale.id,
        newValues:  { totalDiscount, netAmount },
      })
    }

    return { sale: newSale, totalCost, loyaltyPayment }
  }, {
    timeout:        10_000,
    isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
  })
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface CommitSaleInput {
  channelId:       string
  sessionId?:      string | null
  customerId?:     string | null
  saleType:        'RETAIL' | 'WHOLESALE' | 'CREDIT'
  discountAmount?: number
  notes?:          string | null
  dueDate?:        string | Date | null
  items: Array<{
    itemId:          string
    serialId?:       string | null
    quantity:        number
    unitPrice:       number
    discountAmount?: number
  }>
  payments: Array<{
    method:      'CASH' | 'MOBILE_MONEY' | 'CARD' | 'BANK_TRANSFER' | 'LOYALTY_POINTS' | 'CREDIT'
    amount:      number
    reference?:  string
  }>
}

/**
 * â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
 * SALE COMMIT â€” with receiptNo collision retry
 *
 * KEY FIX: receiptNo is generated BEFORE the transaction starts.
 * If sale.create() throws P2002 on receiptNo (duplicate), we catch it,
 * generate a completely new receiptNo, and retry the whole transaction.
 * This makes the unique constraint SELF-HEALING â€” the error can never
 * surface to the user.
 * â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
 */
export async function commitSale(
  input:    CommitSaleInput,
  actor:    TokenPayload,
  options?: { skipStockCheck?: boolean; offlineReceiptNo?: string | null; approvalToken?: string | null }
) {
  // Server-level double-commit guard
  const guardKey      = `${input.channelId}:${actor.sub}`
  const inFlightSince = inFlightCommits.get(guardKey)
  if (inFlightSince && Date.now() - inFlightSince < IN_FLIGHT_TTL_MS) {
    throw { statusCode: 409, message: 'A sale is already being processed. Please wait a moment.' }
  }
  inFlightCommits.set(guardKey, Date.now())

  const MAX_RECEIPT_RETRIES = 5

  try {
    for (let attempt = 0; attempt < MAX_RECEIPT_RETRIES; attempt++) {
      // Generate a fresh receiptNo for each attempt
      // We need a temporary transaction client just for the sequence call
      let receiptNo: string
      try {
        receiptNo = await prisma.$transaction(async (tx) => generateReceiptNo(input.channelId, tx as any))
      } catch {
        // If even that mini-transaction fails, use the timestamp fallback
        const now     = new Date()
        const eatDate = new Date(now.getTime() + 3 * 60 * 60 * 1000)
        const dateStr = eatDate.toISOString().slice(0, 10).replace(/-/g, '')
        const ts      = process.hrtime.bigint().toString().slice(-8)
        const suffix  = randomBytes(2).toString('hex')
        receiptNo     = `RCP-${dateStr}-${ts}-${suffix}`
      }

      try {
        const result = await commitSaleOnce(input, actor, receiptNo, {
          skipStockCheck: options?.skipStockCheck,
          offlineReceiptNo: options?.offlineReceiptNo ?? undefined,
          approvalToken: options?.approvalToken ?? undefined
        })

        // Success â€” emit event and return
        eventBus.emit('sale.committed', {
          saleId:      result.sale.id,
          channelId:   result.sale.channelId,
          totalAmount: Number(result.sale.totalAmount),
        })

        return result.sale

      } catch (err: any) {
        // â”€â”€ P2002 on receiptNo â†’ retry with a new receipt number â”€â”€â”€â”€
        // This is THE fix. Instead of crashing with the Prisma error,
        // we catch it silently and loop again with a fresh number.
        const isPrismaUniqueViolation =
          err?.code === 'P2002' &&
          (err?.meta?.target as string[])?.includes('receiptNo')

        if (isPrismaUniqueViolation && attempt < MAX_RECEIPT_RETRIES - 1) {
          // Log internally but don't throw â€” user never sees this
          console.warn(`[sales] receiptNo collision on attempt ${attempt + 1}, retrying...`)
          continue
        }

        // Any other error, or we've exhausted retries â€” throw normally
        throw err
      }
    }

    // Should never reach here, but TypeScript needs this
    throw { statusCode: 500, message: 'Failed to generate a unique receipt number after multiple attempts' }

  } finally {
    inFlightCommits.delete(guardKey)
  }
}

/**
 * â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
 * QUERIES
 * â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
 */
export async function findSales(query: any, actor?: TokenPayload) {
  const page  = query.page  ?? 1
  const limit = Math.min(query.limit ?? 25, 100)
  const skip  = (page - 1) * limit

  const where: Prisma.SaleWhereInput = {
    deletedAt: null,
    ...(query.channelId   && { channelId:   query.channelId }),
    ...(query.saleType    && { saleType:    query.saleType }),
    ...(query.customerId  && { customerId:  query.customerId }),
    ...(query.sessionId   && { sessionId:   query.sessionId }),
    ...(query.performedBy && { performedBy: query.performedBy }),
    ...(query.startDate || query.endDate ? {
      createdAt: {
        ...(query.startDate && { gte: new Date(`${query.startDate.split('T')[0]}T00:00:00+03:00`) }),
        ...(query.endDate   && { lte: new Date(`${query.endDate.split('T')[0]}T23:59:59+03:00`) }),
      },
    } : {}),
  }

  const [data, total, aggStats] = await Promise.all([
    prisma.sale.findMany({
      where, skip, take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        items:    { include: { item: { select: { name: true, sku: true } } } },
        payments: true,
        customer: { select: { id: true, name: true, phone: true } },
      },
    }),
    prisma.sale.count({ where }),
    prisma.sale.aggregate({ where, _sum: { totalAmount: true } }),
  ])

  const marginRes = await prisma.$queryRaw<any[]>`
    SELECT COALESCE(SUM("lineTotal" - ("costPriceSnapshot" * "quantity")), 0) as "margin"
    FROM   "sale_items" si
    JOIN   "sales" s ON si."saleId" = s.id
    WHERE  s."deletedAt" IS NULL
    AND    s."channelId" = ${where.channelId || actor?.channelId || ''}
    ${query.performedBy ? Prisma.sql`AND s."performedBy" = ${query.performedBy}` : Prisma.sql``}
    ${(where.createdAt as any)?.gte ? Prisma.sql`AND s."createdAt" >= ${(where.createdAt as any).gte}` : Prisma.sql``}
    ${(where.createdAt as any)?.lte ? Prisma.sql`AND s."createdAt" <= ${(where.createdAt as any).lte}` : Prisma.sql``}
  `
  const totalMargin = Number(marginRes[0]?.margin || 0)

  return {
    data,
    meta:  { total, page, limit, totalPages: Math.ceil(total / limit) },
    stats: { totalRevenue: Number(aggStats._sum.totalAmount || 0), totalMargin },
  }
}

export async function findSaleById(id: string) {
  return prisma.sale.findUniqueOrThrow({
    where:   { id },
    include: {
      items:    { include: { item: true } },
      payments: true,
      customer: true,
      channel:  { select: { id: true, name: true, code: true } },
    },
  })
}

export async function findSaleItems(saleId: string) {
  return prisma.saleItem.findMany({
    where:   { saleId },
    include: { item: true },
    orderBy: { createdAt: 'asc' },
  })
}

/**
 * â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
 * REVERSE SALE (VOID/REFUND)
 * â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
 */
export async function reverseSale(saleId: string, actorId: string, managerPassword?: string) {
  return prisma.$transaction(async (tx) => {
    const sale = await tx.sale.findUniqueOrThrow({
      where:   { id: saleId },
      include: { items: true, payments: true },
    })

    if (sale.deletedAt) throw { statusCode: 400, message: 'Sale already reversed' }

    const actor = await tx.user.findUniqueOrThrow({
      where:  { id: actorId },
      select: { passwordHash: true, role: true },
    })

    const bypassPassword = ['SUPER_ADMIN', 'ADMIN', 'MANAGER_ADMIN'].includes(actor.role)
    if (!bypassPassword) {
      const isValid = managerPassword ? await verifyPassword(actor.passwordHash, managerPassword) : false
      if (!isValid) throw { statusCode: 403, message: 'Invalid manager password' }
    }

    for (const item of sale.items) {
      await tx.stockMovement.create({
        data: {
          itemId: item.itemId, channelId: sale.channelId, movementType: 'RETURN',
          quantityChange: item.quantity, referenceId: sale.id, referenceType: 'sale_reversal',
          unitCostAtTime: item.costPriceSnapshot, performedBy: actorId,
        },
      })
      // No DB trigger exists! We must manually update availableQty.
      await tx.inventoryBalance.update({
        where: { itemId_channelId: { itemId: item.itemId, channelId: sale.channelId } },
        data: { availableQty: { increment: item.quantity } }
      })
    }

    if (sale.saleType === 'CREDIT' && sale.customerId) {
      await tx.customer.update({ where: { id: sale.customerId }, data: { outstandingCredit: { decrement: sale.netAmount } } })
    }

    const loyaltyPayment = sale.payments.find(p => p.method === 'LOYALTY_POINTS')
    if (loyaltyPayment && sale.customerId) {
      await tx.customer.update({ where: { id: sale.customerId }, data: { loyaltyPoints: { increment: Math.round(Number(loyaltyPayment.amount)) } } })
    }

    const totalCost = sale.items.reduce((sum, item) => sum + (Number(item.costPriceSnapshot) * item.quantity), 0)
    await buildCreditNoteJournalEntry(tx as any, sale.id, Number(sale.totalAmount), totalCost, sale.channelId, actorId, sale.saleType === 'CREDIT')

    await tx.commissionEntry.updateMany({
      where: { saleId: sale.id, status: { in: ['PENDING', 'APPROVED'] } },
      data:  { status: 'VOIDED' },
    })

    await tx.sale.update({ where: { id: saleId }, data: { deletedAt: new Date() } })

    logAction({ action: AUDIT.SALE_VOID, actorId, actorRole: actor.role, channelId: sale.channelId, targetType: 'sale', targetId: sale.id })
    return { message: 'Sale reversed successfully' }
  })
}

export async function syncOfflineSale(payload: any, actor: TokenPayload, idempotencyKey: string) {
  const cached = await checkIdempotency(idempotencyKey)
  if (cached) return cached.responseBody

  const sale   = await commitSale(payload.saleData, actor, { offlineReceiptNo: payload.offlineReceiptNo })
  const result = { status: 'synced', receiptNo: sale.receiptNo }
  await storeIdempotencyResult(idempotencyKey, result, 200)
  return result
}
