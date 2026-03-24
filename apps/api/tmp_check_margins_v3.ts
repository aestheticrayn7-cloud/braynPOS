import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'

const prisma = new PrismaClient()

async function main() {
  const result: any = {}

  // 1. Check a few items
  const items = await prisma.item.findMany({
    select: { id: true, name: true, sku: true, weightedAvgCost: true },
    take: 5
  })
  result.items = items

  // 2. Check today's sales and items
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  const end = new Date()
  end.setHours(23, 59, 59, 999)

  const saleItems = await prisma.saleItem.findMany({
    where: {
      createdAt: { gte: start, lte: end }
    },
    select: {
      id: true,
      costPriceSnapshot: true,
      quantity: true,
      sale: { select: { receiptNo: true, channelId: true } }
    }
  })
  result.saleItemsForToday = saleItems

  // 3. Test the raw query logic
  const cogsRaw = await prisma.$queryRaw`
    SELECT s."channelId",
           COALESCE(SUM(si."costPriceSnapshot" * si.quantity), 0) AS cogs
    FROM   sale_items si
    JOIN   sales s ON s.id = si."saleId"
    WHERE  s."createdAt" >= ${start}
      AND  s."createdAt" <= ${end}
      AND  s."deletedAt" IS NULL
    GROUP BY s."channelId"
  `
  result.cogsRawResult = cogsRaw

  fs.writeFileSync('c:\\Users\\HP\\Desktop\\braynPOS\\apps\\api\\diag_margins_results.json', JSON.stringify(result, null, 2))
  console.log('Results written to diag_margins_results.json')
}

main().catch(console.error).finally(() => prisma.$disconnect())
