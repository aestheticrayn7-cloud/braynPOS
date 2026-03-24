import { prisma } from './src/lib/prisma';

async function run() {
  const chuka = (await prisma.channel.findFirst({ where: { name: 'Chuka Shop' } }))?.id;
  if (!chuka) return;

  const res = await prisma.inventory_balances.findMany({
    where: { channelId: chuka },
    include: { item: true }
  });

  console.log('--- CHUKA SHOP DATABASE STATE ---');
  console.log('Total Records:', res.length);
  res.forEach(r => {
    console.log(` - ${r.item.name}: Qty=${r.availableQty}, MovesCount=?`);
  });

  const mouseInChuka = await prisma.inventory_balances.findFirst({
    where: { itemId: { equals: 'item-mouse-id-whatever' }, channelId: chuka }
  });
  console.log('Explicit Mouse Search in Chuka:', !!mouseInChuka);
}
run();
