import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'

const prisma = new PrismaClient()

async function checkCols() {
  const cols = await prisma.$queryRaw<any[]>`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'inventory_balances'
  `
  fs.writeFileSync('ib_cols.txt', JSON.stringify(cols, null, 2))
}

checkCols().finally(() => prisma.$disconnect())
