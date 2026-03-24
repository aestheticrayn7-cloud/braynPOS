import { prisma } from './src/lib/prisma';
async function main() {
  const entries = await prisma.commissionEntry.findMany({ 
    take: 5,
    include: { sale: { include: { items: true } } }
  });
  console.log('ENTRIES WITH SALES:', JSON.stringify(entries, null, 2));
}
main();
