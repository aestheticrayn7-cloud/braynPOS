import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function debug() {
  const now = new Date()
  const todayLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))

  console.log('--- TIME INFO ---')
  console.log('Now (Local):', now.toString())
  console.log('Now (ISO):', now.toISOString())
  console.log('Today (Local Midnight):', todayLocal.toISOString())
  console.log('Today (UTC Midnight):', todayUTC.toISOString())

  const sales = await prisma.sale.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: {
      id: true,
      receiptNo: true,
      createdAt: true,
      netAmount: true,
      channelId: true
    }
  })

  console.log('\n--- RECENT SALES ---')
  sales.forEach(s => {
    console.log(`[${s.receiptNo}] CREATED: ${s.createdAt.toISOString()} | AMT: ${s.netAmount}`)
  })

  const countUTC = await prisma.sale.count({
    where: { createdAt: { gte: todayUTC } }
  })
  const countLocal = await prisma.sale.count({
    where: { createdAt: { gte: todayLocal } }
  })

  console.log('\n--- QUERY TESTS ---')
  console.log('Count GTE UTC Today:', countUTC)
  console.log('Count GTE Local Today:', countLocal)
}

debug().catch(console.error).finally(() => prisma.$disconnect())
