import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'

const prisma = new PrismaClient()

async function checkSKUs() {
  const items = await prisma.item.findMany({ select: { id: true, name: true, sku: true } })
  let out = '--- ALL SKUS ---\n'
  items.forEach(i => out += `- ${i.name} [${i.sku}]\n`)
  fs.writeFileSync('all_skus.txt', out)
}

checkSKUs().finally(() => prisma.$disconnect())
