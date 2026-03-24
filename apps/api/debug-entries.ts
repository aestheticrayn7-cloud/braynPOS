import { prisma } from './src/lib/prisma';
async function main() {
  const start = new Date('2026-03-01');
  const end = new Date('2026-03-31T23:59:59');
  const count = await prisma.commissionEntry.count({ 
    where: { createdAt: { gte: start, lte: end } }
  });
  console.log(`FOUND ${count} COMMISSION ENTRIES IN MARCH 2026`);
  
  const rules = await prisma.commissionRule.findMany({ where: { isActive: true } });
  console.log('RULES:', JSON.stringify(rules.map(r => ({ name: r.name, minMargin: r.minMarginPercent, rate: r.ratePercent })), null, 2));

  if (count === 0) {
      console.log('NO ENTRIES FOUND. TRIGGERING RECALCULATION...');
      const sales = await prisma.sale.findMany({
          where: { createdAt: { gte: start, lte: end }, deletedAt: null },
          select: { id: true, receiptNo: true }
      });
      console.log(`FOUND ${sales.length} SALES IN MARCH 2026 TO PROCESS.`);
  }
}
main();
