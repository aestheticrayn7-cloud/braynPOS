import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function debug() {
  const channels = await prisma.channel.findMany({
    select: { id: true, name: true, code: true, deletedAt: true }
  })
  console.log('--- CHANNELS ---')
  console.table(channels)

  const users = await prisma.user.findMany({
    where: { role: { in: ['SUPER_ADMIN', 'MANAGER_ADMIN'] } },
    select: { id: true, name: true, role: true, channelId: true }
  })
  console.log('\n--- ADMIN USERS ---')
  console.table(users)

  const today = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate()))
  const todaySalesCount = await prisma.sale.count({
    where: { createdAt: { gte: today }, deletedAt: null }
  })
  console.log(`\nGlobal Sales Today (GTE ${today.toISOString()}): ${todaySalesCount}`)

  const salesByChannel = await prisma.sale.groupBy({
    by: ['channelId'],
    where: { createdAt: { gte: today }, deletedAt: null },
    _count: true,
    _sum: { netAmount: true }
  })
  console.log('\n--- SALES BY CHANNEL TODAY ---')
  console.table(salesByChannel.map(s => ({
    channelId: s.channelId,
    count: s._count,
    revenue: s._sum.netAmount
  })))
}

debug().catch(console.error).finally(() => prisma.$disconnect())
