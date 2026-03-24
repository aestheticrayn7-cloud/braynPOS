import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const microwave = await prisma.item.findFirst({ where: { name: 'microwave' } })
  if (!microwave) return
  
  const balances = await (prisma as any).inventory_balances.findMany({
    where: { itemId: microwave.id },
    include: { channel: true }
  })
  
  console.log('--- MICROWAVE BALANCES ---')
  for (const b of balances) {
    console.log(`Channel: ${b.channel.name} (${b.channelId}), Avail: ${b.availableQty}, Incoming: ${b.incomingQty}`)
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
