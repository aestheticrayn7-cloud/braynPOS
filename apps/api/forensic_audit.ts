import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('--- [BRAYN FORENSIC AUDIT] ---')
  
  // 1. Audit the problematic sale
  const sale = await prisma.sale.findFirst({
    where: { receiptNo: 'RCP-20260329-0001-a822' },
    include: { items: true }
  })

  if (!sale) {
    console.error('FAIL: Could not find receipt RCP-20260329-0001-a822')
  } else {
    console.log('\n[SALE DATA]')
    console.log(`Receipt: ${sale.receiptNo}`)
    console.log(`UTC CreatedAt: ${sale.createdAt.toISOString()}`)
    console.log(`Local (EAT) Clock: ${new Date(sale.createdAt.getTime() + 3 * 60 * 60 * 1000).toLocaleString('en-GB')}`)
    console.log(`Net Amount: ${sale.netAmount}`)
    
    console.log('\n[ITEM MARGIN AUDIT]')
    for (const item of sale.items) {
      console.log(`Item ID: ${item.itemId}`)
      console.log(`Quantity: ${item.quantity}`)
      console.log(`Unit Price: ${item.unitPrice}`)
      console.log(`Cost Price Snapshot: ${item.costPriceSnapshot}`)
      const calculatedMargin = Number(item.unitPrice) - Number(item.costPriceSnapshot)
      console.log(`Calculated Margin Per Unit: ${calculatedMargin}`)
    }
  }

  // 2. Check the "Today" boundary that the dashboard uses
  const now = new Date()
  const dashboardTodayLocal = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  console.log('\n[DASHBOARD LOGIC AUDIT]')
  console.log(`Server Current UTC: ${now.toISOString()}`)
  console.log(`Dashboard Today Cutoff (UTC): ${dashboardTodayLocal.toISOString()}`)
  
  if (sale && sale.createdAt < dashboardTodayLocal) {
    console.log('--- ERROR DETECTED ---')
    console.log(`The sale happened before the dashboard "Today" cutoff!`)
    console.log(`Sale ${sale.createdAt.toISOString()} is LESS THAN Cutoff ${dashboardTodayLocal.toISOString()}`)
    console.log('Result: Dashboard shows 0.00 while Sales History (local timezone) shows the sale.')
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
