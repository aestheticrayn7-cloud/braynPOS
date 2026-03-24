import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const channelId = '605831cd-dc31-47c1-8b39-dcd8dd493de2' // The target HQ
  
  // This mimics the logic in Stock Service / balances endpoint
  const balances = await (prisma as any).inventory_balances.findMany({
    where: { channelId },
    include: {
      item: {
        select: {
          id: true,
          name: true,
          sku: true,
          category: { select: { name: true } },
          reorderLevel: true,
        }
      }
    }
  })
  
  console.log(`--- STOCK BALANCES FOR CONSOLIDATED HQ (${channelId}) ---`)
  console.log(`Total items in balance table: ${balances.length}`)
  
  const formatted = balances.map((b: any) => ({
    name: b.item.name,
    sku: b.item.sku,
    avail: b.availableQty,
    incoming: b.incomingQty
  }))
  
  console.log(JSON.stringify(formatted, null, 2))
}

main().catch(console.error).finally(() => prisma.$disconnect())
