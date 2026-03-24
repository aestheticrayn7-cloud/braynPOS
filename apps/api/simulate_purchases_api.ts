import { purchaseService } from './src/modules/purchases/purchase.service'
import { prisma } from './src/lib/prisma'

async function main() {
  const res = await purchaseService.findAll({ limit: 5 })
  console.log('--- PURCHASES API SIMULATION ---')
  res.data.forEach(p => {
    console.log(`PO: ${p.purchaseNo}, Channel: ${JSON.stringify(p.channel)}, Total: ${p.totalCost}`)
  })
}

main().catch(console.error).finally(() => prisma.$disconnect())
