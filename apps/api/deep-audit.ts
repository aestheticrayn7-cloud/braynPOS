import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient({ log: [] });
async function run() {
  const hq = (await prisma.channel.findFirst({ where: { code: 'HQ' } }))?.id;
  const chuka = (await prisma.channel.findFirst({ where: { name: 'Chuka Shop' } }))?.id;
  const mobile = (await prisma.channel.findFirst({ where: { name: 'Mobile Shop' } }))?.id;

  const itemNames = ['Generic Business Laptop', 'Optical Wireless Mouse', 'Ipcone Blender', 'Printer'];

  for (const name of itemNames) {
    console.log('--- ' + name + ' ---');
    const moveCount = await prisma.stockMovement.count({
      where: { item: { name } }
    });
    console.log('Total Movements Systemwide: ' + moveCount);
    
    const branches = [
      { id: hq, name: 'HQ' },
      { id: chuka, name: 'Chuka' },
      { id: mobile, name: 'Mobile' }
    ];

    for (const b of branches) {
      if (!b.id) continue;
      const cnt = await prisma.stockMovement.count({
        where: { item: { name }, channelId: b.id }
      });
      const bal = await prisma.inventory_balances.findUnique({
        where: { itemId_channelId: { itemId: (await prisma.item.findFirst({ where: { name } }))?.id || '', channelId: b.id } }
      });
      console.log('  ' + b.name + ' : Movements=' + cnt + ', BalanceRec=' + (bal ? 'EXISTS (Qty=' + bal.availableQty + ')' : 'MISSING'));
    }
  }
}
run();
