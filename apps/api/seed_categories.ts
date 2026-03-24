import { prisma } from './src/lib/prisma';
async function run() {
  const c = await prisma.category.findMany();
  if (c.length === 0) {
    await prisma.category.createMany({
      data: [
        { name: 'General', code: 'GEN' },
        { name: 'Electronics', code: 'ELEC' },
        { name: 'Food & Beverage', code: 'FOOD' },
        { name: 'Stationery', code: 'STAT' }
      ]
    });
    console.log('Seeded categories');
  } else {
    console.log('Categories exist:', c.length);
  }
}
run().catch(console.error).finally(() => prisma.$disconnect());
