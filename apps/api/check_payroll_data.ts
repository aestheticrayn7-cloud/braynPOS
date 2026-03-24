import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const runs = await prisma.salaryRun.findMany({
    where: { month: 3, year: 2026 },
    include: { lines: { include: { staffProfile: true } } }
  })
  console.log('Salary Runs:', JSON.stringify(runs, null, 2))
}

main().catch(console.error).finally(() => prisma.$disconnect())
