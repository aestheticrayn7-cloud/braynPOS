import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// Simplified hasRole from authorize.ts
const roleHierarchy: Record<string, number> = {
  SUPER_ADMIN:   100,
  MANAGER_ADMIN:  90,
  ADMIN:          80,
  MANAGER:        70,
  CASHIER:        40,
  SALES_PERSON:   40,
  STOREKEEPER:    30,
  PROMOTER:       20,
}

function hasRole(actorRole: string, targetRole: string): boolean {
  return (roleHierarchy[actorRole] ?? 0) >= (roleHierarchy[targetRole] ?? 0)
}

async function test() {
  const superadmin = await prisma.user.findUnique({ where: { username: 'superadmin' } })
  const amon = await prisma.user.findUnique({ where: { username: 'Amon' } })
  
  if (!superadmin || !amon) {
    console.log('Users not found.')
    return
  }

  console.log(`--- SIMULATING: ${superadmin.role} inactivating ${amon.role} ---`)
  
  // Logic from users.routes.ts:
  const isSuperAdminActor = superadmin.role === 'SUPER_ADMIN'
  const canModify = isSuperAdminActor || hasRole(superadmin.role, amon.role)

  if (canModify) {
    console.log(`SUCCESS: ${superadmin.role} can modify ${amon.role}`)
    
    // Perform update
    const result = await prisma.user.update({
        where: { id: amon.id },
        data: { status: 'INACTIVE' }
    })
    console.log(`Status updated to: ${result.status}`)
    
    // Restore
    await prisma.user.update({ where: { id: amon.id }, data: { status: 'ACTIVE' } })
    console.log('Status restored to ACTIVE.')
  } else {
    console.log(`FAILURE: ${superadmin.role} CANNOT modify ${amon.role}`)
  }
}

test().catch(console.error).finally(() => prisma.$disconnect())
