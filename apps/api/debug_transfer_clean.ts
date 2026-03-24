import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function debug() {
  const laptop = await prisma.item.findFirst({ where: { name: { contains: 'Generic Business Laptop' } } })
  const chuka = await prisma.channel.findFirst({ where: { name: { contains: 'Chuka' } } })

  if (!laptop || !chuka) {
    console.log('Missing data')
    return
  }

  const balance = await prisma.inventory_balances.findUnique({
    where: { itemId_channelId: { itemId: laptop.id, channelId: chuka.id } }
  })
  
  const movements = await prisma.stockMovement.findMany({
    where: { itemId: laptop.id, channelId: chuka.id }
  })

  console.log('--- DEBUG RESULTS ---')
  console.log('ITEM:', laptop.name, '(' + laptop.id + ')')
  console.log('CHANNEL:', chuka.name, '(' + chuka.id + ')')
  console.log('BALANCE:', JSON.stringify(balance))
  console.log('MOVE_COUNT:', movements.length)
  console.log('MOVE_SUM:', movements.reduce((acc, m) => acc + m.quantityChange, 0))
  movements.forEach(m => {
    console.log(`  - Type: ${m.movementType}, Change: ${m.quantityChange}, Ref: ${m.referenceId}`)
  })
}

debug().finally(() => prisma.$disconnect())
