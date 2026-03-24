import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const entries = await prisma.commissionEntry.findMany({
    where: { createdAt: { gte: new Date('2026-03-01T00:00:00Z') } },
    select: { userId: true, commissionAmount: true, status: true }
  });
  console.log('COMMISSION ENTRIES SINCE MARCH 1:', entries);
}
main();
