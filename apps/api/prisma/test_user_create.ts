import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function testUserCreation() {
  const email = 'testuser_' + Date.now() + '@example.com'
  const username = 'testuser_' + Date.now()
  
  console.log('--- Attempting to create user ---')
  console.log('Email:', email)
  console.log('Username:', username)
  
  try {
    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash: 'dummy_hash',
        role: 'CASHIER',
      }
    })
    console.log('Success! Created user with ID:', user.id)
  } catch (err: any) {
    console.error('Failure during prisma.user.create:')
    console.error(err.message)
    if (err.code) console.error('Error Code:', err.code)
  } finally {
    await prisma.$disconnect()
  }
}

testUserCreation()
