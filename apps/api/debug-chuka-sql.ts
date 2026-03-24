import { prisma } from './src/lib/prisma';
import { Prisma } from '@prisma/client';

async function run() {
  const chuka = (await prisma.channel.findFirst({ where: { name: 'Chuka Shop' } }))?.id;
  if (!chuka) return;

  const query = Prisma.sql`
      SELECT 
        i."id" as "itemId", 
        i."name" as "itemName", 
        i."sku", 
        CAST(SUM(COALESCE(ib."availableQty", 0)) AS FLOAT) as "availableQty", 
        MAX(ib."lastMovementAt") as "lastMovementAt"
      FROM "items" i
      INNER JOIN "inventory_balances" ib ON i."id" = ib."itemId" 
        AND ib."channelId" = ${chuka}
      WHERE i."deletedAt" IS NULL 
        AND i."isActive" = true
        AND (
          ib."availableQty" > 0 
          OR ib."incomingQty" > 0 
          OR EXISTS (
            SELECT 1 FROM "stock_movements" sm 
            WHERE sm."itemId" = i."id" 
              AND sm."channelId" = ib."channelId" 
            LIMIT 1
          )
        )
      GROUP BY i."id", i."name", i."sku"
      ORDER BY i."name" ASC
  `;

  const results = await prisma.$queryRaw<any[]>(query);
  const zeroes = results.filter(r => Number(r.availableQty) === 0);
  console.log('--- CHUKA SHOP ZERO STOCK ITEMS IN SQL ---');
  zeroes.forEach(r => {
    console.log(r.itemName + ': Qty=' + r.availableQty + ', Last=' + r.lastMovementAt);
  });
  console.log('TOTAL ZERO ITEMS FOUND: ' + zeroes.length);
}
run();
