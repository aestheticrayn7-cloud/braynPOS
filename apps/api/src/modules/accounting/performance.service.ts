import { prisma } from '../../lib/prisma.js'

export class PerformanceService {
  async setTarget(data: { userId: string; channelId: string; targetType: string; period: string; targetValue: number; startDate: string; endDate: string }) {
    // Audit finding: User Targets (Weekly/Monthly Margin)
    return (prisma as any).userTarget.create({
      data: {
        ...data,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate)
      }
    })
  }

  async getPerformance(userId: string, channelId: string) {
    const targets = await (prisma as any).userTarget.findMany({
      where: { userId, channelId, endDate: { gte: new Date() } }
    })

    const results = []
    for (const target of targets) {
      if (target.targetType === 'MARGIN') {
        const stats = await this.getMarginStats(userId, channelId, target.startDate, target.endDate)
        results.push({ ...target, current: stats.margin, progress: (stats.margin / Number(target.targetValue)) * 100 })
      }
      // Add other types as needed
    }
    return results
  }

  private async getMarginStats(userId: string, channelId: string, start: Date, end: Date) {
    const revenue = await prisma.sale.aggregate({
      where: { performedBy: userId, channelId, createdAt: { gte: start, lte: end }, deletedAt: null },
      _sum: { netAmount: true }
    })
    
    const cogsRaw = await prisma.$queryRaw<Array<{ cogs: number }>>`
      SELECT COALESCE(SUM(si."costPriceSnapshot" * si.quantity), 0) AS cogs
      FROM sale_items si
      JOIN sales s ON s.id = si."saleId"
      WHERE s."performedBy" = ${userId} AND s."channelId" = ${channelId}
        AND s."createdAt" >= ${start} AND s."createdAt" <= ${end}
        AND s."deletedAt" IS NULL
    `
    const margin = Number(revenue._sum.netAmount ?? 0) - Number(cogsRaw[0]?.cogs ?? 0)
    return { revenue: Number(revenue._sum.netAmount ?? 0), margin }
  }
}

export const performanceService = new PerformanceService()
