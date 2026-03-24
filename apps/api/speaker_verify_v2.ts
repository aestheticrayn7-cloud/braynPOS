import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const hqId = '605831cd-dc31-47c1-8f39-dcd8dd493de2' // THE REAL ONE
  const speakerId = 'b496be02-aff7-48f8-b3d5-09f19548f029'
  
  const balance = await prisma.inventory_balances.findUnique({
    where: { itemId_channelId: { itemId: speakerId, channelId: hqId } }
  })
  
  console.log(`--- SPEAKER STOCK IN HQ (REAL) ---`)
  console.log('Available:', balance?.availableQty)
  
  const movement = await prisma.stockMovement.findFirst({
    where: { itemId: speakerId, channelId: hqId },
    orderBy: { createdAt: 'desc' }
  })
  console.log('Latest Movement:', JSON.stringify(movement, null, 2))
}

main().catch(console.error).finally(() => prisma.$disconnect())
