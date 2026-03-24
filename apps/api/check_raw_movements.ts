import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const microwave = await prisma.item.findFirst({ where: { name: 'microwave' } })
  if (!microwave) return
  
  const movements = await prisma.stockMovement.findMany({
    where: { itemId: microwave.id }
  })
  
  console.log(`--- RAW MOVEMENTS FOR ${microwave.name} ---`)
  console.log(JSON.stringify(movements, null, 2))
  
  const balance = await (prisma as any).inventory_balances.findUnique({
    where: { itemId_channelId: { itemId: microwave.id, channelId: movements[0]?.channelId || 'none' } }
  })
  console.log('--- FINAL BALANCE ---')
  console.log(JSON.stringify(balance, null, 2))
}

main().catch(console.error).finally(() => prisma.$disconnect())
