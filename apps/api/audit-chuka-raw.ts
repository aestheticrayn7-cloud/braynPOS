import { prisma } from './src/lib/prisma';

async function run() {
  const chuka = (await prisma.channel.findFirst({ where: { name: 'Chuka Shop' } }))?.id;
  if (!chuka) return;

  const res = await prisma.$queryRawUnsafe(`SELECT * FROM inventory_balances WHERE "channelId" = '${chuka}'`);
  console.log('--- ALL BALANCES IN CHUKA (RAW) ---');
  console.log(res);
}
run();
