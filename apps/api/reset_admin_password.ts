import { PrismaClient } from '@prisma/client'
import argon2 from 'argon2'

const prisma = new PrismaClient()

async function reset() {
  const password = 'admin'
  const hash = await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
  })

  await prisma.user.update({
    where: { email: 'admin@brayn.app' },
    data: { passwordHash: hash, status: 'ACTIVE' }
  })

  console.log('Password reset to: admin')
}

reset().catch(console.error).finally(() => prisma.$disconnect())
