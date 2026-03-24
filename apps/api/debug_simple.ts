import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function debug() {
  const channels = await prisma.channel.findMany()
  console.log('CHANNELS_DATA:' + JSON.stringify(channels))

  const sales = await prisma.sale.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10
  })
  console.log('SALES_DATA:' + JSON.stringify(sales))

  const users = await prisma.user.findMany({
    where: { role: { in: ['SUPER_ADMIN', 'MANAGER_ADMIN'] } }
  })
  console.log('ADMINS_DATA:' + JSON.stringify(users))
}

debug().catch(console.error).finally(() => prisma.$disconnect())
