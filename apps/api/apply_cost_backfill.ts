import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'

const prisma = new PrismaClient()

async function main() {
  const result: any = {}

  console.log('--- STARTING COST BACKFILL ---')

  // Step 1: Preview
  result.preview = await prisma.$queryRaw`
    SELECT 
      s."receiptNo",
      s."channelId",
      s."createdAt",
      i.name AS item_name,
      si."costPriceSnapshot" AS current_snapshot,
      ib."weightedAvgCost" AS correct_cost,
      si.quantity,
      si.quantity * ib."weightedAvgCost" AS correct_line_cogs
    FROM sale_items si
    JOIN sales s ON s.id = si."saleId"
    JOIN items i ON i.id = si."itemId"
    JOIN inventory_balances ib 
      ON ib."itemId" = si."itemId"
      AND ib."channelId" = s."channelId"
    WHERE si."costPriceSnapshot" = 0
      AND ib."weightedAvgCost" > 0
      AND s."deletedAt" IS NULL
    ORDER BY s."createdAt" DESC;
  `
  console.log(`Found ${result.preview.length} items to repair.`)

  // Step 2: Update sale_items
  const updateSaleItemsCount = await prisma.$executeRaw`
    UPDATE sale_items
    SET 
      "costPriceSnapshot" = ib."weightedAvgCost",
      markup = sale_items."unitPrice" - ib."weightedAvgCost"
    FROM sales s, inventory_balances ib
    WHERE sale_items."saleId" = s.id
      AND ib."itemId" = sale_items."itemId"
      AND ib."channelId" = s."channelId"
      AND sale_items."costPriceSnapshot" = 0
      AND ib."weightedAvgCost" > 0
      AND s."deletedAt" IS NULL;
  `
  result.updateSaleItemsCount = Number(updateSaleItemsCount)
  console.log(`Updated ${updateSaleItemsCount} sale_items rows.`)

  // Step 3: Update stock_movements
  const updateMovementsCount = await prisma.$executeRaw`
    UPDATE stock_movements sm
    SET "unitCostAtTime" = ib."weightedAvgCost"
    FROM inventory_balances ib
    WHERE sm."itemId" = ib."itemId"
      AND sm."channelId" = ib."channelId"
      AND sm."unitCostAtTime" = 0
      AND sm."movementType" = 'SALE'
      AND ib."weightedAvgCost" > 0;
  `
  result.updateMovementsCount = Number(updateMovementsCount)
  console.log(`Updated ${updateMovementsCount} stock_movements rows.`)

  // Step 4: Final Verify
  const verify = await prisma.$queryRaw`
    SELECT COUNT(*)::int AS count
    FROM sale_items si
    JOIN sales s ON s.id = si."saleId"
    JOIN inventory_balances ib 
      ON ib."itemId" = si."itemId"
      AND ib."channelId" = s."channelId"
    WHERE si."costPriceSnapshot" = 0
      AND ib."weightedAvgCost" > 0
      AND s."deletedAt" IS NULL;
  `
  result.remainingZeroCostCount = verify[0]?.count ?? 0
  console.log(`Remaining zero-cost items: ${result.remainingZeroCostCount}`)

  fs.writeFileSync('c:\\Users\\HP\\Desktop\\braynPOS\\apps\\api\\backfill_results.json', JSON.stringify(result, null, 2))
}

main().catch(console.error).finally(() => prisma.$disconnect())
