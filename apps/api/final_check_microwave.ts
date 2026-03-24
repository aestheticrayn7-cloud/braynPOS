import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const microwave = await prisma.item.findFirst({ where: { name: 'microwave' } })
  if (!microwave) return
  const balance = await (prisma as any).inventory_balances.findUnique({
    where: { itemId_channelId: { itemId: microwave.id, channelId: '4979e2c6-d444-4860-9513-393282f1b4c9' } } // Headquarters ID from previous logs
  })
  if (!balance) {
      const all = await (prisma as any).inventory_balances.findMany({ where: { itemId: microwave.id } })
      console.log('Microwave Balances:', all)
  } else {
      console.log('Microwave Balance at HQ:', balance.availableQty)
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
