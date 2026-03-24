import { prisma } from './src/lib/prisma';
async function run() {
  const m = await prisma.channel.findFirst({ where: { name: 'Mobile Shop' } });
  if (!m) return;
  const balances = await prisma.inventory_balances.findMany({
    where: { channelId: m.id },
    include: { item: true }
  });
  console.log('--- MOBILE SHOP SCAN ---');
  for (const b of balances) {
    const moveCount = await prisma.stockMovement.count({
      where: { itemId: b.itemId, channelId: m.id }
    });
    console.log(b.item.name + ': Qty=' + b.availableQty + ', Last=' + b.lastMovementAt + ', Moves=' + moveCount);
  }
}
run();
