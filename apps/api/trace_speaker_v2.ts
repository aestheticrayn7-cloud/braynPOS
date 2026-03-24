import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const speakerId = 'b496be02-aff7-48f8-b3d5-09f19548f029' // Verified ID
  
  const movements = await prisma.stockMovement.findMany({
    where: { itemId: speakerId },
    orderBy: { createdAt: 'desc' }
  })
  console.log('--- MOVEMENTS ---')
  movements.forEach(m => console.log(`${m.createdAt.toISOString()} | Type: ${m.movementType} | Qty: ${m.quantityChange} | RefId: ${m.referenceId} | Channel: ${m.channelId}`))
  
  if (movements.length > 0 && movements[0].referenceId) {
     const refId = movements[0].referenceId
     console.log(`\nChecking referenceId (UUID or ID string): ${refId}`)
     
     // Search for purchase by id (uuid)
     const pById = await prisma.purchase.findUnique({ where: { id: refId } })
     if (pById) {
       console.log('Found Purchase by UUID:', pById.purchaseNo, 'Channel:', pById.channelId)
     } else {
       // Search for purchase by purchaseNo (string)
       const pByNo = await prisma.purchase.findFirst({ where: { purchaseNo: refId } })
       if (pByNo) {
         console.log('Found Purchase by purchaseNo:', pByNo.id, 'Channel:', pByNo.channelId)
       } else {
         console.log('Purchase record NOT FOUND by either ID or purchaseNo.')
       }
     }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
