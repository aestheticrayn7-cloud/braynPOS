import { prisma } from './src/lib/prisma';

async function main() {
  const utcTodayStr = new Date().toISOString().slice(0, 10);
  const pattern = `RCP-${utcTodayStr.replace(/-/g, '')}-%`;
  
  console.log(`Checking for pattern: ${pattern} at Date: ${utcTodayStr}`);

  const allReceipts = await prisma.$queryRaw`
    SELECT "receiptNo", "createdAt", "channelId"
    FROM   sales
    WHERE  "receiptNo" LIKE ${pattern}
    ORDER  BY "receiptNo" DESC
  `;
  console.log("Matching Receipts in DB:");
  console.log(JSON.stringify(allReceipts, null, 2));

  const mobileShopId = (await prisma.$queryRaw`SELECT id FROM channels WHERE name = 'Mobile Shop' LIMIT 1` as any)[0].id;
  const countRes = await prisma.$queryRaw`
    SELECT COUNT(*)::int as count 
    FROM sales 
    WHERE "channelId" = ${mobileShopId}
      AND "createdAt"::date = ${utcTodayStr}::date
  `;
  console.log(`Count in Mobile Shop TODAY ${utcTodayStr}:`);
  console.log(JSON.stringify(countRes, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
