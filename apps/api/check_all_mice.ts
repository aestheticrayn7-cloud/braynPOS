import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'

const prisma = new PrismaClient()

async function check() {
  const items = await prisma.item.findMany({
    where: { name: { contains: 'Mouse', mode: 'insensitive' } }
  })
  fs.writeFileSync('all_mice.txt', JSON.stringify(items, null, 2))
}

check().finally(() => prisma.$disconnect())
