import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'

const prisma = new PrismaClient()

async function check() {
  const items = await prisma.item.findMany({
    select: { name: true, sku: true, id: true }
  })
  fs.writeFileSync('all_items_skus.txt', JSON.stringify(items, null, 2))
}

check().finally(() => prisma.$disconnect())
