import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function reset() {
  try {
    const user = await prisma.user.findUnique({ where: { email: 'admin@brayn.app' } })
    if (user) {
        await prisma.user.update({
            where: { id: user.id },
            data: { 
                mfaEnabled: false, 
                mfaSecret: null, 
                mfaRecoveryCodes: null 
            }
        })
        console.log('✅ Admin MFA disabled successfully.')
    } else {
        console.log('❌ Admin user not found.')
    }
  } catch (err) {
    console.error('❌ Failed to disable MFA:', err)
  } finally {
    await prisma.$disconnect()
  }
}

reset()
