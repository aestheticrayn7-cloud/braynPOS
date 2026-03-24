import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] })

async function run() {
  const channelId = '123e4567-e89b-12d3-a456-426614174000'
  const items = [
    { itemId: '123e4567-e89b-12d3-a456-426614174001', quantity: 2 }
  ]

  console.log("Testing raw query execution WITHOUT ::uuid...")
  try {
    await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`
        UPDATE inventory_balances AS ib
        SET    "availableQty" = ib."availableQty" - v.qty
        FROM   (VALUES ${Prisma.join(
          items.map(l => Prisma.sql`(${l.itemId}, ${l.quantity}::int)`)
        )}) AS v("itemId", qty)
        WHERE  ib."itemId"    = v."itemId"
          AND  ib."channelId" = ${channelId}
      `
    })
    console.log("Success!")
  } catch (err) {
    console.error("Error executing query:", err)
  } finally {
    await prisma.$disconnect()
  }
}

run()
