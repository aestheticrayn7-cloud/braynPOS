import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('--- Latest Stock Movements ---');
  const movements = await prisma.stockMovement.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { item: { select: { name: true } } }
  });
  console.log(JSON.stringify(movements, null, 2));

  console.log('--- Inventory Balances ---');
  const balances = await prisma.inventoryBalance.findMany({
    include: { item: { select: { name: true } } }
  });
  console.log(JSON.stringify(balances, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
