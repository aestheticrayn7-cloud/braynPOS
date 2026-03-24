import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('--- AUDITING PURCHASES ---')
  const purchases = await prisma.purchase.findMany({
    where: { status: 'COMMITTED', deletedAt: null },
    include: { lines: true }
  })
  
  for (const p of purchases) {
    const movementCount = await prisma.stockMovement.count({
      where: { referenceId: p.id, referenceType: 'purchase' }
    })
    if (movementCount === 0) {
      console.log(`Purchase ${p.purchaseNo} (ID: ${p.id}) is missing movements! Lines: ${p.lines.length}`)
    }
  }

  console.log('--- AUDITING TRANSFERS ---')
  const transfers = await prisma.transfer.findMany({
    where: { status: { in: ['SENT', 'RECEIVED', 'DISPUTED'] } },
    include: { lines: true }
  })
  
  for (const t of transfers) {
    const movementCount = await prisma.stockMovement.count({
      where: { referenceId: t.id, referenceType: 'transfer' }
    })
    if (movementCount === 0) {
      console.log(`Transfer ${t.transferNo} (ID: ${t.id}) is missing movements! Lines: ${t.lines.length}`)
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
