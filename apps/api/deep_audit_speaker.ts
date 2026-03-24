import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const speakerId = 'b496be02-aff7-48f8-b3d5-09f19548f029'
  
  const count = await prisma.purchase.count()
  console.log(`Total Purchases in DB: ${count}`)
  
  const hqs = await prisma.channel.findMany({ where: { name: 'Headquarters' } })
  console.log('HQs found:', hqs.length)
  
  const movements = await prisma.stockMovement.findMany({
    where: { itemId: speakerId },
    orderBy: { createdAt: 'desc' }
  })
  console.log('--- SPEAKER MOVEMENTS ---')
  movements.forEach(m => console.log(`${m.createdAt.toISOString()} | Type: ${m.movementType} | Qty: ${m.quantityChange} | Ref: ${m.referenceId} | Channel: ${m.channelId}`))
  
  const pNo = 'PUR-1773860140936'
  const p = await prisma.purchase.findFirst({ where: { purchaseNo: pNo }, include: { lines: true } })
  console.log(`\nDirect search for ${pNo}: ${p ? 'FOUND' : 'NOT FOUND'}`)
  
  if (!p) {
    // Check if it's "soft deleted"
    console.log('Checking for soft-deleted record...')
    const pDeleted = await prisma.purchase.findFirst({ 
      where: { purchaseNo: pNo, NOT: { deletedAt: null } } as any
    })
    console.log(`Soft-deleted search: ${pDeleted ? 'FOUND' : 'NOT FOUND'}`)
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
