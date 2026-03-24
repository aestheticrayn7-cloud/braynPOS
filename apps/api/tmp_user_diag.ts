import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'

const prisma = new PrismaClient()

async function main() {
  const result: any = {}

  // User Query 1: Recent Sales Cost Snapshots
  result.recentSalesSnapshots = await prisma.$queryRaw`
    SELECT 
      s."receiptNo",
      s."channelId",
      s."createdAt",
      si."itemId",
      si.quantity,
      si."unitPrice",
      si."costPriceSnapshot",
      si."costPriceSnapshot" * si.quantity AS line_cogs
    FROM sale_items si
    JOIN sales s ON s.id = si."saleId"
    WHERE s."deletedAt" IS NULL
    ORDER BY s."createdAt" DESC
    LIMIT 20;
  `

  // User Query 2: Item Costs on inventory_balances
  result.inventoryBalances = await prisma.$queryRaw`
    SELECT 
      i.name,
      i.sku,
      ib."channelId",
      ib."availableQty",
      ib."weightedAvgCost",
      ib."retailPrice"
    FROM inventory_balances ib
    JOIN items i ON i.id = ib."itemId"
    ORDER BY i.name;
  `

  fs.writeFileSync('c:\\Users\\HP\\Desktop\\braynPOS\\apps\\api\\user_sql_results.json', JSON.stringify(result, null, 2))
}

main().catch(console.error).finally(() => prisma.$disconnect())
