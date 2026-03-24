import { prisma } from './src/lib/prisma';
async function run() {
  const item = await prisma.item.findFirst();
  const channel = await prisma.channel.findFirst({ where: { isMainWarehouse: true } });
  if (!item || !channel) return;

  console.log('Testing trigger for ' + item.name + ' in ' + channel.name);
  
  const before = await prisma.inventory_balances.findUnique({
    where: { itemId_channelId: { itemId: item.id, channelId: channel.id } }
  });
  console.log('LastMovement Before: ' + before?.lastMovementAt);

  // Create a dummy movement (using valid MovementType)
  await prisma.stockMovement.create({
    data: {
      itemId: item.id,
      channelId: channel.id,
      movementType: 'ADJUSTMENT_IN',
      quantityChange: 0,
      referenceId: 'trigger-test-' + Date.now(),
      referenceType: 'test',
      performedBy: 'test-system',
      notes: 'Trigger Test'
    }
  });

  // Wait a bit
  await new Promise(r => setTimeout(r, 1000));

  const after = await prisma.inventory_balances.findUnique({
    where: { itemId_channelId: { itemId: item.id, channelId: channel.id } }
  });
  console.log('LastMovement After: ' + after?.lastMovementAt);
  
  if (after?.lastMovementAt && before?.lastMovementAt && after.lastMovementAt > before.lastMovementAt) {
    console.log('SUCCESS: Trigger updated the timestamp.');
  } else {
    console.log('FAILURE: Trigger did not update the timestamp or it was the same.');
    if (after?.lastMovementAt && before?.lastMovementAt && after.lastMovementAt.toISOString() === before.lastMovementAt.toISOString()) {
        console.log('Timestamps are identical.');
    }
  }
}
run();
