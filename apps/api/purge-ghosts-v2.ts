import { prisma } from './src/lib/prisma';
import { Prisma } from '@prisma/client';

async function run() {
  console.log('--- DEEP PURGE INITIATED ---');
  
  // Find all balances where stock is effectively zero
  const balances = await prisma.inventory_balances.findMany({
    include: { item: true, channel: true }
  });

  let deleted = 0;
  for (const b of balances) {
    const isZero = new Prisma.Decimal(b.availableQty).isZero() && 
                   new Prisma.Decimal(b.incomingQty).isZero();
    
    if (isZero) {
        // Now check movements
        const mCount = await prisma.stockMovement.count({
            where: { itemId: b.itemId, channelId: b.channelId }
        });

        if (mCount === 0) {
            console.log('DELETING GHOST: ' + b.item.name + ' in ' + b.channel.name);
            await prisma.inventory_balances.delete({
                where: { itemId_channelId: { itemId: b.itemId, channelId: b.channelId } }
            });
            deleted++;
        } else {
            console.log('KEEPING (Has History): ' + b.item.name + ' in ' + b.channel.name + ' (Moves: ' + mCount + ')');
        }
    }
  }
  console.log('TOTAL DELETED: ' + deleted);
}
run();
