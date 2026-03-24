import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const now = new Date()
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
  
  // Find all sales today and extract their sequence numbers
  const salesToday = await prisma.sale.findMany({
    where: { receiptNo: { startsWith: `RCP-${dateStr}-` } },
    select: { receiptNo: true, channelId: true }
  })
  
  console.log(`Found ${salesToday.length} sales today.`)
  
  const channelMaxSeq: Record<string, number> = {}
  for (const sale of salesToday) {
    const parts = sale.receiptNo.split('-')
    const seqNum = parseInt(parts[parts.length - 1], 10)
    if (seqNum > (channelMaxSeq[sale.channelId] || 0)) {
      channelMaxSeq[sale.channelId] = seqNum
    }
  }

  for (const [channelId, maxSeq] of Object.entries(channelMaxSeq)) {
    const seqKey = `sales_${channelId}_${dateStr}`
    await prisma.$executeRawUnsafe(`
      INSERT INTO receipt_sequences (seq_key, last_seq)
      VALUES ('${seqKey}', ${maxSeq})
      ON CONFLICT (seq_key) DO UPDATE SET last_seq = GREATEST(receipt_sequences.last_seq, ${maxSeq})
    `)
    console.log(`Synced ${seqKey} to ${maxSeq}`)
  }
}
main().catch(console.error).finally(() => prisma.$disconnect())
