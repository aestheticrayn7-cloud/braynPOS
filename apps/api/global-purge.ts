import { prisma } from './src/lib/prisma';
import { Prisma } from '@prisma/client';

async function run() {
  const items = await prisma.item.findMany({ where: { isActive: true, deletedAt: null } });
  const channels = await prisma.channel.findMany({ where: { deletedAt: null } });

  console.log('--- GLOBAL GHOST AUDIT ---');

  for (const c of channels) {
    for (const i of items) {
      const b = await prisma.inventory_balances.findUnique({
        where: { itemId_channelId: { itemId: i.id, channelId: c.id } }
      });
      
      if (b && new Prisma.Decimal(b.availableQty).isZero()) {
        const moves = await prisma.stockMovement.count({
            where: { itemId: i.id, channelId: c.id }
        });
        
        if (moves > 0) {
            console.log('ITEM WITH HISTORY (KEEP): ' + i.name + ' in ' + c.name + ' (Moves: ' + moves + ')');
        } else {
            console.log('ACTUAL GHOST (SHOULD PURGE): ' + i.name + ' in ' + c.name);
            // I'll try to delete it right now to be sure
            await prisma.inventory_balances.delete({
                where: { itemId_channelId: { itemId: i.id, channelId: c.id } }
            });
            console.log('   -> DELETED.');
        }
      }
    }
  }
}
run();
