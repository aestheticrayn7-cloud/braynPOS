import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('--- REPAIRED INVENTORY BALANCES ---')
  const results = await (prisma as any).inventory_balances.findMany({
    include: { item: { select: { name: true, sku: true } }, channel: { select: { name: true } } }
  })
  
  console.log(JSON.stringify(results.map((r: any) => ({
    item: r.item.name,
    channel: r.channel.name,
    available: r.availableQty,
    incoming: r.incomingQty
  })), null, 2))
}

main().catch(console.error).finally(() => prisma.$disconnect())
