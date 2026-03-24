import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient({ log: [] });
async function run() {
  const items = await prisma.item.findMany();
  console.log('--- SCAN RESULTS ---');
  for (const item of items) {
    const balances = await prisma.inventory_balances.findMany({
      where: { itemId: item.id },
      include: { channel: true }
    });
    process.stdout.write('Item: ' + item.name + ' (' + item.sku + ') has ' + balances.length + ' records\n');
    for (const b of balances) {
      process.stdout.write('  - Branch: ' + b.channel.name + ', Qty: ' + b.availableQty + ', Last: ' + b.lastMovementAt + '\n');
    }
  }
}
run();
