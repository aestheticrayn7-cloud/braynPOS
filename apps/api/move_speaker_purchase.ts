import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const hqId = '605831cd-dc31-47c1-8b39-dcd8dd493de2'
  const speakerName = 'RBT speaker'
  
  // 1. Find the purchase for RBT speaker
  const purchase = await prisma.purchase.findFirst({
    where: { lines: { some: { item: { name: { contains: 'RBT' } } } } },
    include: { lines: true }
  })
  
  if (!purchase) return console.log('RBT Speaker Purchase not found!')
  
  console.log(`Purchase ${purchase.purchaseNo} found in channel ${purchase.channelId}. Moving to ${hqId}...`)
  
  // 2. Move Purchase and its StockMovement to HQ
  await prisma.$transaction(async (tx) => {
    await tx.purchase.update({
      where: { id: purchase.id },
      data: { channelId: hqId }
    })
    
    await tx.stockMovement.updateMany({
      where: { referenceId: purchase.id, referenceType: 'purchase' },
      data: { channelId: hqId }
    })
    
    // 3. Update Serials if any
    await tx.serial.updateMany({
      where: { itemId: purchase.lines[0].itemId, channelId: purchase.channelId },
      data: { channelId: hqId }
    })

    // 4. Ensure Chris is in HQ
    await tx.user.updateMany({
      where: { username: 'chris' },
      data: { channelId: hqId }
    })
  })

  console.log('✅ Purchase and user moved to Headquarters.')
}

main().catch(console.error).finally(() => prisma.$disconnect())
