import { prisma } from './src/lib/prisma.js';

async function run() {
  try {
    const hildahSale = await prisma.sale.findUnique({
      where: { receiptNo: 'RCP-20260327-0001-5afd' },
      include: { items: true }
    });
    const elimooSale = await prisma.sale.findUnique({
      where: { receiptNo: 'RCP-20260327-0001-7457' },
      include: { items: true }
    });
    console.log('HILDAH:', JSON.stringify(hildahSale, null, 2));
    console.log('ELIMOO:', JSON.stringify(elimooSale, null, 2));
  } catch (err) {
    console.error('ERROR:', err);
  } finally {
    await prisma.$disconnect();
  }
}

run();
