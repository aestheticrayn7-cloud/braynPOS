import { PrismaClient, Prisma } from '@prisma/client'
// We use a manual calculation here because importing commission.service
// from a standalone script in a monorepo can fail with module resolution issues
const prisma = new PrismaClient()

async function main() {
  const month = 3; 
  const year = 2026;
  const start = new Date(year, month - 1, 1)
  const end = new Date(year, month, 0, 23, 59, 59, 999)

  console.log(`[BACKFILL] Scanning sales for March 2026...`)
  
  const sales = await prisma.sale.findMany({
    where: {
      deletedAt: null,
      createdAt: { gte: start, lte: end },
      commissionEntry: null,
    },
    include: { items: true }
  })

  console.log(`[BACKFILL] Found ${sales.length} sales to process.`)

  const rules = await prisma.commissionRule.findMany({ where: { isActive: true } })

  for (const sale of sales) {
    // Basic Margin Calc
    let margin = 0
    for (const item of sale.items) {
      margin += (Number(item.unitPrice) - Number(item.costPriceSnapshot)) * item.quantity
    }
    margin -= Number(sale.discountAmount ?? 0)

    if (margin <= 0) continue

    // Find Rule (Simplified resolveRule)
    const user = await prisma.user.findUnique({ where: { id: sale.performedBy }, select: { role: true } })
    if (!user) continue

    const rule = rules.find(r => 
      (r.userId === sale.performedBy) ||
      (r.role === user.role && r.channelId === sale.channelId) ||
      (r.channelId === sale.channelId && !r.userId && !r.role) ||
      (!r.channelId && !r.userId && !r.role)
    )

    if (rule) {
      const rate = Number(rule.ratePercent)
      const commissionAmount = (margin * rate) / 100
      
      await prisma.commissionEntry.create({
        data: {
          saleId: sale.id,
          userId: sale.performedBy,
          channelId: sale.channelId,
          ruleId: rule.id,
          grossMargin: new Prisma.Decimal(margin.toFixed(4)),
          marginPercent: new Prisma.Decimal(((margin / Number(sale.totalAmount)) * 100).toFixed(4)),
          commissionAmount: new Prisma.Decimal(commissionAmount.toFixed(4)),
          rateApplied: new Prisma.Decimal(rate.toFixed(4)),
          status: 'PENDING'
        }
      })
      console.log(`✅ ${sale.receiptNo}: Ksh ${commissionAmount.toFixed(2)} entry created for ${user.role}`)
    } else {
       console.log(`— ${sale.receiptNo}: No matching commission rule`)
    }
  }
}

main().finally(() => prisma.$disconnect())
