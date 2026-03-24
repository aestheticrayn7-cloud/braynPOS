import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const line = await prisma.salaryRunLine.findFirst({
    include: { staffProfile: true }
  })
  console.log('Sample SalaryRunLine:', JSON.stringify(line, null, 2))
}

main().catch(console.error).finally(() => prisma.$disconnect())
