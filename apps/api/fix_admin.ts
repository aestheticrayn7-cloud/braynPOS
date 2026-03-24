import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst();
  if (!user) { console.log('NO USERS'); return; }
  console.log('Email:', user.email, '| mfaEnabled:', user.mfaEnabled, '| status:', user.status);
  
  const passwords = ['Admin@123', 'BraynAdmin@2026', 'admin@123', 'admin'];
  for (const pw of passwords) {
    const ok = await argon2.verify(user.passwordHash, pw);
    if (ok) { console.log('✅ Correct password is:', pw); return; }
  }
  console.log('❌ None of the tested passwords matched. Hash:', user.passwordHash.substring(0, 40));
}

main().finally(() => prisma.$disconnect());
