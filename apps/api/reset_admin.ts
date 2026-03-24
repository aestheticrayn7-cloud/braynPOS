import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const hash = await argon2.hash('Admin@123', { type: argon2.argon2id, memoryCost: 65536, timeCost: 3, parallelism: 4 });
  await prisma.user.update({
    where: { email: 'admin@brayn.app' },
    data: { passwordHash: hash }
  });
  console.log('Password forcefully reset back to Admin@123');
}

main().finally(() => prisma.$disconnect());
