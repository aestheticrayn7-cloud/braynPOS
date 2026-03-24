import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const hqId = '605831cd-dc31-47c1-8b39-dcd8dd493de2'
  
  // Check the Mouse movements
  const mouse = await prisma.item.findFirst({ where: { name: { contains: 'Mouse' } } })
  if (!mouse) return console.log('Mouse not found!')
  
  console.log(`--- MOUSE RAW MOVEMENTS (${mouse.name}) ---`)
  const movements = await prisma.stockMovement.findMany({
    where: { itemId: mouse.id, channelId: hqId },
    orderBy: { createdAt: 'desc' }
  })
  
  movements.forEach(m => {
    console.log(`${m.createdAt.toISOString()} | Type: ${m.movementType} | Change: ${m.quantityChange} | Ref: ${m.referenceType} (${m.referenceId})`)
  })
  
  // Check reorder levels
  const items = await prisma.item.findMany({ select: { name: true, reorderLevel: true } })
  console.log('\n--- REORDER LEVELS ---')
  items.forEach(i => console.log(`${i.name}: ${i.reorderLevel}`))
}

main().catch(console.error).finally(() => prisma.$disconnect())
