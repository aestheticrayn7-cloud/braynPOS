import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Starting deep clean of all user-related data...')
  
  try {
    // We use a raw transaction to handle the order and potential FK issues
    await prisma.$executeRaw`BEGIN`
    
    // Disable triggers temporarily to avoid side effects during mass deletion
    await prisma.$executeRaw`SET session_replication_role = 'replica'`

    console.log('Cleaning related modules...')
    await prisma.refreshToken.deleteMany()
    await prisma.staffProfile.deleteMany()
    await prisma.salaryRunLine.deleteMany()
    await prisma.salaryRun.deleteMany()
    await prisma.commissionEntry.deleteMany()
    await prisma.commissionPayout.deleteMany()
    await prisma.commissionRule.deleteMany()
    await prisma.salesSession.deleteMany()
    await prisma.supportTicket.deleteMany()
    await prisma.managerApproval.deleteMany()
    
    console.log('Cleaning user table...')
    await prisma.user.deleteMany()

    // Re-enable triggers
    await prisma.$executeRaw`SET session_replication_role = 'origin'`
    await prisma.$executeRaw`COMMIT`
    
    console.log('✅ ALL users and their personal data have been cleared.')
    console.log('You can now create fresh user accounts.')
  } catch (err) {
    await prisma.$executeRaw`ROLLBACK`
    console.error('❌ Failed to clear users:', err)
  } finally {
    await prisma.$disconnect()
  }
}

main()
