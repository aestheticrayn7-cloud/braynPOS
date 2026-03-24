import { prisma } from './src/lib/prisma';

async function main() {
  const lastSales = await prisma.sale.findMany({ 
    orderBy: { createdAt: 'desc' }, 
    take: 10,
    select: { receiptNo: true, createdAt: true, channelId: true }
  });
  console.log("LAST 10 RECEIPTS:");
  console.log(JSON.stringify(lastSales, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
