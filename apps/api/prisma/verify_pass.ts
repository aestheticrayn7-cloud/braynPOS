import argon2 from 'argon2'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkPassword() {
  const user = await prisma.user.findUnique({ where: { id: 'usr-super-admin' } })
  if (!user) {
    console.log('User not found')
    return
  }
  
  const password = 'Admin@123'
  const isValid = await argon2.verify(user.passwordHash, password)
  console.log('User:', user.email)
  console.log('Hash in DB:', user.passwordHash)
  console.log('Password:', password)
  console.log('Is valid:', isValid)
  
  await prisma.$disconnect()
}

checkPassword()
