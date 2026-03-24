import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const duplicatePayments = await prisma.$queryRaw`
    SELECT "idempotencyKey", COUNT(*) 
    FROM payments 
    WHERE "idempotencyKey" IS NOT NULL 
    GROUP BY "idempotencyKey" 
    HAVING COUNT(*) > 1
  `
  
  const duplicateSerials = await prisma.$queryRaw`
    SELECT "serialNo", "itemId", "channelId", COUNT(*) 
    FROM serials 
    GROUP BY "serialNo", "itemId", "channelId" 
    HAVING COUNT(*) > 1
  `
  
  console.log('Duplicate Payments:', duplicatePayments)
  console.log('Duplicate Serials:', duplicateSerials)
}

main().catch(console.error).finally(() => prisma.$disconnect())
