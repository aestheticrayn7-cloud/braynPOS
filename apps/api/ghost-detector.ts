import { prisma } from './src/lib/prisma';
async function run() {
  const hq = (await prisma.channel.findFirst({ where: { code: 'HQ' } }))?.id;
  const mobile = (await prisma.channel.findFirst({ where: { name: 'Mobile Shop' } }))?.id;
  
  const ghost = await prisma.inventory_balances.findMany({
    where: { 
      channelId: mobile,
      availableQty: 0
    },
    include: { item: true }
  });
  
  console.log('--- GHOST RECORDS IN MOBILE SHOP ---');
  for (const g of ghost) {
    console.log('Item: ' + g.item.name + ' (' + g.item.sku + ')');
    console.log('  Available: ' + g.availableQty);
    console.log('  Last Movement (Raw): ' + g.lastMovementAt);
    const moves = await prisma.stockMovement.count({
      where: { itemId: g.itemId, channelId: g.channelId }
    });
    console.log('  Movements Count: ' + moves);
  }
}
run();
