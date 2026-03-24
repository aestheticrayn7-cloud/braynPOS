import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('--- INVENTORY BALANCES ---')
  const balances = await (prisma as any).inventory_balances.findMany({
    include: { item: { select: { name: true, sku: true } } }
  })
  console.log(JSON.stringify(balances.map((b: any) => ({
    item: b.item.name,
    sku: b.item.sku,
    available: b.availableQty,
    incoming: b.incomingQty
  })), null, 2))
}

main().catch(console.error).finally(() => prisma.$disconnect())
