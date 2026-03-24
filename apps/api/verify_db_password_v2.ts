import { PrismaClient } from '@prisma/client'
import argon2 from 'argon2'

const prisma = new PrismaClient()

async function check() {
  const user = await prisma.user.findUnique({
    where: { email: 'admin@brayn.app' }
  })

  if (!user) {
    console.log('User not found')
    return
  }

  const password = 'Admin@123'
  const isValid = await argon2.verify(user.passwordHash, password)
  
  console.log('--- PASSWORD VERIFICATION ---')
  console.log('Email:', user.email)
  console.log('Hash in DB:', user.passwordHash)
  console.log('Password tested:', password)
  console.log('Is valid:', isValid)
}

check().catch(console.error).finally(() => prisma.$disconnect())
