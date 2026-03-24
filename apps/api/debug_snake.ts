import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'

const prisma = new PrismaClient()

async function debug() {
  const item = await prisma.item.findFirst({ where: { name: { contains: 'snakelight' } } })
  const chuka = await prisma.channel.findFirst({ where: { name: { contains: 'Chuka' } } })

  let out = '--- SNAKELIGHT DEBUG ---\n'
  if (!item || !chuka) {
    out += 'Missing item or channel\n'
    fs.writeFileSync('debug_snake.txt', out)
    return
  }

  const balance = await prisma.inventory_balances.findUnique({
    where: { itemId_channelId: { itemId: item.id, channelId: chuka.id } }
  })
  
  const movements = await prisma.stockMovement.findMany({
    where: { itemId: item.id, channelId: chuka.id },
    orderBy: { createdAt: 'asc' }
  })

  out += `ITEM: ${item.name} (${item.id})\n`
  out += `CHANNEL: ${chuka.name} (${chuka.id})\n`
  out += `BALANCE: ${JSON.stringify(balance)}\n`
  out += `MOVE_COUNT: ${movements.length}\n`
  out += `MOVE_SUM: ${movements.reduce((acc, m) => acc + m.quantityChange, 0)}\n`
  movements.forEach(m => {
    out += `  - [${m.createdAt.toISOString()}] Type: ${m.movementType}, Change: ${m.quantityChange}, Ref: ${m.referenceId}\n`
  })

  // Check the transfer line
  const tLines = await prisma.transferLine.findMany({
    where: { itemId: item.id },
    include: { transfer: true }
  })
  out += `\n--- RELATED TRANSFERS ---\n`
  tLines.forEach(tl => {
    out += `  - Transfer: ${tl.transfer.transferNo}, Status: ${tl.transfer.status}, Sent: ${tl.sentQuantity}, Recv: ${tl.receivedQuantity}\n`
  })
  
  fs.writeFileSync('debug_snake.txt', out)
}

debug().finally(() => prisma.$disconnect())
