import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config()
const prisma = new PrismaClient()

async function main() {
  const recentSales = await prisma.sale.findMany({
    where: { 
      createdAt: { gte: new Date('2026-04-01T00:00:00Z') }
    },
    include: { items: true, commissionEntries: true },
    orderBy: { createdAt: 'desc' },
    take: 10
  })

  console.log(`Found ${recentSales.length} recent sales in April.`)

  for (const sale of recentSales) {
    let rawMargin = 0
    let totalSales = Number(sale.totalAmount)
    
    console.log(`\nSale ${sale.id} | Amount: ${totalSales} | discount: ${sale.discountAmount}`)
    console.log(`------------------------------------------------`)
    
    for (const item of sale.items) {
      const up = Number(item.unitPrice)
      const cp = Number(item.costPriceSnapshot)
      const qty = item.quantity
      const disc = Number(item.discountAmount ?? 0)
      
      const lineMargin = ((up - cp) * qty) - disc
      rawMargin += lineMargin
      
      console.log(`Item ${item.itemId}:`)
      console.log(`  QTY: ${qty} | UnitPrice: ${up} | CostSnap: ${cp}`)
      console.log(`  Discount: ${disc} | LineMargin: ${lineMargin}`)
    }
    rawMargin -= Number(sale.discountAmount ?? 0)
    
    console.log(`=> Calculated Gross Margin: ${rawMargin}`)
    const marginPercent = totalSales > 0 ? (rawMargin / totalSales) * 100 : 0
    console.log(`=> Margin %: ${marginPercent.toFixed(2)}%`)
    console.log(`=> DB Commissions: ${sale.commissionEntries.length > 0 ? sale.commissionEntries.map(c => c.commissionAmount).join(',') : 'None'}`)
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
