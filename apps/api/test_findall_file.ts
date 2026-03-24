import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'

const prisma = new PrismaClient()

async function test() {
  const channelId = '4178970e-8042-4796-a6af-da7c8e85d5ba'
  
  const where = {
    deletedAt: null,
    inventory_balances: {
      some: { channelId: channelId }
    }
  }

  const items = await prisma.item.findMany({
    where,
    include: {
      category: true,
      inventory_balances: {
        where: { channelId }
      }
    }
  })

  fs.writeFileSync('findall_fixed.txt', JSON.stringify(items, null, 2))
}

test().catch(console.error).finally(() => prisma.$disconnect())
