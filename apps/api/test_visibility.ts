import { PrismaClient } from '@prisma/client'
import { UsersService } from './src/modules/users/users.service.js'
const prisma = new PrismaClient()
const usersService = new UsersService()

async function test() {
  const amon = await prisma.user.findUnique({ where: { username: 'Amon' } })
  if (!amon) {
    console.log('Amon not found.')
    return
  }

  console.log('--- TESTING VISIBILITY FOR AMON (MANAGER_ADMIN) ---')
  const result = await usersService.findAll({}, { id: amon.id, role: amon.role, channelId: amon.channelId })
  
  const superAdmins = result.data.filter(u => u.role === 'SUPER_ADMIN')
  console.log(`Found ${superAdmins.length} Super Admins.`)
  superAdmins.forEach(u => console.log(` - ${u.username} (${u.role})`))

  if (superAdmins.length > 0) {
    console.log('SUCCESS: MANAGER_ADMIN can see SUPER_ADMIN.')
  } else {
    console.log('FAILURE: MANAGER_ADMIN cannot see SUPER_ADMIN.')
  }
}

test().catch(console.error).finally(() => prisma.$disconnect())
