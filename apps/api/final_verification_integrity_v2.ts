import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('--- FINAL INTEGRITY VERIFICATION (V2) ---')
  
  // 1. Check constraints
  const constraints: any = await prisma.$queryRaw`
    SELECT conname, contype, (conrelid::regclass)::text AS table_name
    FROM   pg_constraint
    WHERE  conname IN (
      'payments_idempotencyKey_key',
      'serials_serialNo_itemId_channelId_key',
      'loyalty_transactions_channelId_fkey',
      'customer_payments_channelId_fkey',
      'transfers_sentByUserId_fkey',
      'transfers_receivedByUserId_fkey',
      'support_tickets_assignedToId_fkey'
    )
    OR conname LIKE 'payments_idempotencyKey_key%'
    OR conname LIKE 'serials_serial_No_itemId_channelId_key%'
    ORDER BY table_name, conname;
  `
  console.log('Constraints Found:', constraints.length)
  console.log(JSON.stringify(constraints, null, 2))

  // 2. Check orphaned tickets
  const orphaned: any = await prisma.$queryRaw`
    SELECT COUNT(*) AS count
    FROM support_tickets
    WHERE "assignedToId" IS NOT NULL
      AND NOT EXISTS (SELECT 1 FROM users WHERE id = support_tickets."assignedToId")
  `
  console.log('Orphaned Ticket Assignments:', orphaned[0].count)

  // 3. Check duplicate serials
  const duplicates: any = await prisma.$queryRaw`
    SELECT "serialNo", "itemId", "channelId", COUNT(*) AS count
    FROM serials
    WHERE "deletedAt" IS NULL
    GROUP BY "serialNo", "itemId", "channelId"
    HAVING COUNT(*) > 1
  `
  console.log('Duplicate Serials Found:', duplicates.length)
}

main().catch(console.error).finally(() => prisma.$disconnect())
