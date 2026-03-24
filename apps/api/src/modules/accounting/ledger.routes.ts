import type { FastifyPluginAsync } from 'fastify'
import { ledgerService } from './ledger.service.js'
import { authenticate } from '../../middleware/authenticate.js'
import { authorize } from '../../middleware/authorize.js'
import { z } from 'zod'

export const ledgerRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', authenticate)

  // GET /accounting/journal-entries
  app.get('/journal-entries', {
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER')],
  }, async (request) => {
    const query = z.object({
      channelId: z.string().uuid().optional(),
      referenceType: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      page: z.coerce.number().min(1).optional(),
      limit: z.coerce.number().min(1).max(100).optional(),
    }).parse(request.query)

    if (!['SUPER_ADMIN', 'MANAGER_ADMIN'].includes(request.user.role)) {
      query.channelId = request.user.channelId || undefined
    }

    return ledgerService.getJournalEntries(query)
  })

  // GET /accounting/journal-entries/:id
  app.get('/journal-entries/:id', {
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER')],
  }, async (request) => {
    const { id } = request.params as { id: string }
    return ledgerService.getJournalEntry(id)
  })

  // GET /accounting/trial-balance
  app.get('/trial-balance', {
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER')],
  }, async (request) => {
    const query = z.object({
      asOfDate: z.string().optional(),
      channelId: z.string().uuid().optional(),
    }).parse(request.query)

    let cid = query.channelId
    if (!['SUPER_ADMIN', 'MANAGER_ADMIN'].includes(request.user.role)) {
      cid = request.user.channelId || undefined
    }

    return ledgerService.getTrialBalance(query.asOfDate, cid)
  })

  // GET /accounting/ledger/:accountId
  app.get('/ledger/:accountId', {
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER')],
  }, async (request) => {
    const { accountId } = request.params as { accountId: string }
    const query = z.object({
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      page: z.coerce.number().min(1).optional(),
      limit: z.coerce.number().min(1).max(100).optional(),
      channelId: z.string().uuid().optional(),
    }).parse(request.query)

    if (!['SUPER_ADMIN', 'MANAGER_ADMIN'].includes(request.user.role)) {
      query.channelId = request.user.channelId || undefined
    }

    return ledgerService.getAccountLedger(accountId, query)
  })

  // GET /accounting/profit-loss
  app.get('/profit-loss', {
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER')],
  }, async (request) => {
    const query = z.object({
      startDate: z.string(),
      endDate: z.string(),
      channelId: z.string().uuid().optional(),
    }).parse(request.query)

    let cid = query.channelId
    if (!['SUPER_ADMIN', 'MANAGER_ADMIN'].includes(request.user.role)) {
      cid = request.user.channelId || undefined
    }

    return ledgerService.getProfitLoss(query.startDate, query.endDate, cid)
  })

  // GET /accounting/balance-sheet
  app.get('/balance-sheet', {
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER')],
  }, async (request) => {
    const query = z.object({
      asOfDate: z.string().optional(),
      channelId: z.string().uuid().optional(),
    }).parse(request.query)

    let cid = query.channelId
    if (!['SUPER_ADMIN', 'MANAGER_ADMIN'].includes(request.user.role)) {
      cid = request.user.channelId || undefined
    }

    return ledgerService.getBalanceSheet(query.asOfDate, cid)
  })

  // GET /accounting/inventory-balances — live stock from inventory_balances
  app.get('/inventory-balances', {
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN', 'ADMIN', 'MANAGER', 'STOREKEEPER', 'CASHIER', 'SALES_PERSON')],
  }, async (request) => {
    let { channelId } = z.object({
      channelId: z.string().uuid().optional(),
    }).parse(request.query)

    // Secure channelId: Non-admins (and branch admins) can only view their own channel
    if (!['SUPER_ADMIN', 'MANAGER_ADMIN'].includes(request.user.role)) {
      channelId = request.user.channelId || 'NONE' 
    }

    const { stockService } = await import('../stock/stock.service.js')
    if (channelId && channelId !== 'NONE') {
      return stockService.getChannelBalances(channelId)
    }
    
    // Safety check for Branch Admins/Managers/Storekeepers who somehow got here without a channelId
    if (!['SUPER_ADMIN', 'MANAGER_ADMIN'].includes(request.user.role)) {
      return []
    }
    // Return all balances across all channels (Admin only)
    const { prisma } = await import('../../lib/prisma.js')
    return prisma.$queryRaw`
      SELECT ib."itemId", ib."channelId", ib."availableQty", ib."lastMovementAt"
      FROM inventory_balances ib
      ORDER BY ib."lastMovementAt" DESC
    `
  })
}
