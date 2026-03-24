import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function check() {
  const itemsCount = await prisma.item.count()
  const categories = await prisma.category.findMany({
    include: { _count: { select: { items: true } } }
  })
  
  let output = '--- DB Check ---\n'
  output += `Total Items: ${itemsCount}\n`
  for (const c of categories) {
    output += `Category: ${c.name} | ID: ${c.id} | Items: ${c._count.items} | Deleted: ${c.deletedAt}\n`
  }
  
  const hq = await prisma.channel.findUnique({ where: { code: 'HQ' } })
  if (hq) {
    const balances = await prisma.inventory_balances.count({ where: { channelId: hq.id } })
    output += `HQ Inventory Balance Rows: ${balances}\n`
  }

  const today = new Date().toISOString().split('T')[0]
  const start = new Date(`${today}T00:00:00Z`)
  const end = new Date(`${today}T23:59:59Z`)
  
  const totalSalesCount = await prisma.sale.count({
    where: { deletedAt: null, createdAt: { gte: start, lte: end } }
  })
  output += `Today Total Sales Count: ${totalSalesCount}\n`

  const fs = require('fs')
  fs.writeFileSync('db_check.txt', output)
  console.log('Results written to db_check.txt')
}

check().finally(() => prisma.$disconnect())
