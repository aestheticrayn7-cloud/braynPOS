import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verifyTrigger() {
  const item = await prisma.item.findFirst()
  const channel = await prisma.channel.findFirst()
  const user = await prisma.user.findFirst()

  if (!item || !channel || !user) {
    console.error('Missing prerequisites for testing.')
    return
  }

  const itemId = item.id
  const channelId = channel.id
  const userId = user.id

  console.log(`Testing with Item: ${item.name}, Channel: ${channel.name}`)

  // 1. Initial State
  const initial = await prisma.inventory_balances.findUnique({
    where: { itemId_channelId: { itemId, channelId } }
  })
  console.log('1. Initial Available Qty:', initial?.availableQty ?? 0)

  // 2. Test INSERT
  console.log('2. Inserting movement (+100)...')
  const m1 = await prisma.stockMovement.create({
    data: {
      itemId,
      channelId,
      quantityChange: 100,
      movementType: 'ADJUSTMENT_IN',
      performedBy: userId,
      referenceId: 'test-insert',
      referenceType: 'other'
    }
  })
  
  const state2 = await prisma.inventory_balances.findUnique({
    where: { itemId_channelId: { itemId, channelId } }
  })
  console.log('   Available Qty after INSERT:', state2?.availableQty)

  // 3. Test UPDATE (Change quantity from 100 to 150)
  console.log('3. Updating movement (100 -> 150)...')
  await prisma.stockMovement.update({
    where: { id: m1.id },
    data: { quantityChange: 150 }
  })
  
  const state3 = await prisma.inventory_balances.findUnique({
    where: { itemId_channelId: { itemId, channelId } }
  })
  console.log('   Available Qty after UPDATE:', state3?.availableQty)

  // 4. Test DELETE
  console.log('4. Deleting movement...')
  await prisma.stockMovement.delete({
    where: { id: m1.id }
  })
  
  const state4 = await prisma.inventory_balances.findUnique({
    where: { itemId_channelId: { itemId, channelId } }
  })
  console.log('   Available Qty after DELETE:', state4?.availableQty)
  
  if (state4?.availableQty === initial?.availableQty) {
    console.log('SUCCESS: Trigger lifecycle verification complete.')
  } else {
    console.warn('MISMATCH: Final balance does not match initial balance.')
  }
}

verifyTrigger().finally(() => prisma.$disconnect())
