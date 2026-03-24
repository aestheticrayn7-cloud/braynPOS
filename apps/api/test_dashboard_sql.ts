import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

async function testDashboardQueries() {
  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)
  
  const effectiveChannelId = undefined // HQ Mode
  
  console.log('Testing Sales Summary Query...')
  try {
    const res = await prisma.$queryRaw`
      SELECT
        COUNT(*)::int                 AS count,
        COALESCE(SUM("netAmount"), 0) AS revenue
      FROM sales
      WHERE "deletedAt" IS NULL
        AND "createdAt" >= ${today}
    `
    console.log('Success:', res)
  } catch (err) {
    console.error('FAILED Sales Summary:', err.message)
  }

  console.log('Testing Stock Alert Queries...')
  try {
    const res = await prisma.$queryRaw`
      SELECT COUNT(*)::int AS count
      FROM items i
      LEFT JOIN inventory_balances ib
        ON ib."itemId" = i.id
      WHERE i."deletedAt" IS NULL
        AND i."isActive"  = true
        AND COALESCE(ib."availableQty", 0) <= 0
    `
    console.log('Success:', res)
  } catch (err) {
    console.error('FAILED Stock Alerts:', err.message)
  }

  console.log('Testing Transfers Query...')
  try {
    const res = await prisma.$queryRaw`
      SELECT COUNT(*)::int AS count
      FROM transfers
      WHERE status IN ('SENT', 'AWAITING_RECEIVER')
    `
    console.log('Success:', res)
  } catch (err) {
    console.error('FAILED Transfers:', err.message)
  }

  console.log('Testing Recent Sales Query...')
  try {
    const res = await prisma.$queryRaw`
      SELECT
        s.id,
        s."receiptNo",
        s."netAmount",
        s."channelId",
        s."customerId",
        s."createdAt",
        ch.name  AS "channelName",
        cu.name  AS "customerName"
      FROM   sales s
      LEFT   JOIN channels  ch ON ch.id = s."channelId"
      LEFT   JOIN customers cu ON cu.id = s."customerId"
      WHERE  s."deletedAt" IS NULL
        AND  s."createdAt" >= ${today}
      ORDER  BY s."createdAt" DESC
      LIMIT  5
    `
    console.log('Success:', res)
  } catch (err) {
    console.error('FAILED Recent Sales:', err.message)
  }

  await prisma.$disconnect()
}

testDashboardQueries().catch(console.error)
