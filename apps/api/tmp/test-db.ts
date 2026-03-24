import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  try {
    await prisma.$connect();
    console.log('DATABASE_CONNECTION_SUCCESS');
  } catch (e) {
    console.error('DATABASE_CONNECTION_ERROR:', e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
