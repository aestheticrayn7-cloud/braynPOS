import { prisma } from './src/lib/prisma';
async function main() {
  const start = new Date('2026-03-01');
  const end = new Date('2026-03-31T23:59:59');
  const entries = await prisma.commissionEntry.findMany({ 
    where: { createdAt: { gte: start, lte: end } },
    include: { user: { select: { username: true } } }
  });
  const map = entries.map(e => ({ user: e.user.username, amount: e.commissionAmount, status: e.status, payout: e.payoutId }));
  console.log('RESULTS:', JSON.stringify(map, null, 2));
}
main();
