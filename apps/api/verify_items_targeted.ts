import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const items = await prisma.item.findMany({
    where: { name: { in: ['microwave', 'Generic Business Laptop'] } }
  })
  
  for (const item of items) {
    console.log(`--- ${item.name} (${item.sku}) ---`)
    const balances = await (prisma as any).inventory_balances.findMany({
      where: { itemId: item.id },
      include: { channel: { select: { name: true } } }
    })
    console.log('Balances:', JSON.stringify(balances.map((b: any) => ({ 
      channel: b.channel.name, 
      avail: b.availableQty, 
      in: b.incomingQty 
    })), null, 2))
    
    const movements = await prisma.stockMovement.findMany({
      where: { itemId: item.id },
      include: { channel: { select: { name: true } } },
      orderBy: { createdAt: 'desc' }
    })
    console.log('Movements:', JSON.stringify(movements.map(m => ({
      ch: m.channel.name,
      type: m.movementType,
      qty: m.quantityChange,
      ref: m.referenceType
    })), null, 2))
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
