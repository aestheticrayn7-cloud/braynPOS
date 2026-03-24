import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const pNos = ['PUR-1773857431388', 'PUR-1773854650948', 'PUR-1773854190903']
  
  for (const no of pNos) {
    const p = await prisma.purchase.findUnique({
      where: { purchaseNo: no },
      include: { 
        lines: { include: { item: true } },
        channel: true
      }
    })
    
    console.log(`--- PURCHASE: ${no} ---`)
    console.log(`Channel: ${p?.channel?.name} (${p?.channelId})`)
    p?.lines.forEach(l => {
      console.log(`- Item: ${l.item.name}, Qty: ${l.quantity}, UnitCost: ${l.unitCost}`)
    })
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
