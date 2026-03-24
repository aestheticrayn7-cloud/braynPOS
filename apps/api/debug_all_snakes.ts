import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'

const prisma = new PrismaClient()

async function debug() {
  const items = await prisma.item.findMany({ 
    where: { name: { contains: 'snakelights' } } 
  })

  let out = '--- ALL SNAKELIGHTS ---\n'
  items.forEach(it => {
    out += `ID: ${it.id}, Name: ${it.name}, SKU: ${it.sku}\n`
  })
  
  fs.writeFileSync('debug_all_snakes.txt', out)
}

debug().finally(() => prisma.$disconnect())
