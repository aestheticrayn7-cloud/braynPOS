import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const nos = ['PUR-1773854650948', 'PUR-1773854190903']
  const purchases = await prisma.purchase.findMany({
    where: { purchaseNo: { in: nos } },
    include: { lines: { include: { item: true } } }
  })
  
  console.log('--- PURCHASE DETAILS ---')
  for (const p of purchases) {
    console.log(`\nNo: ${p.purchaseNo}, Status: ${p.status}, Channel: ${p.channelId}`)
    for (const l of p.lines) {
      console.log(`- Item: ${l.item.name} (${l.item.sku}), Qty: ${l.quantity}, Cost: ${l.unitCost}`)
    }
    
    // Check movements
    const movements = await prisma.stockMovement.findMany({
      where: { referenceId: p.id, referenceType: 'purchase' }
    })
    console.log(`- Movements Found: ${movements.length}`)
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
