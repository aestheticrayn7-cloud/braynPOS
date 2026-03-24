import { prisma } from './src/lib/prisma';
async function run() {
  console.log('--- PURGING GHOST INVENTORY BALANCES ---');
  
  // A ghost record is:
  // 1. availableQty = 0
  // 2. incomingQty = 0
  // 3. NO stock movements exist for that (itemId, channelId)
  
  const balances = await prisma.inventory_balances.findMany({
    where: {
      availableQty: 0,
      incomingQty: 0,
    }
  });
  
  console.log('Found ' + balances.length + ' potential ghost records.');
  
  let deletedCount = 0;
  for (const b of balances) {
    const moveCount = await prisma.stockMovement.count({
      where: { itemId: b.itemId, channelId: b.channelId }
    });
    
    if (moveCount === 0) {
      console.log('  Deleting ghost record: Item ' + b.itemId + ' in Channel ' + b.channelId);
      await prisma.inventory_balances.delete({
        where: { itemId_channelId: { itemId: b.itemId, channelId: b.channelId } }
      });
      deletedCount++;
    }
  }
  
  console.log('Successfully purged ' + deletedCount + ' ghost records.');
}
run();
