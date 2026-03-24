import { PrismaClient } from '@prisma/client';
import { calculateCommission } from './src/modules/commission/commission.service';

const prisma = new PrismaClient();

async function main() {
  const marchSales = await prisma.sale.findMany({
    where: {
      createdAt: {
        gte: new Date('2026-03-01T00:00:00Z'),
        lte: new Date('2026-03-31T23:59:59Z')
      }
    }
  });

  console.log(`--- RECALCULATING COMMISSIONS FOR ${marchSales.length} MARCH SALES ---`);
  
  for (const sale of marchSales) {
    const result = await calculateCommission(sale.id);
    if (result) {
       console.log(`✅ ${sale.receiptNo}: ${result.commissionAmount} earned by User ${result.userId}`);
    } else {
       console.log(`❌ ${sale.receiptNo}: No commission qualified`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
