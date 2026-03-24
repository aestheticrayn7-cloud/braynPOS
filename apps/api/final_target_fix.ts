import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // THE CORRECT ID FROM THE DB
  const hqId = '605831cd-dc31-47c1-8f39-dcd8dd493de2' 
  const purchaseNo = 'PUR-1773860140936'
  const speakerId = 'b496be02-aff7-48f8-b3d5-09f19548f029'
  const chukaId = '1a645410-a2e3-4228-819f-2fe29dd87a0f'
  
  console.log(`--- TARGETED FIX: Speaker & Chris ---`)

  await prisma.$transaction(async (tx) => {
    // 1. Assign Chris to the REAL HQ
    await tx.user.updateMany({
      where: { username: 'chris' },
      data: { channelId: hqId }
    })
    console.log('Chris assigned to HQ.')

    // 2. Move Purchase record
    const p = await tx.purchase.findFirst({ where: { purchaseNo } })
    if (p) {
      console.log(`Moving purchase ${p.purchaseNo} to HQ...`)
      await tx.purchase.update({
        where: { id: p.id },
        data: { channelId: hqId }
      })
      
      // 3. Move StockMovements
      await tx.stockMovement.updateMany({
        where: { referenceId: p.purchaseNo, referenceType: 'purchase' },
        data: { channelId: hqId }
      })
      console.log('Movements updated.')
    } else {
      console.log('Purchase not found by No.')
    }

    // 4. Merge/Move Inventory Balances for Speaker
    const chukaBalance = await tx.inventory_balances.findUnique({
      where: { itemId_channelId: { itemId: speakerId, channelId: chukaId } }
    })
    
    if (chukaBalance) {
      console.log(`Merging ${chukaBalance.availableQty} speakers from Chuka to HQ...`)
      const hqBalance = await tx.inventory_balances.findUnique({
        where: { itemId_channelId: { itemId: speakerId, channelId: hqId } }
      })
      
      if (hqBalance) {
        await tx.inventory_balances.update({
          where: { itemId_channelId: { itemId: speakerId, channelId: hqId } },
          data: { 
            availableQty: Number(hqBalance.availableQty) + Number(chukaBalance.availableQty),
            lastMovementAt: new Date()
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
  })

  console.log('✅ FIXED: Speaker and Chris are now in the correct Headquarters.')
}

main().catch(console.error).finally(() => prisma.$disconnect())
