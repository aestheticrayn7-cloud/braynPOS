import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const constraints: any = await prisma.$queryRaw`
    SELECT conname, (conrelid::regclass)::text AS table_name
    FROM   pg_constraint
    WHERE  (conrelid::regclass)::text IN ('payments', 'serials', 'transfers', 'customer_payments', 'loyalty_transactions', 'support_tickets')
    ORDER BY table_name, conname;
  `
  console.log(JSON.stringify(constraints, null, 2))
}

main().catch(console.error).finally(() => prisma.$disconnect())
