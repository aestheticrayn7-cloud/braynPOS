import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const profiles = await prisma.staffProfile.findMany({
    include: { user: true }
  })
  console.log('Profiles Gross Salaries:')
  profiles.forEach(p => {
    console.log(`${p.user.username}: ${p.grossSalary} (Type: ${typeof p.grossSalary})`)
  })
}

main().catch(console.error).finally(() => prisma.$disconnect())
