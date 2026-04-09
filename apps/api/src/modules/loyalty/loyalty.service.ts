import { prisma } from '../../lib/prisma.js'

export class LoyaltyService {
  /**
   * Earn Points based on Gross Margin (Profit)
   * This strategy ensures points are only awarded if the sale was profitable.
   * Logic: 1 point for every 50 profit units (e.g. KES 50 profit = 1 point)
   */
  async earnPoints(customerId: string, saleId: string, margin: number) {
    if (margin <= 0) return { earned: 0, reason: 'Zero or negative margin' }

    // PROFIT-BASED ACCRUAL: 1 point per 50 units of profit
    const points = Math.floor(margin / 50)
    if (points <= 0) return { earned: 0, reason: 'Profit below reward threshold' }

    const customer = await prisma.customer.findUniqueOrThrow({
      where:  { id: customerId },
      select: { channelId: true },
    })

    if (!customer.channelId) throw { statusCode: 400, message: 'Customer has no assigned channel' }

    await prisma.$transaction([
      prisma.loyaltyTransaction.create({
        data: {
          customerId,
          channelId:   customer.channelId,
          type:        'EARN',
          points,
          referenceId: saleId,
          notes:       `Earned from profit margin on Sale ${saleId}`,
        },
      }),
      prisma.customer.update({
        where: { id: customerId },
        data:  { loyaltyPoints: { increment: points } },
      }),
    ])

    return { earned: points }
  }

  async redeemPoints(customerId: string, points: number) {
    if (points <= 0) {
      throw { statusCode: 400, message: 'Points to redeem must be greater than zero' }
    }

    return prisma.$transaction(async (tx) => {
      // FIX 2: Use a conditional update that only decrements if balance
      // is still sufficient at the moment of the write — not at the
      // moment of the earlier read. This eliminates the race window.
      const result = await tx.$executeRaw`
        UPDATE customers
        SET    "loyaltyPoints" = "loyaltyPoints" - ${points}
        WHERE  id              = ${customerId}::text
          AND  "loyaltyPoints" >= ${points}
          AND  "deletedAt"     IS NULL
      `

      if (result === 0) {
        // Either customer not found, deleted, or insufficient points
        const customer = await tx.customer.findUnique({
          where:  { id: customerId },
          select: { loyaltyPoints: true },
        })
        if (!customer) {
          throw { statusCode: 404, message: 'Customer not found' }
        }
        throw {
          statusCode: 400,
          message:    `Insufficient loyalty points. Available: ${customer.loyaltyPoints}, requested: ${points}`,
        }
      }

      // Read the post-update balance for the response (FIX 3: not stale)
      const updated = await tx.customer.findUniqueOrThrow({
        where:  { id: customerId },
        select: { loyaltyPoints: true, channelId: true },
      })

      if (!updated.channelId) throw { statusCode: 400, message: 'Customer has no assigned channel' }

      await tx.loyaltyTransaction.create({
        data: {
          customerId,
          channelId: updated.channelId,  // FIX 1
          type:      'REDEEM',
          points:    -points,
          notes:     'Points redeemed',
        },
      })

      return {
        redeemed:  points,
        remaining: updated.loyaltyPoints,  // FIX 3: actual post-update value
      }
    })
  }

  async getHistory(customerId: string, page = 1, limit = 25) {
    const skip = (page - 1) * limit
    const [data, total] = await Promise.all([
      prisma.loyaltyTransaction.findMany({
        where:   { customerId },
        skip, take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.loyaltyTransaction.count({ where: { customerId } }),
    ])
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } }
  }
}

export const loyaltyService = new LoyaltyService()
