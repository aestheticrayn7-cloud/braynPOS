import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // THE VERIFIED REAL ID WITH 8f39
  const hqId = '605831cd-dc31-47c1-8f39-dcd8dd493de2' 
  const speakerId = 'b496be02-aff7-4148-b53a-0be5de051b0a' // The NEW speaker ID
  
  console.log('--- SUPER ABSOLUTE FINAL FIX ---')

  await prisma.$transaction(async (tx) => {
    // 1. Move ALL users to the CORRECT HQ
    const uCount = await tx.user.updateMany({
      data: { channelId: hqId }
    })
    console.log(`Updated ${uCount.count} users to HQ.`)

    // 2. Move ALL other data from other channels to HQ
    const tables: any[] = await tx.$queryRaw`SELECT table_name FROM information_schema.columns WHERE column_name = 'channelId' AND table_schema = 'public'`
    for (const { table_name } of tables) {
       if (table_name === 'inventory_balances' || table_name === 'channels') continue;
       const res = await tx.$executeRawUnsafe(`UPDATE "${table_name}" SET "channelId" = '${hqId}' WHERE "channelId" != '${hqId}'`)
       if (res > 0) console.log(`Moved ${res} records in ${table_name}`)
    }

    // 3. SPECIAL: Restore the 100 Speakers if missing
    const hqBalance = await tx.inventory_balances.findUnique({
      where: { itemId_channelId: { itemId: speakerId, channelId: hqId } }
    })
    
    if (hqBalance) {
      if (Number(hqBalance.availableQty) < 100) {
        console.log(`Restoring speaker stock to 100 (was ${hqBalance.availableQty})...`)
        await tx.inventory_balances.update({
          where: { itemId_channelId: { itemId: speakerId, channelId: hqId } },
          data: { availableQty: 100 }
        })
        
        // Add a movement to record this "Correction"
        await tx.stockMovement.create({
          data: {
            itemId: speakerId,
            channelId: hqId,
            movementType: 'ADJUSTMENT_IN',
            quantityChange: 100 - Number(hqBalance.availableQty),
            referenceId: 'SYSTEM_RECOVERY',
            referenceType: 'adjustment',
            performedBy: (await tx.user.findFirst({ where: { role: 'SUPER_ADMIN' } }))?.id || 'system',
            notes: 'System recovery of missing purchase'
          }
        })
      }
    } else {
      console.log('Creating HQ balance for Speaker with 100 units...')
      await tx.inventory_balances.create({
        data: {
          itemId: speakerId,
          channelId: hqId,
          availableQty: 100,
          retailPrice: 0, // Placeholder
          wholesalePrice: 0,
          weightedAvgCost: 0
        }
      })
    }
  })

  console.log('✅ ALL DATA UNIFIED IN HQ.')
}

main().catch(console.error).finally(() => prisma.$disconnect())
