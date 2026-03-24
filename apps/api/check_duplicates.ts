import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkDuplicates() {
  const allItems = await prisma.item.findMany({
    select: { id: true, sku: true, name: true }
  })
  
  console.log('TOTAL_ITEMS:', allItems.length)
  
  const skuMap = new Map<string, string[]>()
  for (const item of allItems) {
    if (!skuMap.has(item.sku)) {
      skuMap.set(item.sku, [])
    }
    skuMap.get(item.sku)!.push(item.id)
  }
  
  console.log('--- DUPLICATE SKUs ---')
  for (const [sku, ids] of skuMap.entries()) {
    if (ids.length > 1) {
      console.log(`SKU: ${sku}, IDs: ${ids.join(', ')}`)
    }
  }
  
  const microwaveSku = 'ITEM-1773854078508'
  console.log('--- MICROWAVE SKU CHECK ---')
  console.log(`Searching for SKU: ${microwaveSku}`)
  const microwaves = allItems.filter(i => i.sku === microwaveSku)
  console.log(`Found ${microwaves.length} items`)
  microwaves.forEach(m => console.log(`- ID: ${m.id}, Name: ${m.name}`))
}

checkDuplicates().finally(() => prisma.$disconnect())
