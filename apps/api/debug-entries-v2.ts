import { prisma } from './src/lib/prisma';
async function main() {
  const start = new Date('2026-03-01');
  const end = new Date('2026-03-31T23:59:59');
  const entries = await prisma.commissionEntry.findMany({ 
    where: { createdAt: { gte: start, lte: end } },
    include: { user: { select: { username: true } } }
  });
  console.log(`FOUND ${entries.length} ENTRIES IN MARCH 2026:`);
  entries.forEach(e => console.log(`- ${e.user.username}: ${e.commissionAmount} (${e.status}, payoutId: ${e.payoutId})`));
}
main();
