import { PrismaClient } from '@prisma/client'
import { UsersService } from './src/modules/users/users.service.js'
const prisma = new PrismaClient()
const usersService = new UsersService()

async function test() {
  const superadmin = await prisma.user.findUnique({ where: { username: 'superadmin' } })
  const amon = await prisma.user.findUnique({ where: { username: 'Amon' } })
  
  if (!superadmin || !amon) {
    console.log('Users not found.')
    return
  }

  console.log(`--- TESTING: ${superadmin.role} inactivating ${amon.role} ---`)
  
  // Simulate inactivation
  try {
    const result = await usersService.update(
        amon.id, 
        { status: 'INACTIVE' }, 
        { id: superadmin.id, role: superadmin.role, channelId: superadmin.channelId }
    )
    console.log(`SUCCESS: Status updated to ${result.status}`)
    
    // Restore for safety
    await prisma.user.update({ where: { id: amon.id }, data: { status: 'ACTIVE' } })
  } catch (err) {
    console.error('FAILURE:', err)
  }
}

test().catch(console.error).finally(() => prisma.$disconnect())
