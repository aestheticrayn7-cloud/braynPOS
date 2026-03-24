import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function listUsers() {
  try {
    const users = await prisma.user.findMany({
      select: { username: true, email: true, role: true }
    })
    console.log(JSON.stringify(users, null, 2))
  } catch (err) {
    console.error(err)
  } finally {
    await prisma.$disconnect()
  }
}

listUsers()
