import { prisma } from './src/lib/prisma';
import { stockService } from './src/modules/stock/stock.service';

async function run() {
  const chuka = (await prisma.channel.findFirst({ where: { name: 'Chuka Shop' } }))?.id;
  if (!chuka) return;

  console.log('--- API SIMULATION: getChannelBalances for ' + chuka + ' ---');
  const results = await stockService.getChannelBalances(chuka);
  
  const ghost = results.find(r => r.itemName === 'Optical Wireless Mouse');
  console.log('Optical Wireless Mouse Found:', !!ghost);
  if (ghost) {
    console.log('Result:', ghost);
  }

  console.log('All Items in API result:', results.map(r => r.itemName));
  console.log('Total Results:', results.length);
}
run();
