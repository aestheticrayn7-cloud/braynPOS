import { prisma } from '../../lib/prisma.js'
import type { Prisma } from '@prisma/client'

export class CustomersService {
  async findAll(query: {
    channelId?: string
    page?:      number
    limit?:     number
    search?:    string
    tier?:      string
  }) {
    const page  = query.page  ?? 1
    const limit = Math.min(query.limit ?? 25, 100)
    const skip  = (page - 1) * limit

    const where: Prisma.CustomerWhereInput = {
      // FIX 4: Exclude soft-deleted customers from all list results
      deletedAt: null,
      // When channelId is undefined (HQ), no channel filter applied — returns all
      ...(query.channelId !== undefined && { channelId: query.channelId }),
      ...(query.tier    && { tier: query.tier as Prisma.EnumCustomerTierFilter }),
      ...(query.search  && {
        OR: [
          { name:  { contains: query.search, mode: 'insensitive' } },
          { phone: { contains: query.search } },
          { email: { contains: query.search, mode: 'insensitive' } },
        ],
      }),
    }

    const [data, total] = await Promise.all([
      prisma.customer.findMany({ where, skip, take: limit, orderBy: { name: 'asc' } }),
      prisma.customer.count({ where }),
    ])

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } }
  }

  async findById(id: string, channelId?: string) {
    return prisma.customer.findFirstOrThrow({
      where: {
        id,
        deletedAt: null,
        ...(channelId !== undefined && { channelId }),
      },
      include: {
        _count: { select: { sales: true, loyaltyTransactions: true } },
      },
    })
  }

  private calculateDefaultLimit(tier: 'BRONZE' | 'SILVER' | 'GOLD'): number {
    switch (tier) {
      case 'GOLD':   return 10000
      case 'SILVER': return 5000
      case 'BRONZE':
      default:       return 1000
    }
  }

  async create(data: Prisma.CustomerUncheckedCreateInput) {
    if (!data.creditLimit || Number(data.creditLimit) === 0) {
      const tier = (data.tier as 'BRONZE' | 'SILVER' | 'GOLD') || 'BRONZE'
      data.creditLimit = this.calculateDefaultLimit(tier)
    }
    try {
      return await prisma.customer.create({ data })
    } catch (err) {
      if ((err as any).code === 'P2002') {
        throw { statusCode: 400, message: 'A customer with this phone number already exists in this channel' }
      }
      throw err
    }
  }

  // FIX 10: channelId is now optional (undefined for HQ users).
  // Previously callers passed '' (empty string) for HQ which produced
  // WHERE channelId = '' — matching no records and always throwing 404.
  async update(id: string, channelId: string | undefined, data: Prisma.CustomerUpdateInput) {
    try {
      return await prisma.customer.update({
        where: {
          id,
          ...(channelId !== undefined && { channelId }),
        },
        data,
      })
    } catch (err) {
      if ((err as any).code === 'P2002') {
        throw { statusCode: 400, message: 'Another customer in this channel already uses this phone number' }
      }
      throw err
    }
  }

  // FIX 10: channelId optional for HQ — same fix as update()
  async softDelete(id: string, channelId: string | undefined) {
    await this.findById(id, channelId)
    return prisma.customer.update({
      where: {
        id,
        ...(channelId !== undefined && { channelId }),
      },
      data: { deletedAt: new Date() },
    })
  }

  async findCustomersByBrandPurchased(channelId: string, brandId: string, daysLookback = 90) {
    // Audit finding: CRM Outreach (Filter by Brand Purchase)
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - daysLookback)

    const customerIds = await prisma.$queryRaw<Array<{ customerId: string }>>`
      SELECT DISTINCT s."customerId"
      FROM sales s
      JOIN sale_items si ON si."saleId" = s.id
      JOIN items i ON i.id = si."itemId"
      WHERE s."channelId" = ${channelId}
        AND i."brandId" = ${brandId}
        AND s."createdAt" >= ${startDate}
        AND s."deletedAt" IS NULL
        AND s."customerId" IS NOT NULL
    `
    
    if (customerIds.length === 0) return []

    return prisma.customer.findMany({
      where: { id: { in: customerIds.map(c => c.customerId) }, deletedAt: null }
    })
  }
}

export const customersService = new CustomersService()
