import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('--- REPAIRING PURCHASES ---')
  const purchases = await prisma.purchase.findMany({
    where: { status: 'COMMITTED', deletedAt: null },
    include: { lines: true }
  })
  
  for (const p of purchases) {
    const movementCount = await prisma.stockMovement.count({
      where: { referenceId: p.id, referenceType: 'purchase' }
    })
    if (movementCount === 0) {
      console.log(`Fixing Purchase ${p.purchaseNo}...`)
      for (const line of p.lines) {
        await prisma.stockMovement.create({
          data: {
            itemId: line.itemId,
            channelId: p.channelId,
            movementType: 'PURCHASE',
            quantityChange: Number(line.quantity),
            unitCostAtTime: Number(line.unitCost),
            referenceId: p.id,
            referenceType: 'purchase',
            notes: 'Restored from repair script',
            performedBy: p.committedBy || 'system',
          }
        })
      }
    }
  }

  console.log('--- REPAIRING TRANSFERS ---')
  const transfers = await prisma.transfer.findMany({
    where: { status: { in: ['SENT', 'RECEIVED', 'DISPUTED'] } },
    include: { lines: true }
  })
  
  for (const t of transfers) {
    const movementCount = await prisma.stockMovement.count({
      where: { referenceId: t.id, referenceType: 'transfer' }
    })
    if (movementCount === 0) {
      console.log(`Fixing Transfer ${t.transferNo} (Status: ${t.status})...`)
      for (const line of t.lines) {
        // Source channel movement
        await prisma.stockMovement.create({
          data: {
            itemId: line.itemId,
            channelId: t.fromChannelId,
            movementType: 'TRANSFER_OUT',
            quantityChange: -(line.sentQuantity),
            referenceId: t.id,
            referenceType: 'transfer',
            performedBy: t.sentBy || 'system',
          }
        })
        
        if (t.status === 'SENT') {
          // Destination channel pending
          await prisma.stockMovement.create({
            data: {
              itemId: line.itemId,
              channelId: t.toChannelId,
              movementType: 'TRANSFER_IN_PENDING',
              quantityChange: line.sentQuantity,
              referenceId: t.id,
              referenceType: 'transfer',
              performedBy: t.sentBy || 'system',
            }
          })
        } else {
          // RECEIVED or DISPUTED
          if (line.receivedQuantity && line.receivedQuantity > 0) {
             await prisma.stockMovement.create({
              data: {
                itemId: line.itemId,
                channelId: t.toChannelId,
                movementType: 'TRANSFER_IN',
                quantityChange: line.receivedQuantity,
                referenceId: t.id,
                referenceType: 'transfer',
                performedBy: t.receivedBy || 'system',
              }
            })
          }
        }
      }
    }
  }
  
  console.log('✅ Repair completed.')
}

main().catch(console.error).finally(() => prisma.$disconnect())
