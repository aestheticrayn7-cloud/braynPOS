import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const indexes: any = await prisma.$queryRaw`
    SELECT indexname, tablename, indexdef
    FROM   pg_indexes
    WHERE  tablename IN ('payments', 'serials', 'transfers', 'customer_payments', 'loyalty_transactions', 'support_tickets')
    ORDER BY tablename, indexname;
  `
  console.log(JSON.stringify(indexes, null, 2))
}

main().catch(console.error).finally(() => prisma.$disconnect())
