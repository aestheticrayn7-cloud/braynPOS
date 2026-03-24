import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const microwave = await prisma.item.findFirst({ where: { name: 'microwave' } })
  if (!microwave) return
  
  const balances = await (prisma as any).inventory_balances.findMany({
    where: { itemId: microwave.id }
  })
  
  console.log('--- MICROWAVE BALANCES (IDS) ---')
  for (const b of balances) {
    console.log(`ChannelID: ${b.channelId}, Avail: ${b.availableQty}`)
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
