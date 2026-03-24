import { prisma } from '../../lib/prisma.js'

// FIX 5: Validate and parse date strings safely
function parseDate(dateStr: string, endOfDay = false): Date {
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) {
    throw { statusCode: 400, message: `Invalid date: "${dateStr}"` }
  }
  if (endOfDay) d.setUTCHours(23, 59, 59, 999)
  return d
}

export class ReportsService {
  async salesSummary(channelId: string, startDate: string, endDate: string) {
    const start = parseDate(startDate)
    const end   = parseDate(endDate, true)

    const sales = await prisma.sale.aggregate({
      where: {
        channelId,
        createdAt: { gte: start, lte: end },
        deletedAt: null,
      },
      _sum:   { totalAmount: true, discountAmount: true, netAmount: true },
      _count: true,
    })

    // FIX 3 + 4: Compute COGS in the DB with aggregate(), not by loading
    // all rows. Also excludes voided sales via deletedAt: null.
    // COGS = sum(costPriceSnapshot * quantity) — use a raw aggregation
    // since Prisma aggregate doesn't support computed fields
    const cogsRaw = await prisma.$queryRaw<Array<{ cogs: number }>>`
      SELECT COALESCE(SUM(si."costPriceSnapshot" * si.quantity), 0) AS cogs
      FROM   sale_items si
      JOIN   sales s ON s.id = si."saleId"
      WHERE  s."channelId" = ${channelId}
        AND  s."createdAt" >= ${start}
        AND  s."createdAt" <= ${end}
        AND  s."deletedAt" IS NULL
    `
    const cogs = Number(cogsRaw[0]?.cogs ?? 0)

    const expenses = await prisma.expense.aggregate({
      where: {
        channelId,
        createdAt: { gte: start, lte: end },
      },
      _sum:   { amount: true },
      _count: true,
    })

    const netSales    = Number(sales._sum.netAmount ?? 0)
    const grossMargin = netSales - cogs

    const topItemsRaw = await this.topSellingItems(channelId, startDate, endDate, 5)
    const topItems    = topItemsRaw.map(i => ({
      itemId:   i.itemId,
      itemName: i.name || 'Unknown',
      qty:      i.totalQtySold,
      revenue:  i.totalRevenue,
    }))

    const purchases = await prisma.purchase.aggregate({
      where: {
        channelId,
        createdAt: { gte: start, lte: end },
        status:    'COMMITTED',
      },
      _sum:   { totalCost: true, landedCostTotal: true },
      _count: true,
    })

    const totalPurchases = Number(purchases._sum?.totalCost ?? 0) + Number(purchases._sum?.landedCostTotal ?? 0)
    const totalExpenses  = Number(expenses._sum.amount ?? 0)

    return {
      period:    { startDate, endDate },
      sales: {
        count:          sales._count,
        totalAmount:    Number(sales._sum.totalAmount    ?? 0),
        grossAmount:    Number(sales._sum.totalAmount    ?? 0),
        discountAmount: Number(sales._sum.discountAmount ?? 0),
        netAmount:      netSales,
        cogs,
      },
      expenses:  { count: expenses._count,  totalAmount: totalExpenses  },
      purchases: { count: purchases._count, totalAmount: totalPurchases },
      topItems,
      grossMargin,
      profit: grossMargin - totalExpenses,
    }
  }

  async topSellingItems(channelId: string, startDate: string, endDate: string, limit = 10) {
    const start = parseDate(startDate)
    const end   = parseDate(endDate, true)

    const rows = await prisma.saleItem.groupBy({
      by:    ['itemId'],
      where: {
        sale: {
          channelId,
          createdAt: { gte: start, lte: end },
          deletedAt: null,    // FIX 4
        },
      },
      _sum:     { quantity: true, lineTotal: true },
      orderBy:  { _sum: { quantity: 'desc' } },
      take:     limit,
    })

    // FIX 1: Single findMany instead of one findUnique per row (N+1)
    const itemIds  = rows.map(r => r.itemId)
    const items    = await prisma.item.findMany({
      where:  { id: { in: itemIds } },
      select: { id: true, name: true, sku: true },
    })
    const itemMap  = Object.fromEntries(items.map(i => [i.id, i]))

    return rows.map(row => ({
      itemId:       row.itemId,
      name:         itemMap[row.itemId]?.name,
      sku:          itemMap[row.itemId]?.sku,
      totalQtySold: row._sum.quantity,
      totalRevenue: Number(row._sum.lineTotal ?? 0),
    }))
  }

  async stockFlowReport(channelId: string, startDate: string, endDate: string) {
    const start = parseDate(startDate)
    const end   = parseDate(endDate, true)

    const movements = await prisma.stockMovement.groupBy({
      by:    ['movementType'],
      where: { channelId, createdAt: { gte: start, lte: end } },
      _sum:   { quantityChange: true },
      _count: true,
    })

    return movements.map(m => ({
      movementType:     m.movementType,
      totalQuantity:    m._sum.quantityChange ?? 0,
      transactionCount: m._count,
    }))
  }

