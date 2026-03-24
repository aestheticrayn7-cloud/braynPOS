import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const laptop = await prisma.item.findFirst({ where: { sku: 'LP-GEN-001' } })
  if (!laptop) return
  
  const purchases = await prisma.purchase.findMany({
    where: { lines: { some: { itemId: laptop.id } } }
  })
  console.log(`Purchases for Laptop: ${purchases.length}`)
  purchases.forEach(p => console.log(`- ${p.purchaseNo}: Status=${p.status}, Date=${p.createdAt}`))
  
  const movements = await prisma.stockMovement.findMany({
    where: { itemId: laptop.id }
  })
  console.log(`Movements for Laptop: ${movements.length}`)
  movements.forEach(m => console.log(`- Type=${m.movementType}, Qty=${m.quantityChange}, Ref=${m.referenceType}`))
}

main().catch(console.error).finally(() => prisma.$disconnect())
