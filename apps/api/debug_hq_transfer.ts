import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'

const prisma = new PrismaClient()

async function debug() {
  const laptop = await prisma.item.findFirst({ where: { name: { contains: 'Generic Business Laptop' } } })
  const hq = await prisma.channel.findFirst({ where: { name: { contains: 'Headquarters' } } })

  let out = '--- HQ DEBUG RESULTS ---\n'
  if (!laptop || !hq) {
    out += 'Missing data\n'
    fs.writeFileSync('debug_hq_out.txt', out)
    return
  }

  const balance = await prisma.inventory_balances.findUnique({
    where: { itemId_channelId: { itemId: laptop.id, channelId: hq.id } }
  })
  
  const movements = await prisma.stockMovement.findMany({
    where: { itemId: laptop.id, channelId: hq.id }
  })

  out += `ITEM: ${laptop.name} (${laptop.id})\n`
  out += `CHANNEL: ${hq.name} (${hq.id})\n`
  out += `BALANCE: ${JSON.stringify(balance)}\n`
  out += `MOVE_SUM: ${movements.reduce((acc, m) => acc + m.quantityChange, 0)}\n`
  
  fs.writeFileSync('debug_hq_out.txt', out)
}

debug().finally(() => prisma.$disconnect())
