import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'

const prisma = new PrismaClient()

async function debugMouseMoves() {
  const moves = await prisma.stockMovement.findMany({
    where: { itemId: 'item-mouse-002' },
    orderBy: { createdAt: 'desc' }
  })
  
  let out = '--- MOUSE MOVEMENTS ---\n'
  moves.forEach(m => {
    out += `[${m.createdAt.toISOString()}] Type: ${m.movementType}, Qty: ${m.quantityChange}, Channel: ${m.channelId}, Ref: ${m.referenceId}\n`
  })
  
  fs.writeFileSync('debug_mouse_moves.txt', out)
}

debugMouseMoves().finally(() => prisma.$disconnect())
