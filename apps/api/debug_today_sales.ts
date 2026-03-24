import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function debug() {
  const now = new Date()
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  
  console.log(`Checking sales since ${today.toISOString()}`)

  const sales = await prisma.sale.findMany({
    where: { 
      createdAt: { gte: today },
      deletedAt: null 
    },
    select: {
      id: true,
      receiptNo: true,
      netAmount: true,
      createdAt: true,
      channel: { select: { name: true, code: true } }
    }
  })

  console.log('SALES_TODAY:' + JSON.stringify(sales))

  const aggregate = await prisma.sale.groupBy({
    by: ['channelId'],
    where: {
      createdAt: { gte: today },
      deletedAt: null
    },
    _sum: { netAmount: true },
    _count: true
  })
  
  console.log('AGGREGATE_BY_CHANNEL:' + JSON.stringify(aggregate))
}

debug().catch(console.error).finally(() => prisma.$disconnect())
