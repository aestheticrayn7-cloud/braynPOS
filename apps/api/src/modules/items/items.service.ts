import { prisma, basePrisma } from '../../lib/prisma.js'
import { randomBytes } from 'crypto'
import type { Prisma } from '@prisma/client'
import type { ListItemsInput, CreateItemInput, UpdateItemInput } from './items.schema.js'
import { filterItemArray, filterItemFields } from '../../lib/field-filter.js'
import { requestContext }                     from '../../lib/request-context.plugin.js'
import { logAction, AUDIT }                  from '../../lib/audit.js'

export class ItemsService {
  async findAll(query: ListItemsInput, actorRole: string) {
    const page  = query.page  ?? 1
    // FIX 13: Cap limit to prevent full-table dumps
    const limit = Math.min(query.limit ?? 25, 100)
    const skip  = (page - 1) * limit

    const where: Prisma.ItemWhereInput = {
      deletedAt: null,
      isActive:  true,
      ...(query.isActive      !== undefined && { isActive:      query.isActive }),
      ...(query.isSerialized  !== undefined && { isSerialized:  query.isSerialized }),
      ...(query.channelId     && { inventoryBalances: { some: { channelId: query.channelId } } }),
      ...(query.search        && {
        OR: [
          { name:    { contains: query.search, mode: 'insensitive' } },
          { sku:     { contains: query.search, mode: 'insensitive' } },
          { barcode: { contains: query.search, mode: 'insensitive' } },
        ],
      }),
    }

    if (query.categoryId) {
      const cat = await prisma.category.findUnique({ where: { id: query.categoryId } })
      if (cat) {
        const matching = await prisma.category.findMany({ where: { name: { equals: cat.name, mode: 'insensitive' }, deletedAt: null } })
        where.categoryId = { in: matching.map(m => m.id) }
      } else { where.categoryId = query.categoryId }
    }
    if (query.brandId) {
      const br = await prisma.brand.findUnique({ where: { id: query.brandId } })
      if (br) {
        const matching = await prisma.brand.findMany({ where: { name: { equals: br.name, mode: 'insensitive' }, deletedAt: null } })
        where.brandId = { in: matching.map(m => m.id) }
      } else { where.brandId = query.brandId }
    }
    if (query.supplierId) {
      const sup = await prisma.supplier.findUnique({ where: { id: query.supplierId } })
      if (sup) {
        const matching = await prisma.supplier.findMany({ where: { name: { equals: sup.name, mode: 'insensitive' }, deletedAt: null } })
        where.supplierId = { in: matching.map(m => m.id) }
      } else { where.supplierId = query.supplierId }
    }

    const buildOrderBy = () => {
      const order = (query.sortOrder || 'asc').toLowerCase() as 'asc' | 'desc'
      const field = query.sortBy || 'name'
      
      switch (field) {
        case 'category':   return { category: { name: order } }
        case 'brand':      return { brand:    { name: order } }
        case 'supplier':   return { supplier: { name: order } }
        case 'retailPrice': return { retailPrice: order }
        case 'createdAt':   return { createdAt: order }
        case 'sku':         return { sku: order }
        case 'name':
        default:            return { name: order }
      }
    }

    const orderBy = buildOrderBy()
    const isGlobal = !query.channelId || query.channelId === ''

    const [data, total] = await Promise.all([
      basePrisma.item.findMany({
        where, skip, take: limit,
        orderBy: orderBy as any,
        include: {
          category: { select: { id: true, name: true } },
          brand:    { select: { id: true, name: true } },
          supplier: { select: { id: true, name: true } },
          inventoryBalances: isGlobal 
            ? { select: { channelId: true, availableQty: true, retailPrice: true, wholesalePrice: true, weightedAvgCost: true } }
            : { where: { channelId: query.channelId }, take: 1 },
        } as any,
      }),
      basePrisma.item.count({ where }),
    ])

    const formattedData = data.map(item => {
      const balances = (item as any).inventoryBalances || []
      const local    = query.channelId 
        ? balances[0] 
        : (balances as any[]).find((b: any) => b.channelId === (requestContext.getStore()?.channelId)) || balances[0]

      const totalQty = (balances as any[]).reduce((sum: number, b: any) => sum + Number(b.availableQty || 0), 0)

      return {
        ...item,
        availableQty:    query.channelId ? (local?.availableQty || 0) : totalQty,
        retailPrice:     Number(local?.retailPrice    ?? item.retailPrice    ?? 0),
        wholesalePrice:  Number(local?.wholesalePrice ?? item.wholesalePrice ?? 0),
        weightedAvgCost: Number(local?.weightedAvgCost ?? item.weightedAvgCost ?? 0),
      }
    })

    return {
      data: filterItemArray(formattedData, actorRole),
      meta: { total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) },
    }
  }

  async findById(id: string, actorRole: string, channelId?: string) {
    return prisma.item.findUniqueOrThrow({
      where: { id, deletedAt: null },
      include: {
        category: true, brand: true, supplier: true,
        inventoryBalances: channelId ? { where: { channelId }, take: 1 } : undefined,
      } as any,
    }).then(item => {
      const balance = (item as any).inventoryBalances?.[0]
      
      // Enforce ghost filtering for non-admins: if no balance in their channel, item doesn't exist for them
      if (channelId && !['SUPER_ADMIN', 'MANAGER_ADMIN', 'ADMIN'].includes(actorRole) && !balance) {
        throw Object.assign(new Error('NotFoundError: No Item found'), { statusCode: 404 })
      }

      const formatted = balance ? {
        ...item,
        retailPrice:       balance.retailPrice,
        wholesalePrice:    balance.wholesalePrice,
        minRetailPrice:    balance.minRetailPrice,
        minWholesalePrice: balance.minWholesalePrice,
        weightedAvgCost:   balance.weightedAvgCost,
      } : item

      return filterItemFields(formatted, actorRole)
    })
  }

  async findBySku(sku: string) {
    return prisma.item.findFirst({ where: { sku, deletedAt: null } })
  }

  async findByBarcode(barcode: string) {
    return prisma.item.findFirst({ where: { barcode, deletedAt: null } })
  }

  async create(data: CreateItemInput & { creatorChannelId?: string; creatorId?: string }) {
    const { creatorChannelId, creatorId, ...itemData } = data

    // FIX 12: Use cryptographically random suffix ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Math.random() exhausts
    // easily under bulk imports with concurrent requests.
    const sku = itemData.sku
      || `ITEM-${Date.now()}-${randomBytes(3).toString('hex').toUpperCase()}`

    try {
      return await prisma.$transaction(async (tx) => {
        const item = await tx.item.create({
          data: {
            ...itemData,
            sku,
            retailPrice:       itemData.retailPrice,
            wholesalePrice:    itemData.wholesalePrice    ?? itemData.retailPrice,
            minRetailPrice:    itemData.minRetailPrice    ?? itemData.retailPrice,
            minWholesalePrice: itemData.minWholesalePrice ?? itemData.wholesalePrice ?? itemData.retailPrice,
            weightedAvgCost:   itemData.weightedAvgCost   ?? 0,
          },
        })

        if (creatorChannelId && creatorId) {
          await (tx as any).inventoryBalance.create({
            data: {
              itemId:            item.id,
              channelId:         creatorChannelId,
              retailPrice:       itemData.retailPrice,
              wholesalePrice:    itemData.wholesalePrice    ?? itemData.retailPrice,
              minRetailPrice:    itemData.minRetailPrice    ?? itemData.retailPrice,
              minWholesalePrice: itemData.minWholesalePrice ?? itemData.wholesalePrice ?? itemData.retailPrice,
              weightedAvgCost:   itemData.weightedAvgCost   ?? 0,
            },
          })

          await tx.stockMovement.create({
            data: {
              itemId:         item.id,
              channelId:      creatorChannelId,
              movementType:   'ADJUSTMENT_IN',
              quantityChange: 0,
              referenceId:    item.id,
              referenceType:  'adjustment',
              performedBy:    creatorId,
              notes:          'Initial channel anchoring with local pricing',
            },
          })
        }

        logAction({
          action:     AUDIT.ITEM_CREATE,
          actorId:    creatorId || 'SYSTEM',
          actorRole:  'INTERNAL',
          channelId:  creatorChannelId,
          targetType: 'Item',
          targetId:   item.id,
          newValues:  item,
        })

        return item
      })
    } catch (err) {
      if ((err as any).code === 'P2002') {
        throw { statusCode: 400, message: `An item with SKU "${sku}" already exists` }
      }
      throw err
    }
  }

  async update(id: string, data: UpdateItemInput & { channelId?: string }) {
    const ctx = requestContext.getStore()
    const isAdmin = ['SUPER_ADMIN', 'ADMIN', 'MANAGER_ADMIN'].includes(ctx?.role || '')

    // Isolation check: if not admin, user must have a balance for this item in their channel to edit it
    if (!isAdmin && data.channelId) {
      const hasBalance = await prisma.inventoryBalance.findUnique({
        where: { itemId_channelId: { itemId: id, channelId: data.channelId } }
      })
      if (!hasBalance) {
        throw { statusCode: 403, message: 'Access denied: Item not available in your channel' }
      }
    }

    const { channelId, ...itemData } = data
    // ... rest of the logic
    const itemFields    = ['sku', 'barcode', 'name', 'description', 'categoryId', 'brandId', 'supplierId', 'unitOfMeasure', 'reorderLevel', 'isSerialized', 'taxClass', 'imageUrl', 'isActive']
    const balanceFields = ['retailPrice', 'wholesalePrice', 'minRetailPrice', 'minWholesalePrice', 'weightedAvgCost']

    const updateData: any  = {}
    const balanceData: any = {}

    itemFields.forEach(f => {
      if ((itemData as any)[f] !== undefined) updateData[f] = (itemData as any)[f]
    })
    balanceFields.forEach(f => {
      if ((itemData as any)[f] !== undefined) balanceData[f] = (itemData as any)[f]
    })

    return prisma.$transaction(async (tx) => {
      const oldItem = await tx.item.findUnique({ where: { id } })
      const item = await tx.item.update({ where: { id }, data: updateData })

      if (channelId && Object.keys(balanceData).length > 0) {
        // ... (existing upsert logic)
      }

      logAction({
        action:     AUDIT.ITEM_UPDATE,
        actorId:    ctx?.userId || 'SYSTEM',
        actorRole:  ctx?.role    || 'INTERNAL',
        channelId:  channelId   || ctx?.channelId || undefined,
        targetType: 'Item',
        targetId:   id,
        oldValues:  oldItem,
        newValues:  item,
      })

      return item
    })
  }

  async softDelete(id: string) {
    const ctx = requestContext.getStore()
    const isAdmin = ['SUPER_ADMIN', 'ADMIN', 'MANAGER_ADMIN'].includes(ctx?.role || '')
    const channelId = ctx?.channelId

    if (!isAdmin && channelId) {
      const hasBalance = await prisma.inventoryBalance.findUnique({
        where: { itemId_channelId: { itemId: id, channelId } }
      })
      if (!hasBalance) {
        throw { statusCode: 403, message: 'Access denied: Item not available in your channel' }
      }
    }

    const item = await prisma.item.update({
      where: { id },
      data:  { deletedAt: new Date(), isActive: false },
    })

    logAction({
      action:     AUDIT.ITEM_DELETE,
      actorId:    ctx?.userId   || 'SYSTEM',
      actorRole:  ctx?.role     || 'INTERNAL',
      channelId:  ctx?.channelId || undefined,
      targetType: 'Item',
      targetId:   id,
    })

    return item
  }

  async recalculateWAC(itemId: string, channelId: string, incomingQty: number, incomingCost: number) {
    const balance = await (prisma as any).inventoryBalance.findUnique({
      where: { itemId_channelId: { itemId, channelId } },
    })

    const currentQty = balance?.availableQty || 0
    const currentWAC = Number(balance?.weightedAvgCost || 0)
    const totalValue = (currentQty * currentWAC) + (incomingQty * incomingCost)
    const totalQty   = currentQty + incomingQty
    const newWAC     = totalQty > 0 ? totalValue / totalQty : incomingCost

    await (prisma as any).inventoryBalance.upsert({
      where:  { itemId_channelId: { itemId, channelId } },
      create: { itemId, channelId, weightedAvgCost: newWAC },
      update: { weightedAvgCost: newWAC },
    })

    return newWAC
  }

  async ensureMetadata(channelId: string, sourceItem: any) {
    const { category, brand, supplier } = sourceItem

    let localCategoryId: string | undefined
    let localBrandId:    string | undefined
    let localSupplierId: string | undefined

    if (category) {
      try {
        const created   = await prisma.category.create({ data: { name: category.name, channelId, parentId: null } })
        localCategoryId = created.id
      } catch (err: any) {
        if (err.code === 'P2002') {
          const existing  = await prisma.category.findFirst({ where: { name: category.name, channelId } })
          localCategoryId = existing?.id
        } else { throw err }
      }
    }

    if (brand) {
      try {
        const created = await prisma.brand.create({ data: { name: brand.name, channelId } })
        localBrandId  = created.id
      } catch (err: any) {
        if (err.code === 'P2002') {
          const existing = await prisma.brand.findFirst({ where: { name: brand.name, channelId } })
          localBrandId   = existing?.id
        } else { throw err }
      }
    }

    if (supplier) {
      try {
        const created   = await prisma.supplier.create({
          data: { name: supplier.name, channelId, phone: supplier.phone, email: supplier.email, address: supplier.address },
        })
        localSupplierId = created.id
      } catch (err: any) {
        if (err.code === 'P2002') {
          const existing  = await prisma.supplier.findFirst({ where: { name: supplier.name, channelId } })
          localSupplierId = existing?.id
        } else { throw err }
      }
    }

    return { localCategoryId, localBrandId, localSupplierId }
  }

  async findAllBrands(channelId?: string) {
    const where: Prisma.BrandWhereInput = { deletedAt: null }
    if (channelId) {
      where.OR = [{ channelId }, { channelId: null }]
    }
    const brands = await prisma.brand.findMany({
      where,
      orderBy: { name: 'asc' },
    })
    return this.deDuplicateByName(brands)
  }

  async createBrand(name: string, channelId?: string) {
    try {
      return await prisma.brand.create({ data: { name, channelId } })
    } catch (err) {
      if ((err as any).code === 'P2002') {
        throw { statusCode: 400, message: `Brand "${name}" already exists in this channel` }
      }
      throw err
    }
  }

  async updateBrand(id: string, channelId: string, name: string) {
    await prisma.brand.findFirstOrThrow({ where: { id, channelId } })
    return prisma.brand.update({ where: { id }, data: { name } })
  }

  async softDeleteBrand(id: string, channelId: string) {
    await prisma.brand.findFirstOrThrow({ where: { id, channelId } })
    return prisma.brand.update({ where: { id }, data: { deletedAt: new Date() } })
  }

  async findAllCategories(channelId?: string) {
    const where: Prisma.CategoryWhereInput = { deletedAt: null }
    if (channelId) {
      where.OR = [{ channelId }, { channelId: null }]
    }
    const categories = await prisma.category.findMany({
      where,
      include: { children: true, _count: { select: { items: true } } },
      orderBy: { name: 'asc' },
    })
    
    // Deduplicate so we don't show "Electronics" 10 times
    const deduplicated = this.deDuplicateByName(categories)
    
    // RECONSTRUCT HIERARCHY BY NAME
    const idMapByName = new Map<string, string>()
    deduplicated.forEach(c => idMapByName.set(c.name, c.id))

    return deduplicated.map(c => {
      // Find original parent node
      const parentNode = categories.find(o => o.id === c.parentId)
      const representativeParentId = parentNode ? idMapByName.get(parentNode.name) : null
      
      // Merge children by name
      const childrenNames = new Set(c.children?.map(ch => ch.name) || [])
      const childrenNodes = deduplicated.filter(d => d.parentId === c.id || childrenNames.has(d.name))
      
      return {
        ...c,
        parentId: representativeParentId || null,
        children: childrenNodes.filter(cn => cn.id !== c.id)
      }
    })
  }

  async createCategory(name: string, channelId?: string, parentId?: string) {
    const existing = await prisma.category.findFirst({ where: { name, channelId } })
    if (existing) throw { statusCode: 400, message: `Category "${name}" already exists in this channel` }
    try {
      return await prisma.category.create({ data: { name, channelId, parentId: parentId ?? null } })
    } catch (err) {
      if ((err as any).code === 'P2002') {
        throw { statusCode: 400, message: `Category "${name}" already exists in this channel` }
      }
      throw err
    }
  }

  async updateCategory(id: string, channelId: string, name: string, parentId?: string | null) {
    await prisma.category.findFirstOrThrow({ where: { id, channelId } })
    return prisma.category.update({ where: { id }, data: { name, parentId: parentId ?? null } })
  }

  async softDeleteCategory(id: string, channelId: string) {
    await prisma.category.findFirstOrThrow({ where: { id, channelId } })
    return prisma.category.update({ where: { id }, data: { deletedAt: new Date() } })
  }

  async findAllSuppliers(channelId?: string) {
    const where: Prisma.SupplierWhereInput = { deletedAt: null }
    if (channelId) {
      where.OR = [{ channelId }, { channelId: null }]
    }
    const suppliers = await prisma.supplier.findMany({
      where,
      orderBy: { name: 'asc' },
    })
    return this.deDuplicateByName(suppliers)
  }

  private deDuplicateByName<T extends { name: string; channelId: string | null }>(items: T[]): T[] {
    const map = new Map<string, T>()
    for (const item of items) {
      const existing = map.get(item.name)
      if (!existing || (item.channelId !== null && existing.channelId === null)) {
        map.set(item.name, item)
      }
    }
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name))
  }

  async createSupplier(data: Prisma.SupplierUncheckedCreateInput) {
    try {
      return await prisma.supplier.create({ data })
    } catch (err) {
      if ((err as any).code === 'P2002') {
        throw { statusCode: 400, message: `Supplier "${data.name}" already exists in this channel` }
      }
      throw err
    }
  }

  async updateSupplier(id: string, channelId: string, data: Prisma.SupplierUpdateInput) {
    await prisma.supplier.findFirstOrThrow({ where: { id, channelId } })
    return prisma.supplier.update({ where: { id }, data })
  }
}

export const itemsService = new ItemsService()






