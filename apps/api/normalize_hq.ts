import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function balanceHQ() {
  const hqId = 'c7983e54-a3b0-49be-b8bc-86b1bb01bd25'
  const actor = (await prisma.user.findFirst())?.id || ''
  
  const negatives = await prisma.inventory_balances.findMany({
    where: { channelId: hqId, availableQty: { lt: 0 } }
  })
  
  console.log(`Found ${negatives.length} negative items in HQ. Initializing with opening stock...`)
  
  for (const b of negatives) {
    const adj = -b.availableQty + 100 // Give HQ 100 base stock for now
    await prisma.stockMovement.create({
      data: {
        itemId: b.itemId,
        channelId: hqId,
        movementType: 'ADJUSTMENT_IN',
        quantityChange: adj,
        referenceId: 'opening-stock-fix',
        referenceType: 'other',
        performedBy: actor,
        notes: 'Automated opening stock to fix negative HQ balance'
      }
    })
  }
  
  console.log('HQ Balances normalized.')
}

balanceHQ().finally(() => prisma.$disconnect())
