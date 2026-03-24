import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const hqId = '605831cd-dc31-47c1-8f39-dcd8dd493de2'
  
  // 1. Audit last 5 purchases
  const p = await prisma.purchase.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { lines: { include: { item: true } } } })
  console.log('--- RECENT PURCHASES ---')
  p.forEach(x => console.log(`No: |${x.purchaseNo}|, Status: ${x.status}, Item: ${x.lines[0]?.item?.name}`))
  
  // 2. Identify the RBT Speaker purchase
  const speakerP = p.find(x => x.lines.some(l => l.item.name.includes('RBT')))
  if (!speakerP) return console.log('RBT Speaker purchase NOT found in the last 5.')
  
  const purchaseId = speakerP.id
  const speakerId = speakerP.lines[0].itemId
  const chukaId = speakerP.channelId
  
  console.log(`\nMoving Purchase ${speakerP.purchaseNo} (ID: ${purchaseId}) from ${chukaId} to ${hqId}...`)

  await prisma.$transaction(async (tx) => {
    // 3. Update User
    await tx.user.updateMany({ where: { username: 'chris' }, data: { channelId: hqId } })
    
    // 4. Update Purchase
    await tx.purchase.update({ where: { id: purchaseId }, data: { channelId: hqId } })
    
    // 5. Update StockMovements
    await tx.stockMovement.updateMany({ where: { referenceId: speakerP.id, referenceType: 'purchase' }, data: { channelId: hqId } })
    await tx.stockMovement.updateMany({ where: { referenceId: speakerP.purchaseNo, referenceType: 'purchase' }, data: { channelId: hqId } })
    
    // 6. Merge Balances
    const chukaB = await tx.inventory_balances.findUnique({ where: { itemId_channelId: { itemId: speakerId, channelId: chukaId } } })
    if (chukaB) {
      console.log(`Merging ${chukaB.availableQty} units to HQ...`)
      const hqB = await tx.inventory_balances.findUnique({ where: { itemId_channelId: { itemId: speakerId, channelId: hqId } } })
      if (hqB) {
        await tx.inventory_balances.update({ where: { itemId_channelId: { itemId: speakerId, channelId: hqId } }, data: { availableQty: { increment: chukaB.availableQty } } })
        await tx.inventory_balances.delete({ where: { itemId_channelId: { itemId: speakerId, channelId: chukaId } } })
      } else {
        await tx.inventory_balances.update({ where: { itemId_channelId: { itemId: speakerId, channelId: chukaId } }, data: { channelId: hqId } })
      }
    }
  })
  
  console.log('✅ FIXED: Speaker and Chris are now in HQ.')
}

main().catch(console.error).finally(() => prisma.$disconnect())
