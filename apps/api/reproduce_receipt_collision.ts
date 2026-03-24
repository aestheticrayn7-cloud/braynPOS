import { prisma } from './apps/api/src/lib/prisma'
import { commitSale } from './apps/api/src/modules/sales/sales.service'

async function main() {
  const channelId = '66249ed1-2f7b-4b13-9118-2e8876c2459c' // Mobile Shop
  const itemId    = '4f7ba461-9c16-4af3-9f89-c496be113bc3' // Generic Laptop
  const userId    = 'd9f0a1c1-1234-4567-890a-fb2c3d4e5f6g' // Mark1

  const actor = {
    sub: userId,
    role: 'MANAGER',
    channelId,
    username: 'mark1'
  } as any

  const saleInput = {
    channelId,
    saleType: 'RETAIL' as const,
    items: [{ itemId, quantity: 1, unitPrice: 45000 }],
    payments: [{ method: 'CASH' as const, amount: 45000 }]
  }

  console.log('--- SIMULATING CONCURRENT SALES ---')
  
  try {
    // Attempt 5 concurrent sales
    const results = await Promise.allSettled([
      commitSale(saleInput, actor, { skipStockCheck: true }),
      commitSale(saleInput, actor, { skipStockCheck: true }),
      commitSale(saleInput, actor, { skipStockCheck: true }),
      commitSale(saleInput, actor, { skipStockCheck: true }),
      commitSale(saleInput, actor, { skipStockCheck: true }),
    ])

    results.forEach((res, i) => {
      if (res.status === 'fulfilled') {
        console.log(`Sale ${i+1}: Success - ${res.value.receiptNo}`)
      } else {
        console.log(`Sale ${i+1}: FAILED - ${res.reason.message || res.reason}`)
      }
    })
  } catch (err) {
    console.error('Test failed:', err)
  } finally {
    await prisma.$disconnect()
  }
}

main()
