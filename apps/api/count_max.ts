import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const maxSale = await prisma.sale.aggregate({ _max: { receiptNo: true } })
  const sequences = await prisma.receiptSequence.findMany()
  console.log('Max existing receipt in sales:', maxSale._max.receiptNo)
  console.log('Current trackers in receipt_sequences:', JSON.stringify(sequences, null, 2))
}
main().catch(console.error).finally(() => prisma.$disconnect())
