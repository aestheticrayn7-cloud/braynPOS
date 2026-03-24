import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const transferNo = 'TRF-1774176826980-49EBA0';
  await prisma.$executeRaw`
    DELETE FROM transfer_lines 
    WHERE "transferId" = (SELECT id FROM transfers WHERE "transferNo" = ${transferNo})
  `;
  await prisma.$executeRaw`
    DELETE FROM transfers 
    WHERE "transferNo" = ${transferNo}
  `;
  console.log(`Orphaned transfer ${transferNo} deleted successfully.`);
}
main().catch(console.error).finally(() => prisma.$disconnect());
