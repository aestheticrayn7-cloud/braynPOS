import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany({
    where: { username: { in: ['admin', 'manager', 'chris', 'hilda', 'olivia'] } },
    select: { username: true, channelId: true, channel: { select: { name: true } } }
  })
  
  console.log('--- USER CHANNELS ---')
  users.forEach(u => console.log(`${u.username}: ${u.channel?.name || 'All'} (${u.channelId})`))
  
  const purchases = await prisma.purchase.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: { purchaseNo: true, channelId: true, channel: { select: { name: true } } }
  })
  console.log('\n--- RECENT PURCHASE CHANNELS ---')
  purchases.forEach(p => console.log(`${p.purchaseNo}: ${p.channel?.name || 'Unknown'} (${p.channelId})`))
}

main().catch(console.error).finally(() => prisma.$disconnect())
