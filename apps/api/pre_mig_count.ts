import { PrismaClient } from '@prisma/client'
const p = new PrismaClient()
async function main() {
  const c1 = await p.customerPayment.count()
  const c2 = await p.loyaltyTransaction.count()
  console.log('COUNTS:', { c1, c2 })
}
main().finally(() => p.$disconnect())
