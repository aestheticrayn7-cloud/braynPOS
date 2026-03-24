import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function debug() {
  try {
    const res = await prisma.inventory_balances.create({
      data: {
        itemId: '6f9539fe-20e0-403f-acd5-c1b804709487',
        channelId: '4178970e-8042-4796-a6af-da7c8e85d5ba',
        availableQty: 10,
        incomingQty: 0
      }
    })
    console.log('Inserted:', res)
  } catch (err) {
    console.error('Error inserting:', err)
  }
}

debug().finally(() => prisma.$disconnect())
