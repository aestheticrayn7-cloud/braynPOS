import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const hqId = '605831cd-dc31-47c1-8b39-dcd8dd493de2'
  const speakerId = 'b496be02-aff7-48f8-b3d5-09f19548f029'
  const chukaId = '1a645410-a2e3-4228-819f-2fe29dd87a0f'
  const purchaseNo = 'PUR-1773860140936'
  
  console.log(`--- MOVING PURCHASE ${purchaseNo} AND SPEAKER STOCK TO HQ ---`)

  await prisma.$transaction(async (tx) => {
    // 1. Move Purchase
    const purchase = await tx.purchase.findFirstOrThrow({ where: { purchaseNo } })
    await tx.purchase.update({
      where: { id: purchase.id },
      data: { channelId: hqId }
    })
    
    // 2. Move Stock Movements
    await tx.stockMovement.updateMany({
      where: { referenceId: purchase.id, referenceType: 'purchase' },
      data: { channelId: hqId }
    })
    
    // 3. Merge/Move Inventory Balances
    const chukaBalance = await tx.inventory_balances.findUnique({
      where: { itemId_channelId: { itemId: speakerId, channelId: chukaId } }
    })
    
    if (chukaBalance) {
      const hqBalance = await tx.inventory_balances.findUnique({
        where: { itemId_channelId: { itemId: speakerId, channelId: hqId } }
      })
      
      if (hqBalance) {
        await tx.inventory_balances.update({
          where: { itemId_channelId: { itemId: speakerId, channelId: hqId } },
          data: { 
            availableQty: Number(hqBalance.availableQty) + Number(chukaBalance.availableQty),
            incomingQty: Number(hqBalance.incomingQty) + Number(chukaBalance.incomingQty)
          }
        })
        await tx.inventory_balances.delete({
          where: { itemId_channelId: { itemId: speakerId, channelId: chukaId } }
        })
      } else {
        await tx.inventory_balances.update({
          where: { itemId_channelId: { itemId: speakerId, channelId: chukaId } },
          data: { channelId: hqId }
        })
      }
    }
    
    // 4. Update Chris to HQ
    await tx.user.updateMany({
      where: { username: 'chris' },
      data: { channelId: hqId }
    })
  })

  console.log('✅ Porting complete.')
}

main().catch(console.error).finally(() => prisma.$disconnect())
