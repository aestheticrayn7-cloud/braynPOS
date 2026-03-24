import { redis } from './src/lib/redis.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst({ where: { email: 'admin@brayn.app' } });
  if (!user) { console.log('USER NOT FOUND'); return; }
  
  // Clear login failures
  const deleted = await redis.del(`login_failures:${user.id}`);
  console.log('Cleared login_failures key, result:', deleted);
  
  // Also ensure account is active
  await prisma.user.update({ where: { id: user.id }, data: { status: 'ACTIVE' } });
  console.log('Account status set to ACTIVE');
}

main().finally(async () => { await prisma.$disconnect(); process.exit(0); });
