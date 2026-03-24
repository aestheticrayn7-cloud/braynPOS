import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const hq = await prisma.channel.findFirst({
    where: { OR: [{ name: { contains: 'HQ', mode: 'insensitive' } }, { code: 'HQ' }] },
    select: { id: true, name: true, code: true }
  });
  console.log('HQ Channel:', hq);

  const balances = await prisma.inventory_balances.findMany({
    include: { item: { select: { name: true, sku: true } } }
  });
  console.log('Inventory Balances:', JSON.stringify(balances, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
