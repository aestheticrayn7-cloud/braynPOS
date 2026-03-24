import { prisma } from './src/lib/prisma';
async function run() {
  const nulls = await prisma.inventory_balances.findMany({
    where: { lastMovementAt: null as any },
    include: { item: { select: { name: true, sku: true } }, channel: { select: { name: true } } }
  });
  console.log('CHANNELS WITH NULLS:', nulls.map(n => \`\${n.item.name} (\${n.item.sku}) in \${n.channel.name}\`));
  
  const ghost_count = await prisma.inventory_balances.count({
    where: { lastMovementAt: null as any }
  });
  console.log('TOTAL GHOST ROWS:', ghost_count);
}
run();
