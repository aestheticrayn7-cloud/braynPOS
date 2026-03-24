import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function repair() {
  console.log('Repairing balances using JS logic...')
  const moves = await prisma.stockMovement.findMany()
  
  const balances: Record<string, { available: number; incoming: number; lastMove: Date }> = {}
  
  for (const m of moves) {
    const key = `${m.itemId}:${m.channelId}`
    if (!balances[key]) {
      balances[key] = { available: 0, incoming: 0, lastMove: m.createdAt }
    }
    
    if (m.movementType === 'TRANSFER_IN_PENDING') {
      balances[key].incoming += m.quantityChange
    } else {
      balances[key].available += m.quantityChange
    }
    
    if (m.createdAt > balances[key].lastMove) {
      balances[key].lastMove = m.createdAt
    }
  }
  
  for (const [key, val] of Object.entries(balances)) {
    const [itemId, channelId] = key.split(':')
    await prisma.inventory_balances.upsert({
      where: { itemId_channelId: { itemId, channelId } },
      update: {
        availableQty: val.available,
        incomingQty: val.incoming,
        lastMovementAt: val.lastMove
      },
      create: {
        itemId,
        channelId,
        availableQty: val.available,
        incomingQty: val.incoming,
        lastMovementAt: val.lastMove
      }
    })
  }
  console.log('Repair complete.')
  
  // Verify Mouse again
  const chuka = '4178970e-8042-4796-a6af-da7c8e85d5ba'
  const mouse = await prisma.inventory_balances.findUnique({
    where: { itemId_channelId: { itemId: 'item-mouse-002', channelId: chuka } }
  })
  console.log('FINAL MOUSE BAL IN CHUKA:', JSON.stringify(mouse))
}

repair().finally(() => prisma.$disconnect())
