import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'

const prisma = new PrismaClient()

async function check() {
  const shop = 'e803051e-c9ca-46a4-9014-83075d6a3e13'
  const balances = await prisma.inventory_balances.findMany({
    where: { channelId: shop }
  })
  fs.writeFileSync('mobile_balances_final.txt', JSON.stringify(balances, null, 2))
}

check().finally(() => prisma.$disconnect())
