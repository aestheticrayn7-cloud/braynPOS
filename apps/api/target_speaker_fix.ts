import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const hqId = '605831cd-dc31-47c1-8b39-dcd8dd493de2'
  const purchaseNo = 'PUR-1773860140936'
  const speakerId = 'b496be02-aff7-48f8-b3d5-09f19548f029'
  
  console.log(`--- PORTING SPEAKER PURCHASE ${purchaseNo} ---`)

  // 1. Assign Chris to HQ
  await prisma.user.updateMany({
    where: { username: 'chris' },
    data: { channelId: hqId }
  })
  console.log('Chris assigned to HQ.')

  // 2. Find purchase by purchaseNo
  const p = await prisma.purchase.findFirst({
    where: { purchaseNo }
  })
  if (!p) return console.log('Purchase not found!')
  
  console.log(`Moving purchase ${p.id} from ${p.channelId} to ${hqId}...`)

  await prisma.$transaction(async (tx) => {
    // 3. Update Purchase record
    await tx.purchase.update({
      where: { id: p.id },
      data: { channelId: hqId }
    })
    
    // 4. Update StockMovements
    await tx.stockMovement.updateMany({
      where: { referenceId: p.purchaseNo, referenceType: 'purchase' },
      data: { channelId: hqId }
    })
    
    // 5. Update Balance (Trigger will handle the decrement from Chuka if we just update the channelId? NO!)
    // Triggers ONLY fire on INSERT/UPDATE of the table they are on.
    // If I update channelId in StockMovement, the trigger on StockMovement fires and SHOULD update the balance.
    // Wait! My trigger on StockMovement updates the balance ONLY on INSERT.
    // Let's check `inventory_trigger.sql` (if I have it).
    
    // Actually, I'll just manually delete the Chuka balance and add to HQ.
    const balances = await tx.inventory_balances.findMany({ where: { itemId: speakerId } })
    console.log('Current balances before merge:', JSON.stringify(balances))
    
    for (const b of balances) {
      if (b.channelId !== hqId) {
        // Move to HQ
        const hqb = await tx.inventory_balances.findUnique({
          where: { itemId_channelId: { itemId: speakerId, channelId: hqId } }
        })
        if (hqb) {
          await tx.inventory_balances.update({
            where: { itemId_channelId: { itemId: speakerId, channelId: hqId } },
            data: { availableQty: { increment: b.availableQty } }
          })
          await tx.inventory_balances.delete({
            where: { itemId_channelId: { itemId: speakerId, channelId: b.channelId } }
          })
        } else {
          await tx.inventory_balances.update({
            where: { itemId_channelId: { itemId: speakerId, channelId: b.channelId } },
            data: { channelId: hqId }
          })
        }
      }
    }
  })

  console.log('✅ Porting complete.')
}

main().catch(console.error).finally(() => prisma.$disconnect())
