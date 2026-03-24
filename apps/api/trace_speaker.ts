import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const speakerId = 'b496be02-aff7-48f8-b3d5-09f19548f029' // From case_audit
  
  const movements = await prisma.stockMovement.findMany({
    where: { itemId: speakerId },
    orderBy: { createdAt: 'desc' }
  })
  console.log('--- MOVEMENTS ---')
  console.log(JSON.stringify(movements, null, 2))
  
  if (movements.length > 0 && movements[0].referenceId) {
     const refId = movements[0].referenceId
     console.log(`Checking referenceId: ${refId}`)
     const p = await prisma.purchase.findUnique({ where: { id: refId }, include: { lines: true } })
     console.log('Purchase from refId:', JSON.stringify(p, null, 2))
     
     if (!p) {
        // Maybe it's not a UUID?
        console.log('Purchase not found by ID. Checking all purchases for this referenceId as a string...')
        const allP = await prisma.purchase.findMany({ where: { id: { contains: refId } } })
        console.log('Search by ID match:', allP.length)
     }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
