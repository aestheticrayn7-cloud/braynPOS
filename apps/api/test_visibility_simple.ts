import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const GLOBAL_ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN', 'MANAGER_ADMIN']

async function test() {
  const amon = await prisma.user.findUnique({ where: { username: 'Amon' } })
  if (!amon) {
    console.log('Amon not found.')
    return
  }

  const actor = { id: amon.id, role: amon.role, channelId: amon.channelId }
  const isGlobalActor = GLOBAL_ADMIN_ROLES.includes(actor.role)

  console.log(`Testing as ${actor.role} (isGlobal: ${isGlobalActor})`)

  const where = {
    // Exact logic from users.service.ts
    ...(!isGlobalActor && { NOT: { role: 'SUPER_ADMIN' } }),
  }

  const users = await prisma.user.findMany({ where })
  const superAdmins = users.filter(u => u.role === 'SUPER_ADMIN')
  
  console.log(`Found ${superAdmins.length} Super Admins.`)
  superAdmins.forEach(u => console.log(` - ${u.username} (${u.role})`))

  if (superAdmins.length > 0) {
    console.log('SUCCESS: MANAGER_ADMIN can see SUPER_ADMIN.')
  } else {
    console.log('FAILURE: MANAGER_ADMIN cannot see SUPER_ADMIN.')
  }
}

test().catch(console.error).finally(() => prisma.$disconnect())
