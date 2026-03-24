import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('--- DEEP SEARCH FOR SPEAKER & PURCHASES ---')
  
  // 1. Find ALL items named similarly
  const items = await prisma.item.findMany({
    where: { name: { contains: 'RBT', mode: 'insensitive' } },
    include: { inventory_balances: true }
  })
  console.log(`Found ${items.length} items.`)
  items.forEach(i => {
    console.log(`Item: "${i.name}", ID: ${i.id}, Deleted: ${i.deletedAt}`)
  })
  
  // 2. Find ALL purchases (including potentially soft-deleted)
  const allPs = await prisma.purchase.findMany({
    include: { lines: true }
  })
  console.log(`\nFound ${allPs.length} total purchases in DB.`)
  allPs.forEach(p => {
    console.log(`No: |${p.purchaseNo}|, ID: ${p.id}, Deleted: ${p.deletedAt}, Status: ${p.status}`)
  })
  
  // 3. Find ALL stock movements for ANY item with RBT
  const sm = await prisma.stockMovement.findMany({
    where: { item: { name: { contains: 'RBT', mode: 'insensitive' } } }
  })
  console.log(`\nFound ${sm.length} stock movements for RBT items.`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
