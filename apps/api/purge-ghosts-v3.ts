import { prisma } from './src/lib/prisma';

async function run() {
  const sql = `
    DELETE FROM inventory_balances ib
    WHERE ("availableQty" = 0 AND "incomingQty" = 0)
    AND NOT EXISTS (
      SELECT 1 FROM stock_movements sm 
      WHERE sm."itemId" = ib."itemId" 
        AND sm."channelId" = ib."channelId"
    )
  `;
  
  const deleted = await prisma.$executeRawUnsafe(sql);
  console.log('--- RAW SQL PURGE ---');
  console.log('DELETED ROWS:', deleted);
}
run();
