import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const hq = await prisma.channel.findFirst({ where: { name: 'Headquarters' } })
  console.log('HQ ID:', hq?.id)
  
  const balances = await (prisma as any).inventory_balances.findMany({
    include: { item: true }
  })
  
  console.log('--- ALL BALANCES (with item name) ---')
  for (const b of balances) {
    if (b.item.name.toLowerCase().includes('micro') || b.item.name.toLowerCase().includes('laptop')) {
      console.log(`- ${b.item.name}, Channel: ${b.channelId}, Qty: ${b.availableQty}`)
    }
  }
  
  const olivia = await prisma.user.findFirst({ where: { username: 'olivia' } })
  console.log('Olivia Channel:', olivia?.channelId)
}

main().catch(console.error).finally(() => prisma.$disconnect())
