import { prisma } from './src/lib/prisma';
import { Prisma } from '@prisma/client';

async function run() {
  const mobile = (await prisma.channel.findFirst({ where: { name: 'Mobile Shop' } }))?.id;
  if (!mobile) return;

  const query = Prisma.sql`
      SELECT 
        i."name" as "itemName", 
        CAST(SUM(COALESCE(ib."availableQty", 0)) AS FLOAT) as "availableQty"
      FROM "items" i
      INNER JOIN "inventory_balances" ib ON i."id" = ib."itemId" 
        AND ib."channelId" = ${mobile}
      WHERE i."deletedAt" IS NULL 
        AND i."name" = 'Ipcone Blender'
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
      GROUP BY i."id", i."name"
  `;

  const results = await prisma.$queryRaw<any[]>(query);
  console.log('--- REPRODUCTION: Ipcone Blender in Mobile Shop ---');
  console.log(results);
}
run();
