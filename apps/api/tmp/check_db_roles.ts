import { PrismaClient } from '@prisma/client'

async function checkRoles() {
  const prisma = new PrismaClient()
  try {
    const roles = await prisma.$queryRaw`SELECT DISTINCT role FROM users`
    console.log('Roles currently in DB:', roles)
  } catch (err) {
    console.error('Error checking roles:', err)
  } finally {
    await prisma.$disconnect()
  }
}

checkRoles()
