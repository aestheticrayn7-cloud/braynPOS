import { prisma } from '../src/lib/prisma';

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
      sale: { select: { receiptNo: true, netAmount: true } }
    },
    take: 10,
    orderBy: { createdAt: 'desc' }
  });
  console.log('--- SALE ITEMS ---');
  console.log(JSON.stringify(saleItems, null, 2));
}

main().catch(console.error);
