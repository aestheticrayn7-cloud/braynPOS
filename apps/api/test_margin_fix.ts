import { calculateCommission } from './src/modules/commission/commission.service.js'
import { basePrisma as prisma } from './src/lib/prisma.js'

async function testCommissionBlock() {
  console.log('--- Testing Commission Hard-Block ---')
  
  // 1. Find a sale with items
  const sale = await prisma.sale.findFirst({
    where: { items: { some: {} } },
    include: { items: true }
  })

  if (!sale) {
    console.log('No sales found to test with.')
    return
  }

  console.log(`Testing sale ${sale.id} (Receipt: ${sale.receiptNo})`)

  // 2. Temporarily modify a sale item to have 0 cost
  const originalCost = sale.items[0].costPriceSnapshot
  await prisma.saleItem.update({
    where: { id: sale.items[0].id },
    data: { costPriceSnapshot: 0 }
  })

  console.log('Modified item cost to 0. Attempting to calculate commission...')

  // 3. Try to calculate commission
  const result = await calculateCommission(sale.id)

  if (result === null) {
    console.log('SUCCESS: Commission was correctly blocked for 0-cost item.')
  } else {
    console.error('FAILURE: Commission was NOT blocked for 0-cost item!')
  }

  // 4. Restore original cost
  await prisma.saleItem.update({
    where: { id: sale.items[0].id },
    data: { costPriceSnapshot: originalCost }
  })

  console.log('Restored original cost.')
}

testCommissionBlock().catch(console.error).finally(() => prisma.$disconnect())
