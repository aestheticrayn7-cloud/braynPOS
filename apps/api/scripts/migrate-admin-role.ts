import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting role migration: ADMIN -> MANAGER_ADMIN...')
  
  // Note: We use executeRaw because the client might already be out of sync if generation happened
  try {
    const updated = await prisma.$executeRawUnsafe(
      "UPDATE users SET role = 'MANAGER_ADMIN' WHERE role = 'ADMIN'"
    )
    console.log(`Successfully migrated ${updated} users from ADMIN to MANAGER_ADMIN.`)
  } catch (error) {
    console.error('Migration failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