  async dailySalesTrend(channelId: string, startDate: string, endDate: string) {
    const start = parseDate(startDate)
    const end   = parseDate(endDate, true)

    return prisma.$queryRaw<Array<{ date: string; totalSales: number; saleCount: number }>>`
      SELECT
        DATE("createdAt")          AS date,
        COALESCE(SUM("netAmount"), 0) AS "totalSales",
        COUNT(*)::int              AS "saleCount"
      FROM  sales
      WHERE "channelId" = ${channelId}
        AND "deletedAt"  IS NULL
        AND "createdAt"  >= ${start}
        AND "createdAt"  <= ${end}
      GROUP BY DATE("createdAt")
      ORDER BY date
    `
  }

  async adminDashboardAnalytics(startDate: string, endDate: string) {
    const start = parseDate(startDate)
    const end   = parseDate(endDate, true)

    const totalSales = await prisma.sale.aggregate({
      where:  { createdAt: { gte: start, lte: end }, deletedAt: null },
      _sum:   { netAmount: true },
      _count: true,
    })

    const channels = await prisma.channel.findMany({
      select: { id: true, name: true, code: true },
    })

    // FIX 2: Single COGS aggregation across all channels grouped by channelId
    // instead of one saleItem.findMany() per channel (was N queries, now 1)
    const cogsPerChannel = await prisma.$queryRaw<
      Array<{ channelId: string; cogs: number }>
    >`
      SELECT s."channelId",
             COALESCE(SUM(si."costPriceSnapshot" * si.quantity), 0) AS cogs
      FROM   sale_items si
      JOIN   sales s ON s.id = si."saleId"
      WHERE  s."createdAt" >= ${start}
        AND  s."createdAt" <= ${end}
        AND  s."deletedAt"  IS NULL
      GROUP BY s."channelId"
    `
    const cogsMap = Object.fromEntries(cogsPerChannel.map(r => [r.channelId, Number(r.cogs)]))

    const salesPerChannel = await prisma.sale.groupBy({
      by:    ['channelId'],
      where: { createdAt: { gte: start, lte: end }, deletedAt: null },
      _sum:  { netAmount: true },
      _count: true,
    })
    const salesMap = Object.fromEntries(
      salesPerChannel.map(r => [r.channelId, { count: r._count, net: Number(r._sum.netAmount ?? 0) }])
    )

    const channelStats = channels.map(c => {
      const s        = salesMap[c.id]  ?? { count: 0, net: 0 }
      const cogs     = cogsMap[c.id]   ?? 0
      const netSales = s.net
      return {
        channelId:   c.id,
        channelName: c.name,
        salesCount:  s.count,
        revenue:     netSales,
        margin:      netSales - cogs,
      }
    })

    return {
      period:          { startDate, endDate },
      aggregateRevenue: channelStats.reduce((sum, c) => sum + c.revenue, 0),
      aggregateMargin:  channelStats.reduce((sum, c) => sum + c.margin,  0),
      totalSalesCount:  totalSales._count,
      channelStats,
    }
  }

  async staffSalesPerformance(channelId: string, startDate: string, endDate: string) {
    const start = parseDate(startDate)
    const end   = parseDate(endDate, true)

    const revenueStats = await prisma.sale.groupBy({
      by:    ['performedBy'],
      where: { channelId, createdAt: { gte: start, lte: end }, deletedAt: null },
      _sum:  { netAmount: true },
      _count: true,
    })

    // FIX 3 + 4: Compute COGS per staff in the DB — no unbounded row fetch
    const cogsRaw = await prisma.$queryRaw<
      Array<{ performedBy: string; cogs: number }>
    >`
      SELECT s."performedBy",
             COALESCE(SUM(si."costPriceSnapshot" * si.quantity), 0) AS cogs
      FROM   sale_items si
      JOIN   sales s ON s.id = si."saleId"
      WHERE  s."channelId" = ${channelId}
        AND  s."createdAt"  >= ${start}
        AND  s."createdAt"  <= ${end}
        AND  s."deletedAt"  IS NULL
      GROUP BY s."performedBy"
    `
    const cogsMap = Object.fromEntries(cogsRaw.map(r => [r.performedBy, Number(r.cogs)]))

    const performance = revenueStats.map(stat => {
      const revenue       = Number(stat._sum.netAmount ?? 0)
      const cogs          = cogsMap[stat.performedBy]  ?? 0
      const margin        = revenue - cogs
      const marginPercent = revenue > 0 ? (margin / revenue) * 100 : 0

      return {
        userId:        stat.performedBy,
        revenue,
        salesCount:    stat._count,
        margin,
        marginPercent: Math.round(marginPercent * 100) / 100,
      }
    })

    return { period: { startDate, endDate }, performance }
  }
}

export const reportsService = new ReportsService()
