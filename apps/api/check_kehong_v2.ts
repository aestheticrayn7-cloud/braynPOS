import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'

const prisma = new PrismaClient()

async function check() {
  const i = await prisma.item.findFirst({ where: { sku: 'ITEM-1773680682143' } })
  fs.writeFileSync('kehong_state.txt', JSON.stringify(i, null, 2))
}

check().finally(() => prisma.$disconnect())
