import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'

const prisma = new PrismaClient()

async function debug() {
  const laptop = await prisma.item.findFirst({ where: { name: { contains: 'Generic Business Laptop' } } })
  const chuka = await prisma.channel.findFirst({ where: { name: { contains: 'Chuka' } } })

  let out = '--- DEBUG RESULTS ---\n'
  if (!laptop || !chuka) {
    out += 'Missing data\n'
    fs.writeFileSync('debug_out.txt', out)
    return
  }

  const balance = await prisma.inventory_balances.findUnique({
    where: { itemId_channelId: { itemId: laptop.id, channelId: chuka.id } }
  })
  
  const movements = await prisma.stockMovement.findMany({
    where: { itemId: laptop.id, channelId: chuka.id }
  })

  out += `ITEM: ${laptop.name} (${laptop.id})\n`
  out += `CHANNEL: ${chuka.name} (${chuka.id})\n`
  out += `BALANCE: ${JSON.stringify(balance)}\n`
  out += `MOVE_COUNT: ${movements.length}\n`
  out += `MOVE_SUM: ${movements.reduce((acc, m) => acc + m.quantityChange, 0)}\n`
  movements.forEach(m => {
    out += `  - Type: ${m.movementType}, Change: ${m.quantityChange}, Ref: ${m.referenceId}\n`
  })
  
  fs.writeFileSync('debug_out.txt', out)
}

debug().finally(() => prisma.$disconnect())
