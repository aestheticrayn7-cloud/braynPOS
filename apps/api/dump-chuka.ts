import { prisma } from './src/lib/prisma';

async function run() {
  const chuka = (await prisma.channel.findFirst({ where: { name: 'Chuka Shop' } }))?.id;
  if (!chuka) return;

  const res = await prisma.$queryRawUnsafe(`SELECT ib.*, i.name as "itemName" FROM inventory_balances ib JOIN items i ON i.id = ib."itemId" WHERE ib."channelId" = '${chuka}'`);
  console.log('--- ALL BALANCES IN CHUKA ---');
  console.log(JSON.stringify(res, null, 2));
}
run();
