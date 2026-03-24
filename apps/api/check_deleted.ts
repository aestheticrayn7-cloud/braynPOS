import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkDeletedItems() {
  const items = await prisma.item.findMany({
    where: { 
      name: { contains: 'microwave', mode: 'insensitive' },
      deletedAt: { not: null }
    }
  })
  console.log('--- DELETED MICROWAVES ---')
  console.log(JSON.stringify(items, null, 2))
  
  const allItems = await prisma.item.findMany({
    where: { name: { contains: 'microwave', mode: 'insensitive' } }
  })
  console.log('\n--- ALL MICROWAVES (INCL DELETED) ---')
  console.log(JSON.stringify(allItems, null, 2))
}

checkDeletedItems().finally(() => prisma.$disconnect())
