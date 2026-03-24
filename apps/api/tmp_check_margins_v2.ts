import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const items = await prisma.item.findMany({
    select: { id: true, name: true, sku: true, weightedAvgCost: true }
  });
  console.log('--- ITEMS ---');
  console.log(JSON.stringify(items, null, 2));

  const saleItems = await prisma.saleItem.findMany({
    select: {
      id: true,
      saleId: true,
      costPriceSnapshot: true,
      quantity: true,
      lineTotal: true,
      sale: { select: { receiptNo: true, netAmount: true, channelId: true } }
    },
    take: 10,
    orderBy: { createdAt: 'desc' }
  });
  console.log('--- SALE ITEMS ---');
  console.log(JSON.stringify(saleItems, null, 2));

  const cogsRaw = await prisma.$queryRaw`
    SELECT "channelId",
           COALESCE(SUM("costPriceSnapshot" * quantity), 0) AS cogs
    FROM   sale_items si
    JOIN   sales s ON s.id = si."saleId"
    GROUP BY "channelId"
  `;
  console.log('--- COGS RAW ---');
  console.log(JSON.stringify(cogsRaw, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
