import { prisma } from './src/lib/prisma'

async function main() {
  try {
    console.log('--- RAW PRISMA TEST ---')
    const token = 'test-token-' + Date.now()
    const expiresAt = new Date(Date.now() + 1000000)
    
    // Find any user
    const user = await prisma.user.findFirst()
    if (!user) throw new Error('No users found')

    console.log('Creating token for user:', user.id)
    const res = await prisma.refreshToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt
      }
    })
    console.log('SUCCESS:', res.id)
  } catch (err: any) {
    console.error('FAILED:', err.message)
  }
}

main()
