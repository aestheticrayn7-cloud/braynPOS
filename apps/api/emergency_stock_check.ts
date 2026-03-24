import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const all: any[] = await prisma.$queryRaw`SELECT * FROM inventory_balances`
  console.log(`--- ALL INVENTORY BALANCES RAW (${all.length} rows) ---`)
  for (const b of all) {
    const item = await prisma.item.findUnique({ where: { id: b.itemId } })
    console.log(`Item: ${item?.name}, Channel: ${b.channelId}, Qty: ${b.availableQty}`)
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
