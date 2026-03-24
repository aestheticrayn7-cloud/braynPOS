import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const hqId = '605831cd-dc31-47c1-8f39-dcd8dd493de2'
  const speakerId = 'b496be02-aff7-4148-b53a-0be5de051b0a'
  
  console.log('--- FINAL VERIFICATION ---')
  
  // 1. Check Speaker Stock
  const balance = await prisma.inventory_balances.findUnique({
    where: { itemId_channelId: { itemId: speakerId, channelId: hqId } }
  })
  console.log('RBT Speaker Stock in HQ:', balance?.availableQty)
  
  // 2. Check Chris
  const chris = await prisma.user.findFirst({ where: { username: 'chris' } })
  console.log('Chris Channel:', chris?.channelId === hqId ? 'HQ (CORRECT)' : 'WRONG!')
  
  // 3. Count other channels
  const others = await prisma.channel.findMany({ where: { id: { not: hqId } } })
  console.log('Other channels in DB:', others.length)
}

main().catch(console.error).finally(() => prisma.$disconnect())
