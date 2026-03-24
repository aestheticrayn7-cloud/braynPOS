import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const fromChannel = '4979e2c6-d444-4860-9513-393282f1b4c9' // The one with the stock
  const toChannel = '609bd625-a1c1-47c1-8f39-dcd8dd493de2'   // Olivia's channel
  
  console.log(`--- MIGRATING STOCK FROM ${fromChannel} TO ${toChannel} ---`)
  
  const balances = await (prisma as any).inventory_balances.findMany({
    where: { channelId: fromChannel }
  })
  
  for (const b of balances) {
    if (b.availableQty === 0 && b.incomingQty === 0) continue;
    
    console.log(`Moving ${b.availableQty} of item ${b.itemId}...`)
    
    await prisma.$transaction(async (tx) => {
      // 1. Create movement OUT from source
      await tx.stockMovement.create({
        data: {
          itemId: b.itemId,
          channelId: fromChannel,
          movementType: 'ADJUSTMENT_OUT',
          quantityChange: -(b.availableQty),
          referenceId: 'MIGRATION-FIX',
          referenceType: 'adjustment',
          notes: 'Migrating stock from duplicate HQ channel',
          performedBy: 'system',
        }
      })
      
      // 2. Create movement IN for target
      // Inherit prices if possible
      await tx.stockMovement.create({
        data: {
          itemId: b.itemId,
          channelId: toChannel,
          movementType: 'ADJUSTMENT_IN',
          quantityChange: b.availableQty,
          referenceId: 'MIGRATION-FIX',
          referenceType: 'adjustment',
          notes: 'Migrating stock from duplicate HQ channel',
          performedBy: 'system',
        }
      })
      
      // 3. Upsert balance pricing in target
      await tx.inventory_balances.upsert({
        where: { itemId_channelId: { itemId: b.itemId, channelId: toChannel } },
        create: {
          itemId: b.itemId,
          channelId: toChannel,
          retailPrice: b.retailPrice,
          wholesalePrice: b.wholesalePrice,
          minRetailPrice: b.minRetailPrice,
          minWholesalePrice: b.minWholesalePrice,
          weightedAvgCost: b.weightedAvgCost,
        },
        update: {
          retailPrice: b.retailPrice,
          wholesalePrice: b.wholesalePrice,
        }
      })
    })
  }
  
  console.log('✅ Migration finished.')
}

main().catch(console.error).finally(() => prisma.$disconnect())
