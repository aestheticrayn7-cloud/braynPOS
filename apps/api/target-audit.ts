import { prisma } from './src/lib/prisma';
import { Prisma } from '@prisma/client';

async function run() {
  const item = await prisma.item.findFirst({ where: { name: 'Optical Wireless Mouse' } });
  const chuka = (await prisma.channel.findFirst({ where: { name: 'Chuka Shop' } }))?.id;
  if (!item || !chuka) return;

  const query = Prisma.sql`
    SELECT 
        ib."availableQty",
        (SELECT COUNT(*) FROM "stock_movements" sm WHERE sm."itemId" = ib."itemId" AND sm."channelId" = ib."channelId") as "moveCount"
    FROM "inventory_balances" ib
    WHERE ib."itemId" = ${item.id} AND ib."channelId" = ${chuka}
  `;

  const results = await prisma.$queryRaw<any[]>(query);
  console.log('--- TARGET AUDIT: Optical Wireless Mouse in Chuka Shop ---');
  console.log(results);
}
run();
