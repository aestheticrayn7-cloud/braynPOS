import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'

const prisma = new PrismaClient()

async function debugMouse() {
  const mouse = await prisma.item.findFirst({
    where: { name: { contains: 'Mouse' } }
  })
  
  let out = '--- MOUSE DEBUG ---\n'
  if (!mouse) {
    out += 'Mouse NOT FOUND in items table\n'
    const allItems = await prisma.item.findMany({ take: 20 })
    out += 'Sample items:\n'
    allItems.forEach(i => out += `- ${i.name} (${i.id}) Deleted: ${i.deletedAt}\n`)
  } else {
    out += `ID: ${mouse.id}\n`
    out += `Name: ${mouse.name}\n`
    out += `SKU: ${mouse.sku}\n`
    out += `DeletedAt: ${mouse.deletedAt}\n`
    out += `IsActive: ${mouse.isActive}\n`
    
    const balance = await prisma.inventory_balances.findMany({
      where: { itemId: mouse.id }
    })
    out += `Balances: ${JSON.stringify(balance, null, 2)}\n`
  }
  
  fs.writeFileSync('debug_mouse_missing.txt', out)
}

debugMouse().finally(() => prisma.$disconnect())
