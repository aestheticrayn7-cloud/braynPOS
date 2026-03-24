import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'

const prisma = new PrismaClient()

async function debug() {
  const allBalances = await prisma.inventory_balances.findMany()
  
  fs.writeFileSync('all_balances.txt', JSON.stringify(allBalances, null, 2))
}

debug().finally(() => prisma.$disconnect())
