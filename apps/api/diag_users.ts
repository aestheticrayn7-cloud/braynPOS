import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    where: { username: { in: ['admin', 'manager', 'chris', 'evans'], mode: 'insensitive' } },
    select: { username: true, role: true, channelId: true }
  });
  console.log('Result:', JSON.stringify(users, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
