import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const channelId = '605831cd-dc31-47c1-8b39-dcd8dd493de2'
  const microwave = await prisma.item.findFirst({ where: { name: 'microwave' } })
  if (!microwave) return
  
  // Simulate the Stock Levels API call exactly
  const balance = await (prisma as any).inventory_balances.findUnique({
    where: { itemId_channelId: { itemId: microwave.id, channelId } }
  })
  
  console.log('--- STOCK LEVEL VIEW SIMULATION ---')
  console.log(`Item: ${microwave.name}`)
  console.log(`Available: ${balance?.availableQty}`)
  console.log(`Incoming: ${balance?.incomingQty}`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
