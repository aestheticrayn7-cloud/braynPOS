import { prisma } from './src/lib/prisma.js'
import { verifyPassword } from './src/lib/password.js'

async function check() {
  const user = await prisma.user.findUnique({
    where: { email: 'admin@brayn.app' }
  })

  if (!user) {
    console.log('User not found')
    return
  }

  const password = 'Admin@123'
  const isValid = await verifyPassword(user.passwordHash, password)
  
  console.log('--- PASSWORD VERIFICATION ---')
  console.log('Email:', user.email)
  console.log('Hash in DB:', user.passwordHash)
  console.log('Password tested:', password)
  console.log('Is valid:', isValid)
}

check().catch(console.error).finally(() => prisma.$disconnect())
