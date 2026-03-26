import type { FastifyPluginAsync } from 'fastify'
import { itemsService }           from './items.service.js'
import { csvImportService }       from './csv-import.service.js'
import {
  createItemSchema, updateItemSchema,
  listItemsQuery,  stockAdjustmentSchema,
} from './items.schema.js'
import { authenticate }           from '../../middleware/authenticate.js'
import { authorize }              from '../../middleware/authorize.js'
import { prisma }                 from '../../lib/prisma.js'
import { validateApprovalToken }  from '../auth/manager-approve.routes.js'
import { RATE }                   from '../../lib/rate-limit.plugin.js'
import { z }                      from 'zod'
import { eventBus }               from '../../lib/event-bus.js'
import '@fastify/multipart'
import { MultipartFile } from '@fastify/multipart'

export const itemsRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', authenticate)

  // GET /items
  app.get('/', {
    config:     RATE.READ,
    preHandler: [authorize(
      'SUPER_ADMIN', 'MANAGER_ADMIN', 'ADMIN', 'MANAGER',
      'CASHIER', 'SALES_PERSON', 'STOREKEEPER', 'PROMOTER',
    )],
  }, async (request) => {
    const query = listItemsQuery.parse(request.query)
    // Removed debug log for query
    
    if (!['SUPER_ADMIN', 'MANAGER_ADMIN', 'ADMIN'].includes(request.user.role)) {
      query.channelId = request.user.channelId || undefined
    }
    return itemsService.findAll(query, request.user.role)
  })

  // PATCH /items/settings
  app.patch('/settings', {
    preHandler: [authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER_ADMIN', 'MANAGER')],
    schema: { body: { type: 'object' } },
  }, async (request) => {
    const body = request.body as Record<string, any>
    const { settingsService } = await import('../dashboard/settings.service.js')
    // FIX 2: use .sub consistently — .id and .sub are both userId but .sub is canonical
    return settingsService.bulkUpdate(body, request.user.sub, request.user.channelId ?? null)
  })

  // GET /items/:id
  // FIX 7: Added authorize() — was open to any authenticated user.
  // filterItemFields hides cost prices for low-privilege roles, but
  // that's a field filter not an access guard — the DB was still queried.
  app.get('/:id', {
    config:     RATE.READ,
    preHandler: [authorize(
      'SUPER_ADMIN', 'MANAGER_ADMIN', 'ADMIN', 'MANAGER',
      'CASHIER', 'SALES_PERSON', 'STOREKEEPER', 'PROMOTER',
    )],
  }, async (request) => {
    const { id } = request.params as { id: string }
    return itemsService.findById(id, request.user.role, request.user.channelId ?? undefined)
  })

  // GET /items/barcode/:barcode
  // FIX 7: Added authorize() — was open to any authenticated user.
  app.get('/barcode/:barcode', {
    config:     RATE.READ,
    preHandler: [authorize(
      'SUPER_ADMIN', 'MANAGER_ADMIN', 'ADMIN', 'MANAGER',
      'CASHIER', 'SALES_PERSON', 'STOREKEEPER', 'PROMOTER',
    )],
  }, async (request) => {
    const { barcode } = request.params as { barcode: string }
    const item = await itemsService.findByBarcode(barcode)
    if (!item) throw { statusCode: 404, message: 'Item not found' }
    return item
  })

  // POST /items
  app.post('/', {
    config:     RATE.APPROVAL,
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER')],
  }, async (request, reply) => {
    const { approvalToken, ...body } = z.object({
      approvalToken: z.string().optional(),
    }).passthrough().parse(request.body) as z.infer<typeof createItemSchema> & { approvalToken?: string }

    const sanitizedBody = {
      ...body,
      brandId:    body.brandId    === '' ? null : body.brandId,
      categoryId: body.categoryId === '' ? null : body.categoryId,
      supplierId: body.supplierId === '' ? null : body.supplierId,
    }

    const item = await itemsService.create({
      ...sanitizedBody,
      creatorChannelId: request.user.channelId || undefined,
      // FIX 2: use .sub not .id
      creatorId:        request.user.sub,
    })
    reply.status(201).send(item)
  })

  // PATCH /items/:id
  app.patch('/:id', {
    config:     RATE.APPROVAL,
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER')],
  }, async (request) => {
    const { id } = request.params as { id: string }
    const body   = updateItemSchema.parse(request.body)

    const sanitizedBody = {
      ...body,
      brandId:    body.brandId    === '' ? null : body.brandId,
      categoryId: body.categoryId === '' ? null : body.categoryId,
      supplierId: body.supplierId === '' ? null : body.supplierId,
    }

    return itemsService.update(id, {
      ...sanitizedBody,
      channelId: request.user.channelId || undefined,
    })
  })

  // DELETE /items/:id
  app.delete('/:id', {
    config:     RATE.APPROVAL,
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER')],
  }, async (request, reply) => {
    const { id }            = request.params as { id: string }
    const { approvalToken } = z.object({ approvalToken: z.string().optional() }).parse(request.body || {})

    if (request.user.role === 'MANAGER') {
      if (!approvalToken) {
        const approval = await prisma.managerApproval.create({
          data: {
            action:      'item_delete',
            contextId:   id,
            channelId:   request.user.channelId || undefined,
            // FIX 2: use .sub not .id
            requesterId: request.user.sub,
          },
        })
        return reply.status(403).send({
          error:      'Administrator Manager approval required for item deletion',
          approvalId: approval.id,
          message:    'An approval request has been sent to the Administrator Manager.',
        })
      }
      // FIX 8: Pass channelId to block cross-channel approval token replay
      const approved = await validateApprovalToken(
        approvalToken, 'item_delete', id, request.user.channelId || undefined
      )
      if (!approved) {
        return reply.status(403).send({ error: 'Invalid or expired Administrator Manager approval' })
      }
    }

    return itemsService.softDelete(id)
  })

  // POST /items/stock-adjustment
  app.post('/stock-adjustment', {
    config:     RATE.APPROVAL,
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER', 'STOREKEEPER')],
  }, async (request) => {
    const body = stockAdjustmentSchema.parse(request.body)

    const item       = await prisma.item.findUniqueOrThrow({ where: { id: body.itemId } })
    const unitPrice  = Number(item.retailPrice)
    const totalValue = unitPrice * Math.abs(body.quantity)

    const THRESHOLD_QTY   = 50
    const THRESHOLD_VALUE = 500
    const isOverThreshold = Math.abs(body.quantity) > THRESHOLD_QTY || totalValue > THRESHOLD_VALUE
    const needsApproval   = isOverThreshold && !['SUPER_ADMIN', 'ADMIN', 'MANAGER_ADMIN'].includes(request.user.role)

    if (needsApproval) {
      const approval = await prisma.managerApproval.create({
        data: {
          action:      'STOCK_ADJUSTMENT',
          contextId:   body.itemId,
          channelId:   body.channelId,
          // FIX 2: use .sub not .id
          requesterId: request.user.sub,
          notes:       `Threshold Exceeded: Qty=${body.quantity}, Value=${totalValue}. Reason: ${body.reason}`,
        },
      })
      return {
        message:    'Adjustment exceeds threshold and requires Manager Approval',
        approvalId: approval.id,
        status:     'PENDING_APPROVAL',
      }
    }

    let movementType: 'ADJUSTMENT_IN' | 'ADJUSTMENT_OUT' | 'OPENING_STOCK'
    if (body.isOpening) {
      const { settingsService } = await import('../dashboard/settings.service.js')
      const globalSettings = await settingsService.getByKey('advancedSettings') as any
      if (!globalSettings?.globalOpeningStockActive) {
        throw { statusCode: 403, message: 'Global opening stock window is closed' }
      }
      const channel = await prisma.channel.findUniqueOrThrow({ where: { id: body.channelId } })
      const flags   = (channel.featureFlags as any) || {}
      if (!flags.openingStockWindowActive && request.user.role !== 'SUPER_ADMIN') {
        throw { statusCode: 403, message: 'Opening stock window is not active for this channel' }
      }
      movementType = 'OPENING_STOCK'
    } else {
      movementType = body.quantity > 0 ? 'ADJUSTMENT_IN' : 'ADJUSTMENT_OUT'
    }

    // FIX 3: Update inventory_balances in a transaction with the stockMovement.
    // Previously only a stockMovement record was written — availableQty
    // was never updated so stock levels never changed from adjustments.
    await prisma.$transaction(async (tx) => {
      await tx.stockMovement.create({
        data: {
          itemId:         body.itemId,
          channelId:      body.channelId,
          movementType:   movementType as any,
          quantityChange: body.quantity,
          referenceId:    body.itemId,
          referenceType:  'adjustment',
          // FIX 2: use .sub not .id
          performedBy:    request.user.sub,
          notes:          `[${body.reasonCode || 'MANUAL'}] ${body.reason}`,
        },
      })

      // Removed manual availableQty update: Trigger on stock_movements now handles it.
    })

    // Emit event for real-time UI updates
    const updatedBalance = await prisma.inventoryBalance.findUnique({
      where: { itemId_channelId: { itemId: body.itemId, channelId: body.channelId } }
    })
    
    eventBus.emit('inventory.updated', {
      itemId:       body.itemId,
      channelId:    body.channelId,
      availableQty: Number(updatedBalance?.availableQty || 0),
      movementType: movementType
    })

    return { message: 'Stock adjustment recorded', movementType, quantity: body.quantity }
  })

  // ── Brands ──────────────────────────────────────────────────────────
  app.get('/brands', { config: RATE.READ }, async (request) => {
    const isHQ = ['SUPER_ADMIN', 'MANAGER_ADMIN', 'ADMIN'].includes(request.user.role)
    return itemsService.findAllBrands(isHQ ? undefined : (request.user.channelId || undefined))
  })

  app.post('/brands', {
    config:     RATE.APPROVAL,
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER')],
  }, async (request, reply) => {
    const { name } = z.object({ name: z.string().min(1) }).parse(request.body)
    const brand = await itemsService.createBrand(name, request.user.channelId || undefined)
    reply.status(201).send(brand)
  })

  app.patch('/brands/:id', {
    config:     RATE.APPROVAL,
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER')],
  }, async (request) => {
    const { id } = request.params as { id: string }
    const isHQ   = ['SUPER_ADMIN', 'MANAGER_ADMIN', 'ADMIN'].includes(request.user.role)
    const { name } = z.object({ name: z.string().min(1) }).parse(request.body)
    return itemsService.updateBrand(id, isHQ ? '' : (request.user.channelId || ''), name)
  })

  app.delete('/brands/:id', {
    config:     RATE.APPROVAL,
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER')],
  }, async (request) => {
    const { id } = request.params as { id: string }
    const isHQ   = ['SUPER_ADMIN', 'MANAGER_ADMIN', 'ADMIN'].includes(request.user.role)
    return itemsService.softDeleteBrand(id, isHQ ? '' : (request.user.channelId || ''))
  })

  // ── Categories ───────────────────────────────────────────────────────
  app.get('/categories', { config: RATE.READ }, async (request) => {
    const isHQ = ['SUPER_ADMIN', 'MANAGER_ADMIN', 'ADMIN'].includes(request.user.role)
    return itemsService.findAllCategories(isHQ ? undefined : (request.user.channelId || undefined))
  })

  app.post('/categories', {
    config:     RATE.APPROVAL,
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER')],
  }, async (request, reply) => {
    const { name, parentId } = z.object({
      name:     z.string().min(1),
      parentId: z.string().optional(),
    }).parse(request.body)
    try {
      const category = await itemsService.createCategory(name, request.user.channelId || undefined, parentId)
      reply.status(201).send(category)
    } catch (err: unknown) {
      if ((err as any)?.code === 'P2002') {
        return reply.status(409).send({ error: `A category named "${name}" already exists.` })
      }
      throw err
    }
  })

  app.patch('/categories/:id', {
    config:     RATE.APPROVAL,
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER')],
  }, async (request, reply) => {
    const { id }             = request.params as { id: string }
    const { name, parentId } = z.object({
      name:     z.string().min(1),
      parentId: z.string().optional().nullable(),
    }).parse(request.body)
    const isHQ = ['SUPER_ADMIN', 'MANAGER_ADMIN', 'ADMIN'].includes(request.user.role)
    try {
      return itemsService.updateCategory(id, isHQ ? '' : (request.user.channelId || ''), name, parentId)
    } catch (err: unknown) {
      if ((err as any)?.code === 'P2002') {
        return reply.status(409).send({ error: `A category named "${name}" already exists.` })
      }
      throw err
    }
  })

  app.delete('/categories/:id', {
    config:     RATE.APPROVAL,
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER')],
  }, async (request) => {
    const { id } = request.params as { id: string }
    const isHQ   = ['SUPER_ADMIN', 'MANAGER_ADMIN', 'ADMIN'].includes(request.user.role)
    return itemsService.softDeleteCategory(id, isHQ ? '' : (request.user.channelId || ''))
  })

  // ── Suppliers ────────────────────────────────────────────────────────
  app.get('/suppliers', { config: RATE.READ }, async (request) => {
    const isHQ = ['SUPER_ADMIN', 'MANAGER_ADMIN', 'ADMIN'].includes(request.user.role)
    return itemsService.findAllSuppliers(isHQ ? undefined : (request.user.channelId || undefined))
  })

  app.post('/suppliers', {
    config:     RATE.APPROVAL,
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER')],
  }, async (request, reply) => {
    const body = z.object({
      name:         z.string().min(1),
      contactName:  z.string().optional(),
      phone:        z.string().min(10).max(13).regex(/^[+0-9]+$/, 'Invalid phone number format'),
      email:        z.string().email().optional(),
      address:      z.string().optional(),
      taxPin:       z.string().optional(),
      paymentTerms: z.string().optional(),
    }).parse(request.body)
    const supplier = await itemsService.createSupplier({ ...body, channelId: request.user.channelId || undefined })
    reply.status(201).send(supplier)
  })

  app.patch('/suppliers/:id', {
    config:     RATE.APPROVAL,
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER')],
  }, async (request) => {
    const { id } = request.params as { id: string }
    const isHQ   = ['SUPER_ADMIN', 'MANAGER_ADMIN', 'ADMIN'].includes(request.user.role)
    const body   = z.object({
      name:         z.string().min(1).optional(),
      contactName:  z.string().optional(),
      phone:        z.string().min(10).max(13).regex(/^[+0-9]+$/).optional(),
      email:        z.string().email().optional().or(z.literal('')),
      address:      z.string().optional(),
      taxPin:       z.string().optional(),
      paymentTerms: z.string().optional(),
    }).parse(request.body)
    return itemsService.updateSupplier(id, isHQ ? '' : (request.user.channelId || ''), body)
  })

  app.delete('/suppliers/:id', {
    config:     RATE.APPROVAL,
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER')],
  }, async (request) => {
    const { id } = request.params as { id: string }
    const isHQ   = ['SUPER_ADMIN', 'MANAGER_ADMIN', 'ADMIN'].includes(request.user.role)
    return itemsService.updateSupplier(
      id,
      isHQ ? '' : (request.user.channelId || ''),
      { deletedAt: new Date() } as never
    )
  })

  // POST /items/import
  app.post('/import', {
    config:     RATE.APPROVAL,
    preHandler: [authorize('SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER')],
  }, async (request) => {
    const data = await request.file()
    if (!data || !data.file) throw { statusCode: 400, message: 'CSV file required' }
    const buffer = await data.toBuffer()
    return csvImportService.importItems(buffer)
  })
}
